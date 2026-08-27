import { describe, it, expect } from 'vitest'
import { detectApis } from '@/lib/analyzer/api-detector'
import type { RepoFile } from '@/types/repository'

function makeFile(path: string, content: string): RepoFile {
  return { path, language: 'TypeScript', size: 500, contentHash: 'abc', isRelevant: true, content }
}

describe('detectApis', () => {
  it('parses Next.js App Router GET handler', () => {
    const files = [
      makeFile('src/app/api/users/route.ts', `
        export async function GET(req: Request) {
          return Response.json({})
        }
        export async function POST(req: Request) {
          return Response.json({})
        }
      `),
    ]
    const routes = detectApis(files)
    expect(routes.some((r) => r.method === 'GET')).toBe(true)
    expect(routes.some((r) => r.method === 'POST')).toBe(true)
  })

  it('parses Express router.get routes', () => {
    const files = [
      makeFile('src/routes/user.ts', `
        router.get("/users", getUsers);
        router.post("/users", createUser);
        router.delete("/users/:id", deleteUser);
      `),
    ]
    const routes = detectApis(files)
    expect(routes.some((r) => r.method === 'GET' && r.path === '/users')).toBe(true)
    expect(routes.some((r) => r.method === 'POST' && r.path === '/users')).toBe(true)
  })
})
