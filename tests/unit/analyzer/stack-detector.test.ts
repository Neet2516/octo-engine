import { describe, it, expect } from 'vitest'
import { detectStack } from '@/lib/analyzer/stack-detector'
import type { RepoFile } from '@/types/repository'

function makeFile(path: string, content?: string): RepoFile {
  return { path, language: 'JSON', size: 100, contentHash: 'abc', isRelevant: true, content }
}

describe('detectStack', () => {
  it('detects React from package.json', () => {
    const files = [makeFile('package.json', JSON.stringify({ dependencies: { react: '^18', next: '^14' } }))]
    const stack = detectStack(files)
    expect(stack.frontend).toContain('React')
    expect(stack.frontend).toContain('Next.js')
  })

  it('detects Prisma from package.json', () => {
    const files = [
      makeFile('package.json', JSON.stringify({ dependencies: { '@prisma/client': '^7' } })),
      makeFile('prisma/schema.prisma', 'model User { id String @id }'),
    ]
    const stack = detectStack(files)
    expect(stack.database).toContain('Prisma ORM')
  })

  it('detects Docker from Dockerfile presence', () => {
    const files = [makeFile('Dockerfile', 'FROM node:20')]
    const stack = detectStack(files)
    expect(stack.infrastructure).toContain('Docker')
  })

  it('detects TypeScript from tools', () => {
    const files = [makeFile('package.json', JSON.stringify({ devDependencies: { typescript: '^5' } }))]
    const stack = detectStack(files)
    expect(stack.tools).toContain('TypeScript')
  })
})
