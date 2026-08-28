import { NextRequest, NextResponse } from 'next/server'
import { getReport } from '@/services/report.service'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = await getReport(params.id)
    if (!report) {
      return NextResponse.json({ error: 'REPORT_NOT_FOUND', message: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json(report)
  } catch (err: unknown) {
    console.error('Error fetching report:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Failed to retrieve report' }, { status: 500 })
  }
}

