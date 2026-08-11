'use client'
import { motion } from 'framer-motion'

export function ConfirmedChip({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-600/20 border border-electric-500/40 text-sm"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-electric-400 font-semibold">{value}</span>
    </motion.div>
  )
}
