import type { RepoFile } from '@/types/repository'

const IGNORE_DIRS = [
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
  'target', 'vendor', '.cache', '__pycache__', '.pytest_cache',
]

const IGNORE_EXT = [
  '.lock', '.min.js', '.map', '.png', '.jpg', '.jpeg', '.svg',
  '.gif', '.mp4', '.webp', '.ico', '.woff', '.woff2', '.ttf',
  '.eot', '.otf', '.pdf', '.zip', '.tar', '.gz',
]

const PRIORITY_KEYWORDS = [
  'readme', 'package.json', 'tsconfig', 'dockerfile', 'docker-compose',
  '.env.example', 'prisma', 'routes', 'route', 'controllers', 'controller',
  'services', 'service', 'models', 'model', 'api', 'auth', 'config',
  'test', 'spec', 'middleware', 'schema', 'migration',
]

/**
 * Marks files as relevant and filters out noise.
 * Returns all files with isRelevant populated.
 */
export function filterFiles(files: RepoFile[]): RepoFile[] {
  return files.map((file) => {
    const lower = file.path.toLowerCase()

    // Skip ignored dirs
    const inIgnoredDir = IGNORE_DIRS.some((dir) =>
      lower.split('/').includes(dir)
    )
    if (inIgnoredDir) return { ...file, isRelevant: false }

    // Skip ignored extensions
    const hasIgnoredExt = IGNORE_EXT.some((ext) => lower.endsWith(ext))
    if (hasIgnoredExt) return { ...file, isRelevant: false }

    // Skip files > 100 KB
    if (file.size > 100_000) return { ...file, isRelevant: false }

    return { ...file, isRelevant: true }
  })
}

/**
 * Score a file 0–100 for relevance prioritisation.
 * Higher = fetch this file first.
 */
export function scoreFile(file: RepoFile): number {
  const lower = file.path.toLowerCase()
  const filename = lower.split('/').pop() ?? lower

  let score = 50

  // Boost priority files
  for (const keyword of PRIORITY_KEYWORDS) {
    if (filename.includes(keyword) || lower.includes(keyword)) {
      score += 10
      break
    }
  }

  // Penalty for deep nesting
  const depth = file.path.split('/').length
  score -= depth * 2

  // Boost small files (likely config)
  if (file.size < 5_000) score += 5

  return Math.max(0, Math.min(100, score))
}
