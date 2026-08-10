'use client'
import { DndContext, DragEndEvent, closestCorners, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import { KanbanColumn } from './kanban-column'
import { LeadCard } from './lead-card'
import { useLeadsPipeline } from '@/hooks/useLeadsPipeline'
import type { Lead, LeadStatus } from '@/types'

const COLUMNS: LeadStatus[] = ['new', 'contacted', 'in-review', 'approved']

export function KanbanBoard() {
  const { leads, moveLeadToStatus } = useLeadsPipeline()
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const handleDragStart = (e: DragStartEvent) => {
    setActiveLead(leads.find(l => l.id === e.active.id) ?? null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveLead(null)
    if (!over) return
    const newStatus = COLUMNS.includes(over.id as LeadStatus)
      ? (over.id as LeadStatus)
      : leads.find(l => l.id === over.id)?.status
    if (newStatus && newStatus !== leads.find(l => l.id === active.id)?.status) {
      moveLeadToStatus(active.id as string, newStatus)
    }
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map(status => (
          <KanbanColumn key={status} status={status} leads={leads.filter(l => l.status === status)} />
        ))}
      </div>
      <DragOverlay>{activeLead && <LeadCard lead={activeLead} />}</DragOverlay>
    </DndContext>
  )
}
