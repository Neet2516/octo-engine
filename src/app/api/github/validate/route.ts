import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateGithubUrl, fetchRepoMeta } from '@/lib/github'
import { InvalidUrlError, RepoNotFoundError, PrivateRepoError, RateLimitError } from '@/lib/github/errors'

const schema = z.object({ url: z.string().url() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url } = schema.parse(body)

    // SSRF protection
    if (/localhost|127\.|10\.|192\.168\.|0\.0\.0\.0/i.test(url)) {
      return NextResponse.json({ error: 'INVALID_URL', message: 'Private IP addresses are not allowed' }, { status: 400 })
    }

    const { owner, repo } = validateGithubUrl(url)
    const meta = await fetchRepoMeta(owner, repo)

    return NextResponse.json({
      owner: meta.owner,
      repo: meta.name,
      description: meta.description,
      stars: meta.stars,
      language: meta.language,
      defaultBranch: meta.defaultBranch,
    })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'INVALID_URL', message: 'Invalid URL format' }, { status: 400 })
    if (err instanceof InvalidUrlError) return NextResponse.json({ error: 'INVALID_URL', message: err.message }, { status: 400 })
    if (err instanceof RepoNotFoundError) return NextResponse.json({ error: 'REPO_NOT_FOUND', message: err.message }, { status: 404 })
    if (err instanceof PrivateRepoError) return NextResponse.json({ error: 'PRIVATE_REPO', message: err.message }, { status: 403 })
    if (err instanceof RateLimitError) return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: err.message, retryAfter: Math.ceil((err.resetAt.getTime() - Date.now()) / 1000) }, { status: 429 })
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, { status: 500 })
  }
}
