import type { Report, ReportSection } from '@/types/report'
import { randomUUID } from 'crypto'

// In-memory store until DB is wired
const reports = new Map<string, Report>()

export async function createReport(repositoryId: string, title: string): Promise<Report> {
  const report: Report = {
    id: randomUUID(),
    repositoryId,
    title,
    status: 'pending',
    version: 1,
    sections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  reports.set(report.id, report)
  return report
}

export async function getReport(id: string): Promise<Report | null> {
  return reports.get(id) ?? null
}

export async function updateSection(
  reportId: string,
  sectionId: string,
  content: string
): Promise<ReportSection | null> {
  const report = reports.get(reportId)
  if (!report) return null
  const section = report.sections.find((s) => s.id === sectionId)
  if (!section) return null
  section.content = content
  section.version += 1
  section.updatedAt = new Date()
  report.updatedAt = new Date()
  return section
}

export async function setSections(reportId: string, sections: ReportSection[]): Promise<void> {
  const report = reports.get(reportId)
  if (!report) return
  report.sections = sections
  report.status = 'ready'
  report.updatedAt = new Date()
}
