# Partner Portal Narrative Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the partner portal from a generic CRM dashboard into an intelligence surface with 3 sections: Command (merged dashboard + pipeline), Clients (card grid + slide-over), Analytics (polished).

**Architecture:** The partner layout in `app/(distribution)/` stays untouched. Sidebar nav is updated to 3 primary items. The `/partner/pipeline` route is redirected to `/partner`. New UI components live in `components/distribution/`. All mock data is imported from `@/mock-data/*.json`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, @dnd-kit (drag-drop preserved internally), Recharts, shadcn/ui Sheet (for slide-over)

## Global Constraints

- `'use client'` required on all interactive components
- Mock data imports: `import leads from '@/mock-data/leads.json'`, `import customers from '@/mock-data/customers.json'`, `import policies from '@/mock-data/policies.json'`, `import analyticsData from '@/mock-data/analytics.json'`
- Lead status values: `'new' | 'contacted' | 'in-review' | 'approved'`
- Customer shape: `{ id, name, age, state, email, phone, createdAt }` — joined with policy via `customerId`
- Policy shape: `{ id, customerId, plan, type, coverageAmount, monthlyPremium, status, issuedDate, expiryDate }`
- Policy status values: `'active' | 'pending' | 'lapsed' | 'cancelled'`
- Electric blue primary: `electric-500` / `electric-600`. Amber accent: `amber-400`
- No new npm packages — use only already-installed dependencies

---

### Task 1: Sidebar Navigation Restructure

**Files:**
- Modify: `components/distribution/sidebar.tsx`
- Modify: `components/distribution/mobile-header.tsx`
- Create: `app/(distribution)/partner/pipeline/page.tsx` (redirect)

**Interfaces:**
- Produces: Sidebar with 3 primary nav items: Command (`/partner`), Clients (`/partner/clients`), Analytics (`/partner/analytics`). Quote Generator kept as secondary. Dashboard and Lead Pipeline removed.
- Sidebar bottom: agent profile + amber "approved today" counter

- [ ] **Step 1: Update sidebar nav items and add wins counter**

Replace entire contents of `components/distribution/sidebar.tsx`:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Command, Users, BarChart3, Shield, LogOut, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const NAV_PRIMARY = [
  { href: '/partner', icon: Command, label: 'Command' },
  { href: '/partner/clients', icon: Users, label: 'Clients' },
  { href: '/partner/analytics', icon: BarChart3, label: 'Analytics' },
]

