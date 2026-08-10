'use client'
import { motion } from 'framer-motion'
import { User, Activity, FileCheck, CheckCircle } from 'lucide-react'

const steps = [
  { icon: User, step: '01', title: 'Tell us about yourself', description: 'Share your age, state, and lifestyle details in under 2 minutes.' },
  { icon: Activity, step: '02', title: 'AI analyzes your profile', description: 'Our AI assesses your risk and calculates eligibility instantly.' },
  { icon: FileCheck, step: '03', title: 'Choose your plan', description: 'Review personalized quote options and select coverage that fits.' },
  { icon: CheckCircle, step: '04', title: "You're covered", description: 'Submit and receive approval confirmation in minutes.' },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Four simple steps to complete coverage</p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-electric-600/50 to-transparent" />
          {steps.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="text-center relative">
              <div className="w-20 h-20 rounded-2xl bg-electric-600/20 border border-electric-600/40 flex items-center justify-center mx-auto mb-6 relative z-10">
                <step.icon className="w-8 h-8 text-electric-400" />
              </div>
              <div className="text-xs font-bold text-electric-500 mb-2">{step.step}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
