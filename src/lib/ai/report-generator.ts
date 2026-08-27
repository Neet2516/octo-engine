import { randomUUID } from 'crypto'
import type { RepositoryAnalysis } from '@/types/analysis'
import type { ReportSection, SectionType } from '@/types/report'
import { ALL_SECTION_TYPES, SECTION_TITLES } from '@/types/report'
import { getAIProvider } from './provider'
import { buildPrompt as reportPrompt } from './prompts/08_report'

/**
 * Generates all 27 report sections by iterating over ALL_SECTION_TYPES
 * and calling the AI for each one individually.
 */
export async function generateReportSections(
  analysis: RepositoryAnalysis
): Promise<ReportSection[]> {
  const ai = getAIProvider()
  const sections: ReportSection[] = []

  for (const sectionType of ALL_SECTION_TYPES) {
    const prompt = reportPrompt(sectionType, analysis, [])
    const content = String(await ai.complete(prompt))

    sections.push({
      id: randomUUID(),
      type: sectionType,
      title: SECTION_TITLES[sectionType],
      content,
      version: 1,
      updatedAt: new Date(),
    })
  }

  return sections
}

/**
 * Regenerates a single section with an optional instruction.
 */
export async function regenerateSection(
  sectionType: SectionType,
  analysis: RepositoryAnalysis,
  instruction?: string
): Promise<ReportSection> {
  const ai = getAIProvider()
  let prompt = reportPrompt(sectionType, analysis, [])
  if (instruction) {
    prompt += `\n\nAdditional instruction: ${instruction}`
  }
  const content = String(await ai.complete(prompt))
  return {
    id: randomUUID(),
    type: sectionType,
    title: SECTION_TITLES[sectionType],
    content,
    version: 1,
    updatedAt: new Date(),
  }
}