const NAV_SECONDARY = [
  { href: '/partner/quote', icon: Calculator, label: 'Quote Generator' },
]

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/partner' ? pathname === '/partner' : pathname.startsWith(href)

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

      <nav className="flex-1 px-3 py-4">
        <p className="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-widest">Workspace</p>
        <div className="space-y-1 mb-6">
          {NAV_PRIMARY.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground px-3 mb-2 uppercase tracking-widest">Tools</p>
        <div className="space-y-1">
          {NAV_SECONDARY.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-electric-600/20 text-electric-400 border border-electric-600/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-border">
        {/* Today's wins counter */}
        <div className="px-3 py-2 mb-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
          <p className="text-xs text-amber-400 font-semibold">3 approved today</p>
          <p className="text-xs text-muted-foreground">Keep it up, Sarah</p>
        </div>
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

- [ ] **Step 2: Update mobile header to match new nav**

Open `components/distribution/mobile-header.tsx`. Find the array of nav links inside the mobile menu sheet. Remove the entries for `Dashboard` (href `/partner`) and `Lead Pipeline` (href `/partner/pipeline`). Add `Command` (href `/partner`, icon `Command` from lucide). Keep Clients, Quote Generator, Analytics.

The updated nav array inside the mobile header sheet should be:
```tsx
const NAV = [
  { href: '/partner', label: 'Command', icon: Command },
  { href: '/partner/clients', label: 'Clients', icon: Users },
  { href: '/partner/quote', label: 'Quote Generator', icon: Calculator },
  { href: '/partner/analytics', label: 'Analytics', icon: BarChart3 },
]
```

Import `Command` and `Calculator` from `'lucide-react'` alongside existing imports.

- [ ] **Step 3: Redirect pipeline page to Command**

Replace entire contents of `app/(distribution)/partner/pipeline/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function PipelinePage() {
  redirect('/partner')
}
```

- [ ] **Step 4: Visual verify**

Run `npx next dev`. Visit `/partner`. Confirm:
- Sidebar shows: **Workspace** section with Command, Clients, Analytics; **Tools** section with Quote Generator
- Dashboard and Lead Pipeline links are gone
- Amber "3 approved today" counter appears above agent profile at sidebar bottom
- Visiting `/partner/pipeline` redirects to `/partner`
- Mobile menu shows the same updated links

- [ ] **Step 5: Commit**

```bash
git add components/distribution/sidebar.tsx components/distribution/mobile-header.tsx "app/(distribution)/partner/pipeline/page.tsx"
git commit -m "feat: restructure partner nav — Command/Clients/Analytics, remove dashboard+pipeline links"
```

---

### Task 2: Partner Command Page (Full Rebuild)

**Files:**
- Create: `components/distribution/pulse-stat.tsx`
- Create: `components/distribution/swimlane-pipeline.tsx`
- Modify: `app/(distribution)/partner/page.tsx`

**Interfaces:**
- Consumes: `analyticsData.monthlyPolicies` — array of `{ month: string, policies: number }`
- Consumes: `leads` from `@/mock-data/leads.json` — array of `{ id, name, email, phone, status, createdAt }`
- Produces: Command page with pulse stat (left) + swimlane pipeline (right)

- [ ] **Step 1: Create PulseStat component**

Create `components/distribution/pulse-stat.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface PulseStatProps {
  value: number
  trend: string
  sparkData: { v: number }[]
}

export function PulseStat({ value, trend, sparkData }: PulseStatProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = Math.ceil(value / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-7xl font-bold text-electric-400 leading-none tabular-nums"
      >
        {count}
      </motion.p>
      <p className="text-sm text-muted-foreground mt-2">policies issued this month</p>
      <p className="text-sm text-amber-400 font-medium mt-1">{trend}</p>

      {/* Spark line */}
      <div className="mt-6 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
        {[
          { label: 'Leads', value: '247' },
          { label: 'Conversion', value: '34.2%' },
          { label: 'Avg approval', value: '2.4d' },
        ].map(s => (
          <div key={s.label}>
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create SwimlanePipeline component**

Create `components/distribution/swimlane-pipeline.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface Lead {
  id: string
  name: string
  status: string
  createdAt: string
}

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'in-review', label: 'In Review' },
  { key: 'approved', label: 'Approved' },
]

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function SwimlanePipeline({ leads }: { leads: Lead[] }) {
  const [localLeads, setLocalLeads] = useState(leads)

  const focusLeadId = localLeads.find(l => l.status === 'contacted')?.id ?? localLeads[0]?.id

  const moveLeadForward = (leadId: string) => {
    setLocalLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l
      const stageIndex = STAGES.findIndex(s => s.key === l.status)
      const next = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)]
      return { ...l, status: next.key }
    }))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-3 flex-1 min-h-0">
        {STAGES.map(stage => {
          const stageLeads = localLeads.filter(l => l.status === stage.key)
          return (
            <div key={stage.key} className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {stage.label}
                </p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                  {stageLeads.length}
                </span>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {stageLeads.map(lead => {
                  const isFocus = lead.id === focusLeadId
                  const days = daysSince(lead.createdAt)
                  return (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl p-3 border cursor-pointer transition-all ${
                        isFocus
                          ? 'border-amber-400/60 bg-amber-400/5'
                          : 'border-border bg-card hover:border-electric-500/40'
                      }`}
                      onClick={() => moveLeadForward(lead.id)}
                    >
                      {isFocus && (
                        <p className="text-xs text-amber-400 font-semibold mb-1.5">↑ Follow up today</p>
                      )}
                      <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Day {days}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Click a card to advance to next stage</p>
    </div>
  )
}
```

- [ ] **Step 3: Rebuild partner/page.tsx**

Replace entire contents of `app/(distribution)/partner/page.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'
import analyticsData from '@/mock-data/analytics.json'
import leads from '@/mock-data/leads.json'
import { PulseStat } from '@/components/distribution/pulse-stat'
import { SwimlanePipeline } from '@/components/distribution/swimlane-pipeline'
import { useChartColors } from '@/hooks/use-chart-colors'

export default function CommandPage() {
  useChartColors() // ensure theme detection fires

  const monthlyData = analyticsData.monthlyPolicies
  const currentMonth = monthlyData[monthlyData.length - 1]
  const prevMonth = monthlyData[monthlyData.length - 2]
  const pctChange = prevMonth
    ? Math.round(((currentMonth.policies - prevMonth.policies) / prevMonth.policies) * 100)
    : 0
  const trend = pctChange >= 0
    ? `↑ ${pctChange}% ahead of last month`
    : `↓ ${Math.abs(pctChange)}% behind last month`

  const sparkData = monthlyData.slice(-10).map(d => ({ v: d.policies }))

  return (
    <div className="h-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold">Command</h1>
        <p className="text-muted-foreground text-sm mt-1">Your live view — everything in one place.</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 flex-1 min-h-0">
        {/* Left — Pulse */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 theme-card rounded-2xl p-8 flex flex-col justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              This Month
            </p>
            <PulseStat
              value={currentMonth.policies}
              trend={trend}
              sparkData={sparkData}
            />
          </div>
        </motion.div>

        {/* Right — Swimlane */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 theme-card rounded-2xl p-6 flex flex-col min-h-[480px]"
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Live Pipeline
            </p>
            <span className="text-xs text-muted-foreground">{leads.length} leads</span>
          </div>
          <div className="flex-1 min-h-0">
            <SwimlanePipeline leads={leads} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Visual verify**

Visit `/partner`. Confirm:
- Two-column layout: left pulse stat (large number), right swimlane
- Large electric-blue count-up number showing policies this month
- Spark line beneath it
- Three secondary stats (Leads, Conversion, Avg approval) in a strip
- Swimlane shows 4 horizontal stage columns: New, Contacted, In Review, Approved
- One card highlighted in amber ("Follow up today")
- Clicking a card advances it to the next stage (Framer Motion layout animation)

- [ ] **Step 5: Commit**

```bash
git add components/distribution/pulse-stat.tsx components/distribution/swimlane-pipeline.tsx "app/(distribution)/partner/page.tsx"
git commit -m "feat: rebuild partner dashboard as Command page — pulse stat + swimlane pipeline"
```

---

### Task 3: Partner Clients Rebuild (Card Grid + Slide-Over)

**Files:**
- Create: `components/distribution/client-card.tsx`
- Create: `components/distribution/client-slide-over.tsx`
- Modify: `app/(distribution)/partner/clients/page.tsx`

**Interfaces:**
- Consumes: `customers` from `@/mock-data/customers.json`, `policies` from `@/mock-data/policies.json`
- Customer + policy joined on `policy.customerId === customer.id`
- Policy status `'active'` → green ring, `'pending'` → amber ring, `'lapsed'` | `'cancelled'` → red ring
- Produces: `ClientCard` accepts `{ customer, policy | undefined }`, on click opens `ClientSlideOver`

- [ ] **Step 1: Create ClientCard**

Create `components/distribution/client-card.tsx`:

```tsx
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
```

- [ ] **Step 2: Create ClientSlideOver**

Create `components/distribution/client-slide-over.tsx`:

```tsx
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
```

- [ ] **Step 3: Rebuild clients page**

Replace entire contents of `app/(distribution)/partner/clients/page.tsx`:

```tsx
'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import customers from '@/mock-data/customers.json'
import policies from '@/mock-data/policies.json'
import { ClientCard } from '@/components/distribution/client-card'
import { ClientSlideOver } from '@/components/distribution/client-slide-over'

type FilterTab = 'all' | 'active' | 'attention' | 'recent'

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'attention', label: 'Needs Attention' },
  { key: 'recent', label: 'Recent' },
]

function getPolicyForCustomer(customerId: string) {
  return (policies as { id: string; customerId: string; plan: string; type: string; coverageAmount: number; monthlyPremium: number; status: 'active' | 'pending' | 'lapsed' | 'cancelled'; issuedDate: string | null; expiryDate: string | null }[]).find(p => p.customerId === customerId)
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
```

- [ ] **Step 4: Visual verify**

Visit `/partner/clients`. Confirm:
- "Needs Attention" tab is pre-selected, showing pending/lapsed clients
- 3-column card grid with avatar rings (green/amber/red per status)
- Each card shows name, state/age, coverage amount, status label, days since last seen
- Search filters in real time
- Clicking a card slides in a panel from the right (Sheet component)
- Slide-over shows profile, policy card, activity timeline
- Background grid remains visible behind the slide-over
- `/partner/clients/[id]` route still works but slides-over replaces the typical flow for this page

- [ ] **Step 5: Commit**

```bash
git add components/distribution/client-card.tsx components/distribution/client-slide-over.tsx "app/(distribution)/partner/clients/page.tsx"
git commit -m "feat: rebuild Clients as card grid with slide-over panel replacing data table"
```

---

### Task 4: Partner Analytics — Polish

**Files:**
- Modify: `app/(distribution)/partner/analytics/page.tsx`

**Interfaces:**
- Consumes: `analyticsData.monthlyPolicies` — find max entry for Best Month callout
- Best Month: `monthlyPolicies.reduce((best, d) => d.policies > best.policies ? d : best)`

- [ ] **Step 1: Add Best Month callout to analytics page**

In `app/(distribution)/partner/analytics/page.tsx`, add the following imports at the top if not already present:
```tsx
import { Trophy } from 'lucide-react'
```

Compute best month before the return statement (add this after the existing tab/data setup):
```tsx
const bestMonth = analyticsData.monthlyPolicies.reduce((best, d) =>
  d.policies > best.policies ? d : best
)
```

In the JSX, insert this callout block ABOVE the existing `<div className="grid gap-6">` chart section:

```tsx
<div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 mb-6">
  <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0" />
  <div>
    <p className="text-sm font-semibold text-foreground">
      {bestMonth.month} — {bestMonth.policies} policies
    </p>
    <p className="text-xs text-muted-foreground">Your strongest month on record.</p>
  </div>
</div>
```

- [ ] **Step 2: Visual verify**

Visit `/partner/analytics`. Confirm:
- An amber trophy callout appears above the charts showing the best month and policy count
- Charts render correctly beneath it
- 3M/6M/1Y tabs still work
- Bar chart still shows border-only hover (no white fill)

- [ ] **Step 3: Commit**

```bash
git add "app/(distribution)/partner/analytics/page.tsx"
git commit -m "feat: add Best Month callout to analytics page"
```
