# Lifecor Plan 3: Distribution Dashboard

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full partner/agent experience: dashboard with KPIs and charts, kanban lead pipeline, client management with detail pages, quote generator, and analytics.

**Architecture:** Route group `(distribution)` with a persistent left sidebar layout. All data from mock JSON. `useLeadsPipeline` Zustand store powers the kanban board. Recharts for all charts.

**Tech Stack:** Next.js App Router, Recharts, @dnd-kit/core + @dnd-kit/sortable, Framer Motion, Zustand, Lucide React, Shadcn UI

## Global Constraints (inherited from Plan 1)

- All types from `types/index.ts`; formatters from `lib/formatters.ts`
- All data from `mock-data/*.json` — no API calls
- Recharts for all charts — `ResponsiveContainer` wrapping every chart
- Dark mode default; sidebar accent: Electric Blue
- Mobile responsive — sidebar collapses on mobile (hamburger menu)
- Animate count-up on all KPI numbers using Framer Motion

---

### Task 1: Distribution Layout & Sidebar

**Files:**
- Create: `app/(distribution)/layout.tsx`
- Create: `app/(distribution)/partner/layout.tsx`
- Create: `components/distribution/sidebar.tsx`
- Create: `components/distribution/mobile-header.tsx`

**Interfaces:**
- Produces: `<Sidebar />` with nav links; `<MobileHeader />` for small screens; persistent layout wrapper for all `/partner/*` routes

- [ ] **Step 1: Create `components/distribution/sidebar.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, GitBranch, Calculator, BarChart3, Shield, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV = [
  { href: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/partner/pipeline', icon: GitBranch, label: 'Lead Pipeline' },
  { href: '/partner/clients', icon: Users, label: 'Clients' },
  { href: '/partner/quote', icon: Calculator, label: 'Quote Generator' },
  { href: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold">Lifecor</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-electric-600/20 text-electric-400 text-xs">SM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Sarah Mitchell</div>
            <div className="text-xs text-muted-foreground">Senior Advisor</div>
          </div>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create `components/distribution/mobile-header.tsx`**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, LayoutDashboard, Users, GitBranch, Calculator, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/partner/pipeline', icon: GitBranch, label: 'Lead Pipeline' },
  { href: '/partner/clients', icon: Users, label: 'Clients' },
  { href: '/partner/quote', icon: Calculator, label: 'Quote Generator' },
  { href: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
]

export function MobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-electric-600 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-lg font-bold">Lifecor</span>
      </Link>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 py-2 px-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                pathname === item.href ? 'bg-electric-600/20 text-electric-400' : 'text-muted-foreground',
              )}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 3: Create `app/(distribution)/layout.tsx`**

```typescript
export default function DistributionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4: Create `app/(distribution)/partner/layout.tsx`**

```typescript
import { Sidebar } from '@/components/distribution/sidebar'
import { MobileHeader } from '@/components/distribution/mobile-header'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/(distribution)/ components/distribution/ && git commit -m "feat: add distribution layout with sidebar and mobile header"
```

---

### Task 2: Partner Dashboard (KPIs + Chart + Activity)

**Files:**
- Create: `app/(distribution)/partner/page.tsx`
- Create: `components/distribution/kpi-card.tsx`
- Create: `components/distribution/area-chart.tsx`

**Interfaces:**
- Consumes: `mock-data/analytics.json`, `mock-data/applications.json`; `formatCurrency`, `formatPercent`
- Produces: 4 animated KPI cards, area chart (monthly trend), recent activity feed

- [ ] **Step 1: Create `components/distribution/kpi-card.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  label: string
  value: string
  rawValue: number
  change: string
  positive?: boolean
  icon: React.ReactNode
}

export function KPICard({ label, value, change, positive = true, icon }: KPICardProps) {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-electric-600/20 flex items-center justify-center">
          {icon}
        </div>
        <span className={cn('text-xs font-medium flex items-center gap-1', positive ? 'text-green-400' : 'text-red-400')}>
          <TrendingUp className="w-3 h-3" />{change}
        </span>
      </div>
      <div className={cn('text-3xl font-extrabold mb-1 transition-all duration-700', show ? 'opacity-100' : 'opacity-0')}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `components/distribution/area-chart.tsx`**

```typescript
'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AreaChartProps {
  data: { month: string; policies: number }[]
}

export function PoliciesAreaChart({ data }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }} />
        <Area type="monotone" dataKey="policies" stroke="#3B82F6" strokeWidth={2} fill="url(#blueGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 3: Create `app/(distribution)/partner/page.tsx`**

