export type PolicyType = 'term-10' | 'term-20' | 'term-30' | 'whole-life'
export type PolicyStatus = 'active' | 'pending' | 'lapsed' | 'cancelled'

export interface Policy {
  id: string
  customerId: string
  type: PolicyType
  coverageAmount: number
  monthlyPremium: number
  status: PolicyStatus
  issuedDate: string | null
  expiryDate: string | null
  plan: 'basic' | 'plus' | 'premium'
}
