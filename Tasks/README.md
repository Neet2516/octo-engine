# octo-engine · Task Execution Guide

> Auto-generated from `About.md`. Each task is atomic, git-committable, and sized for minimal LLM token usage.

---

## Execution Order

```
T01 → T02 → T03 → T04 → T05 → T06
                              ↓
              T07 ──────────→ T08 → T09 → T10
                              ↑
              T11 (parallel with T08 onwards)
              T12 (parallel with T09 onwards)
              T13 (after T12)
              T14 (last)
```

| # | File | Commit Message | Depends On | Phase |
|---|------|----------------|-----------|-------|
| T01 | `T01_project_scaffold.md` | `chore: initialise Next.js project with TypeScript, Tailwind, shadcn/ui` | — | MVP |
| T02 | `T02_types_and_schema.md` | `feat: add core TypeScript types and Prisma database schema` | T01 | MVP |
| T03 | `T03_github_service.md` | `feat: add GitHub repository fetch and file-filtering service` | T02 | MVP |
| T04 | `T04_intelligence_engine.md` | `feat: add static repository analyser — detects stack, arch, modules, APIs, DB, security` | T03 | MVP |
| T05 | `T05_ai_layer.md` | `feat: add multi-provider AI layer with structured report generation pipeline` | T04 | MVP |
| T06 | `T06_api_routes.md` | `feat: add API routes for analysis, report, and export with BullMQ job queue` | T05 | MVP |
| T07 | `T07_landing_page.md` | `feat: build landing page with GitHub URL input and feature sections` | T01 | Phase 2 |
| T08 | `T08_analysis_page.md` | `feat: add real-time analysis progress page with step indicators` | T06, T07 | Phase 2 |
| T09 | `T09_report_viewer.md` | `feat: add full report viewer with sidebar navigation and inline editor` | T08 | Phase 2 |
| T10 | `T10_export_system.md` | `feat: add PDF, DOCX, and Markdown export with proper academic formatting` | T09 | Phase 2 |
| T11 | `T11_error_handling_security.md` | `feat: add global error handling, input validation, rate limiting, and security headers` | T06 | Phase 2 |
| T12 | `T12_large_repo_rag.md` | `feat: add chunking, embeddings, and vector retrieval for large repositories` | T05 | Phase 3 |
| T13 | `T13_testing.md` | `test: add unit and integration tests for analyser, API routes, and export` | T01–T12 | Phase 3 |
| T14 | `T14_finalize_and_deploy.md` | `chore: production hardening — env validation, logging, Docker, README` | T01–T13 | Phase 4 |

---

## Design Principles for AI Agents

1. **One task per agent session** — each file is self-contained with explicit prerequisites.
2. **Done-Definition** — every task ends with a clear, testable completion criterion.
3. **Minimal context** — only the types/facts the agent needs are listed; nothing redundant.
4. **Evidence-backed** — no hallucination; the intelligence engine is built before the AI layer.
5. **Incremental commits** — each task maps to exactly one git commit.

---

## Phase Summary

| Phase | Tasks | Deliverable |
|---|---|---|
| MVP | T01–T06 | URL → analysis → report (API only) |
| Phase 2 | T07–T11 | Full UI, editor, export, security |
| Phase 3 | T12–T13 | Large repo support, tests |
| Phase 4 | T14 | Production-ready Docker deployment |
