'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/hooks/use-chart-colors'

interface AreaChartProps {
  data: { month: string; policies: number }[]
}

export function PoliciesAreaChart({ data }: AreaChartProps) {
  const c = useChartColors()
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis dataKey="month" tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: c.tick, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: '12px', color: c.tooltipColor }} />
        <Area type="monotone" dataKey="policies" stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
