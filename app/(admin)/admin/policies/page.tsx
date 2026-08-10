'use client'
import { useState } from 'react'
import { Download, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import policiesData from '@/mock-data/policies.json'
import customersData from '@/mock-data/customers.json'
import type { Policy, Customer, PolicyStatus } from '@/types'
import { formatCurrency, formatPremium, formatDate } from '@/lib/formatters'

const policies = policiesData as Policy[]
const customers = customersData as Customer[]

const STATUS_STYLES: Record<PolicyStatus, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  lapsed: 'bg-red-500/20 text-red-400 border-red-500/30',
  cancelled: 'bg-red-700/20 text-red-500 border-red-700/30',
}

export default function PoliciesPage() {
  const [filter, setFilter] = useState<'all' | PolicyStatus>('all')

  const filtered = filter === 'all' ? policies : policies.filter(p => p.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Policy Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} policies</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => toast.success('Export started', { description: 'CSV will download shortly' })}>
          <Download className="mr-2 w-4 h-4" />Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select defaultValue="all" onValueChange={(v) => setFilter(v as 'all' | PolicyStatus)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="lapsed">Lapsed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Policy ID', 'Customer', 'Plan', 'Type', 'Coverage', 'Premium/mo', 'Status', 'Issued'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(policy => {
              const customer = customers.find(c => c.id === policy.customerId)
              return (
                <tr key={policy.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{policy.id.toUpperCase()}</td>
                  <td className="px-4 py-3 text-sm font-medium">{customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm capitalize">{policy.plan}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground uppercase">{policy.type}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(policy.coverageAmount)}</td>
                  <td className="px-4 py-3 text-sm">{formatPremium(policy.monthlyPremium)}</td>
                  <td className="px-4 py-3">
                    <Badge className={`border capitalize text-xs ${STATUS_STYLES[policy.status]}`}>{policy.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {policy.issuedDate ? formatDate(policy.issuedDate) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
