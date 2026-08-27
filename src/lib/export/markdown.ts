import { getReport } from '@/services/report.service'

export async function exportMarkdown(
  reportId: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const report = await getReport(reportId)
  if (!report) throw new Error('Report not found')

  const lines: string[] = [`# ${report.title}\n`]
  for (const section of report.sections) {
    lines.push(`## ${section.title}\n`)
    lines.push(section.content)
    lines.push('\n---\n')
  }

  const content = lines.join('\n')
  const buffer = Buffer.from(content, 'utf-8')
  const filename = `${report.title.replace(/\s+/g, '_')}_report.md`

  return { buffer, mimeType: 'text/markdown', filename }
}
