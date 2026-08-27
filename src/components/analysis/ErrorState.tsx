'use client'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function ErrorState({ error, url }: { error: string; url: string }) {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 rounded-lg bg-[#18181f] border border-white/10 text-gray-300 hover:text-white transition-colors"
          >
            Try Another Repository
          </button>
          <button
            onClick={() => router.push(`/analyze?url=${encodeURIComponent(url)}`)}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </main>
  )
}
