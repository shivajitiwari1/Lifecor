export interface Customer {
  id: string
  name: string
  age: number
  state: string
  annualIncome: number
  smoker: boolean
  existingConditions: 'none' | 'minor' | 'major'
  dependents: 0 | 1 | 2 | 3
  email: string
  phone: string
  createdAt: string
}

export interface DTCSession {
  name: string
  age: number
  state: string
  smoker: boolean
  existingConditions: 'none' | 'minor' | 'major'
  annualIncome: number
  dependents: 0 | 1 | 2 | 3
  selectedPlan: 'basic' | 'plus' | 'premium' | null
  riskTier: 'standard' | 'preferred' | 'ultra-preferred' | null
  confidenceScore: number | null
}
