'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import customersData from '@/mock-data/customers.json'
import policiesData from '@/mock-data/policies.json'
import type { Customer, Policy } from '@/types'
import { ClientCard } from '@/components/distribution/client-card'
import { ClientSlideOver } from '@/components/distribution/client-slide-over'

const customers = customersData as Customer[]
const policies = policiesData as Policy[]

type FilterTab = 'all' | 'active' | 'attention' | 'recent'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'attention', label: 'Needs Attention' },
  { key: 'recent', label: 'Recent' },
]

function getPolicyForCustomer(customerId: string): Policy | undefined {
  return policies.find(p => p.customerId === customerId)
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('attention')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedCustomer = customers.find(c => c.id === selectedId) ?? null
  const selectedPolicy = selectedId ? getPolicyForCustomer(selectedId) : undefined

  const filtered = useMemo(() => {
    let list = customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
    )
    if (tab === 'active') list = list.filter(c => getPolicyForCustomer(c.id)?.status === 'active')
    if (tab === 'attention') list = list.filter(c => {
      const status = getPolicyForCustomer(c.id)?.status
      return status === 'pending' || status === 'lapsed' || status === 'cancelled'
    })
    if (tab === 'recent') list = [...list].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 8)
    return list
  }, [search, tab])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground text-sm mt-1">Your book of business at a glance.</p>
      </motion.div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or state..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:border-electric-500 transition-colors"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-muted">
          {TABS.map(t => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === t.key ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer, i) => (
          <ClientCard
            key={customer.id}
            customer={customer}
            policy={getPolicyForCustomer(customer.id)}
            onClick={() => setSelectedId(customer.id)}
            index={i}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full text-center py-12">No clients match your filter.</p>
        )}
      </div>

      {/* Slide-over */}
      <ClientSlideOver
        customer={selectedCustomer}
        policy={selectedPolicy}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
