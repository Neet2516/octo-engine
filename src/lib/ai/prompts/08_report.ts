import type { RepositoryAnalysis } from '@/types/analysis'
import type { SectionType } from '@/types/report'
import { SECTION_TITLES } from '@/types/report'

export function buildPrompt(
  sectionType: SectionType,
  analysis: RepositoryAnalysis,
  excerpts: string[]
): string {
  const title = SECTION_TITLES[sectionType]

  const analysisContext = JSON.stringify({
    project: analysis.project,
    stack: analysis.technologyStack,
    architecture: analysis.architecture,
    modules: analysis.modules?.slice(0, 5),
    apis: analysis.apis?.slice(0, 10),
    database: analysis.database,
    security: analysis.security?.slice(0, 5),
    testing: analysis.testing,
  }, null, 2)

  const specialInstructions: Partial<Record<SectionType, string>> = {
    cover: 'Generate a cover page in Markdown with project name, tech stack badges, and a brief tagline.',
    certificate: 'Generate a certificate template with [STUDENT_NAME], [COLLEGE], [GUIDE_NAME] placeholders.',
    declaration: 'Generate a declaration statement with [STUDENT_NAME] and [DATE] placeholders.',
    acknowledgement: 'Generate acknowledgement text with [GUIDE_NAME] and [COLLEGE] placeholders.',
    architecture: 'Include a Mermaid diagram (```mermaid ... ```) showing the system architecture based on detected components.',
    api: 'Create a detailed API reference table with Method, Endpoint, Description, Auth columns.',
    database: 'Include ER diagram description and entity relationship details from the detected schema.',
    toc: 'Generate a structured table of contents for a 27-section academic report.',
  }

  return `You are an expert technical writer generating the "${title}" section of an academic project report.

The report is about the "${analysis.project.name}" project: ${analysis.project.purpose}

Repository Analysis:
${analysisContext}

Relevant code excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

${specialInstructions[sectionType] ? `Special instructions: ${specialInstructions[sectionType]}` : ''}

RULES:
- Write in formal academic/technical English
- Every technical claim must be traceable to the repository evidence provided
- Do NOT hallucinate technologies, features, or APIs not found in the analysis
- Write at least 200 words for most sections (cover, toc, certificate, declaration can be shorter)
- Use Markdown formatting

Generate the "${title}" section now:`
}
