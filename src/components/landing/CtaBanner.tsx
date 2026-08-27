'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function CtaBanner() {
  const router = useRouter()
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/20"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Generate Your Report?
        </h2>
        <p className="text-gray-400 mb-8">
          Paste a GitHub URL and get a professional project report in minutes.
        </p>
        <button
          id="cta-btn"
          onClick={() => router.push('/#github-url-input')}
          className="px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/30"
        >
          Get Started — It&apos;s Free
        </button>
      </motion.div>
    </section>
  )
}
