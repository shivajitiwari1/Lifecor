'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Mail, FileText, Calendar } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Confetti } from '@/components/dtc/confetti'
import { useDemoSession } from '@/hooks/useDemoSession'

const NEXT_STEPS = [
  { icon: Mail, title: 'Welcome Email Sent', description: 'Check your inbox for policy confirmation', done: true },
  { icon: FileText, title: 'Policy Documents', description: 'Available in your account within 24 hours', done: false },
  { icon: Calendar, title: 'Coverage Starts', description: 'Your coverage begins immediately upon approval', done: false },
]

export default function ApprovedPage() {
  const { session } = useDemoSession()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-40 h-40 rounded-full bg-green-500/20 border-4 border-green-500/40 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-extrabold mb-2">
              {session.name ? `${session.name.split(' ')[0]}, you're` : "You're"}{' '}
              <span className="text-gradient">Approved!</span>
            </h1>
            <p className="text-amber-400 font-medium text-lg mt-2">Your policy is active right now.</p>
            <p className="text-muted-foreground text-lg mb-10">
              Welcome to Lifecor. Your coverage is now active.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6 text-left mb-8"
          >
            <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">What Happens Next</h3>
            <div className="space-y-4">
              {NEXT_STEPS.map((step) => (
                <div key={step.title} className="flex items-start gap-4">
                  {step.done ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/20 border border-green-500/40">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted border border-border">
                      <step.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Link
              href="/partner"
              className={cn(buttonVariants(), 'bg-electric-600 hover:bg-electric-700 text-white h-12 px-8')}
            >
              See how agents use Lifecor <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}
