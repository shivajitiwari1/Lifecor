import { create } from 'zustand'
import type { Lead, LeadStatus } from '@/types'
import leadsData from '@/mock-data/leads.json'

interface LeadsPipelineStore {
  leads: Lead[]
  moveLeadToStatus: (leadId: string, status: LeadStatus) => void
}

export const useLeadsPipeline = create<LeadsPipelineStore>((set) => ({
  leads: leadsData as Lead[],
  moveLeadToStatus: (leadId, status) =>
    set((s) => ({ leads: s.leads.map(l => l.id === leadId ? { ...l, status } : l) })),
}))
