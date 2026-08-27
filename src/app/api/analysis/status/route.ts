import { NextRequest, NextResponse } from 'next/server'
import { getAnalysisQueue } from '@/lib/queue/client'

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: 'MISSING_JOB_ID', message: 'jobId query param is required' }, { status: 400 })
  }

  try {
    const queue = getAnalysisQueue()
    const job = await queue.getJob(jobId)
    if (!job) {
      return NextResponse.json({ error: 'JOB_NOT_FOUND', message: 'Job not found' }, { status: 404 })
    }

    const state = await job.getState()
    const progress = typeof job.progress === 'number' ? job.progress : 0
    const currentStep = (job.data as Record<string, unknown>).currentStep as string | undefined

    return NextResponse.json({
      jobId,
      status: state,
      progress,
      currentStep: currentStep ?? '',
      error: job.failedReason ?? null,
    })
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Failed to get job status' }, { status: 500 })
  }
}
