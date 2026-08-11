'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPremium, formatDate } from '@/lib/formatters'

interface Customer {
  id: string; name: string; email: string; phone: string; state: string; age: number; createdAt: string
}
interface Policy {
  id: string; plan: string; type: string; coverageAmount: number; monthlyPremium: number
  status: 'active' | 'pending' | 'lapsed' | 'cancelled'; issuedDate: string | null; expiryDate: string | null
}

interface ClientSlideOverProps {
  customer: Customer | null
  policy?: Policy
  open: boolean
  onClose: () => void
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/40',
  pending: 'bg-amber-400/20 text-amber-400 border-amber-400/40',
  lapsed: 'bg-red-500/20 text-red-400 border-red-500/40',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/40',
}

const NOTES = [
  { date: '3 days ago', text: 'Client reviewed policy terms. Interested in upgrading to Premium.' },
  { date: '2 weeks ago', text: 'Initial onboarding call completed. Policy documents sent via email.' },
  { date: '1 month ago', text: 'Application submitted and approved. Welcome email sent.' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function ClientSlideOver({ customer, policy, open, onClose }: ClientSlideOverProps) {
  if (!customer) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">{customer.name}</SheetTitle>
        </SheetHeader>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-8 pt-4">
          <div className="w-14 h-14 rounded-full bg-electric-600/20 flex items-center justify-center flex-shrink-0">
            <span className="text-electric-400 font-bold text-lg">{getInitials(customer.name)}</span>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.state} · Age {customer.age}</p>
            <p className="text-xs text-muted-foreground">Client since {formatDate(customer.createdAt)}</p>
          </div>
        </div>

        <div className="space-y-1 mb-6 text-sm">
          <p className="text-muted-foreground">{customer.email}</p>
          <p className="text-muted-foreground">{customer.phone}</p>
        </div>

        {/* Policy */}
        {policy && (
          <div className="theme-card rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground capitalize">
                {policy.plan} Protection
              </p>
              <Badge className={`border capitalize ${STATUS_BADGE[policy.status] ?? ''}`}>
                {policy.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Coverage</p>
                <p className="font-semibold">{formatCurrency(policy.coverageAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Monthly</p>
                <p className="font-semibold">{formatPremium(policy.monthlyPremium)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Type</p>
                <p className="font-semibold capitalize">{policy.type.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Issued</p>
                <p className="font-semibold">{policy.issuedDate ? formatDate(policy.issuedDate) : '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Activity</p>
          <div className="space-y-4">
            {NOTES.map((note, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-electric-500 mt-1 flex-shrink-0" />
                  {i < NOTES.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs text-muted-foreground mb-1">{note.date}</p>
                  <p className="text-sm text-foreground">{note.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
