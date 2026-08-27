import crypto from 'crypto'
import { getOctokit } from './client'
import { filterFiles, scoreFile } from './filter'
import {
  InvalidUrlError,
  RepoNotFoundError,
  PrivateRepoError,
  RateLimitError,
  RepoTooLargeError,
} from './errors'
import type { RepoMeta, RepoFile } from '@/types/repository'

const MAX_REPO_FILES = 10_000
const MAX_CONTENT_SIZE = 100_000 // 100 KB
const MAX_CONCURRENT_FETCHES = 10

/** Parse a github.com URL and return { owner, repo } */
export function validateGithubUrl(url: string): { owner: string; repo: string } {
  try {
    const u = new URL(url)
    if (u.hostname !== 'github.com') throw new Error()
    const parts = u.pathname.replace(/^\//, '').split('/')
    if (parts.length < 2 || !parts[0] || !parts[1]) throw new Error()
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') }
  } catch {
    throw new InvalidUrlError()
  }
}

/** Fetch structured metadata about a repository */
export async function fetchRepoMeta(owner: string, repo: string): Promise<RepoMeta> {
  const octokit = getOctokit()

  await checkRateLimit(octokit)

  let repoData: Awaited<ReturnType<typeof octokit.repos.get>>['data']
  try {
    const { data } = await octokit.repos.get({ owner, repo })
    repoData = data
  } catch (err: unknown) {
    if (isOctokitError(err)) {
      if (err.status === 404) throw new RepoNotFoundError()
      if (err.status === 403) throw new PrivateRepoError()
    }
    throw err
  }

  if (repoData.private) throw new PrivateRepoError()

  // Fetch languages
  const { data: languages } = await octokit.repos.listLanguages({ owner, repo })

  // Fetch contributors count
  let contributors = 0
  try {
    const { data: contribs } = await octokit.repos.listContributors({ owner, repo, per_page: 1 })
    contributors = Array.isArray(contribs) ? contribs.length : 0
  } catch { /* optional */ }

  // Fetch README
  let readme = ''
  try {
    const { data: rm } = await octokit.repos.getReadme({ owner, repo })
    readme = Buffer.from(rm.content, 'base64').toString('utf-8')
  } catch { /* no readme */ }

  return {
    id: String(repoData.id),
    url: repoData.html_url,
    owner: repoData.owner.login,
    name: repoData.name,
    branch: repoData.default_branch,
    description: repoData.description ?? '',
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    language: repoData.language ?? '',
    languages: languages as Record<string, number>,
    topics: repoData.topics ?? [],
    license: repoData.license?.name ?? null,
    defaultBranch: repoData.default_branch,
    readme,
    contributors,
    commitCount: 0, // populated separately if needed
  }
}

/** Fetch the file tree for a repo recursively */
export async function fetchFileTree(
  owner: string,
  repo: string,
  branch: string
): Promise<RepoFile[]> {
  const octokit = getOctokit()
  await checkRateLimit(octokit)

  const { data: tree } = await octokit.git.getTree({
    owner,
    repo,
    tree_sha: branch,
    recursive: 'true',
  })

  if (tree.truncated) {
    // Still continue with what we have
    console.warn('[octo-engine] Tree truncated — repo is very large')
  }

  const blobs = tree.tree.filter((item) => item.type === 'blob')
  if (blobs.length > MAX_REPO_FILES) {
    throw new RepoTooLargeError(blobs.length)
  }

  const files: RepoFile[] = blobs.map((item) => ({
    path: item.path ?? '',
    language: detectLanguage(item.path ?? ''),
    size: item.size ?? 0,
    contentHash: crypto.createHash('md5').update(item.sha ?? '').digest('hex'),
    isRelevant: false,
  }))

  return filterFiles(files)
}

/** Fetch the raw content of a single file; returns '' for binary/oversized */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string> {
  const octokit = getOctokit()
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path, ref: branch })
    if (Array.isArray(data) || data.type !== 'file') return ''
    if (data.size > MAX_CONTENT_SIZE) return ''
    if (!data.content) return ''
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

/** Fetch content for all relevant files with concurrency limit */
export async function fetchRelevantFileContents(
  owner: string,
  repo: string,
  branch: string,
  files: RepoFile[]
): Promise<RepoFile[]> {
  const relevant = files
    .filter((f) => f.isRelevant)
    .sort((a, b) => scoreFile(b) - scoreFile(a))
    .slice(0, 500) // hard cap

  const result: RepoFile[] = [...files]
  const chunks: RepoFile[][] = []

  for (let i = 0; i < relevant.length; i += MAX_CONCURRENT_FETCHES) {
    chunks.push(relevant.slice(i, i + MAX_CONCURRENT_FETCHES))
  }

  for (const chunk of chunks) {
    const contents = await Promise.all(
      chunk.map((f) => fetchFileContent(owner, repo, f.path, branch))
    )
    for (let i = 0; i < chunk.length; i++) {
      const idx = result.findIndex((f) => f.path === chunk[i].path)
      if (idx !== -1) result[idx] = { ...result[idx], content: contents[i] }
    }
  }

  return result
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function checkRateLimit(octokit: ReturnType<typeof getOctokit>) {
  try {
    const { data } = await octokit.rateLimit.get()
    const remaining = data.rate.remaining
    if (remaining < 10) {
      const resetAt = new Date(data.rate.reset * 1000)
      throw new RateLimitError(resetAt)
    }
  } catch (err) {
    if (err instanceof RateLimitError) throw err
    // ignore rate limit check failures
  }
}

function detectLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    ts: 'TypeScript', tsx: 'TypeScript', js: 'JavaScript', jsx: 'JavaScript',
    py: 'Python', rb: 'Ruby', go: 'Go', rs: 'Rust', java: 'Java',
    kt: 'Kotlin', swift: 'Swift', cs: 'C#', cpp: 'C++', c: 'C',
    php: 'PHP', html: 'HTML', css: 'CSS', scss: 'SCSS', md: 'Markdown',
    json: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML', prisma: 'Prisma',
    sql: 'SQL', sh: 'Shell', dockerfile: 'Dockerfile',
  }
  return map[ext] ?? ext.toUpperCase()
}

function isOctokitError(err: unknown): err is { status: number } {
  return typeof err === 'object' && err !== null && 'status' in err
}
