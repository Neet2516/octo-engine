# T08 · Analysis Progress Page

**Commit:** `feat: add real-time analysis progress page with step indicators`

**Depends on:** T06, T07

---

## Objective
Show genuine real-time progress while the background job runs. No fake/animated progress bars.

## Route
`/analyze?url=<github_url>`

## Behaviour on Mount
1. Extract `url` from query param.
2. `POST /api/analysis/start` → receive `{ jobId, reportId }`.
3. Poll `GET /api/analysis/status?jobId=` every 2 s.
4. Render step list based on `currentStep`.
5. On `status === "done"` → redirect to `/report/:reportId`.
6. On `status === "error"` → show error with retry button.

## UI Components (`src/components/analysis/`)

### `ProgressSteps.tsx`
```
✓ Repository validated
✓ Metadata fetched
✓ File structure analysed
● Analysing source code   ← spinner on active
○ Detecting architecture
○ Generating report
```

### `AnalysisStats.tsx`
Shows: Files found · Relevant files · Estimated time remaining

### `ErrorState.tsx`
Shows: error message + "Try another repository" + "Retry" buttons.

## Rules
- Do NOT fake progress increments.
- Do NOT start polling before job ID is received.
- Cancel poll interval on unmount.

## Done-Definition
End-to-end: pasting a small public repo URL causes the step list to advance and eventually redirects to the report page.
