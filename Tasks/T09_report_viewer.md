# T09 · Report Viewer & Editor

**Commit:** `feat: add full report viewer with sidebar navigation and inline editor`

**Depends on:** T08

---

## Objective
Render the generated report beautifully; allow inline editing and per-section regeneration.

## Route
`/report/:id`

## Layout
```
┌─────────────────────────────────────────────────────┐
│  Navbar: repo name  |  Edit  Download▾  Share       │
├───────────┬─────────────────────────────────────────┤
│  Sidebar  │            Report Content               │
│  (fixed)  │   (scrollable, section-by-section)      │
└───────────┴─────────────────────────────────────────┘
```

## Sidebar (`src/components/report/ReportSidebar.tsx`)
Links to all 27 sections; highlights active section on scroll (Intersection Observer).

## Content (`src/components/report/ReportContent.tsx`)
- Render each `ReportSection.content` as Markdown (use `react-markdown` + `rehype-highlight`).
- Architecture section: render Mermaid diagram (`react-mermaid2` or equivalent).

## Editor (`src/components/editor/SectionEditor.tsx`)
- Monaco Editor (markdown mode) opens when user clicks "Edit" on a section.
- Autosave: debounced `PATCH /api/reports/:id/sections/:sectionId` after 800 ms idle.
- "Save" / "Cancel" buttons.

## Regeneration (`src/components/report/RegenerateMenu.tsx`)
Dropdown per section:
- Regenerate · Make More Technical · Make Simpler · Expand · Shorten
Calls `POST /api/reports/:id/sections/:sectionId/regenerate` with instruction.
Shows inline loading state on the section; replaces content on success.

## Report Metadata Panel
Allow editing: Student Names · College · Guide · Academic Year.
Stored in `Report.metadataJson`.

## Done-Definition
Can navigate all sections; edit and autosave a section; trigger regeneration; section updates in place.
