'use client'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

interface PolicyCardProps {
  name: string
  planName: string
  coverageAmount: string
  monthlyPremium: string
}

export function PolicyCard({ name, planName, coverageAmount, monthlyPremium }: PolicyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 p-8 relative overflow-hidden"
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
      {/* Glow */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-electric-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-electric-400" />
            <span className="text-white font-bold text-sm tracking-widest">LIFECOR</span>
          </div>
          <span className="text-white/40 text-xs uppercase tracking-wide">{planName}</span>
        </div>

        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Policyholder</p>
          <p className="text-white text-xl font-semibold">{name}</p>
        </div>

        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Coverage Amount</p>
          <p className="text-3xl font-bold text-white">{coverageAmount}</p>
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Monthly Premium</p>
            <p className="text-electric-400 text-lg font-semibold">{monthlyPremium}</p>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-3 rounded-sm bg-white/20" />
            <div className="w-4 h-3 rounded-sm bg-electric-500/60" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
