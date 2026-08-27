import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry { count: number; resetAt: number }

const store = new Map<string, RateLimitEntry>()

const LIMITS = {
  'analysis-start': { max: 10, windowMs: 60 * 60 * 1000 },   // 10 / hour
  'default':        { max: 100, windowMs: 15 * 60 * 1000 },  // 100 / 15 min
}

export function rateLimit(req: NextRequest, bucket: keyof typeof LIMITS = 'default'): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const key = `${bucket}:${ip}`
  const limit = LIMITS[bucket]
  const now = Date.now()

  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + limit.windowMs })
    return null
  }

  entry.count++
  if (entry.count > limit.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }
  return null
}
