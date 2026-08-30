'use client'
import { useEffect, useState } from 'react'
import type { Report } from '@/types/report'
import ReportSidebar from '@/components/report/ReportSidebar'
import ReportContent from '@/components/report/ReportContent'
import { Download } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetch(`/api/reports/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('Report not found or still generating')
        return r.json()
      })
      .then((data) => {
        setReport(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        toast({
          title: 'Report Load Failed',
          message: err instanceof Error ? err.message : 'Could not fetch report data',
          type: 'error',
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  async function handleExport(format: 'pdf' | 'docx' | 'md') {
    try {
      toast({
        title: 'Exporting Document',
        message: `Preparing ${format.toUpperCase()} download...`,
        type: 'info',
      })
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: params.id, format }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Export failed' }))
        throw new Error(err.message || 'Export failed')
      }
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${(report?.title || 'project').replace(/\s+/g, '_')}_report.${format}`
      a.click()
      toast({
        title: 'Export Complete',
        message: `Downloaded ${format.toUpperCase()} report successfully!`,
        type: 'success',
      })
    } catch (err: unknown) {
      toast({
        title: 'Export Error',
        message: err instanceof Error ? err.message : 'Failed to export document',
        type: 'error',
      })
    }
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
