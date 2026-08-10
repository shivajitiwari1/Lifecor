'use client'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import type { QuotePlan } from '@/types'

interface QuoteCardProps {
  plan: QuotePlan
  selected: boolean
  onSelect: () => void
}

export function QuoteCard({ plan, selected, onSelect }: QuoteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 group',
        selected
          ? 'border-electric-500 bg-electric-600/10 blue-glow'
          : 'border-border bg-card hover:border-electric-500/50 hover:-translate-y-1',
      )}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-electric-600 text-white text-xs font-bold">
          <Star className="w-3 h-3" /> Most Popular
        </div>
      )}
      <div className="mb-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">{plan.name}</div>
        <div className="text-4xl font-extrabold text-foreground">{formatPremium(plan.monthlyPremium)}</div>
        <div className="text-sm text-electric-400 font-medium mt-1">{formatCurrency(plan.coverageAmount)} coverage</div>
      </div>
      <ul className="space-y-2 mb-4">
        {plan.benefits.map(b => (
          <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      <div className={cn(
        'w-full h-10 rounded-xl border-2 flex items-center justify-center text-sm font-semibold transition-all',
        selected
          ? 'border-electric-500 bg-electric-600 text-white'
          : 'border-border text-muted-foreground group-hover:border-electric-500/50',
      )}>
        {selected ? 'Selected' : 'Select Plan'}
      </div>
    </button>
  )
}
