import type { RepoFile } from '@/types/repository'
import type { ApiRoute } from '@/types/analysis'

// Patterns for Next.js App Router route handlers
const NEXT_APP_ROUTER = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s*\(/g
// Patterns for Express/Fastify routes
const EXPRESS_ROUTE = /(app|router)\.(get|post|put|patch|delete|use)\s*\(\s*['"`]([^'"`]+)['"`]/g
// Next.js pages/api patterns
const NEXT_PAGES_API = /export\s+default\s+(?:async\s+)?function\s+handler/

export function detectApis(files: RepoFile[]): ApiRoute[] {
  const routes: ApiRoute[] = []

  for (const file of files) {
    if (!file.content || !file.isRelevant) continue

    const path = file.path

    // Next.js App Router: src/app/api/**/route.ts
    if (path.includes('/api/') && path.endsWith('route.ts')) {
      const routePath = extractNextAppRoutePath(path)
      let match: RegExpExecArray | null
      NEXT_APP_ROUTER.lastIndex = 0
      while ((match = NEXT_APP_ROUTER.exec(file.content)) !== null) {
        routes.push({
          method: match[1],
          path: routePath,
          description: `${match[1]} ${routePath}`,
          authentication: detectAuth(file.content),
          evidence: [path],
        })
      }
    }

    // Next.js Pages Router: pages/api/**/*.ts
    if (path.includes('pages/api/') && NEXT_PAGES_API.test(file.content)) {
      const routePath = '/' + path.replace(/.*pages\/api\//, 'api/').replace(/\.[jt]sx?$/, '').replace(/\/index$/, '')
      routes.push({
        method: 'ANY',
        path: routePath,
        description: `Handler for ${routePath}`,
        authentication: detectAuth(file.content),
        evidence: [path],
      })
    }

    // Express / Fastify routes
    EXPRESS_ROUTE.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = EXPRESS_ROUTE.exec(file.content ?? '')) !== null) {
      routes.push({
        method: match[2].toUpperCase(),
        path: match[3],
        description: `${match[2].toUpperCase()} ${match[3]}`,
        authentication: detectAuth(file.content),
        evidence: [path],
      })
    }
  }

  // Deduplicate
  const seen = new Set<string>()
  return routes.filter((r) => {
    const key = `${r.method}:${r.path}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function extractNextAppRoutePath(filePath: string): string {
  return (
    '/' +
    filePath
      .replace(/.*\/app\//, '')
      .replace(/\/route\.tsx?$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1')
  )
}

function detectAuth(content: string): string | undefined {
  if (/auth|jwt|bearer|session|middleware|protect|requireAuth|getServerSession/i.test(content)) {
    return 'Bearer token / Session'
  }
  return undefined
}
