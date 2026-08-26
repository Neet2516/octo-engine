# T04 · Repository Intelligence Engine (Static Analysis)

**Commit:** `feat: add static repository analyser — detects stack, arch, modules, APIs, DB, security`

**Depends on:** T03

---

## Objective
Extract structured facts from the file tree and content **before** calling the LLM. This is the highest-value task — accurate facts = accurate report.

## Files

### `src/lib/analyzer/stack-detector.ts`
Detect technology stack from:
- `package.json` dependencies
- file extensions
- config file names (next.config, vite.config, tailwind.config, prisma schema …)

Returns: `technologyStack` partial of `RepositoryAnalysis`.

### `src/lib/analyzer/arch-detector.ts`
Classify architecture pattern:
- monolith / microservices / serverless / full-stack / CLI / library / mobile / data-pipeline
- Identify major components from directory structure.

### `src/lib/analyzer/module-detector.ts`
Walk directory tree; identify modules by folder names (`auth`, `user`, `payment`, `notification`, `dashboard`, `api`).
For each module, list its files and assign responsibility label.

### `src/lib/analyzer/api-detector.ts`
Parse source files for:
- Express/Next.js route definitions (`app.get`, `router.post`, `export async function GET`)
- Extract method, path, auth middleware presence.
Each route → typed `ApiRoute` with evidence file path.

### `src/lib/analyzer/db-detector.ts`
Detect: Prisma schema → parse models/relations. Also detect mongoose schemas, SQLAlchemy models, Sequelize.
Assign `CONFIRMED` confidence when schema file found, `INFERRED` from import patterns.

### `src/lib/analyzer/security-detector.ts`
Grep for: `jsonwebtoken`, `bcrypt`, `passport`, `cors`, `helmet`, `rateLimit`, `express-validator`, `next-auth`, `OAuth`.
Only report what is found with evidence paths.

### `src/lib/analyzer/index.ts`
```ts
export async function runStaticAnalysis(files: RepoFile[]): Promise<Partial<RepositoryAnalysis>>
```
Runs all detectors, merges output.

## Done-Definition
`runStaticAnalysis` on the octo-engine repo itself returns non-empty `technologyStack` and `architecture`.
