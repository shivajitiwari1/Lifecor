'use client'
import { cn } from '@/lib/utils'

interface ToggleCardProps {
  label: string
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
}

export function ToggleCard({ label, selected, onClick, icon }: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3',
        selected
          ? 'border-electric-500 bg-electric-600/20 text-foreground'
          : 'border-border bg-card hover:border-electric-500/50 text-muted-foreground hover:text-foreground',
      )}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium text-sm">{label}</span>
      <div className={cn(
        'ml-auto w-5 h-5 rounded-full border-2 transition-all',
        selected ? 'border-electric-500 bg-electric-500' : 'border-muted-foreground',
      )}>
        {selected && <div className="w-full h-full rounded-full bg-white scale-50" />}
      </div>
    </button>
  )
}
