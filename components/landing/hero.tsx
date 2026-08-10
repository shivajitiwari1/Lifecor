'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden navy-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/20 border border-electric-600/30 text-electric-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
            Now in Beta — Join 10,000+ covered individuals
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Life Insurance Built{' '}
            <span className="text-gradient">For The Modern World</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Get covered in minutes with a digital-first experience designed for consumers and distribution partners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-electric-600 hover:bg-electric-700 text-white px-8 h-12 text-base font-semibold'
              )}
            >
              Start Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/partner"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/20 hover:border-white/40 text-white px-8 h-12 text-base'
              )}
            >
              <Play className="mr-2 w-4 h-4" />Partner Experience
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[{ value: '3 min', label: 'To get covered' }, { value: '98%', label: 'Digital process' }, { value: '$0', label: 'Paperwork' }].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  )
}
