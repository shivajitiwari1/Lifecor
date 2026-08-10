'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LeadCard } from './lead-card'
import type { Lead, LeadStatus } from '@/types'
import { cn } from '@/lib/utils'

const COLUMN_STYLES: Record<LeadStatus, string> = {
  'new': 'border-slate-500/30',
  'contacted': 'border-blue-500/30',
  'in-review': 'border-amber-500/30',
  'approved': 'border-green-500/30',
}

const COLUMN_BADGE: Record<LeadStatus, string> = {
  'new': 'bg-slate-500/20 text-slate-400',
  'contacted': 'bg-blue-500/20 text-blue-400',
  'in-review': 'bg-amber-500/20 text-amber-400',
  'approved': 'bg-green-500/20 text-green-400',
}

const COLUMN_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'in-review': 'In Review',
  'approved': 'Approved',
}

interface KanbanColumnProps {
  status: LeadStatus
  leads: Lead[]
}

export function KanbanColumn({ status, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div className={cn('flex flex-col rounded-2xl border-2 bg-card/50 p-4 min-h-[400px] transition-all', COLUMN_STYLES[status], isOver && 'bg-electric-600/5')}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{COLUMN_LABELS[status]}</h3>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', COLUMN_BADGE[status])}>{leads.length}</span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-3 flex-1">
          {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      </SortableContext>
    </div>
  )
}
