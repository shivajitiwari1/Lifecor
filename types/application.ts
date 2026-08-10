export type ApplicationStatus = 'submitted' | 'under-review' | 'approved' | 'declined'

export interface Application {
  id: string
  customerId: string
  agentId: string | null
  plan: 'basic' | 'plus' | 'premium'
  coverageAmount: number
  monthlyPremium: number
  status: ApplicationStatus
  submittedDate: string
  decidedDate: string | null
}
