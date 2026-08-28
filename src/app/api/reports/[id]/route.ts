import { NextRequest, NextResponse } from 'next/server'
import { getReport } from '@/services/report.service'

/** Safely serialize the report — convert Dates to ISO strings, ensure section.content is always a string */
function serializeReport(report: Awaited<ReturnType<typeof getReport>>) {
  if (!report) return null
  return {
    ...report,
    createdAt: report.createdAt instanceof Date ? report.createdAt.toISOString() : report.createdAt,
    updatedAt: report.updatedAt instanceof Date ? report.updatedAt.toISOString() : report.updatedAt,
    sections: report.sections.map((s) => ({
      ...s,
      // Guarantee content is always a plain string — never an object
      content: typeof s.content === 'string' ? s.content : JSON.stringify(s.content, null, 2),
      updatedAt: s.updatedAt instanceof Date ? s.updatedAt.toISOString() : s.updatedAt,
    })),
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = await getReport(params.id)
    if (!report) {
      return NextResponse.json({ error: 'REPORT_NOT_FOUND', message: 'Report not found' }, { status: 404 })
    }
    return NextResponse.json(serializeReport(report))
  } catch (err: unknown) {
    console.error('Error fetching report:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR', message: 'Failed to retrieve report' }, { status: 500 })
  }
}

