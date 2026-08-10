'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, FileBarChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ReportModal } from '@/components/admin/report-modal'
import analyticsData from '@/mock-data/analytics.json'

type ReportKey = 'loss-ratio' | 'conversion' | 'volume' | null

const LOSS_RATIO_DATA = [
  { month: 'Feb', ratio: 58.2 },
  { month: 'Mar', ratio: 61.4 },
  { month: 'Apr', ratio: 55.8 },
  { month: 'May', ratio: 59.1 },
  { month: 'Jun', ratio: 57.3 },
  { month: 'Jul', ratio: 54.6 },
]

const REPORTS = [
  {
    key: 'loss-ratio' as ReportKey,
    icon: BarChart3,
    title: 'Loss Ratio by Month',
    description: 'Claims paid vs. premiums earned. Target: under 65%.',
    metric: '54.6%',
    metricLabel: 'Current loss ratio',
    trend: 'Down 2.7% from last month',
    trendPositive: true,
    data: LOSS_RATIO_DATA,
    type: 'line' as const,
    dataKey: 'ratio',
    xKey: 'month',
    formatter: (v: unknown) => `${v}%`,
  },
  {
    key: 'conversion' as ReportKey,
    icon: TrendingUp,
    title: 'Conversion Rate by State',
    description: 'Lead-to-policy conversion rates across top 5 states.',
    metric: '41.3%',
    metricLabel: 'Top state (NY)',
    trend: '+3.2% vs. last quarter',
    trendPositive: true,
    data: analyticsData.conversionByState,
    type: 'bar' as const,
    dataKey: 'rate',
    xKey: 'state',
    formatter: (v: unknown) => `${v}%`,
  },
  {
    key: 'volume' as ReportKey,
    icon: FileBarChart,
    title: 'Monthly Application Volume',
    description: 'Total applications submitted across all channels.',
    metric: '134',
    metricLabel: 'Applications in Jul',
    trend: '+6 vs. June',
    trendPositive: true,
    data: analyticsData.monthlyPolicies,
    type: 'bar' as const,
    dataKey: 'policies',
    xKey: 'month',
    formatter: undefined,
  },
]

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportKey>(null)
  const activeData = REPORTS.find(r => r.key === activeReport)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Pre-built analytics reports — click any card to view the full chart</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveReport(report.key)}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center mb-4 group-hover:bg-slate-500/30 transition-colors">
              <report.icon className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1">{report.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{report.description}</p>
            <div className="pt-4 border-t border-border">
              <div className="text-2xl font-bold">{report.metric}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{report.metricLabel}</div>
              <div className={`text-xs mt-1 ${report.trendPositive ? 'text-green-400' : 'text-red-400'}`}>{report.trend}</div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4 group-hover:border-slate-500/50 transition-colors">
              View Full Chart
            </Button>
          </motion.div>
        ))}
      </div>

      {activeData && (
        <ReportModal
          open={!!activeReport}
          onClose={() => setActiveReport(null)}
          title={activeData.title}
          data={activeData.data}
          type={activeData.type}
          dataKey={activeData.dataKey}
          xKey={activeData.xKey}
          formatter={activeData.formatter}
        />
      )}
    </div>
  )
}
