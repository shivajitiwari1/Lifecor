'use client'
import { FileText, Users, DollarSign, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { KPICard } from '@/components/distribution/kpi-card'
import analyticsData from '@/mock-data/analytics.json'
import policiesData from '@/mock-data/policies.json'
import agentsData from '@/mock-data/agents.json'
import applicationsData from '@/mock-data/applications.json'
import type { Policy, Agent, Application } from '@/types'

const policies = policiesData as Policy[]
const agents = agentsData as Agent[]
const applications = applicationsData as Application[]

const activePolicies = policies.filter(p => p.status === 'active').length
const totalPremium = policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.monthlyPremium * 12, 0)
const activeAgents = agents.filter(a => a.role !== 'viewer').length
const pendingApps = applications.filter(a => a.status === 'under-review' || a.status === 'submitted').length

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System-wide overview — all carriers, all agents</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Policies" value={String(activePolicies)} rawValue={activePolicies} change="+11% this quarter" icon={<FileText className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Annual Premium" value={`$${(totalPremium / 1000).toFixed(0)}K`} rawValue={totalPremium} change="+18% YoY" icon={<DollarSign className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Active Agents" value={String(activeAgents)} rawValue={activeAgents} change="+2 this month" icon={<Users className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Pending Applications" value={String(pendingApps)} rawValue={pendingApps} change={`${pendingApps} awaiting review`} positive={false} icon={<Clock className="w-5 h-5 text-slate-400" />} />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold mb-1">System-Wide Policy Volume</h2>
        <p className="text-xs text-muted-foreground mb-4">Total policies issued across all agents — last 12 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analyticsData.monthlyPolicies} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }} />
            <Line type="monotone" dataKey="policies" stroke="#94A3B8" strokeWidth={2} dot={{ fill: '#94A3B8', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
