# T13 · Tests

**Commit:** `test: add unit and integration tests for analyser, API routes, and export`

**Depends on:** T01–T12

---

## Objective
Cover the most critical paths. Target: critical paths only — not 100% coverage.

## Setup
```bash
pnpm add -D vitest @vitest/ui happy-dom msw
```

## Test Files

### `tests/unit/github/filter.test.ts`
- `filterFiles` removes `node_modules`, `dist`, images.
- `scoreFile` gives higher score to `routes/`, `api/`, `auth/`.

### `tests/unit/analyzer/stack-detector.test.ts`
- Detect React from `package.json` with `"react"` dep.
- Detect Prisma from `prisma/schema.prisma` file presence.

### `tests/unit/analyzer/api-detector.test.ts`
- Parse Express `router.get("/users", ...)` → extracts method + path.
- Parse Next.js `export async function GET` → extracts route.

### `tests/unit/ai/provider.test.ts`
- `getAIProvider()` returns `OpenAIProvider` when `OPENAI_API_KEY` set.
- Mock: prompt function returns valid `RepositoryAnalysis` partial.

### `tests/integration/api/analysis.test.ts`
- `POST /api/analysis/start` with valid URL → returns 200 + jobId.
- `POST /api/analysis/start` with invalid URL → returns 400.
- Rate limit test: 11th request returns 429.

### `tests/integration/export/pdf.test.ts`
- Export a seeded report → returns Buffer with `%PDF` header.

## Run
```bash
pnpm test          # unit only
pnpm test:int      # integration (requires DB + Redis)
```

## Done-Definition
`pnpm test` passes all unit tests with zero failures.
