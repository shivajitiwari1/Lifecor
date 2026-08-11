'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CoverageMeter } from './coverage-meter'

const STORIES: Record<string, string> = {
  basic: "Covers your family's immediate expenses and replaces your income for 5 years.",
  plus: "Protects your mortgage, your children's education, and a decade of household income.",
  premium: 'Complete peace of mind — income replacement, education, mortgage, and long-term financial security.',
}

interface Plan {
  name: string
  monthlyPremium: number
  coverageAmount: number
  benefits: string[]
}

interface CoveragePanelProps {
  plan: Plan
  isRecommended: boolean
  isSelected: boolean
  onSelect: () => void
  direction: 1 | -1
}

export function CoveragePanel({ plan, isRecommended, isSelected, onSelect, direction }: CoveragePanelProps) {
  const story = STORIES[plan.name.toLowerCase()] ?? plan.name
  const coverageLabel =
    plan.coverageAmount >= 1000000
      ? '$1,000,000'
      : `$${(plan.coverageAmount / 1000).toFixed(0)},000`

  return (
    <motion.div
      key={plan.name}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full max-w-2xl"
    >
      {isRecommended && (
        <div className="mb-3 flex justify-end">
          <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-semibold">
            ★ Recommended for you
          </span>
        </div>
      )}

      <div className={`rounded-3xl p-8 border-2 transition-colors ${
        isSelected ? 'border-electric-500 bg-electric-600/5' : 'border-border bg-card'
      }`}>
        <p className="text-2xl font-semibold text-foreground leading-snug mb-8">{story}</p>

        <div className="mb-8">
          <CoverageMeter value={plan.coverageAmount} label={coverageLabel} />
        </div>

        <ul className="space-y-3 mb-8">
          {plan.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
              <Check className="w-4 h-4 text-electric-400 mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        <div className="border-t border-border pt-6 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Monthly premium</p>
            <p className="text-4xl font-bold text-foreground">
              ${plan.monthlyPremium}
              <span className="text-lg text-muted-foreground font-normal">/mo</span>
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              isSelected
                ? 'bg-electric-600 text-white'
                : 'bg-muted text-foreground hover:bg-electric-600/20 hover:text-electric-400'
            }`}
          >
            {isSelected ? 'Selected ✓' : 'Select this plan'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
