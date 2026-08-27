import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'

const PRISMA_MODEL = /^model\s+(\w+)\s*\{/gm
const PRISMA_RELATION = /@relation/g
const MONGOOSE_SCHEMA = /new\s+Schema\s*\(\s*\{/g
const MONGOOSE_MODEL = /model\s*\(\s*['"`](\w+)['"`]/g

export function detectDatabase(
  files: RepoFile[]
): RepositoryAnalysis['database'] {
  const evidence: string[] = []

  // ── Prisma ─────────────────────────────────────────────────────────────────
  const prismaSchema = files.find(
    (f) => f.path.endsWith('schema.prisma') && f.content
  )
  if (prismaSchema?.content) {
    const models: string[] = []
    const relationships: string[] = []
    let m: RegExpExecArray | null

    PRISMA_MODEL.lastIndex = 0
    while ((m = PRISMA_MODEL.exec(prismaSchema.content)) !== null) {
      models.push(m[1])
    }

    PRISMA_RELATION.lastIndex = 0
    while ((m = PRISMA_RELATION.exec(prismaSchema.content)) !== null) {
      relationships.push('relation found at schema.prisma')
    }

    evidence.push(prismaSchema.path)

    return {
      value: {
        technology: 'PostgreSQL',
        entities: models,
        relationships: [...new Set(relationships)],
      },
      confidence: 'CONFIRMED',
      evidence,
    }
  }

  // ── Mongoose ────────────────────────────────────────────────────────────────
  const mongoFiles = files.filter(
    (f) => f.content && (f.path.includes('model') || f.path.includes('schema'))
  )
  for (const file of mongoFiles) {
    if (MONGOOSE_SCHEMA.test(file.content ?? '')) {
      evidence.push(file.path)
    }
  }

  if (evidence.length > 0) {
    const models: string[] = []
    for (const file of mongoFiles) {
      MONGOOSE_MODEL.lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = MONGOOSE_MODEL.exec(file.content ?? '')) !== null) {
        models.push(m[1])
      }
    }
    return {
      value: { technology: 'MongoDB', entities: models, relationships: [] },
      confidence: 'CONFIRMED',
      evidence,
    }
  }

  // ── Fallback: infer from imports ─────────────────────────────────────────
  const hasPg = files.some((f) => f.content?.includes("from 'pg'") || f.content?.includes('require("pg")'))
  const hasMysql = files.some((f) => f.content?.includes('mysql2'))
  const hasSqlite = files.some((f) => f.content?.includes('better-sqlite3'))

  if (hasPg) return { value: { technology: 'PostgreSQL', entities: [], relationships: [] }, confidence: 'INFERRED', evidence: [] }
  if (hasMysql) return { value: { technology: 'MySQL', entities: [], relationships: [] }, confidence: 'INFERRED', evidence: [] }
  if (hasSqlite) return { value: { technology: 'SQLite', entities: [], relationships: [] }, confidence: 'INFERRED', evidence: [] }

  return { value: { technology: 'Unknown', entities: [], relationships: [] }, confidence: 'UNKNOWN', evidence: [] }
}
