import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { getAnalysisQueue } from '@/lib/queue/client'
import { validateGithubUrl } from '@/lib/github'
import { InvalidUrlError } from '@/lib/github/errors'

const schema = z.object({ url: z.string().url() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url } = schema.parse(body)

    if (/localhost|127\.|10\.|192\.168\./i.test(url)) {
      return NextResponse.json({ error: 'INVALID_URL', message: 'Private URLs not allowed' }, { status: 400 })
    }

    validateGithubUrl(url) // throws InvalidUrlError if bad

    const repositoryId = randomUUID()
    const reportId = randomUUID()
    const jobId = randomUUID()

    const queue = getAnalysisQueue()
    await queue.add('analyse', { url, repositoryId, reportId }, { jobId, attempts: 2, backoff: { type: 'exponential', delay: 5000 } })

    return NextResponse.json({ jobId, reportId, repositoryId })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'INVALID_URL', message: 'Invalid request body' }, { status: 400 })
    if (err instanceof InvalidUrlError) return NextResponse.json({ error: 'INVALID_URL', message: err.message }, { status: 400 })
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Failed to start analysis' }, { status: 500 })
  }
}
