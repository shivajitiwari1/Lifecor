'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Lead {
  id: string
  clientName: string
  status: string
  lastContactDate: string
}

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'in-review', label: 'In Review' },
  { key: 'approved', label: 'Approved' },
]

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function SwimlanePipeline({ leads }: { leads: Lead[] }) {
  const [localLeads, setLocalLeads] = useState(leads)

  const focusLeadId = localLeads.find(l => l.status === 'contacted')?.id ?? localLeads[0]?.id

  const moveLeadForward = (leadId: string) => {
    setLocalLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l
      const stageIndex = STAGES.findIndex(s => s.key === l.status)
      const next = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)]
      return { ...l, status: next.key }
    }))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-3 flex-1 min-h-0">
        {STAGES.map(stage => {
          const stageLeads = localLeads.filter(l => l.status === stage.key)
          return (
            <div key={stage.key} className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {stage.label}
                </p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {stageLeads.map(lead => {
                  const isFocus = lead.id === focusLeadId
                  const days = daysSince(lead.lastContactDate)
                  return (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl p-3 border cursor-pointer transition-all ${
                        isFocus
                          ? 'border-amber-400/60 bg-amber-400/5'
                          : 'border-border bg-card hover:border-electric-500/40'
                      }`}
                      onClick={() => moveLeadForward(lead.id)}
                    >
                      {isFocus && (
                        <p className="text-xs text-amber-400 font-semibold mb-1.5">↑ Follow up today</p>
                      )}
                      <p className="text-sm font-medium text-foreground truncate">{lead.clientName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Day {days}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Click a card to advance to next stage</p>
    </div>
  )
}
