import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `Describe the database design based on static analysis.

Database detection:
${JSON.stringify(analysis.database, null, 2)}

Schema/model excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

Respond in JSON:
{
  "technology": "PostgreSQL|MongoDB|...",
  "entities": ["list of model/table names"],
  "relationships": ["User has many Reports", "..."],
  "confidence": "CONFIRMED|INFERRED|UNKNOWN",
  "description": "Brief description of the database design"
}`
}
