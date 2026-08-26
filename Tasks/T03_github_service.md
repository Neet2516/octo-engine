# T03 · GitHub API Service

**Commit:** `feat: add GitHub repository fetch and file-filtering service`

**Depends on:** T02

---

## Objective
Build the GitHub layer that fetches repo metadata, the file tree, and raw file content — with intelligent filtering before any AI call.

## Files

### `src/lib/github/client.ts`
Singleton Octokit wrapper using `GITHUB_TOKEN` env var.

### `src/lib/github/fetcher.ts`
Functions:
- `validateGithubUrl(url: string): { owner: string; repo: string }` — throws on invalid URL
- `fetchRepoMeta(owner, repo): Promise<RepoMeta>` — calls GitHub REST, returns typed RepoMeta
- `fetchFileTree(owner, repo, branch): Promise<RepoFile[]>` — recursively gets tree, applies ignore list
- `fetchFileContent(owner, repo, path, branch): Promise<string>` — downloads raw content; returns empty string on binary/oversized (>100 KB)

### `src/lib/github/filter.ts`
```ts
const IGNORE_DIRS = ["node_modules",".git","dist","build",".next","coverage","target","vendor",".cache"];
const IGNORE_EXT  = [".lock","min.js",".map",".png",".jpg",".svg",".gif",".mp4",".woff",".ttf"];
const PRIORITY_FILES = ["README","package.json","tsconfig","Dockerfile","docker-compose",
  ".env.example","prisma","routes","controllers","services","models","api","auth","config","test"];

export function filterFiles(files: RepoFile[]): RepoFile[]  // marks isRelevant
export function scoreFile(file: RepoFile): number           // 0-100 relevance score
```

### `src/services/repository.service.ts`
```ts
export async function analyseRepository(url: string): Promise<{ meta: RepoMeta; files: RepoFile[] }>
```
Orchestrates: validate → fetch meta → fetch tree → filter → fetch content for relevant files.

## Rate Limiting
- Respect `x-ratelimit-remaining` header; throw `RateLimitError` when < 10.
- Chunk content fetches to max 10 concurrent requests.

## Error Types (export from `src/lib/github/errors.ts`)
```ts
export class InvalidUrlError extends Error {}
export class RepoNotFoundError extends Error {}
export class PrivateRepoError extends Error {}
export class RateLimitError extends Error { resetAt: Date }
export class RepoTooLargeError extends Error { fileCount: number }
```

## Done-Definition
Unit test: `pnpm test lib/github` — fetchRepoMeta resolves, filter removes node_modules.
