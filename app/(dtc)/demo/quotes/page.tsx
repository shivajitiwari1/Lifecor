'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuoteCard } from '@/components/dtc/quote-card'
import { useDemoSession } from '@/hooks/useDemoSession'
import { generateQuoteResult } from '@/lib/mock-ai'
import type { DTCSession } from '@/types'

export default function QuotesPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const quoteResult = useMemo(() => generateQuoteResult(session), [session])
  const [selected, setSelected] = useState<DTCSession['selectedPlan']>(session.selectedPlan ?? null)

  const handleContinue = () => {
    if (!selected) return
    setField('selectedPlan', selected)
    router.push('/demo/recommendation')
  }

  const planKey = (name: string): DTCSession['selectedPlan'] =>
    name.toLowerCase() as DTCSession['selectedPlan']

  return (
    <>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Your Personalized Quotes</h1>
            <p className="text-muted-foreground">Choose the plan that works best for you</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {quoteResult.plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <QuoteCard
                  plan={plan}
                  selected={selected === planKey(plan.name)}
                  onSelect={() => setSelected(planKey(plan.name))}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleContinue} disabled={!selected} className="bg-electric-600 hover:bg-electric-700 text-white h-12 px-10 text-base font-semibold disabled:opacity-40">
              Continue with {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : 'Selected Plan'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
