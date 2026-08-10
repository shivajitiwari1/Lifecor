export interface QuotePlan {
  name: 'Basic' | 'Plus' | 'Premium'
  monthlyPremium: number
  coverageAmount: number
  benefits: string[]
  recommended: boolean
}

export interface QuoteResult {
  plans: QuotePlan[]
  riskTier: 'standard' | 'preferred' | 'ultra-preferred'
  confidenceScore: number
  eligibilityStatus: 'eligible' | 'ineligible' | 'review-required'
}
