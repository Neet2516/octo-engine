# 🐙 octo-engine

> **Turn Any GitHub Repository Into a Comprehensive, Academic & Technical Project Report in Minutes.**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 📌 Overview

**octo-engine** is a production-grade AI-powered documentation and report generation engine. It ingests public GitHub repository URLs, statically analyzes repository structure, dependencies, APIs, database schemas, and architectural patterns, and synthesizes structured, evidence-backed academic and technical project reports.

Unlike standard LLM wrappers, **octo-engine** runs a deterministic static intelligence pipeline *before* engaging the AI layer, ensuring that every architectural claim, tech stack entry, and API route in the report is strictly grounded in verifiable repository evidence—eliminating hallucinations.

---

## ✨ Key Features

- **🔍 Automated Repository Analysis**: Statically scans file trees, package manifests, configs, routing files, models, and controllers.
- **🛡️ Evidence-Backed Intelligence Engine**: Classifies project architecture (monolith, microservices, serverless, full-stack, etc.), database models, API routes, and security mechanisms with strict confidence ratings (`CONFIRMED`, `INFERRED`, `UNKNOWN`).
- **🧠 Multi-Provider AI Layer**: Modular LLM integration supporting OpenAI, Anthropic, and custom AI providers via a unified provider interface.
- **📊 27-Section Academic & Technical Reports**: Generates end-to-end documentation including Cover Page, Abstract, Architecture Diagrams, Database Design, API Specifications, Security Analysis, Testing, and Limitations.
- **🎨 Interactive Architecture Diagrams**: Generates dynamic Mermaid.js architecture and data-flow diagrams directly from detected components.
- **⚡ Real-Time Progress Tracking**: Live status updates showing validation, metadata extraction, dependency analysis, and report synthesis.
- **✏️ Interactive Report Editor**: In-browser document editor allowing users to modify text, regenerate individual sections on demand, and add institution/academic metadata.
- **📥 Multi-Format Export**: Export production-ready reports to **PDF** (with academic formatting, headers/footers, TOC), **DOCX**, and **Markdown**.
- **📚 Large Repository RAG Strategy**: Smart chunking, embeddings, and vector retrieval for multi-thousand-file repositories.

---

## 🔄 Core Workflow

```text
User Enters GitHub Repository URL
               ↓
      Validate Repository
               ↓
    Fetch Repository Metadata (GitHub API)
               ↓
    Analyze Directory Structure & Intelligent File Filtering
               ↓
    Static Repository Intelligence Engine
    ├── Technology Stack Detection
    ├── Architecture & Component Mapping
    ├── Module & API Discovery
    ├── Database Schema & Entity Identification
    └── Security & Testing Verification
               ↓
    Multi-Task AI Synthesis Pipeline (Evidence-Guided)
               ↓
    Interactive Report Viewer & Editor
               ↓
    Export to PDF / DOCX / Markdown
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | [Next.js (App Router)](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/), [Monaco Editor](https://microsoft.github.io/monaco-editor/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | Next.js API Routes / Server Actions, Node.js, GitHub REST API |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/) |
| **Queue & Caching** | [Redis](https://redis.io/) + [BullMQ](https://bullmq.io/) (for background jobs & large repo handling) |
| **AI Integration** | Modular Provider Abstraction (`OpenAIProvider`, `AnthropicProvider`, etc.) |
| **Diagrams & Export** | [Mermaid.js](https://mermaid.js.org/), Puppeteer / `@react-pdf/renderer`, `docx` |

---

## 📂 Project Architecture

```text
src/
├── app/                      # Next.js App Router pages and API routes
│   ├── page.tsx              # Landing page with GitHub URL input
│   ├── analyze/              # Real-time analysis status view
│   ├── report/               # Interactive report viewer & editor
│   └── api/                  # API endpoints (GitHub, analysis, reports, exports)
│       ├── github/
│       ├── analysis/
│       ├── reports/
│       └── export/
├── components/               # React UI components
│   ├── landing/              # Hero, features, demo CTA
│   ├── analysis/             # Real-time progress indicators
│   ├── report/               # Report reader, sidebar navigation
│   ├── editor/               # Inline editor & section regeneration controls
│   └── ui/                   # shadcn/ui reusable primitives
├── lib/                      # Core business logic & utilities
│   ├── github/               # GitHub API client & repo fetchers
│   ├── analyzer/             # Static repository intelligence engine
│   ├── ai/                   # Multi-provider AI abstractions & prompt tasks
│   ├── parser/               # Manifest & source code parsers
│   ├── embeddings/           # Vector embeddings & chunking for large repos
│   ├── report/               # Report templates & builders
│   └── export/               # PDF, DOCX, and Markdown generators
├── services/                 # Service layer orchestrating domain logic
│   ├── repository.service.ts
│   ├── analysis.service.ts
│   ├── report.service.ts
│   └── export.service.ts
├── types/                    # Core TypeScript definitions & schemas
│   ├── repository.ts
│   ├── analysis.ts
│   └── report.ts
└── prisma/
    └── schema.prisma         # Database schema for repositories, analyses & reports
