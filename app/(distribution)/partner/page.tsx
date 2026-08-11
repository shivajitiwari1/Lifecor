'use client'
import { motion } from 'framer-motion'
import analyticsData from '@/mock-data/analytics.json'
import leads from '@/mock-data/leads.json'
import { PulseStat } from '@/components/distribution/pulse-stat'
import { SwimlanePipeline } from '@/components/distribution/swimlane-pipeline'
import { useChartColors } from '@/hooks/use-chart-colors'

export default function CommandPage() {
  useChartColors() // ensure theme detection fires

  const monthlyData = analyticsData.monthlyPolicies
  const currentMonth = monthlyData[monthlyData.length - 1]
  const prevMonth = monthlyData[monthlyData.length - 2]
  const pctChange = prevMonth
    ? Math.round(((currentMonth.policies - prevMonth.policies) / prevMonth.policies) * 100)
    : 0
  const trend = pctChange >= 0
    ? `↑ ${pctChange}% ahead of last month`
    : `↓ ${Math.abs(pctChange)}% behind last month`

  const sparkData = monthlyData.slice(-10).map(d => ({ v: d.policies }))

  return (
    <div className="h-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold">Command</h1>
        <p className="text-muted-foreground text-sm mt-1">Your live view — everything in one place.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 flex-1 min-h-0">
        {/* Left — Pulse */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 theme-card rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              This Month
            </p>
            <PulseStat
              value={currentMonth.policies}
              trend={trend}
              sparkData={sparkData}
            />
          </div>
        </motion.div>

        {/* Right — Swimlane */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 theme-card rounded-2xl p-6 flex flex-col min-h-[480px]"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Live Pipeline
            </p>
            <span className="text-xs text-muted-foreground">{leads.length} leads</span>
          </div>
          <div className="flex-1 min-h-0">
            <SwimlanePipeline leads={leads} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
