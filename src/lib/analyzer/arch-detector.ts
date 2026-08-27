import type { RepoFile } from '@/types/repository'
import type { RepositoryAnalysis } from '@/types/analysis'

type ArchPattern = RepositoryAnalysis['architecture']['pattern']

const ARCH_SIGNALS: Record<ArchPattern, string[]> = {
  'full-stack': ['src/app', 'src/pages', 'frontend', 'backend', 'server', 'client'],
  'microservices': ['services/', 'service/', 'gateway', 'grpc', 'proto'],
  'serverless': ['functions/', 'lambda', 'netlify/functions', 'vercel/functions', 'cloudflare/workers'],
  'monolith': ['mvc', 'controllers/', 'views/', 'models/'],
  'cli': ['bin/', 'cmd/', 'commander', 'yargs', 'inquirer'],
  'library': ['lib/', 'dist/', 'esm/', 'cjs/', 'index.ts', 'index.js'],
  'mobile': ['android/', 'ios/', 'react-native', 'expo', 'flutter'],
  'data-pipeline': ['pipeline', 'etl', 'airflow', 'spark', 'notebooks/'],
  'client-server': ['client/', 'server/', 'socket', 'ws'],
}

export function detectArchitecture(files: RepoFile[]): RepositoryAnalysis['architecture'] {
  const paths = files.map((f) => f.path.toLowerCase())

  const scores: Record<string, number> = {}
  for (const [pattern, signals] of Object.entries(ARCH_SIGNALS)) {
    scores[pattern] = signals.filter((s) => paths.some((p) => p.includes(s))).length
  }

  const pattern = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown') as ArchPattern

  // Identify major components from top-level directories
  const topDirs = new Set<string>()
  for (const f of files) {
    const parts = f.path.split('/')
    if (parts.length > 1) topDirs.add(parts[0])
  }

  const componentMap: Record<string, string> = {
    'src': 'Source code root',
    'app': 'Application pages and routes',
    'components': 'Reusable UI components',
    'lib': 'Core business logic and utilities',
    'services': 'Service layer orchestrating domain logic',
    'types': 'TypeScript type definitions',
    'prisma': 'Database schema and migrations',
    'api': 'API route handlers',
    'hooks': 'Custom React hooks',
    'utils': 'Utility functions',
    'config': 'Configuration files',
    'tests': 'Test files',
    'docs': 'Documentation',
    'scripts': 'Build and utility scripts',
    'public': 'Static public assets',
  }

  const components: RepositoryAnalysis['architecture']['components'] = []
  for (const dir of topDirs) {
    const lower = dir.toLowerCase()
    if (componentMap[lower]) {
      components.push({
        name: dir,
        responsibility: componentMap[lower],
        evidence: files.filter((f) => f.path.startsWith(dir + '/')).slice(0, 3).map((f) => f.path),
      })
    }
  }

  return {
    pattern,
    components,
    dataFlow: buildDataFlow(pattern),
  }
}

function buildDataFlow(pattern: string): string {
  const flows: Record<string, string> = {
    'full-stack': 'Client → API Layer → Service Layer → Database',
    'microservices': 'API Gateway → Service Mesh → Individual Microservices → Data Stores',
    'serverless': 'HTTP Trigger → Edge Function → Third-party Services / Database',
    'monolith': 'Router → Controller → Service → Model → Database',
    'cli': 'CLI Input → Command Handler → Business Logic → Output',
    'library': 'Consumer Code → Library API → Core Logic → Return Value',
    'client-server': 'Client → WebSocket/HTTP → Server → Database',
    'data-pipeline': 'Data Source → Ingestion → Transform → Load → Analytics',
    'mobile': 'User → App UI → State Management → API Client → Backend',
  }
  return flows[pattern] || 'Input → Processing → Output'
}
