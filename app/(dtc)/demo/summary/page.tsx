'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PolicyCard } from '@/components/dtc/policy-card'
import { useDemoSession } from '@/hooks/useDemoSession'
import { getRecommendedPlan, generateQuoteResult } from '@/lib/mock-ai'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import { sleep } from '@/lib/utils'

export default function SummaryPage() {
  const router = useRouter()
  const { session } = useDemoSession()
  const [submitting, setSubmitting] = useState(false)
  const plan = session.selectedPlan ?? getRecommendedPlan(session)
  const result = generateQuoteResult(session)
  const planDetails = result.plans.find(p => p.name.toLowerCase() === plan)!

  const handleSubmit = async () => {
    setSubmitting(true)
    await sleep(1800)
    router.push('/demo/approved')
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your policy is ready.</h1>
            <p className="text-muted-foreground">Take a moment to review, then activate your coverage.</p>
          </div>

          <div className="space-y-6 mb-8">
            <PolicyCard
              name={session.name ?? ''}
              planName={`${plan.charAt(0).toUpperCase() + plan.slice(1)} Protection`}
              coverageAmount={formatCurrency(planDetails?.coverageAmount ?? 0)}
              monthlyPremium={formatPremium(planDetails?.monthlyPremium ?? 0)}
            />
            <div className="flex flex-col gap-2 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Coverage starts immediately
              </p>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                No medical exam required
              </p>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold">
            {submitting ? (
              <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Submitting Application...</>
            ) : (
              'Submit Application'
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">By submitting you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </div>
    </>
  )
}
