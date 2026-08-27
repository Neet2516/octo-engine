'use client'
import { useEffect, useState } from 'react'
import type { Report } from '@/types/report'
import ReportSidebar from '@/components/report/ReportSidebar'
import ReportContent from '@/components/report/ReportContent'
import { Download, Edit } from 'lucide-react'

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setReport(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  async function handleExport(format: 'pdf' | 'docx' | 'md') {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: params.id, format }),
    })
    if (!res.ok) return
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `report.${format}`
    a.click()
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-gray-400">
      Loading report…
    </div>
  )

  if (!report) return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center text-gray-400">
      Report not found.
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0f0f13]/80 backdrop-blur sticky top-0 z-30">
        <h1 className="font-semibold text-white truncate max-w-sm">{report.title}</h1>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm hover:border-indigo-500/40 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-[#22222c] border border-white/10 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity z-50">
              {(['pdf', 'docx', 'md'] as const).map((fmt) => (
                <button key={fmt} onClick={() => handleExport(fmt)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors uppercase text-gray-300">
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <ReportSidebar sections={report.sections} activeSection={activeSection} onSelect={setActiveSection} />
        <ReportContent report={report} onSectionUpdate={(id, content) => {
          setReport((r) => r ? {
            ...r,
            sections: r.sections.map((s) => s.id === id ? { ...s, content } : s)
          } : r)
        }} />
      </div>
    </div>
  )
}
