'use client'
import { motion } from 'framer-motion'
import { Clock, FileText, HelpCircle } from 'lucide-react'

const problems = [
  { icon: Clock, title: 'Weeks of waiting', description: 'Traditional life insurance takes 4–8 weeks. Medical exams, paperwork, phone calls — all required.' },
  { icon: FileText, title: 'Mountains of paperwork', description: '30+ page applications. Fax machines. Physical signatures. Manual underwriting from the 1980s.' },
  { icon: HelpCircle, title: 'Confusing & opaque', description: 'Hidden fees, complex policy language, and zero transparency into how decisions are made.' },
]

export function ProblemSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Traditional life insurance is <span className="text-red-400">broken</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">People go uninsured because the process is too slow, too confusing, and too painful.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="theme-card rounded-2xl p-8 group hover:border-red-400/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <p.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
