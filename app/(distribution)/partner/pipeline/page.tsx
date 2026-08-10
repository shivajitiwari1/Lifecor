import { KanbanBoard } from '@/components/distribution/kanban-board'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lead Pipeline</h1>
        <p className="text-muted-foreground text-sm mt-1">Drag and drop leads between stages to update their status</p>
      </div>
      <KanbanBoard />
    </div>
  )
}
