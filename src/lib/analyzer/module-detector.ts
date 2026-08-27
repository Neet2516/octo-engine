import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'

const MODULE_PATTERNS: Record<string, string> = {
  auth: 'Authentication and authorisation',
  authentication: 'Authentication and authorisation',
  user: 'User management and profiles',
  users: 'User management and profiles',
  payment: 'Payment processing',
  payments: 'Payment processing',
  notification: 'Notification delivery',
  notifications: 'Notification delivery',
  dashboard: 'Dashboard and analytics UI',
  api: 'API route handling',
  admin: 'Admin panel and management',
  report: 'Report generation',
  reports: 'Report generation',
  analysis: 'Repository analysis pipeline',
  github: 'GitHub API integration',
  export: 'Document export (PDF, DOCX, Markdown)',
  email: 'Email delivery',
  chat: 'Chat and messaging',
  search: 'Search and indexing',
  upload: 'File upload and storage',
  media: 'Media handling',
  config: 'Application configuration',
  database: 'Database access layer',
  db: 'Database access layer',
  middleware: 'Request middleware',
  queue: 'Background job queue',
  worker: 'Background workers',
  embed: 'Vector embeddings',
  embeddings: 'Vector embeddings and RAG',
  ai: 'AI / LLM integration layer',
}

export function detectModules(files: RepoFile[]): RepositoryAnalysis['modules'] {
  const moduleFiles: Record<string, RepoFile[]> = {}

  for (const file of files) {
    const parts = file.path.toLowerCase().split('/')
    for (const part of parts) {
      const clean = part.replace(/\.[^.]+$/, '') // remove extension
      if (MODULE_PATTERNS[clean]) {
        if (!moduleFiles[clean]) moduleFiles[clean] = []
        moduleFiles[clean].push(file)
      }
    }
  }

  return Object.entries(moduleFiles).map(([name, mFiles]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    responsibility: MODULE_PATTERNS[name],
    files: mFiles.map((f) => f.path).slice(0, 10),
    evidence: mFiles.map((f) => f.path).slice(0, 3),
  }))
}
