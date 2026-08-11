'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDemoSession } from '@/hooks/useDemoSession'
import { getAIRecommendationMessage, getRecommendedPlan } from '@/lib/mock-ai'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import { sleep } from '@/lib/utils'

const PLAN_DETAILS = {
  basic: { coverage: 250000, premium: 18 },
  plus: { coverage: 500000, premium: 29 },
  premium: { coverage: 1000000, premium: 47 },
}

export default function RecommendationPage() {
  const router = useRouter()
  const { session } = useDemoSession()
  const [showMessage, setShowMessage] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const recommended = getRecommendedPlan(session)
  const message = getAIRecommendationMessage(session)
  const details = PLAN_DETAILS[session.selectedPlan ?? recommended]

  useEffect(() => {
    const run = async () => {
      await sleep(400)
      setShowMessage(true)
      await sleep(1200)
      setShowPlan(true)
    }
    run()
  }, [])

  return (
    <>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Recommendation</h1>
            <p className="text-muted-foreground">Based on your profile, here&apos;s what we recommend</p>
          </motion.div>

          {showMessage && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-electric-600/20 border border-electric-600/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-electric-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-electric-400">Lifecor AI</span>
                  <Sparkles className="w-3 h-3 text-electric-400" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
              </div>
            </motion.div>
          )}

          {showPlan && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="rounded-2xl border-2 border-electric-500 bg-electric-600/10 p-6 mb-8 blue-glow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-electric-400 font-medium mb-1">Recommended Plan</div>
                  <div className="text-2xl font-bold capitalize">{session.selectedPlan ?? recommended} Protection</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold">{formatPremium(details.premium)}</div>
                  <div className="text-sm text-muted-foreground">{formatCurrency(details.coverage)} coverage</div>
                </div>
              </div>
            </motion.div>
          )}

          {showPlan && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Button onClick={() => router.push('/demo/summary')} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold">
                Review My Application <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
