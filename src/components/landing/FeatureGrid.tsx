'use client'
import { motion } from 'framer-motion'
import { Filter, Shield, FileText, Edit3, Download, GitBranch } from 'lucide-react'

const features = [
  { icon: Filter, title: 'Smart File Filtering', desc: 'Ignores noise (node_modules, dist, lock files) and prioritises routes, models, configs, and services.' },
  { icon: Shield, title: 'Evidence-Backed Claims', desc: 'Every technical claim is traceable to a file in the repository. Zero hallucinations.' },
  { icon: FileText, title: '27-Section Report', desc: 'Full academic report: Abstract, Architecture, DB Design, API Spec, Security, Testing, and more.' },
  { icon: Edit3, title: 'Editable Sections', desc: 'Edit any section inline with Monaco Editor. Regenerate individual sections with a click.' },
  { icon: Download, title: 'PDF / DOCX / MD Export', desc: 'Download as a properly formatted academic PDF, an editable Word document, or raw Markdown.' },
  { icon: GitBranch, title: 'Architecture Diagrams', desc: 'Auto-generated Mermaid.js diagrams from detected components and data flows.' },
]

export default function FeatureGrid() {
  return (
    <section className="py-24 px-6 bg-[#0c0c10]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4 text-white"
        >
          Everything You Need
        </motion.h2>
        <p className="text-center text-gray-400 mb-16">Built for engineers, students, and researchers.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-[#18181f] border border-white/5 hover:border-indigo-500/40 hover:bg-[#1c1c26] transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600/15 flex items-center justify-center mb-4 group-hover:bg-indigo-600/25 transition-colors">
                <f.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
