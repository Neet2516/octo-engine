'use client'
import { CheckCircle, Circle, Loader2 } from 'lucide-react'

const STEPS = [
  { label: 'Repository validated', threshold: 10 },
  { label: 'Metadata fetched', threshold: 20 },
  { label: 'File structure analysed', threshold: 35 },
  { label: 'Source code analysed', threshold: 50 },
  { label: 'Architecture detected', threshold: 70 },
  { label: 'Report sections generated', threshold: 90 },
  { label: 'Complete', threshold: 100 },
]

export default function ProgressSteps({ progress, currentStep }: { progress: number; currentStep: string }) {
  return (
    <div className="space-y-3 mb-8">
      {STEPS.map((step) => {
        const done = progress >= step.threshold
        const active = !done && progress >= step.threshold - 15

        return (
          <div key={step.label} className="flex items-center gap-3">
            {done ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : active ? (
              <Loader2 className="w-5 h-5 text-indigo-400 flex-shrink-0 animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />
            )}
            <span className={done ? 'text-white' : active ? 'text-indigo-300' : 'text-gray-500'}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