```typescript
import { Users, TrendingUp, FileText, Shield } from 'lucide-react'
import { KPICard } from '@/components/distribution/kpi-card'
import { PoliciesAreaChart } from '@/components/distribution/area-chart'
import analyticsData from '@/mock-data/analytics.json'
import applicationsData from '@/mock-data/applications.json'
import { formatDate } from '@/lib/formatters'

const ACTIVITY = [
  { text: 'James Carter policy approved', time: '2 min ago', type: 'success' },
  { text: 'New lead: David Williams submitted', time: '18 min ago', type: 'info' },
  { text: 'Quote generated for Lisa Johnson', time: '1 hr ago', type: 'info' },
  { text: 'Application submitted: Brian Thomas', time: '2 hrs ago', type: 'info' },
  { text: 'Christopher Wilson policy approved', time: '3 hrs ago', type: 'success' },
]

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, Sarah. Here's what's happening today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Leads" value="247" rawValue={247} change="+12% this month" icon={<Users className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Conversion Rate" value="34.2%" rawValue={34.2} change="+4.1% vs last month" icon={<TrendingUp className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Applications" value="89" rawValue={89} change="+7 this week" icon={<FileText className="w-5 h-5 text-electric-400" />} />
        <KPICard label="Policies Issued" value="61" rawValue={61} change="+8 this month" icon={<Shield className="w-5 h-5 text-electric-400" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Policies Issued — Last 12 Months</h2>
          <PoliciesAreaChart data={analyticsData.monthlyPolicies} />
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'success' ? 'bg-green-400' : 'bg-electric-400'}`} />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify at http://localhost:3000/partner**

Expected: Sidebar renders, 4 KPI cards show, area chart renders with data.

- [ ] **Step 5: Commit**

```bash
git add app/(distribution)/partner/page.tsx components/distribution/ && git commit -m "feat: add partner dashboard with KPIs and chart"
```

---

### Task 3: Lead Pipeline (Kanban)

**Files:**
- Create: `app/(distribution)/partner/pipeline/page.tsx`
- Create: `components/distribution/kanban-board.tsx`
- Create: `components/distribution/kanban-column.tsx`
- Create: `components/distribution/lead-card.tsx`

**Interfaces:**
- Consumes: `useLeadsPipeline` Zustand store, `@dnd-kit/core`, `@dnd-kit/sortable`
- Produces: 4-column drag-and-drop kanban board; dropping a card calls `moveLeadToStatus()`

- [ ] **Step 1: Create `components/distribution/lead-card.tsx`**

```typescript
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
```

- [ ] **Step 2: Create `components/distribution/kanban-column.tsx`**

```typescript
'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LeadCard } from './lead-card'
import type { Lead, LeadStatus } from '@/types'
import { cn } from '@/lib/utils'

const COLUMN_STYLES: Record<LeadStatus, string> = {
  'new': 'border-slate-500/30',
  'contacted': 'border-blue-500/30',
  'in-review': 'border-amber-500/30',
  'approved': 'border-green-500/30',
}

const COLUMN_BADGE: Record<LeadStatus, string> = {
  'new': 'bg-slate-500/20 text-slate-400',
  'contacted': 'bg-blue-500/20 text-blue-400',
  'in-review': 'bg-amber-500/20 text-amber-400',
  'approved': 'bg-green-500/20 text-green-400',
}

const COLUMN_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'in-review': 'In Review',
  'approved': 'Approved',
}

interface KanbanColumnProps {
  status: LeadStatus
  leads: Lead[]
}

export function KanbanColumn({ status, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div className={cn('flex flex-col rounded-2xl border-2 bg-card/50 p-4 min-h-[400px] transition-all', COLUMN_STYLES[status], isOver && 'bg-electric-600/5')}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">{COLUMN_LABELS[status]}</h3>
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', COLUMN_BADGE[status])}>{leads.length}</span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex flex-col gap-3 flex-1">
          {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
        </div>
      </SortableContext>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/distribution/kanban-board.tsx`**

```typescript
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
```

- [ ] **Step 4: Create `app/(distribution)/partner/pipeline/page.tsx`**

```typescript
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
```

- [ ] **Step 5: Verify drag-and-drop at http://localhost:3000/partner/pipeline**

Expected: 4 columns render with leads. Dragging a lead card between columns moves it and updates the count badges.

- [ ] **Step 6: Commit**

```bash
git add app/(distribution)/partner/pipeline/ components/distribution/kanban-board.tsx components/distribution/kanban-column.tsx components/distribution/lead-card.tsx && git commit -m "feat: add lead pipeline kanban board with drag-and-drop"
```

---

### Task 4: Client Management (Table + Detail)

**Files:**
- Create: `app/(distribution)/partner/clients/page.tsx`
- Create: `app/(distribution)/partner/clients/[id]/page.tsx`

**Interfaces:**
- Consumes: `mock-data/customers.json`, `mock-data/policies.json`
- Produces: Searchable client table; click-through to detail page with profile, policy, and notes

- [ ] **Step 1: Create `app/(distribution)/partner/clients/page.tsx`**

```typescript
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
                        {client.name.split(' ').map(n => n[0]).join('').slice(0,2)}
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
```

- [ ] **Step 2: Create `app/(distribution)/partner/clients/[id]/page.tsx`**

