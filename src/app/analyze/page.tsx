'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProgressSteps from '@/components/analysis/ProgressSteps'
import AnalysisStats from '@/components/analysis/AnalysisStats'
import ErrorState from '@/components/analysis/ErrorState'
import { useToast } from '@/components/ui/toast'

const POLL_INTERVAL = 2000

export default function AnalyzePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url') ?? ''
  const { toast } = useToast()

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
        if (!res.ok) {
          const errMsg = data.message ?? 'Failed to start analysis'
          toast({
            title: 'Analysis Request Failed',
            message: errMsg,
            type: 'error',
          })
          throw new Error(errMsg)
        }
        if (!cancelled) {
          setJobId(data.jobId)
          setReportId(data.reportId)
          toast({
            title: 'Analysis Started',
            message: `Starting deep static & AI inspection for ${url.split('/').slice(-2).join('/')}`,
            type: 'info',
          })
        }
      } catch (e) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : String(e)
          setError(msg)
          toast({
            title: 'Connection Error',
            message: msg,
            type: 'error',
          })
        }
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
          toast({
            title: 'Analysis Complete',
            message: 'All 27 sections generated successfully. Redirecting to report...',
            type: 'success',
          })
          router.push(`/report/${reportId}`)
        }
        if (data.status === 'failed') {
          clearInterval(interval)
          const failReason = data.error ?? 'Analysis pipeline encountered an error'
          setError(failReason)
          toast({
            title: 'Pipeline Error',
            message: failReason,
            type: 'error',
          })
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
