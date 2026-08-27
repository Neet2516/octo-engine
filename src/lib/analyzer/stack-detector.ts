import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'

/**
 * Detect technology stack from package.json, file extensions, and config files.
 */
export function detectStack(files: RepoFile[]): Partial<RepositoryAnalysis['technologyStack']> {
  const paths = files.map((f) => f.path.toLowerCase())
  const contents = files.reduce<Record<string, string>>((acc, f) => {
    if (f.content) acc[f.path.toLowerCase()] = f.content
    return acc
  }, {})

  const frontend: string[] = []
  const backend: string[] = []
  const database: string[] = []
  const languages: string[] = []
  const infrastructure: string[] = []
  const tools: string[] = []

  // --- Frontend ---
  const pkgJson = contents['package.json'] || ''
  if (pkgJson) {
    if (/"react"/.test(pkgJson)) frontend.push('React')
    if (/"next"/.test(pkgJson)) frontend.push('Next.js')
    if (/"vue"/.test(pkgJson)) frontend.push('Vue.js')
    if (/"@angular\/core"/.test(pkgJson)) frontend.push('Angular')
    if (/"svelte"/.test(pkgJson)) frontend.push('Svelte')
    if (/"tailwindcss"/.test(pkgJson)) frontend.push('Tailwind CSS')
    if (/"framer-motion"/.test(pkgJson)) frontend.push('Framer Motion')
    if (/"@monaco-editor"/.test(pkgJson)) frontend.push('Monaco Editor')
    if (/"shadcn"/.test(pkgJson) || /"@radix-ui"/.test(pkgJson)) frontend.push('shadcn/ui')

    // --- Backend ---
    if (/"express"/.test(pkgJson)) backend.push('Express.js')
    if (/"fastify"/.test(pkgJson)) backend.push('Fastify')
    if (/"next"/.test(pkgJson)) backend.push('Next.js API Routes')
    if (/"koa"/.test(pkgJson)) backend.push('Koa')
    if (/"hono"/.test(pkgJson)) backend.push('Hono')
    if (/"bullmq"/.test(pkgJson)) backend.push('BullMQ')
    if (/"ioredis"/.test(pkgJson)) { backend.push('Redis'); infrastructure.push('Redis') }

    // --- Database ---
    if (/"@prisma\/client"/.test(pkgJson)) { database.push('PostgreSQL'); database.push('Prisma ORM') }
    if (/"mongoose"/.test(pkgJson)) database.push('MongoDB (Mongoose)')
    if (/"sequelize"/.test(pkgJson)) database.push('Sequelize ORM')
    if (/"typeorm"/.test(pkgJson)) database.push('TypeORM')
    if (/"pg"/.test(pkgJson)) database.push('PostgreSQL')
    if (/"mysql2"/.test(pkgJson)) database.push('MySQL')
    if (/"better-sqlite3"/.test(pkgJson)) database.push('SQLite')

    // --- Tools ---
    if (/"typescript"/.test(pkgJson)) tools.push('TypeScript')
    if (/"eslint"/.test(pkgJson)) tools.push('ESLint')
    if (/"prettier"/.test(pkgJson)) tools.push('Prettier')
    if (/"vitest"/.test(pkgJson)) tools.push('Vitest')
    if (/"jest"/.test(pkgJson)) tools.push('Jest')
    if (/"zod"/.test(pkgJson)) tools.push('Zod')
    if (/"puppeteer"/.test(pkgJson)) tools.push('Puppeteer')
    if (/"docx"/.test(pkgJson)) tools.push('docx')
  }

  // --- Languages from extensions ---
  const extCounts: Record<string, number> = {}
  for (const f of files) {
    if (f.language && f.isRelevant) {
      extCounts[f.language] = (extCounts[f.language] || 0) + 1
    }
  }
  for (const [lang, count] of Object.entries(extCounts).sort((a, b) => b[1] - a[1])) {
    if (count > 1 && !languages.includes(lang)) languages.push(lang)
  }

  // --- Infrastructure from config files ---
  if (paths.some((p) => p.includes('dockerfile'))) infrastructure.push('Docker')
  if (paths.some((p) => p.includes('docker-compose'))) infrastructure.push('Docker Compose')
  if (paths.some((p) => p.includes('.github/workflows'))) infrastructure.push('GitHub Actions')
  if (paths.some((p) => p.includes('vercel.json') || p.includes('.vercelrc'))) infrastructure.push('Vercel')
  if (paths.some((p) => p.includes('railway'))) infrastructure.push('Railway')

  return { frontend, backend, database, languages, infrastructure, tools }
}
