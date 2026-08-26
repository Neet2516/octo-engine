# T07 · Landing Page UI

**Commit:** `feat: build landing page with GitHub URL input and feature sections`

**Depends on:** T01 (UI can be developed in parallel with T03–T06)

---

## Objective
Build a clean, professional developer-tool landing page.

## Design Tokens (add to `tailwind.config.ts`)
```ts
colors: {
  brand: { DEFAULT:"#6366f1", dark:"#4f46e5", light:"#a5b4fc" },
  surface: { 1:"#0f0f13", 2:"#18181f", 3:"#22222c" },
  muted: "#6b7280"
}
fontFamily: { sans: ["Inter","system-ui","sans-serif"] }
```
Import Inter from Google Fonts in `app/layout.tsx`.

## Sections (in order)

### Hero
- Headline: **"Turn Any GitHub Repository Into a Project Report"**
- Sub: "Analyse your codebase with AI and generate a professional, documentation-ready report in minutes."
- URL input field + "Generate Report" button
- Placeholder: `https://github.com/username/project`
- Example link below input

### How It Works (3 steps)
1. Paste GitHub URL  2. AI analyses codebase  3. Download report

### Features (6 cards)
Smart file filtering · Evidence-backed claims · 27-section report · Editable sections · PDF/DOCX/MD export · Architecture diagrams

### Example Report (static preview card)

### CTA banner

## Component Files
```
src/components/landing/
  HeroSection.tsx
  UrlInput.tsx          ← validates URL on blur, shows inline error
  HowItWorks.tsx
  FeatureGrid.tsx
  ExampleReport.tsx
  CtaBanner.tsx
```

## Behaviour
- On submit: validate URL → if valid, navigate to `/analyze?url=<encoded>`
- Show inline error for invalid URL without page reload.
- Animate hero text and cards on mount (Framer Motion, subtle fade-up).

## Done-Definition
Lighthouse performance ≥ 90; URL validation works; button navigates correctly.
