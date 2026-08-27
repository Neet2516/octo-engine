import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'
import { detectStack } from './stack-detector'
import { detectArchitecture } from './arch-detector'
import { detectModules } from './module-detector'
import { detectApis } from './api-detector'
import { detectDatabase } from './db-detector'
import { detectSecurity } from './security-detector'

/**
 * Runs all static detectors in parallel and merges the results
 * into a Partial<RepositoryAnalysis>.
 *
 * No LLM is involved — pure deterministic analysis.
 */
export async function runStaticAnalysis(
  files: RepoFile[]
): Promise<Partial<RepositoryAnalysis>> {
  const [stack, architecture, modules, apis, database, security] = await Promise.all([
    Promise.resolve(detectStack(files)),
    Promise.resolve(detectArchitecture(files)),
    Promise.resolve(detectModules(files)),
    Promise.resolve(detectApis(files)),
    Promise.resolve(detectDatabase(files)),
    Promise.resolve(detectSecurity(files)),
  ])

  // Detect testing from files
  const testing = detectTesting(files)

  // Project name from package.json or directory structure
  const pkgContent = files.find((f) => f.path === 'package.json')?.content
  const pkgName = pkgContent ? tryParseJson(pkgContent)?.name : undefined

  return {
    project: {
      name: pkgName || 'Unknown Project',
      description: '',
      purpose: '',
      problemStatement: '',
      objectives: [],
    },
    technologyStack: {
      frontend: stack.frontend ?? [],
      backend: stack.backend ?? [],
      database: stack.database ?? [],
      languages: stack.languages ?? [],
      infrastructure: stack.infrastructure ?? [],
      tools: stack.tools ?? [],
    },
    architecture,
    modules,
    apis,
    database,
    security,
    testing,
    limitations: [],
    futureScope: [],
  }
}

function detectTesting(files: RepoFile[]): RepositoryAnalysis['testing'] {
  const paths = files.map((f) => f.path.toLowerCase())
  const pkgContent = files.find((f) => f.path === 'package.json')?.content ?? ''

  const frameworks: string[] = []
  if (/"vitest"/.test(pkgContent)) frameworks.push('Vitest')
  if (/"jest"/.test(pkgContent)) frameworks.push('Jest')
  if (/"mocha"/.test(pkgContent)) frameworks.push('Mocha')
  if (/"@testing-library"/.test(pkgContent)) frameworks.push('@testing-library')
  if (/"cypress"/.test(pkgContent)) frameworks.push('Cypress')
  if (/"playwright"/.test(pkgContent)) frameworks.push('Playwright')

  const testFiles = paths.filter((p) => p.includes('.test.') || p.includes('.spec.') || p.includes('/tests/') || p.includes('/__tests__/'))
  const testTypes: string[] = []
  if (testFiles.some((p) => p.includes('unit'))) testTypes.push('Unit')
  if (testFiles.some((p) => p.includes('integration'))) testTypes.push('Integration')
  if (testFiles.some((p) => p.includes('e2e'))) testTypes.push('E2E')
  if (testTypes.length === 0 && testFiles.length > 0) testTypes.push('Unit')

  return {
    framework: frameworks.join(', ') || 'Not detected',
    coverage: testFiles.length > 0 ? `${testFiles.length} test files found` : 'No tests detected',
    testTypes,
    evidence: testFiles.slice(0, 5),
  }
}

function tryParseJson(s: string): Record<string, unknown> | null {
  try { return JSON.parse(s) } catch { return null }
}

export { detectStack, detectArchitecture, detectModules, detectApis, detectDatabase, detectSecurity }