```

---

## 📑 Report Sections Generated

The engine produces an exhaustive 27-section report ready for technical and academic submissions:

1. **Cover Page**
2. **Certificate** *(editable placeholders)*
3. **Declaration**
4. **Acknowledgement**
5. **Abstract**
6. **Table of Contents**
7. **Introduction**
8. **Problem Statement**
9. **Objectives**
10. **Existing System**
11. **Proposed System**
12. **Scope of the Project**
13. **Technology Stack**
14. **System Requirements**
15. **System Architecture** *(with Mermaid diagrams)*
16. **System Design**
17. **Module Description**
18. **Database Design** *(entities, schemas & relationships)*
19. **API Design** *(endpoints, methods, payloads)*
20. **Implementation Details**
21. **Security Considerations**
22. **Testing & Quality Assurance**
23. **Results**
24. **Limitations**
25. **Future Scope**
26. **Conclusion**
27. **References**

---

## 🚦 Roadmap & Implementation Tasks

Detailed atomic execution tasks are documented in the [`Tasks/`](./Tasks/) directory:

- [x] **[Tasks Execution Guide](./Tasks/README.md)**
- 🔹 **Phase 1 (MVP)**:
  - [`T01` Project Scaffold & Setup](./Tasks/T01_project_scaffold.md)
  - [`T02` TypeScript Types & Prisma Schema](./Tasks/T02_types_and_schema.md)
  - [`T03` GitHub Service & File Filtering](./Tasks/T03_github_service.md)
  - [`T04` Repository Intelligence Engine](./Tasks/T04_intelligence_engine.md)
  - [`T05` AI Layer & Prompting Pipeline](./Tasks/T05_ai_layer.md)
  - [`T06` API Routes & Job Queue](./Tasks/T06_api_routes.md)
- 🔹 **Phase 2 (UI & Export)**:
  - [`T07` Landing Page](./Tasks/T07_landing_page.md)
  - [`T08` Real-time Analysis Page](./Tasks/T08_analysis_page.md)
  - [`T09` Report Viewer & In-line Editor](./Tasks/T09_report_viewer.md)
  - [`T10` Export System (PDF, DOCX, Markdown)](./Tasks/T10_export_system.md)
  - [`T11` Error Handling & Security](./Tasks/T11_error_handling_security.md)
- 🔹 **Phase 3 (Scale & Verification)**:
  - [`T12` Large Repository RAG & Vector Retrieval](./Tasks/T12_large_repo_rag.md)
  - [`T13` Unit & Integration Testing](./Tasks/T13_testing.md)
- 🔹 **Phase 4 (Production)**:
  - [`T14` Finalize, Dockerize & Deploy](./Tasks/T14_finalize_and_deploy.md)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`
- **PostgreSQL Database**
- **Redis Server** (optional for local MVP, required for BullMQ background workers)
- **API Keys**:
  - GitHub Personal Access Token (for higher rate limits)
  - OpenAI / Anthropic API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Neet2516/octo-engine.git
   cd octo-engine
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/octo_engine?schema=public"

   # Redis / Queue
   REDIS_URL="redis://localhost:6379"

   # GitHub API
   GITHUB_TOKEN="your_github_pat"

   # AI Provider Keys
   AI_PROVIDER="openai" # or "anthropic"
   OPENAI_API_KEY="your_openai_key"
   ANTHROPIC_API_KEY="your_anthropic_key"
   ```

4. **Initialize Database:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Code Integrity

- **Static Analysis Only**: Repositories are analyzed statically; arbitrary code is never executed.
- **Strict Evidence Verification**: Technical claims must have explicit repository evidence to prevent hallucinations.
- **Rate Limiting & Token Sanitization**: API keys and secrets are protected and never exposed to the client.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <sub>Developed by <a href="https://github.com/Neet2516">Neet2516</a> · Built for engineers, students, and researchers.</sub>
</div>
