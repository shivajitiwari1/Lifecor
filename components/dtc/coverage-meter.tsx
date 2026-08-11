'use client'
import { motion } from 'framer-motion'

interface CoverageMeterProps {
  value: number
  max?: number
  label: string
}

export function CoverageMeter({ value, max = 1000000, label }: CoverageMeterProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$250K</span>
        <span className="font-semibold text-electric-400">{label}</span>
        <span>$1M</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-electric-600 to-electric-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
