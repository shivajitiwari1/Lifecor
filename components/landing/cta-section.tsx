'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CTASection() {
  return (
    <section className="py-24 bg-navy-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 rounded-2xl bg-electric-600/20 border border-electric-600/40 flex items-center justify-center mx-auto mb-8">
            <Shield className="w-8 h-8 text-electric-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to experience the future of life insurance?</h2>
          <p className="text-white/60 text-lg mb-10">See how Lifecor makes coverage fast, simple, and accessible.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-electric-600 hover:bg-electric-700 text-white px-8 h-12'
              )}
            >
              Start Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/partner"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'border-white/50 hover:border-white/80 text-white px-8 h-12'
              )}
            >
              Partner Experience
            </Link>
          </div>
        </motion.div>
        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2 text-white/50"><Shield className="w-4 h-4 text-electric-400" />© 2025 Lifecor. All rights reserved.</span>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => <Link key={l} href="#" className="text-white/50 hover:text-white transition-colors">{l}</Link>)}
          </div>
        </div>
      </div>
    </section>
  )
}
