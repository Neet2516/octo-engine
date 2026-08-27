import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `You are an expert software architect. Based on the static analysis below, confirm or enrich the architecture description.

Detected pattern: ${analysis.architecture?.pattern}
Detected components: ${JSON.stringify(analysis.architecture?.components?.slice(0, 8))}

Code excerpts:
${excerpts.slice(0, 5).join('\n\n---\n\n')}

Respond in JSON:
{
  "pattern": "full-stack|microservices|serverless|monolith|cli|library|mobile|data-pipeline|client-server",
  "components": [{ "name": "...", "responsibility": "...", "evidence": ["..."] }],
  "dataFlow": "brief description of data flow"
}`
}
