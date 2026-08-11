'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDemoSession } from '@/hooks/useDemoSession'
import type { DTCSession } from '@/types'
import { QuestionScreen } from '@/components/dtc/question-screen'

const QUESTIONS = [
  {
    key: 'smoker' as const,
    question: 'Do you smoke or use tobacco products?',
    options: [
      { value: false, label: 'No', emoji: '✅' },
      { value: true, label: 'Yes', emoji: '🚬' },
    ],
  },
  {
    key: 'existingConditions' as const,
    question: 'Any existing health conditions?',
    options: [
      { value: 'none', label: 'None', emoji: '💪' },
      { value: 'minor', label: 'Minor', emoji: '🩺' },
      { value: 'major', label: 'Major', emoji: '🏥' },
    ],
  },
  {
    key: 'annualIncome' as const,
    question: "What's your approximate annual income?",
    options: [
      { value: 40000, label: 'Under $50K', emoji: '💼' },
      { value: 75000, label: '$50K – $100K', emoji: '📈' },
      { value: 150000, label: '$100K – $200K', emoji: '🏦' },
      { value: 250000, label: 'Over $200K', emoji: '🚀' },
    ],
  },
  {
    key: 'dependents' as const,
    question: 'How many people depend on your income?',
    options: [
      { value: 0, label: 'Just me', emoji: '🧍' },
      { value: 1, label: '1 person', emoji: '👫' },
      { value: 2, label: '2 people', emoji: '👨‍👩‍👧' },
      { value: 3, label: '3 or more', emoji: '👨‍👩‍👧‍👦' },
    ],
  },
]

export default function LifestylePage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const current = QUESTIONS[currentIndex]
  const selected = session[current.key]
  const canAdvance = selected !== null && selected !== undefined

  const goNext = () => {
    if (!canAdvance) return
    if (currentIndex === QUESTIONS.length - 1) {
      router.push('/demo/eligibility')
    } else {
      setDirection(1)
      setCurrentIndex(i => i + 1)
    }
  }

  const goBack = () => {
    if (currentIndex === 0) { router.push('/demo'); return }
    setDirection(-1)
    setCurrentIndex(i => i - 1)
  }

  const answeredCount = QUESTIONS.filter(q => session[q.key] !== null && session[q.key] !== undefined).length

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      {/* Progress ring */}
      <div className="fixed top-20 right-6 z-40">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
          <motion.circle
            cx="24" cy="24" r="20" fill="none" strokeWidth="2" className="text-electric-500"
            stroke="currentColor"
            strokeDasharray={String(2 * Math.PI * 20)}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - answeredCount / QUESTIONS.length) }}
            transition={{ duration: 0.4 }}
          />
          <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="fill-foreground">
            {answeredCount}/{QUESTIONS.length}
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <QuestionScreen
          key={current.key}
          questionKey={current.key}
          question={current.question}
          options={current.options as { value: string | number | boolean; label: string; emoji?: string }[]}
          selected={selected as string | number | boolean | null | undefined}
          onSelect={val => setField(current.key, val as DTCSession[typeof current.key])}
          direction={direction}
        />
      </AnimatePresence>

      {/* Navigation — sits above the fixed bottom strip (pb-20 accounts for the strip) */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-between items-center px-8 max-w-xl mx-auto w-full">
        <button type="button" onClick={goBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.03 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          className={`flex items-center gap-1 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
            canAdvance
              ? 'bg-electric-600 text-white hover:bg-electric-500'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {currentIndex === QUESTIONS.length - 1 ? 'See My Eligibility' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
