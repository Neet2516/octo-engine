import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `Summarise the security measures implemented in this repository.

Detected security mechanisms:
${JSON.stringify(analysis.security, null, 2)}

Security-related code excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

IMPORTANT: Only describe security mechanisms that have evidence in the code above. Do not hallucinate.

Respond in JSON:
{
  "mechanisms": [{
    "mechanism": "name",
    "description": "how it is implemented",
    "evidence": ["file path"]
  }],
  "summary": "overall security posture"
}`
}
