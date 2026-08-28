'use client'
import { useState } from 'react'
import type { Report } from '@/types/report'
import ReactMarkdown from 'react-markdown'
import { Edit3, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useToast } from '@/components/ui/toast'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function ReportContent({
  report,
  onSectionUpdate,
}: {
  report: Report
  onSectionUpdate: (sectionId: string, content: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const { toast } = useToast()

  async function saveSection(sectionId: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/reports/${report.id}/sections/${sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      if (!res.ok) throw new Error('Failed to update section')
      onSectionUpdate(sectionId, editContent)
      setEditingId(null)
      toast({
        title: 'Section Saved',
        message: 'Your modifications have been persisted.',
        type: 'success',
      })
    } catch (err: unknown) {
      toast({
        title: 'Save Failed',
        message: err instanceof Error ? err.message : 'Could not save section changes',
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  async function regenerateSection(sectionId: string, sectionTitle: string) {
    setRegeneratingId(sectionId)
    toast({
      title: 'Regenerating Section',
      message: `Running AI generation for "${sectionTitle}"...`,
      type: 'info',
    })
    try {
      const res = await fetch(`/api/reports/${report.id}/sections/${sectionId}/regenerate`, {
        method: 'POST',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Regeneration failed' }))
        throw new Error(err.message || 'Regeneration failed')
      }
      const updated = await res.json()
      if (updated?.content) {
        onSectionUpdate(sectionId, updated.content)
      }
      toast({
        title: 'Section Regenerated',
        message: `"${sectionTitle}" updated with fresh AI findings!`,
        type: 'success',
      })
    } catch (err: unknown) {
      toast({
        title: 'Regeneration Error',
        message: err instanceof Error ? err.message : 'AI section regeneration failed',
        type: 'error',
      })
    } finally {
      setRegeneratingId(null)
    }
  }

  return (
    <main className="flex-1 overflow-y-auto px-8 py-10 max-w-4xl mx-auto w-full">
      {report.sections.map((section) => (
        <article key={section.id} id={`section-${section.id}`} className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingId(section.id); setEditContent(section.content) }}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                title="Edit section"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => regenerateSection(section.id, section.title)}
                disabled={regeneratingId === section.id}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                title="Regenerate section"
              >
                <RefreshCw className={`w-4 h-4 ${regeneratingId === section.id ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>

          {editingId === section.id ? (
            <div className="rounded-xl overflow-hidden border border-indigo-500/30">
              <MonacoEditor
                height="400px"
                language="markdown"
                theme="vs-dark"
                value={editContent}
                onChange={(v) => setEditContent(v ?? '')}
                options={{ minimap: { enabled: false }, wordWrap: 'on', fontSize: 14 }}
              />
              <div className="flex gap-2 p-3 bg-[#1e1e1e]">
                <button onClick={() => saveSection(section.id)} disabled={saving}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={() => setEditingId(null)}
                  className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none text-gray-300">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          )}
        </article>
      ))}
    </main>
  )
}
