'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProgressSteps from '@/components/analysis/ProgressSteps'
import AnalysisStats from '@/components/analysis/AnalysisStats'
import ErrorState from '@/components/analysis/ErrorState'

const POLL_INTERVAL = 2000

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') ?? ''

  const [jobId, setJobId] = useState<string | null>(null)
  const [reportId, setReportId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('starting')
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Start analysis on mount
  useEffect(() => {
    if (!url) return
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch('/api/analysis/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.message ?? 'Failed to start analysis')
        if (!cancelled) {
          setJobId(data.jobId)
          setReportId(data.reportId)
        }
      } catch (e) {
        if (!cancelled) setError(String(e))
      }
    })()

    return () => { cancelled = true }
  }, [url])

  // Poll status once jobId is received
  useEffect(() => {
    if (!jobId) return
    let cancelled = false

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analysis/status?jobId=${jobId}`)
        const data = await res.json()
        if (cancelled) return

        setStatus(data.status)
        setProgress(data.progress ?? 0)
        setCurrentStep(data.currentStep ?? '')

        if (data.status === 'completed' && reportId) {
          clearInterval(interval)
          router.push(`/report/${reportId}`)
        }
        if (data.status === 'failed') {
          clearInterval(interval)
          setError(data.error ?? 'Analysis failed')
        }
      } catch { /* network hiccup, keep polling */ }
    }, POLL_INTERVAL)

    return () => { cancelled = true; clearInterval(interval) }
  }, [jobId, reportId, router])

  if (error) return <ErrorState error={error} url={url} />

  return (
    <main className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-white mb-2">Analysing Repository</h1>
        <p className="text-gray-400 mb-8 text-sm truncate">{url}</p>
        <ProgressSteps progress={progress} currentStep={currentStep} />
        <AnalysisStats progress={progress} currentStep={currentStep} />
      </div>
    </main>
  )
}