```typescript
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

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const customer = (customersData as Customer[]).find(c => c.id === params.id)
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
              {customer.name.split(' ').map(n => n[0]).join('').slice(0,2)}
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
              ].map((row: any) => (
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
```

- [ ] **Step 3: Commit**

```bash
git add app/(distribution)/partner/clients/ && git commit -m "feat: add client management table and detail page"
```

---

### Task 5: Quote Generator

**Files:**
- Create: `app/(distribution)/partner/quote/page.tsx`

**Interfaces:**
- Consumes: `generateQuoteResult()`, React Hook Form + Zod, `QuoteCard` from Plan 2
- Produces: Form → fake 2s loading → 3 quote result cards with approval probability

- [ ] **Step 1: Create `app/(distribution)/partner/quote/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuoteCard } from '@/components/dtc/quote-card'
import { generateQuoteResult } from '@/lib/mock-ai'
import { sleep } from '@/lib/utils'
import type { QuoteResult, DTCSession } from '@/types'

const US_STATES = ['California','Texas','Florida','New York','Illinois','Arizona','Washington','Colorado','Georgia','Nevada','Michigan','Oregon','Virginia','Minnesota','Ohio','Utah','Pennsylvania','North Carolina','Tennessee','Missouri']

const schema = z.object({
  age: z.coerce.number().min(18).max(75),
  state: z.string().min(1),
  annualIncome: z.coerce.number().min(1),
})
type FormData = z.infer<typeof schema>

export default function QuoteGeneratorPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<DTCSession['selectedPlan']>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setResult(null)
    await sleep(2000)
    const session: Partial<DTCSession> = { age: data.age, state: data.state, annualIncome: data.annualIncome, smoker: false, existingConditions: 'none', dependents: 0 }
    setResult(generateQuoteResult(session))
    setSelectedPlan(null)
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Quote Generator</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate instant quotes for your clients</p>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Client Age</Label>
            <Input type="number" placeholder="34" className="mt-1.5" {...register('age')} />
            {errors.age && <p className="text-red-400 text-xs mt-1">Valid age required (18–75)</p>}
          </div>
          <div>
            <Label>State</Label>
            <Select onValueChange={v => setValue('state', v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.state && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div>
            <Label>Annual Income</Label>
            <Input type="number" placeholder="95000" className="mt-1.5" {...register('annualIncome')} />
            {errors.annualIncome && <p className="text-red-400 text-xs mt-1">Required</p>}
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" disabled={loading} className="bg-electric-600 hover:bg-electric-700 text-white h-10 px-8">
              {loading ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Calculating...</> : <><Calculator className="mr-2 w-4 h-4" />Generate Quotes</>}
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Quote Results</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Confidence: <span className="text-electric-400 font-bold">{result.confidenceScore}%</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {result.plans.map(plan => (
                <QuoteCard key={plan.name} plan={plan} selected={selectedPlan === plan.name.toLowerCase()} onSelect={() => setSelectedPlan(plan.name.toLowerCase() as DTCSession['selectedPlan'])} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(distribution)/partner/quote/ && git commit -m "feat: add partner quote generator"
```

---

### Task 6: Partner Analytics

**Files:**
- Create: `app/(distribution)/partner/analytics/page.tsx`

**Interfaces:**
- Consumes: `mock-data/analytics.json`, Recharts
- Produces: 3 Recharts graphs (bar, line, area) with date range selector tabs

- [ ] **Step 1: Create `app/(distribution)/partner/analytics/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import analyticsData from '@/mock-data/analytics.json'

const TOOLTIP_STYLE = { backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }

const TABS = ['3M', '6M', '1Y'] as const
type Tab = typeof TABS[number]

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('1Y')
  const policiesData = tab === '3M' ? analyticsData.monthlyPolicies.slice(-3)
    : tab === '6M' ? analyticsData.monthlyPolicies.slice(-6)
    : analyticsData.monthlyPolicies

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance insights for your book of business</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${tab === t ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Monthly Policies Issued</h2>
          <p className="text-xs text-muted-foreground mb-4">Total policies closed per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={policiesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="policies" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Conversion Trend</h2>
            <p className="text-xs text-muted-foreground mb-4">Monthly conversion rate (%)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={analyticsData.conversionTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} domain={[20, 50]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Conversion']} />
                <Line type="monotone" dataKey="rate" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="font-semibold mb-1">Revenue Estimate</h2>
            <p className="text-xs text-muted-foreground mb-4">Estimated monthly commission ($)</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={analyticsData.revenueEstimate} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify all partner pages at http://localhost:3000/partner**

Navigate each sidebar link. Expected: All 5 pages render with correct data.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/(distribution)/partner/analytics/ && git commit -m "feat: add partner analytics with bar, line, and area charts"
```

---

**Plan 3 complete.** Delivers: full distribution partner experience — dashboard, kanban pipeline, client management, quote generator, analytics.

Proceed to Plan 4 (Admin Panel) next.
