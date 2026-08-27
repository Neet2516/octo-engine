export interface RepoMeta {
  id: string
  url: string
  owner: string
  name: string
  branch: string
  description: string
  stars: number
  forks: number
  language: string
  languages: Record<string, number>
  topics: string[]
  license: string | null
  defaultBranch: string
  readme: string
  contributors: number
  commitCount: number
}

export interface RepoFile {
  path: string
  language: string
  size: number
  contentHash: string
  isRelevant: boolean
  content?: string
}
