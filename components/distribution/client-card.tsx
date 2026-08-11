'use client'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/formatters'

interface Customer {
  id: string
  name: string
  email: string
  state: string
  age: number
  createdAt: string
}

interface Policy {
  id: string
  customerId: string
  plan: string
  coverageAmount: number
  monthlyPremium: number
  status: 'active' | 'pending' | 'lapsed' | 'cancelled'
  issuedDate: string | null
  expiryDate: string | null
  type: string
}

interface ClientCardProps {
  customer: Customer
  policy?: Policy
  onClick: () => void
  index: number
}

const STATUS_RING: Record<string, string> = {
  active: 'ring-green-500',
  pending: 'ring-amber-400',
  lapsed: 'ring-red-500',
  cancelled: 'ring-red-500',
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  active: { text: 'Active', color: 'text-green-400' },
  pending: { text: 'Needs attention', color: 'text-amber-400' },
  lapsed: { text: 'Policy lapsed', color: 'text-red-400' },
  cancelled: { text: 'Cancelled', color: 'text-red-400' },
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

export function ClientCard({ customer, policy, onClick, index }: ClientCardProps) {
  const status = policy?.status ?? 'pending'
  const ring = STATUS_RING[status] ?? 'ring-muted'
  const statusInfo = STATUS_LABEL[status] ?? { text: 'Unknown', color: 'text-muted-foreground' }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className="theme-card rounded-2xl p-5 text-left w-full hover:border-electric-500/40 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full ring-2 ring-offset-2 ring-offset-background ${ring} bg-electric-600/20 flex items-center justify-center flex-shrink-0`}>
          <span className="text-electric-400 font-semibold text-sm">{getInitials(customer.name)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{customer.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{customer.state} · Age {customer.age}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        {policy && (
          <p className="text-lg font-bold text-foreground">{formatCurrency(policy.coverageAmount)}</p>
        )}
        <p className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
        <p className="text-xs text-muted-foreground">Last seen {daysSince(customer.createdAt)}</p>
      </div>
    </motion.button>
  )
}
