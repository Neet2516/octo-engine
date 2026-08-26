# T06 · Next.js API Routes & Background Job Queue

**Commit:** `feat: add API routes for analysis, report, and export with BullMQ job queue`

**Depends on:** T05

---

## Objective
Wire up HTTP endpoints and a Redis/BullMQ queue so large repo analysis runs in the background.

## Endpoints

### `POST /api/github/validate`
Body: `{ url: string }`
Returns: `{ owner, repo, description, stars, language }` or error.

### `POST /api/analysis/start`
Body: `{ url: string }`
- Saves Repository record; enqueues analysis job.
- Returns: `{ jobId: string, reportId: string }`

### `GET /api/analysis/status?jobId=`
Polls BullMQ job state.
Returns: `{ status, progress, currentStep, error? }`

### `GET /api/reports/:id`
Returns full `Report` with all `ReportSection[]`.

### `PATCH /api/reports/:id/sections/:sectionId`
Body: `{ content: string }`
Updates one section. Autosave endpoint.

### `POST /api/reports/:id/sections/:sectionId/regenerate`
Body: `{ instruction?: string }`
Re-runs AI for that section only.

### `POST /api/export`
Body: `{ reportId: string; format: "pdf"|"docx"|"md" }`
Returns binary file stream.

## Background Worker

### `src/lib/queue/worker.ts`
BullMQ worker that processes `analysis` queue:
```
Step 1 (10%): Validate URL
Step 2 (20%): Fetch repo metadata
Step 3 (35%): Fetch & filter files
Step 4 (50%): Static analysis
Step 5 (70%): AI pipeline (tasks 01-07)
Step 6 (90%): Generate report sections
Step 7 (100%): Save to DB; mark job done
```
Update `AnalysisJob.progress` + `currentStep` after each step.

### `src/lib/queue/client.ts`
BullMQ Queue singleton, connected to `REDIS_URL`.

## Error Handling
All routes return structured errors:
```json
{ "error": "RATE_LIMIT_EXCEEDED", "message": "...", "retryAfter": 60 }
```
Never expose stack traces.

## Done-Definition
`POST /api/analysis/start` enqueues a job; `GET /api/analysis/status` returns progress increments.
