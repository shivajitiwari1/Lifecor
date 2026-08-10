'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Users, BarChart3 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function PartnerBenefitsSection() {
  return (
    <section id="partners" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/20 border border-electric-600/30 text-electric-400 text-sm font-medium mb-6">For Distribution Partners</div>
            <h2 className="text-4xl font-bold mb-6">Close deals <span className="text-gradient">3x faster</span></h2>
            <p className="text-muted-foreground text-lg mb-8">Give clients the modern insurance experience they expect. Our partner platform streamlines your workflow from lead to policy.</p>
            <div className="space-y-4 mb-8">
              {[
                { icon: TrendingUp, text: '34% average conversion rate — industry leading' },
                { icon: Users, text: 'Manage all your clients in one unified dashboard' },
                { icon: BarChart3, text: 'Real-time analytics on leads, conversions, and revenue' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-electric-600/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-electric-400" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <Link
              href="/partner"
              className={cn(
                buttonVariants(),
                'bg-electric-600 hover:bg-electric-700 text-white'
              )}
            >
              Explore Partner Experience
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-2xl p-8 space-y-3 bg-muted border border-border shadow-sm">
            {[
              { label: 'Total Leads', value: '247', change: '+12%' },
              { label: 'Conversion Rate', value: '34.2%', change: '+4.1%' },
              { label: 'Policies Issued', value: '61', change: '+8' },
              { label: 'Est. Commission', value: '$18,300', change: '+$2,100' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                <span className="text-foreground/70 text-sm font-medium">{m.label}</span>
                <div className="text-right">
                  <div className="font-bold text-foreground">{m.value}</div>
                  <div className="text-green-500 dark:text-green-400 text-xs font-medium">{m.change} this month</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
