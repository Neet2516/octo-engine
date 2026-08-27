import { NextRequest, NextResponse } from 'next/server'
import { exportReport } from '@/services/export.service'
import { z } from 'zod'

const schema = z.object({
  reportId: z.string(),
  format: z.enum(['pdf', 'docx', 'md']),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reportId, format } = schema.parse(body)

    const { buffer, mimeType, filename } = await exportReport(reportId, format)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.byteLength),
      },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'reportId and format are required' }, { status: 400 })
    }
    return NextResponse.json({ error: 'EXPORT_ERROR', message: 'Failed to export report' }, { status: 500 })
  }
}
