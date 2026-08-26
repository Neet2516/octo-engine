# T11 · Error Handling, Security & Rate Limiting

**Commit:** `feat: add global error handling, input validation, rate limiting, and security headers`

**Depends on:** T06

---

## Objective
Harden the application to be production-safe.

## Tasks

### 1. Input Validation (Zod on all API routes)
- URL format check + disallow `localhost`, `10.*`, `192.168.*`, `127.*` (SSRF prevention).
- Request body size limit: 1 MB.
- File size limit during content fetch: 100 KB per file.

### 2. Rate Limiting (`src/lib/middleware/rateLimit.ts`)
- Use `@upstash/ratelimit` or in-memory for dev.
- Limits: 10 analysis starts / IP / hour; 100 API calls / IP / 15 min.

### 3. Security Headers (`next.config.ts`)
```ts
headers: [{ source:"/(.*)", headers:[
  { key:"X-Frame-Options", value:"DENY" },
  { key:"X-Content-Type-Options", value:"nosniff" },
  { key:"Referrer-Policy", value:"strict-origin-when-cross-origin" },
  { key:"Content-Security-Policy", value:"..." }
]}]
```

### 4. Secret Protection
- All secrets only in env vars; never logged or returned to client.
- `src/lib/env.ts` — validates required env vars on startup with Zod; throws if missing.

### 5. Error Boundary (`src/components/ui/ErrorBoundary.tsx`)
React error boundary wrapping each page; shows friendly message + reload button.

### 6. Global Error Handler (`src/lib/middleware/errorHandler.ts`)
Maps typed errors to HTTP status codes:
```
InvalidUrlError        → 400
RepoNotFoundError      → 404
PrivateRepoError       → 403
RateLimitError         → 429
RepoTooLargeError      → 413
AI errors              → 503
Unknown                → 500
```

### 7. Sanitisation
- Sanitise AI-generated content before rendering (`DOMPurify` on client or `sanitize-html` on server).
- Do not execute any code from the analysed repository.

## Done-Definition
Passing a `localhost` URL returns 400; missing env var throws at startup; rate limit triggers 429 after 11 starts.
