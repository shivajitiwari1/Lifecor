'use client'
import { motion } from 'framer-motion'
import { Zap, Smartphone, Brain } from 'lucide-react'

const items = [
  { icon: Zap, title: 'Fast', value: '3 min', description: 'From application to approval in minutes, not weeks.' },
  { icon: Smartphone, title: 'Digital-First', value: '100%', description: 'Entirely online. No exams, no paperwork, no phone calls.' },
  { icon: Brain, title: 'AI-Powered', value: '94%', description: 'Intelligent underwriting with a 94% average confidence score.' },
]

export function SolutionSection() {
  return (
    <section className="py-24 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Lifecor is <span className="text-gradient">different</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We rebuilt the entire experience from the ground up.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 group hover:border-electric-500/40 transition-all duration-300 text-center">
              <div className="w-14 h-14 rounded-2xl bg-electric-600/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-600/30 transition-colors">
                <item.icon className="w-7 h-7 text-electric-400" />
              </div>
              <div className="text-5xl font-extrabold text-gradient mb-2">{item.value}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
