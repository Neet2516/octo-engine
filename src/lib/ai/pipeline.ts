import type { RepoMeta } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'
import { getAIProvider } from './provider'
import { buildPrompt as understand } from './prompts/01_understand'
import { buildPrompt as architecture } from './prompts/02_architecture'
import { buildPrompt as modules } from './prompts/03_modules'
import { buildPrompt as apis } from './prompts/04_apis'
import { buildPrompt as database } from './prompts/05_database'
import { buildPrompt as security } from './prompts/06_security'
import { buildPrompt as testing } from './prompts/07_testing'

function tryJson(s: unknown): Record<string, unknown> {
  if (typeof s === 'object' && s !== null) return s as Record<string, unknown>
  try { return JSON.parse(String(s)) } catch { return {} }
}

/**
 * Runs the 7-task AI enrichment pipeline sequentially.
 * Each task receives the static analysis facts + relevant code excerpts.
 * Returns a fully enriched RepositoryAnalysis.
 */
export async function runAIPipeline(
  meta: RepoMeta,
  staticAnalysis: Partial<RepositoryAnalysis>,
  relevantExcerpts: string[]
): Promise<RepositoryAnalysis> {
  const ai = getAIProvider()

  // Task 01: Project understanding
  const understandResult = tryJson(
    await ai.complete(understand(meta, staticAnalysis, relevantExcerpts))
  )

  // Task 02: Architecture
  const archResult = tryJson(
    await ai.complete(architecture(staticAnalysis, relevantExcerpts))
  )

  // Task 03: Modules
  const modulesResult = tryJson(
    await ai.complete(modules(staticAnalysis, relevantExcerpts))
  )

  // Task 04: APIs
  const apisResult = tryJson(
    await ai.complete(apis(staticAnalysis, relevantExcerpts))
  )

  // Task 05: Database
  const dbResult = tryJson(
    await ai.complete(database(staticAnalysis, relevantExcerpts))
  )

  // Task 06: Security
  const secResult = tryJson(
    await ai.complete(security(staticAnalysis, relevantExcerpts))
  )

  // Task 07: Testing
  const testResult = tryJson(
    await ai.complete(testing(staticAnalysis, relevantExcerpts))
  )

  // Merge static + AI results
  const merged: RepositoryAnalysis = {
    project: {
      name: meta.name,
      description: meta.description,
      purpose: String(understandResult.purpose ?? staticAnalysis.project?.purpose ?? ''),
      problemStatement: String(understandResult.problemStatement ?? ''),
      objectives: (understandResult.objectives as string[]) ?? staticAnalysis.project?.objectives ?? [],
    },
    technologyStack: staticAnalysis.technologyStack ?? {
      frontend: [], backend: [], database: [], languages: [], infrastructure: [], tools: [],
    },
    architecture: {
      pattern: String(archResult.pattern ?? staticAnalysis.architecture?.pattern ?? 'unknown'),
      components: (archResult.components as RepositoryAnalysis['architecture']['components']) ?? staticAnalysis.architecture?.components ?? [],
      dataFlow: String(archResult.dataFlow ?? staticAnalysis.architecture?.dataFlow ?? ''),
    },
    modules: (modulesResult.modules as RepositoryAnalysis['modules']) ?? staticAnalysis.modules ?? [],
    apis: (apisResult.apis as RepositoryAnalysis['apis']) ?? staticAnalysis.apis ?? [],
    database: {
      value: {
        technology: String(dbResult.technology ?? staticAnalysis.database?.value?.technology ?? 'Unknown'),
        entities: (dbResult.entities as string[]) ?? staticAnalysis.database?.value?.entities ?? [],
        relationships: (dbResult.relationships as string[]) ?? staticAnalysis.database?.value?.relationships ?? [],
      },
      confidence: (dbResult.confidence as 'CONFIRMED' | 'INFERRED' | 'UNKNOWN') ?? staticAnalysis.database?.confidence ?? 'UNKNOWN',
      evidence: staticAnalysis.database?.evidence ?? [],
    },
    security: (secResult.mechanisms as RepositoryAnalysis['security']) ?? staticAnalysis.security ?? [],
    testing: {
      framework: String(testResult.framework ?? staticAnalysis.testing?.framework ?? ''),
      coverage: String(testResult.coverage ?? staticAnalysis.testing?.coverage ?? ''),
      testTypes: (testResult.testTypes as string[]) ?? staticAnalysis.testing?.testTypes ?? [],
      evidence: (testResult.evidence as string[]) ?? staticAnalysis.testing?.evidence ?? [],
    },
    limitations: staticAnalysis.limitations ?? [],
    futureScope: staticAnalysis.futureScope ?? [],
  }

  return merged
}
