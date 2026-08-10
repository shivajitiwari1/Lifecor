'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string
  rawValue: number
  change: string
  positive?: boolean
  icon: React.ReactNode
}

export function KPICard({ label, value, change, positive = true, icon }: KPICardProps) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-electric-600/20 flex items-center justify-center">
          {icon}
        </div>
        <span className={cn('text-xs font-medium flex items-center gap-1', positive ? 'text-green-400' : 'text-red-400')}>
          <TrendingUp className="w-3 h-3" />{change}
        </span>
      </div>
      <div className={cn('text-3xl font-extrabold mb-1 transition-all duration-700', show ? 'opacity-100' : 'opacity-0')}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
