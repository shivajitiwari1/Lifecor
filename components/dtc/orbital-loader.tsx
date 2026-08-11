'use client'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const RINGS = [
  { size: 88, duration: 3, color: '#3B82F6' },
  { size: 128, duration: 5, color: '#60A5FA' },
  { size: 168, duration: 8, color: '#93C5FD' },
]

const PHASES = ['Profile analysed', 'Risk factors checked', 'Eligibility confirmed']

export function OrbitalLoader({ phase }: { phase: number }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {RINGS.map((ring, i) => {
          const locked = phase > i
          const offset = (180 - ring.size) / 2
          return (
            <div key={i} className="absolute" style={{ top: offset, left: offset, width: ring.size, height: ring.size }}>
              <motion.div
                className="w-full h-full rounded-full border-2"
                style={{
                  borderColor: locked ? '#22C55E' : ring.color,
                  opacity: locked ? 1 : 0.5,
                }}
                animate={locked ? { rotate: 0 } : { rotate: 360 }}
                transition={
                  locked
                    ? { duration: 0.2 }
                    : { duration: ring.duration, repeat: Infinity, ease: 'linear' }
                }
              />
              {locked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-full border border-green-500/20"
                />
              )}
            </div>
          )
        })}
        {/* Shield center */}
        <motion.div
          animate={{ scale: phase === 3 ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-14 h-14 rounded-2xl bg-electric-600/20 border border-electric-500/40 flex items-center justify-center"
        >
          <Shield className={`w-7 h-7 transition-colors duration-500 ${phase === 3 ? 'text-green-400' : 'text-electric-400'}`} />
        </motion.div>
      </div>

      {/* Phase labels */}
      <div className="space-y-2 text-center">
        {PHASES.map((label, i) => (
          <motion.p
            key={label}
            animate={{ opacity: phase > i ? 1 : phase === i ? 0.6 : 0.25 }}
            className={`text-sm transition-colors ${phase > i ? 'text-green-400' : 'text-muted-foreground'}`}
          >
            {phase > i ? '✓ ' : '○ '}{label}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
