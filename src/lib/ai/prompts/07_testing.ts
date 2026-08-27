import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `Summarise the testing approach in this repository.

Detected testing info:
${JSON.stringify(analysis.testing, null, 2)}

Test file excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

Respond in JSON:
{
  "framework": "...",
  "testTypes": ["Unit", "Integration", "E2E"],
  "coverage": "...",
  "summary": "description of testing strategy",
  "evidence": ["file paths"]
}`
}
