import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `Describe the API endpoints detected in this repository.

Detected endpoints:
${JSON.stringify(analysis.apis?.slice(0, 20), null, 2)}

Route code excerpts:
${excerpts.slice(0, 5).join('\n\n---\n\n')}

Respond in JSON:
{
  "apis": [{
    "method": "GET|POST|...",
    "path": "/api/...",
    "description": "what this endpoint does",
    "authentication": "Bearer|None|Session",
    "evidence": ["file path"]
  }]
}`
}
