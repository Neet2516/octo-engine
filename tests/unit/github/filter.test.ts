import { describe, it, expect } from 'vitest'
import { filterFiles, scoreFile } from '@/lib/github/filter'
import type { RepoFile } from '@/types/repository'

function makeFile(path: string, size = 1000): RepoFile {
  return { path, language: 'TypeScript', size, contentHash: 'abc', isRelevant: false }
}

describe('filterFiles', () => {
  it('removes node_modules', () => {
    const files = [makeFile('node_modules/lodash/index.js'), makeFile('src/app/page.tsx')]
    const filtered = filterFiles(files)
    expect(filtered.find((f) => f.path.includes('node_modules'))?.isRelevant).toBe(false)
    expect(filtered.find((f) => f.path === 'src/app/page.tsx')?.isRelevant).toBe(true)
  })

  it('removes dist and build directories', () => {
    const files = [makeFile('dist/bundle.js'), makeFile('build/output.js'), makeFile('src/index.ts')]
    const filtered = filterFiles(files)
    expect(filtered.filter((f) => f.isRelevant).map((f) => f.path)).toEqual(['src/index.ts'])
  })

  it('removes image files', () => {
    const files = [makeFile('public/logo.png'), makeFile('src/lib/util.ts')]
    const filtered = filterFiles(files)
    expect(filtered.find((f) => f.path.endsWith('.png'))?.isRelevant).toBe(false)
  })

  it('removes files larger than 100KB', () => {
    const files = [makeFile('src/big-file.ts', 200_000), makeFile('src/small.ts', 500)]
    const filtered = filterFiles(files)
    expect(filtered.find((f) => f.path === 'src/big-file.ts')?.isRelevant).toBe(false)
    expect(filtered.find((f) => f.path === 'src/small.ts')?.isRelevant).toBe(true)
  })
})

describe('scoreFile', () => {
  it('gives higher score to route files', () => {
    const route = makeFile('src/app/api/routes/auth.ts')
    const asset = makeFile('public/assets/image.css')
    expect(scoreFile(route)).toBeGreaterThan(scoreFile(asset))
  })

  it('gives higher score to api directories', () => {
    const apiFile = makeFile('src/api/user.ts')
    const deepFile = makeFile('src/a/b/c/d/e/util.ts')
    expect(scoreFile(apiFile)).toBeGreaterThan(scoreFile(deepFile))
  })
})
