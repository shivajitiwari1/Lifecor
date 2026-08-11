'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface PulseStatProps {
  value: number
  trend: string
  sparkData: { v: number }[]
}

export function PulseStat({ value, trend, sparkData }: PulseStatProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl font-bold text-electric-400 leading-none tabular-nums"
      >
        {count}
      </motion.p>
      <p className="text-sm text-muted-foreground mt-2">policies issued this month</p>
      <p className="text-sm text-amber-400 font-medium mt-1">{trend}</p>

      {/* Spark line */}
      <div className="mt-6 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
        {[
          { label: 'Leads', value: '247' },
          { label: 'Conversion', value: '34.2%' },
          { label: 'Avg approval', value: '2.4d' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
