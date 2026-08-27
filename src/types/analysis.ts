type Confidence = 'CONFIRMED' | 'INFERRED' | 'UNKNOWN'

interface Evidenced<T> {
  value: T
  confidence: Confidence
  evidence: string[]
}

export interface ApiRoute {
  method: string
  path: string
  description: string
  authentication?: string
  evidence: string[]
}

export interface RepositoryAnalysis {
  project: {
    name: string
    description: string
    purpose: string
    problemStatement: string
    objectives: string[]
  }
  technologyStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    languages: string[]
    infrastructure: string[]
    tools: string[]
  }
  architecture: {
    pattern: string
    components: { name: string; responsibility: string; evidence: string[] }[]
    dataFlow: string
  }
  modules: {
    name: string
    responsibility: string
    files: string[]
    evidence: string[]
  }[]
  apis: ApiRoute[]
  database: Evidenced<{
    technology: string
    entities: string[]
    relationships: string[]
  }>
  security: {
    mechanism: string
    description: string
    evidence: string[]
  }[]
  testing: {
    framework: string
    coverage: string
    testTypes: string[]
    evidence: string[]
  }
  limitations: string[]
  futureScope: string[]
}
