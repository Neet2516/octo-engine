# T02 · TypeScript Types & Prisma Schema

**Commit:** `feat: add core TypeScript types and Prisma database schema`

**Depends on:** T01

---

## Objective
Define all shared types and the database schema once — every later task imports from here.

## Files to Create

### `src/types/repository.ts`
```ts
export interface RepoMeta {
  id: string; url: string; owner: string; name: string;
  branch: string; description: string; stars: number;
  forks: number; language: string; languages: Record<string,number>;
  topics: string[]; license: string | null; defaultBranch: string;
  readme: string; contributors: number; commitCount: number;
}
export interface RepoFile {
  path: string; language: string; size: number;
  contentHash: string; isRelevant: boolean; content?: string;
}
```

### `src/types/analysis.ts`
```ts
type Confidence = "CONFIRMED" | "INFERRED" | "UNKNOWN";
interface Evidenced<T> { value: T; confidence: Confidence; evidence: string[]; }

export interface RepositoryAnalysis {
  project: { name:string; description:string; purpose:string; problemStatement:string; objectives:string[]; };
  technologyStack: { frontend:string[]; backend:string[]; database:string[]; languages:string[]; infrastructure:string[]; tools:string[]; };
  architecture: { pattern:string; components:{ name:string; responsibility:string; evidence:string[]; }[]; dataFlow:string; };
  modules: { name:string; responsibility:string; files:string[]; evidence:string[]; }[];
  apis: { method:string; path:string; description:string; authentication?:string; evidence:string[]; }[];
  database: Evidenced<{ technology:string; entities:string[]; relationships:string[]; }>;
  security: { mechanism:string; description:string; evidence:string[]; }[];
  testing: { framework:string; coverage:string; testTypes:string[]; evidence:string[]; };
  limitations: string[]; futureScope: string[];
}
```

### `src/types/report.ts`
```ts
export type SectionType =
  "cover"|"certificate"|"declaration"|"acknowledgement"|"abstract"|
  "toc"|"introduction"|"problem_statement"|"objectives"|"existing_system"|
  "proposed_system"|"scope"|"tech_stack"|"system_requirements"|
  "architecture"|"system_design"|"modules"|"database"|"api"|
  "implementation"|"security"|"testing"|"results"|"limitations"|
  "future_scope"|"conclusion"|"references";

export interface ReportSection { id:string; type:SectionType; title:string; content:string; version:number; updatedAt:Date; }
export interface Report { id:string; repositoryId:string; title:string; status:"pending"|"generating"|"ready"|"error"; version:number; sections:ReportSection[]; createdAt:Date; updatedAt:Date; }
```

### `prisma/schema.prisma`
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model Repository {
  id String @id @default(cuid())
  url String @unique
  owner String; name String; branch String; commitSha String
  description String?; analysisJson Json?
  createdAt DateTime @default(now()); updatedAt DateTime @updatedAt
  reports Report[]
  files   RepositoryFile[]
}
model RepositoryFile {
  id String @id @default(cuid())
  repositoryId String; path String; language String?; size Int
  contentHash String; isRelevant Boolean @default(false)
  analysisStatus String @default("pending")
  repository Repository @relation(fields:[repositoryId], references:[id], onDelete:Cascade)
}
model Report {
  id String @id @default(cuid())
  repositoryId String; title String
  status String @default("pending"); version Int @default(1)
  createdAt DateTime @default(now()); updatedAt DateTime @updatedAt
  repository Repository @relation(fields:[repositoryId], references:[id], onDelete:Cascade)
  sections ReportSection[]
}
model ReportSection {
  id String @id @default(cuid())
  reportId String; sectionType String; title String
  content String @db.Text; version Int @default(1)
  updatedAt DateTime @updatedAt
  report Report @relation(fields:[reportId], references:[id], onDelete:Cascade)
}
model AnalysisJob {
  id String @id @default(cuid())
  repositoryId String; status String @default("queued")
  progress Int @default(0); currentStep String?; error String?
  createdAt DateTime @default(now()); updatedAt DateTime @updatedAt
}
```

### Run migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

## Done-Definition
`pnpm prisma generate` succeeds; all types export without errors.
