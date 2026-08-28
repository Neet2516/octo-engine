'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useToast } from '@/components/ui/toast'

export default function HeroSection() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  function validateUrl(val: string): boolean {
    try {
      const u = new URL(val)
      return u.hostname === 'github.com' && u.pathname.split('/').filter(Boolean).length >= 2
    } catch {
      return false
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateUrl(url)) {
      const msg = 'Please enter a valid public GitHub repository URL (e.g. https://github.com/username/repo)'
      setError(msg)
      toast({
        title: 'Invalid GitHub URL',
        message: msg,
        type: 'warning',
      })
      return
    }
    setError('')
    router.push(`/analyze?url=${encodeURIComponent(url)}`)
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Multi-Model Failover · Groq + OpenRouter + Gemini · Zero Hallucinations
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
          Turn Any GitHub Repository Into a Project Report
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Analyse your codebase with resilient multi-model AI and generate a professional, documentation-ready academic report in minutes.
        </p>

        {/* URL Input */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-3">
          <input
            id="github-url-input"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            onBlur={() => url && !validateUrl(url) && setError('Invalid GitHub URL')}
            placeholder="https://github.com/username/project"
            className="flex-1 px-5 py-4 rounded-xl bg-[#18181f] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors text-base"
          />
          <button
            id="generate-report-btn"
            type="submit"
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold transition-all duration-200 whitespace-nowrap shadow-lg shadow-indigo-500/20"
          >
            Generate Report →
          </button>
        </form>

        {/* Error */}
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

        {/* Example link */}
        <p className="text-gray-500 text-sm mt-3">
          Try an example:{' '}
          <button
            type="button"
            onClick={() => {
              const demo = 'https://github.com/vercel/next.js'
              setUrl(demo)
              toast({
                title: 'Example Loaded',
                message: 'Loaded vercel/next.js repository URL',
                type: 'info',
              })
            }}
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
          >
            vercel/next.js
          </button>
        </p>
      </motion.div>
    </section>
  )
}
