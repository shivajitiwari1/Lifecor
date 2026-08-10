import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import customersData from '@/mock-data/customers.json'
import policiesData from '@/mock-data/policies.json'
import type { Customer, Policy } from '@/types'
import { formatCurrency, formatPremium, formatDate } from '@/lib/formatters'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  lapsed: 'bg-red-500/20 text-red-400 border-red-500/30',
}

const NOTES = [
  { date: '2025-01-20', text: 'Client expressed interest in upgrading to Premium plan next renewal.' },
  { date: '2025-01-10', text: 'Follow-up call completed. Client satisfied with current coverage.' },
  { date: '2024-12-15', text: 'Initial consultation — explained term vs. whole life options.' },
]

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = (customersData as Customer[]).find(c => c.id === id)
  if (!customer) notFound()
  const policy = (policiesData as Policy[]).find(p => p.customerId === customer.id)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/partner/clients" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        {policy && (
          <Badge className={`border capitalize ${STATUS_STYLES[policy.status] ?? ''}`}>{policy.status}</Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-electric-600/20 flex items-center justify-center text-xl font-bold text-electric-400">
              {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="text-lg font-bold">{customer.name}</div>
              <div className="text-sm text-muted-foreground">Age {customer.age} · {customer.state}</div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { icon: Mail, label: customer.email },
              { icon: Phone, label: customer.phone },
              { icon: MapPin, label: customer.state },
              { icon: Calendar, label: `Client since ${formatDate(customer.createdAt)}` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <item.icon className="w-4 h-4 text-electric-400 flex-shrink-0" />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">Policy Details</h2>
          {policy ? (
            <div className="space-y-4">
              {[
                { label: 'Plan', value: `${policy.plan.charAt(0).toUpperCase() + policy.plan.slice(1)} Protection` },
                { label: 'Coverage', value: formatCurrency(policy.coverageAmount) },
                { label: 'Monthly Premium', value: formatPremium(policy.monthlyPremium) },
                { label: 'Policy Type', value: policy.type.replace('-', ' ').toUpperCase() },
                { label: 'Status', value: policy.status, badge: true },
                ...(policy.issuedDate ? [{ label: 'Issued', value: formatDate(policy.issuedDate) }] : []),
                ...(policy.expiryDate ? [{ label: 'Expires', value: formatDate(policy.expiryDate) }] : []),
              ].map((row: { label: string; value: string; badge?: boolean }) => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  {row.badge ? (
                    <Badge className={`border capitalize text-xs ${STATUS_STYLES[row.value] ?? ''}`}>{row.value}</Badge>
                  ) : (
                    <span className="text-sm font-medium capitalize">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Shield className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No active policy</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">Notes</h2>
        <div className="space-y-4">
          {NOTES.map((note, i) => (
            <div key={i} className="flex gap-4">
              <div className="text-xs text-muted-foreground w-24 flex-shrink-0 pt-0.5">{formatDate(note.date)}</div>
              <p className="text-sm text-muted-foreground">{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
