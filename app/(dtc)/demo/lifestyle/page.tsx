'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/dtc/step-progress'
import { ToggleCard } from '@/components/dtc/toggle-card'
import { useDemoSession } from '@/hooks/useDemoSession'
import type { DTCSession } from '@/types'

export default function LifestylePage() {
  const router = useRouter()
  const { setField, session } = useDemoSession()
  const [smoker, setSmoker] = useState<boolean | null>(session.smoker ?? null)
  const [conditions, setConditions] = useState<DTCSession['existingConditions'] | null>(session.existingConditions ?? null)
  const [income, setIncome] = useState<number | null>(session.annualIncome ?? null)
  const [dependents, setDependents] = useState<DTCSession['dependents'] | null>(session.dependents ?? null)

  const answeredCount = [smoker, conditions, income, dependents].filter(v => v !== null).length
  const progress = (answeredCount / 4) * 100
  const canContinue = answeredCount === 4

  const handleContinue = () => {
    setField('smoker', smoker!)
    setField('existingConditions', conditions!)
    setField('annualIncome', income!)
    setField('dependents', dependents!)
    router.push('/demo/eligibility')
  }

  return (
    <>
      <StepProgress currentStep={2} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Lifestyle Assessment</h1>
              <p className="text-muted-foreground text-sm">Answer 4 quick questions to personalize your quotes</p>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4"
                  className="text-electric-500 transition-all duration-500"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{answeredCount}/4</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Do you smoke?</p>
              <div className="grid grid-cols-2 gap-3">
                <ToggleCard label="No, I don't smoke" selected={smoker === false} onClick={() => setSmoker(false)} icon="🚭" />
                <ToggleCard label="Yes, I smoke" selected={smoker === true} onClick={() => setSmoker(true)} icon="🚬" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Existing health conditions?</p>
              <div className="grid grid-cols-3 gap-3">
                {([['none', 'None', '✅'], ['minor', 'Minor', '⚠️'], ['major', 'Major', '🏥']] as const).map(([v, l, icon]) => (
                  <ToggleCard key={v} label={l} icon={icon} selected={conditions === v} onClick={() => setConditions(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Annual household income</p>
              <div className="grid grid-cols-2 gap-3">
                {([[0, 'Under $50K', '💼'], [60000, '$50K–$100K', '💼'], [120000, '$100K–$200K', '💰'], [250000, 'Over $200K', '🏦']] as const).map(([v, l, icon]) => (
                  <ToggleCard key={v} label={l} icon={icon} selected={income === v} onClick={() => setIncome(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Number of dependents</p>
              <div className="grid grid-cols-4 gap-3">
                {([0, 1, 2, 3] as const).map(v => (
                  <ToggleCard key={v} label={v === 3 ? '3+' : String(v)} selected={dependents === v} onClick={() => setDependents(v)} />
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleContinue} disabled={!canContinue} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-8 disabled:opacity-40">
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </>
  )
}
