'use client'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import analyticsData from '@/mock-data/analytics.json'

const TOOLTIP_STYLE = { backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }

const TABS = ['3M', '6M', '1Y'] as const
type Tab = typeof TABS[number]

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('1Y')
  const policiesData = tab === '3M' ? analyticsData.monthlyPolicies.slice(-3)
    : tab === '6M' ? analyticsData.monthlyPolicies.slice(-6)
    : analyticsData.monthlyPolicies

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance insights for your book of business</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Monthly Policies Issued</h2>
          <p className="text-xs text-muted-foreground mb-4">Total policies closed per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={policiesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="policies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Conversion Trend</h2>
            <p className="text-xs text-muted-foreground mb-4">Monthly conversion rate (%)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={analyticsData.conversionTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[20, 50]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Conversion']} />
                <Line type="monotone" dataKey="rate" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Revenue Estimate</h2>
            <p className="text-xs text-muted-foreground mb-4">Estimated monthly commission ($)</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={analyticsData.revenueEstimate} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
