import {
  validateGithubUrl,
  fetchRepoMeta,
  fetchFileTree,
  fetchRelevantFileContents,
} from '@/lib/github'
import type { RepoMeta, RepoFile } from '@/types/repository'

/**
 * Orchestrates: validate → fetch meta → fetch file tree → filter → fetch content.
 * Returns structured metadata and an array of RepoFile with content for relevant files.
 */
export async function analyseRepository(
  url: string
): Promise<{ meta: RepoMeta; files: RepoFile[] }> {
  const { owner, repo } = validateGithubUrl(url)
  const meta = await fetchRepoMeta(owner, repo)
  const fileTree = await fetchFileTree(owner, repo, meta.defaultBranch)
  const files = await fetchRelevantFileContents(owner, repo, meta.defaultBranch, fileTree)
  return { meta, files }
}
