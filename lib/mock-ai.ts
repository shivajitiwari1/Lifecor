import type { DTCSession, QuoteResult } from '@/types'

export function calculateRiskTier(session: Partial<DTCSession>): 'standard' | 'preferred' | 'ultra-preferred' {
  let pts = 0
  if (session.smoker) pts += 3
  if (session.existingConditions === 'major') pts += 3
  if (session.existingConditions === 'minor') pts += 1
  if ((session.age ?? 0) > 55) pts += 2
  else if ((session.age ?? 0) > 45) pts += 1
  if (pts >= 4) return 'standard'
  if (pts >= 2) return 'preferred'
  return 'ultra-preferred'
}

export function calculateConfidenceScore(session: Partial<DTCSession>): number {
  const tier = calculateRiskTier(session)
  const base = tier === 'ultra-preferred' ? 96 : tier === 'preferred' ? 91 : 84
  return Math.min(99, Math.max(80, base + Math.floor(Math.random() * 3) - 1))
}

export function getRecommendedPlan(session: Partial<DTCSession>): 'basic' | 'plus' | 'premium' {
  const income = session.annualIncome ?? 0
  const deps = session.dependents ?? 0
  if (income > 120000 || deps >= 3) return 'premium'
  if (income > 60000 || deps >= 1) return 'plus'
  return 'basic'
}

export function generateQuoteResult(session: Partial<DTCSession>): QuoteResult {
  const riskTier = calculateRiskTier(session)
  const confidenceScore = calculateConfidenceScore(session)
  const rec = getRecommendedPlan(session)
  return {
    riskTier,
    confidenceScore,
    eligibilityStatus: 'eligible',
    plans: [
      { name: 'Basic', monthlyPremium: 18, coverageAmount: 250000, recommended: rec === 'basic',
        benefits: ['$250,000 death benefit', '10-year term', 'No medical exam', 'Instant approval'] },
      { name: 'Plus', monthlyPremium: 29, coverageAmount: 500000, recommended: rec === 'plus',
        benefits: ['$500,000 death benefit', '20-year term', 'No medical exam', 'Instant approval', 'Terminal illness rider'] },
      { name: 'Premium', monthlyPremium: 47, coverageAmount: 1000000, recommended: rec === 'premium',
        benefits: ['$1,000,000 death benefit', '30-year term', 'No medical exam', 'Instant approval', 'Terminal illness rider', 'Disability waiver'] },
    ],
  }
}

export function getAIRecommendationMessage(session: Partial<DTCSession>): string {
  const plan = getRecommendedPlan(session)
  const planNames = { basic: 'Basic Protection', plus: 'Plus Protection', premium: 'Premium Protection' }
  const depNote = (session.dependents ?? 0) > 0 ? ` to protect your ${session.dependents} dependent${session.dependents === 1 ? '' : 's'}` : ''
  return `Based on your profile, ${planNames[plan]} provides the best balance of affordability and coverage${depNote}. With a ${calculateRiskTier(session).replace('-', ' ')} risk classification, you qualify for our most competitive rates.`
}
