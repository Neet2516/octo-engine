import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak,
} from 'docx'
import { getReport } from '@/services/report.service'

export async function exportDocx(
  reportId: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const report = await getReport(reportId)
  if (!report) throw new Error('Report not found')

  const children: Paragraph[] = [
    new Paragraph({ text: report.title, heading: HeadingLevel.TITLE }),
  ]

  for (const section of report.sections) {
    children.push(new Paragraph({ children: [new PageBreak()] }))
    children.push(new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1 }))

    // Split content into paragraphs
    const paragraphs = section.content.split('\n').filter((l) => l.trim())
    for (const para of paragraphs) {
      // Skip markdown headings already handled
      if (para.startsWith('#')) continue
      children.push(
        new Paragraph({
          children: [new TextRun({ text: para.replace(/\*\*/g, '').replace(/`/g, ''), size: 24 })],
          spacing: { after: 200 },
        })
      )
    }
  }

  const doc = new Document({ sections: [{ children }] })
  const buffer = await Packer.toBuffer(doc)
  const filename = `${report.title.replace(/\s+/g, '_')}_report.docx`

  return { buffer: Buffer.from(buffer), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', filename }
}
