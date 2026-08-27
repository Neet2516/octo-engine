import { getReport } from '@/services/report.service'

export async function exportPdf(
  reportId: string
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const report = await getReport(reportId)
  if (!report) throw new Error('Report not found')

  // Dynamic import of puppeteer to avoid cold-start in serverless
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.default.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()

  const html = buildHtml(report.title, report.sections)
  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '2.5cm', right: '2cm', bottom: '2cm', left: '2cm' },
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-size:9px;color:#666;width:100%;text-align:center;">${report.title}</div>`,
    footerTemplate: `<div style="font-size:9px;color:#666;width:100%;text-align:center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
    printBackground: true,
  })

  await browser.close()
  const filename = `${report.title.replace(/\s+/g, '_')}_report.pdf`

  return { buffer: Buffer.from(pdfBuffer), mimeType: 'application/pdf', filename }
}

function buildHtml(title: string, sections: { title: string; content: string }[]): string {
  const body = sections.map((s) => `
    <div class="section">
      <h1>${s.title}</h1>
      <div class="content">${markdownToHtml(s.content)}</div>
    </div>
  `).join('<hr/>')

  return `<!DOCTYPE html><html><head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; }
    h1 { font-size: 18pt; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 2em; }
    h2 { font-size: 14pt; } h3 { font-size: 12pt; }
    pre { background: #f5f5f5; padding: 1em; border-radius: 4px; font-size: 10pt; overflow-wrap: break-word; }
    code { background: #f5f5f5; padding: 0 3px; font-size: 10pt; }
    .section { page-break-before: always; } .section:first-child { page-break-before: auto; }
    table { border-collapse: collapse; width: 100%; } td,th { border: 1px solid #ccc; padding: 6px; }
  </style></head><body>
  <h1 style="text-align:center;font-size:24pt;margin-top:4em;">${title}</h1>
  ${body}
  </body></html>`
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre>$1</pre>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hpuo])/gm, '')
    .trim()
}
