'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Lifestyle' },
  { n: 3, label: 'Eligibility' },
  { n: 4, label: 'Quotes' },
  { n: 5, label: 'Recommendation' },
  { n: 6, label: 'Summary' },
  { n: 7, label: 'Approved' },
]

export function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-background/95 backdrop-blur border-b border-border px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  step.n < currentStep && 'bg-electric-600 text-white',
                  step.n === currentStep && 'bg-electric-600 text-white ring-4 ring-electric-600/30',
                  step.n > currentStep && 'bg-muted text-muted-foreground',
                )}>
                  {step.n < currentStep ? <Check className="w-4 h-4" /> : step.n}
                </div>
                <span className={cn(
                  'text-[10px] mt-1 hidden sm:block transition-colors',
                  step.n <= currentStep ? 'text-foreground' : 'text-muted-foreground',
                )}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'h-px flex-1 mx-2 transition-all duration-500',
                  step.n < currentStep ? 'bg-electric-600' : 'bg-border',
                )} style={{ minWidth: '16px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
