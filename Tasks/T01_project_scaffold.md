# T01 · Project Scaffold & Base Configuration

**Commit:** `chore: initialise Next.js project with TypeScript, Tailwind, shadcn/ui`

---

## Objective
Bootstrap the production-ready Next.js monorepo with all core dependencies and folder conventions.

## Prerequisites
- Node >= 18, pnpm installed globally

## Steps

### 1. Init Next.js
```bash
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*" --no-git
```

### 2. Add runtime dependencies
```bash
pnpm add @prisma/client bullmq ioredis \
  @ai-sdk/openai @ai-sdk/anthropic ai \
  puppeteer docx pdf-lib zod
pnpm add -D prisma @types/node
```

### 3. Install shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card badge progress separator
```

### 4. Install UI extras
```bash
pnpm add lucide-react framer-motion @monaco-editor/react
```

### 5. Create folder skeleton
```
src/
├── app/
│   ├── page.tsx
│   ├── analyze/page.tsx
│   ├── report/[id]/page.tsx
│   └── api/{github,analysis,reports,export}/route.ts
├── components/{landing,analysis,report,editor,ui}/
├── lib/{github,analyzer,ai,parser,embeddings,report,export}/
├── services/
└── types/
```
Place a stub `index.ts` in each lib sub-folder.

### 6. Commit .env.example
```env
DATABASE_URL=
GITHUB_TOKEN=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
REDIS_URL=
```

## Done-Definition
`pnpm build` exits 0 with zero TypeScript errors.
