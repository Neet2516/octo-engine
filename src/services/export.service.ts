import type { Report } from '@/types/report'

export async function exportReport(
  reportId: string,
  format: 'pdf' | 'docx' | 'md'
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  // Dynamic import to avoid loading heavy libs unless needed
  if (format === 'md') {
    const { exportMarkdown } = await import('@/lib/export/markdown')
    return exportMarkdown(reportId)
  }
  if (format === 'docx') {
    const { exportDocx } = await import('@/lib/export/docx')
    return exportDocx(reportId)
  }
  if (format === 'pdf') {
    const { exportPdf } = await import('@/lib/export/pdf')
    return exportPdf(reportId)
  }
  throw new Error(`Unsupported format: ${format}`)
}
