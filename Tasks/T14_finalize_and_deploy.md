# T14 · Finalise, Polish & Deployment Prep

**Commit:** `chore: production hardening — env validation, logging, Docker, README`

**Depends on:** T01–T13

---

## Objective
Make the application genuinely production-ready, not a prototype.

## Checklist

### Code Quality
- [ ] Remove all `console.log`; replace with structured logger (`pino`).
- [ ] Eliminate all `any` types; fix lint warnings.
- [ ] Ensure all `async` functions have proper error handling.
- [ ] Confirm no secrets are logged or returned to client.

### Performance
- [ ] Cache GitHub API responses per `{owner}/{repo}/{commitSha}` in Redis (TTL 24 h).
- [ ] Add `loading.tsx` to all Next.js routes (streaming).
- [ ] Lazy-load Monaco Editor and Mermaid renderer.
- [ ] Add `next/image` for any images used.

### Accessibility
- [ ] All interactive elements keyboard-accessible.
- [ ] Focus management after section edit modal closes.
- [ ] ARIA labels on progress indicators.

### Docker
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["node", "server.js"]
```
```yaml
# docker-compose.yml
services:
  app: { build:., ports:["3000:3000"], env_file:.env }
  db:  { image:"postgres:16-alpine", env_file:.env }
  redis: { image:"redis:7-alpine" }
```

### Environment Validation
`src/lib/env.ts` (already in T11) — ensure it runs on startup.

### README.md
Rewrite with:
- Project description
- Architecture overview
- Quick start (`docker compose up`)
- Environment variables table
- Contributing guide

### Final Commits (squash-merge suggestion)
```
chore: production hardening — env validation, logging, Docker, README
```

## Done-Definition
`docker compose up` starts all services; visiting `localhost:3000` shows the landing page; analysis of a small public repo completes end-to-end inside Docker.
