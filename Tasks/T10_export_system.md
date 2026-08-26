# T10 · Export System (PDF, DOCX, Markdown)

**Commit:** `feat: add PDF, DOCX, and Markdown export with proper academic formatting`

**Depends on:** T09

---

## Objective
Generate download-ready files from the report sections.

## Files

### `src/lib/export/pdf.ts`
Use Puppeteer headless to print `/report/:id?print=1` as PDF.
PDF settings:
- A4, margins: top 2.5 cm, others 2 cm
- Page numbers in footer
- Headers with report title
- Embedded Mermaid diagrams (rendered in browser)
- TOC links functional

### `src/lib/export/docx.ts`
Use `docx` npm package.
- Heading 1/2/3 styles matching academic format
- Code blocks as monospace paragraphs with grey background
- Page breaks before major sections
- Auto-generated TOC

### `src/lib/export/markdown.ts`
Simple: join all `section.content` strings with `## SectionTitle` headers.
Return as UTF-8 string.

### `src/services/export.service.ts`
```ts
export async function exportReport(
  reportId: string,
  format: "pdf" | "docx" | "md"
): Promise<{ buffer: Buffer; mimeType: string; filename: string }>
```

## API Route Update
`POST /api/export` → streams response with correct `Content-Disposition` header.

## UI
"Download" dropdown in report Navbar with three options.
Show toast on success; toast + details on error.

## Done-Definition
Each format downloads a file; PDF has page numbers and correct formatting; DOCX opens in Word without errors.
