'use client'
import { motion } from 'framer-motion'

const STEPS = ['Welcome', 'Lifestyle', 'Eligibility', 'Quotes', 'Recommendation', 'Summary', 'Approved']

export function StepProgress({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border/40 px-6 py-3">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Step {currentStep} of {STEPS.length}
        </span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-electric-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{STEPS[currentStep - 1]}</span>
      </div>
    </div>
  )
}
