'use client'
import type { ReportSection } from '@/types/report'

export default function ReportSidebar({
  sections,
  activeSection,
  onSelect,
}: {
  sections: ReportSection[]
  activeSection: string | null
  onSelect: (id: string) => void
}) {
  return (
    <aside className="w-64 border-r border-white/5 overflow-y-auto flex-shrink-0 hidden md:block">
      <div className="p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Sections</p>
        <ul className="space-y-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  onSelect(s.id)
                  document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id
                    ? 'bg-indigo-600/15 text-indigo-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
