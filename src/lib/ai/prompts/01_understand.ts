import type { RepositoryAnalysis } from '@/types/analysis'
import type { RepoMeta } from '@/types/repository'

export function buildPrompt(
  meta: RepoMeta,
  analysis: Partial<RepositoryAnalysis>,
  excerpts: string[]
): string {
  return `You are an expert software engineer analysing the GitHub repository "${meta.owner}/${meta.name}".

Repository Description: ${meta.description || 'Not provided'}
Primary Language: ${meta.language}
Stars: ${meta.stars}

Based on the static analysis already performed, determine:
1. The project's main purpose and the problem it solves
2. The target users
3. 3-5 clear objectives

Static analysis evidence:
- Stack: ${JSON.stringify(analysis.technologyStack)}
- Architecture: ${analysis.architecture?.pattern}

README excerpt:
${meta.readme.slice(0, 2000)}

Relevant code excerpts:
${excerpts.slice(0, 3).join('\n\n---\n\n')}

Respond in JSON format:
{
  "purpose": "...",
  "problemStatement": "...",
  "objectives": ["...", "...", "..."],
  "targetUsers": "..."
}`
}
