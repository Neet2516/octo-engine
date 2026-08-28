import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { validateGithubUrl } from '@/lib/github'
import { InvalidUrlError } from '@/lib/github/errors'
import { startDirectAnalysis } from '@/services/analysis.service'

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

    await startDirectAnalysis(url, jobId, repositoryId, reportId)

    return NextResponse.json({ jobId, reportId, repositoryId })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'INVALID_URL', message: 'Invalid request body' }, { status: 400 })
    if (err instanceof InvalidUrlError) return NextResponse.json({ error: 'INVALID_URL', message: err.message }, { status: 400 })
    console.error('Error starting analysis:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: err instanceof Error ? err.message : 'Failed to start analysis' }, { status: 500 })
  }
}

