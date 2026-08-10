'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import customersData from '@/mock-data/customers.json'
import policiesData from '@/mock-data/policies.json'
import type { Customer, Policy } from '@/types'
import { formatCurrency, formatPremium } from '@/lib/formatters'

const customers = customersData as Customer[]
const policies = policiesData as Policy[]

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  lapsed: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">{customers.length} total clients</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or state..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Client', 'State', 'Age', 'Plan', 'Coverage', 'Premium', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(client => {
              const policy = policies.find(p => p.customerId === client.id)
              return (
                <tr key={client.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-electric-600/20 flex items-center justify-center text-xs font-bold text-electric-400">
                        {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.state}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{client.age}</td>
                  <td className="px-4 py-3 text-sm capitalize">{policy?.plan ?? '—'}</td>
                  <td className="px-4 py-3 text-sm">{policy ? formatCurrency(policy.coverageAmount) : '—'}</td>
                  <td className="px-4 py-3 text-sm">{policy ? formatPremium(policy.monthlyPremium) : '—'}</td>
                  <td className="px-4 py-3">
                    {policy ? (
                      <Badge className={`border text-xs ${STATUS_STYLES[policy.status] ?? ''} capitalize`}>{policy.status}</Badge>
                    ) : <span className="text-xs text-muted-foreground">No policy</span>}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/partner/clients/${client.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
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
