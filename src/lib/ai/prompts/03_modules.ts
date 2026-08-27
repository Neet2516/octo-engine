import type { RepositoryAnalysis } from '@/types/analysis'

export function buildPrompt(
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `Describe the following software modules based on the static analysis.

Detected modules:
${JSON.stringify(analysis.modules?.slice(0, 10), null, 2)}

Code excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

For each module, provide a concise description of its responsibility and how it fits in the system.

Respond in JSON:
{
  "modules": [{ "name": "...", "responsibility": "detailed description", "files": ["..."], "evidence": ["..."] }]
}`
}
