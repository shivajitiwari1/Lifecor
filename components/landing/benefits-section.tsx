'use client'
import { motion } from 'framer-motion'
import { Shield, Clock, CreditCard, Phone, Award, Lock } from 'lucide-react'

const benefits = [
  { icon: Shield, title: 'No Medical Exam', description: 'Coverage up to $1M — no exams required.' },
  { icon: Clock, title: 'Instant Decisions', description: 'Approved or declined in minutes, not weeks.' },
  { icon: CreditCard, title: 'Transparent Pricing', description: 'Fixed premiums that never change. No hidden fees.' },
  { icon: Phone, title: '100% Digital', description: 'Manage your policy entirely online or via mobile.' },
  { icon: Award, title: 'A-Rated Coverage', description: 'Backed by top-rated insurance carriers.' },
  { icon: Lock, title: 'Bank-Level Security', description: 'Your data is encrypted at every step.' },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Lifecor</h2>
          <p className="text-muted-foreground text-lg">Everything you need, nothing you don&apos;t.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 group hover:border-electric-500/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-electric-600/20 flex items-center justify-center mb-4 group-hover:bg-electric-600/30 transition-colors">
                <b.icon className="w-5 h-5 text-electric-400" />
              </div>
              <h3 className="text-base font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
