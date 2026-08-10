'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, MapPin, Shield, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StepProgress } from '@/components/dtc/step-progress'
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

  const rows = [
    { icon: User, label: 'Applicant', value: session.name ?? '—' },
    { icon: User, label: 'Age', value: `${session.age} years old` },
    { icon: MapPin, label: 'State', value: session.state ?? '—' },
    { icon: Shield, label: 'Plan', value: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Protection` },
    { icon: Shield, label: 'Coverage', value: formatCurrency(planDetails?.coverageAmount ?? 0) },
    { icon: DollarSign, label: 'Monthly Premium', value: formatPremium(planDetails?.monthlyPremium ?? 0) },
  ]

  return (
    <>
      <StepProgress currentStep={6} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Review Your Application</h1>
            <p className="text-muted-foreground">Please confirm the details below before submitting</p>
          </div>

          <div className="glass-card rounded-2xl divide-y divide-border mb-8">
            {rows.map(row => (
              <div key={row.label} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <row.icon className="w-4 h-4" />
                  <span className="text-sm">{row.label}</span>
                </div>
                <span className="font-semibold text-sm">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">Risk Classification</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/40 border capitalize">
                {session.riskTier?.replace('-', ' ') ?? 'Preferred'}
              </Badge>
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
