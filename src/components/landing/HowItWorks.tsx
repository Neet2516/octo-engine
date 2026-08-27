'use client'
import { motion } from 'framer-motion'

const steps = [
  { num: '01', title: 'Paste GitHub URL', desc: 'Enter any public GitHub repository URL and hit Generate.' },
  { num: '02', title: 'AI Analyses Codebase', desc: 'We statically scan the repo then use AI to synthesise evidence-backed findings.' },
  { num: '03', title: 'Download Your Report', desc: 'Get a 27-section academic report as PDF, DOCX, or Markdown.' },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
        >
          How It Works
        </motion.h2>
        <p className="text-center text-gray-400 mb-16">Three steps from URL to report.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }} viewport={{ once: true }}
              className="relative p-6 rounded-2xl bg-[#18181f] border border-white/5 hover:border-indigo-500/30 transition-colors"
            >
              <div className="text-5xl font-black text-indigo-600/30 mb-4">{s.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
