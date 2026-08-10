'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MapPin, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/formatters'
import type { Lead } from '@/types'

export function LeadCard({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      className="glass-card rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-electric-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-full bg-electric-600/20 flex items-center justify-center text-xs font-bold text-electric-400">
          {lead.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <span className="text-xs font-bold text-electric-400">{formatCurrency(lead.coverageAmount)}</span>
      </div>
      <div className="font-medium text-sm mb-2">{lead.clientName}</div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lead.state}</span>
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(lead.lastContactDate)}</span>
      </div>
    </div>
  )
}
