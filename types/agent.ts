export type AgentRole = 'admin' | 'agent' | 'viewer'
export type LeadStatus = 'new' | 'contacted' | 'in-review' | 'approved'

export interface Agent {
  id: string
  name: string
  email: string
  role: AgentRole
  avatar: string
  totalLeads: number
  conversionRate: number
  policiesIssued: number
  joinedDate: string
}

export interface Lead {
  id: string
  clientName: string
  coverageAmount: number
  lastContactDate: string
  status: LeadStatus
  agentId: string
  state: string
  age: number
}
