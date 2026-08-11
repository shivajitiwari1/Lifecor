'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDemoSession } from '@/hooks/useDemoSession'
import { generateQuoteResult } from '@/lib/mock-ai'
import { CoveragePanel } from '@/components/dtc/coverage-panel'

export default function QuotesPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const result = generateQuoteResult(session)
  const plans = result.plans

  const recommendedIndex = Math.max(plans.findIndex(p => p.recommended), 0)
  const [currentIndex, setCurrentIndex] = useState(recommendedIndex)
  const [direction, setDirection] = useState<1 | -1>(1)

  const currentPlan = plans[currentIndex]

  const goTo = (index: number) => {
    if (index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const handleContinue = () => {
    if (!session.selectedPlan) setField('selectedPlan', currentPlan.name.toLowerCase() as 'basic' | 'plus' | 'premium')
    router.push('/demo/recommendation')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-electric-400 mb-2">Your Coverage Options</p>
          <h1 className="text-3xl font-bold text-foreground">Choose your protection</h1>
        </div>

        <AnimatePresence mode="wait">
          <CoveragePanel
            key={currentPlan.name}
            plan={currentPlan}
            isRecommended={currentPlan.recommended}
            isSelected={session.selectedPlan === currentPlan.name.toLowerCase()}
            onSelect={() => setField('selectedPlan', currentPlan.name.toLowerCase() as 'basic' | 'plus' | 'premium')}
            direction={direction}
          />
        </AnimatePresence>

        {/* Dot nav */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button type="button" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex gap-2 items-center">
            {plans.map((_, i) => (
              <button key={i} type="button" onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-electric-500 w-6 h-2' : 'bg-muted w-2 h-2'
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === plans.length - 1}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <motion.button
            type="button"
            onClick={handleContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-electric-600 text-white font-semibold hover:bg-electric-500 transition-colors"
          >
            {session.selectedPlan
              ? `Continue with ${plans.find(plan => plan.name.toLowerCase() === session.selectedPlan)?.name ?? currentPlan.name}`
              : `Continue with ${currentPlan.name}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
