'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, TrendingUp, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'
import { calculateRiskTier, calculateConfidenceScore } from '@/lib/mock-ai'
import { sleep } from '@/lib/utils'

const LOADING_PHASES = [
  'Analyzing your profile...',
  'Checking risk factors...',
  'Calculating coverage options...',
]

const TIER_COLORS = {
  'ultra-preferred': 'bg-green-500/20 text-green-400 border-green-500/40',
  'preferred': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'standard': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
}

export default function EligibilityPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const [phase, setPhase] = useState<'loading' | 'results'>('loading')
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [riskTier, setRiskTier] = useState<ReturnType<typeof calculateRiskTier>>('preferred')
  const [confidenceScore, setConfidenceScore] = useState(0)

  useEffect(() => {
    const run = async () => {
      for (let i = 0; i < LOADING_PHASES.length; i++) {
        setLoadingIndex(i)
        await sleep(1000)
      }
      const tier = calculateRiskTier(session)
      const score = calculateConfidenceScore(session)
      setRiskTier(tier)
      setConfidenceScore(score)
      setField('riskTier', tier)
      setField('confidenceScore', score)
      setPhase('results')
    }
    run()
  }, [])

  return (
    <>
      <StepProgress currentStep={3} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {phase === 'loading' ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-md w-full">
              <div className="w-20 h-20 rounded-full border-4 border-electric-600/30 border-t-electric-600 animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
              <AnimatePresence mode="wait">
                <motion.p key={loadingIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="text-muted-foreground text-lg">
                  {LOADING_PHASES[loadingIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {LOADING_PHASES.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= loadingIndex ? 'bg-electric-500' : 'bg-muted'}`} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-1">You're Eligible!</h1>
                <p className="text-muted-foreground">Great news — here's your profile assessment</p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-electric-400" />
                    <span className="font-medium">Risk Classification</span>
                  </div>
                  <Badge className={`border ${TIER_COLORS[riskTier]} capitalize`}>
                    {riskTier.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-electric-400" />
                      <span className="font-medium">Confidence Score</span>
                    </div>
                    <span className="text-2xl font-bold text-electric-400">{confidenceScore}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${confidenceScore}%` }} transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-electric-600 to-electric-400 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-electric-400" />
                    <span className="font-medium">Coverage Range</span>
                  </div>
                  <span className="font-bold text-foreground">$250K – $1M</span>
                </div>
              </div>

              <Button onClick={() => router.push('/demo/quotes')} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-6">
                View Your Quotes <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
