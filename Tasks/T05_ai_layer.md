# T05 · AI Analysis Layer & Provider Abstraction

**Commit:** `feat: add multi-provider AI layer with structured report generation pipeline`

**Depends on:** T04

---

## Objective
Wrap LLM calls behind a provider interface; use separate focused prompts (not one mega-prompt) to fill in what static analysis could not determine.

## Files

### `src/lib/ai/provider.ts`
```ts
export interface AIProvider {
  complete(prompt: string, schema?: ZodSchema): Promise<unknown>;
  streamComplete(prompt: string): AsyncIterable<string>;
}
export class OpenAIProvider implements AIProvider { ... }
export class AnthropicProvider implements AIProvider { ... }
export function getAIProvider(): AIProvider  // reads env to pick provider
```

### `src/lib/ai/prompts/` (one file per AI task)
| File | Purpose |
|---|---|
| `01_understand.ts` | Understand repo purpose, problem, objectives |
| `02_architecture.ts` | Confirm/enrich architecture pattern |
| `03_modules.ts` | Describe module responsibilities |
| `04_apis.ts` | Describe API endpoints |
| `05_database.ts` | Describe DB design, relationships |
| `06_security.ts` | Summarise security mechanisms |
| `07_testing.ts` | Summarise testing approach |
| `08_report.ts` | Per-section report generation |

Each prompt file exports a typed function:
```ts
export function buildPrompt(analysis: Partial<RepositoryAnalysis>, excerpts: string[]): string
```

### `src/lib/ai/pipeline.ts`
```ts
export async function runAIPipeline(
  meta: RepoMeta,
  staticAnalysis: Partial<RepositoryAnalysis>,
  relevantExcerpts: string[]
): Promise<RepositoryAnalysis>
```
Runs tasks 01–07 sequentially, merges results into full `RepositoryAnalysis`.

### `src/lib/ai/report-generator.ts`
```ts
export async function generateReportSections(
  analysis: RepositoryAnalysis
): Promise<ReportSection[]>
```
Iterates over all 27 section types; calls prompt 08 for each. Returns array of sections.

## Rules
- Never ask the LLM to guess; always pass static analysis facts + evidence.
- Use Zod schemas for structured JSON output validation.
- Mark AI output with `confidence` field.
- Log token usage per call.

## Done-Definition
`runAIPipeline` returns a valid `RepositoryAnalysis` with no empty required fields.
