import { NextRequest, NextResponse } from 'next/server'
import { getJob } from '@/services/analysis.service'

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: 'MISSING_JOB_ID', message: 'jobId query param is required' }, { status: 400 })
  }

  try {
    const job = getJob(jobId)
    if (!job) {
      return NextResponse.json({ error: 'JOB_NOT_FOUND', message: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({
      jobId: job.jobId,
      status: job.status === 'active' ? 'active' : job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      error: job.error,
    })
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Failed to get job status' }, { status: 500 })
  }
}

