import { Users, TrendingUp, FileText, Shield } from 'lucide-react'
import { KPICard } from '@/components/distribution/kpi-card'
import { PoliciesAreaChart } from '@/components/distribution/area-chart'
import analyticsData from '@/mock-data/analytics.json'

const ACTIVITY = [
  { text: 'James Carter policy approved', time: '2 min ago', type: 'success' },
  { text: 'New lead: David Williams submitted', time: '18 min ago', type: 'info' },
  { text: 'Quote generated for Lisa Johnson', time: '1 hr ago', type: 'info' },
  { text: 'Application submitted: Brian Thomas', time: '2 hrs ago', type: 'info' },
  { text: 'Christopher Wilson policy approved', time: '3 hrs ago', type: 'success' },
]

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Sarah. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Leads" value="247" rawValue={247} change="+12% this month" icon={<Users className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Conversion Rate" value="34.2%" rawValue={34.2} change="+4.1% vs last month" icon={<TrendingUp className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Applications" value="89" rawValue={89} change="+7 this week" icon={<FileText className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Policies Issued" value="61" rawValue={61} change="+8 this month" icon={<Shield className="w-5 h-5 text-electric-400" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Policies Issued — Last 12 Months</h2>
          <PoliciesAreaChart data={analyticsData.monthlyPolicies} />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'success' ? 'bg-green-400' : 'bg-electric-400'}`} />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
