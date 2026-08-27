import { NextResponse } from 'next/server'
import {
  InvalidUrlError, RepoNotFoundError, PrivateRepoError,
  RateLimitError, RepoTooLargeError,
} from '@/lib/github/errors'

export function handleError(err: unknown): NextResponse {
  if (err instanceof InvalidUrlError)
    return NextResponse.json({ error: 'INVALID_URL', message: err.message }, { status: 400 })
  if (err instanceof RepoNotFoundError)
    return NextResponse.json({ error: 'REPO_NOT_FOUND', message: err.message }, { status: 404 })
  if (err instanceof PrivateRepoError)
    return NextResponse.json({ error: 'PRIVATE_REPO', message: err.message }, { status: 403 })
  if (err instanceof RateLimitError)
    return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED', message: err.message, retryAfter: Math.ceil((err.resetAt.getTime() - Date.now()) / 1000) }, { status: 429 })
  if (err instanceof RepoTooLargeError)
    return NextResponse.json({ error: 'REPO_TOO_LARGE', message: err.message, fileCount: err.fileCount }, { status: 413 })

  console.error('[octo-engine] Unhandled error:', err)
  return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }, { status: 500 })
}
