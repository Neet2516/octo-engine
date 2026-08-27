'use client'

export default function AnalysisStats({ progress, currentStep }: { progress: number; currentStep: string }) {
  return (
    <div className="p-4 rounded-xl bg-[#18181f] border border-white/5">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-gray-400">{currentStep || 'Initialising...'}</span>
        <span className="text-sm font-semibold text-indigo-400">{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
