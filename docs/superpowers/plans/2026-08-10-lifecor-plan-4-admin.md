# Lifecor Plan 4: Admin Panel

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin showcase panel — dashboard with system-wide KPIs, policy management table, user management with invite modal, and pre-built reports with chart modals.

**Architecture:** Route group `(admin)` with its own sidebar (slate accent, visually distinct from distribution). All data from mock JSON. Report charts open in Shadcn `Dialog` modals.

**Tech Stack:** Next.js App Router, Recharts, Shadcn UI (Dialog, Badge, Table), Framer Motion, Lucide React

## Global Constraints (inherited from Plan 1)

- All types from `types/index.ts`; formatters from `lib/formatters.ts`
- Admin sidebar uses slate accent (`bg-slate-500/20 text-slate-400`) — NOT electric blue — to visually signal a different context
- All data from `mock-data/*.json`
- Sonner toast for mock actions (export, invite)
- Mobile responsive

---

### Task 1: Admin Layout & Sidebar

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `app/(admin)/admin/layout.tsx`
- Create: `components/admin/sidebar.tsx`
- Create: `components/admin/mobile-header.tsx`

**Interfaces:**
- Produces: `<AdminSidebar />` with slate accent; `<AdminMobileHeader />`; persistent layout for all `/admin/*` routes

- [ ] **Step 1: Create `components/admin/sidebar.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Users, BarChart3, Shield, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/policies', icon: FileText, label: 'Policy Management' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold">Lifecor</span>
        </Link>
        <Badge className="ml-2 text-[10px] bg-slate-500/20 text-slate-400 border-slate-500/30">Admin</Badge>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="w-4 h-4" />Settings
        </Link>
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" />Back to Site
        </Link>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create `components/admin/mobile-header.tsx`**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, LayoutDashboard, FileText, Users, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/policies', icon: FileText, label: 'Policy Management' },
  { href: '/admin/users', icon: Users, label: 'User Management' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
]

export function AdminMobileHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="md:hidden h-14 border-b border-border bg-card flex items-center justify-between px-4 relative">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-600 flex items-center justify-center">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-lg font-bold">Lifecor Admin</span>
      </Link>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 py-2 px-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                pathname === item.href ? 'bg-slate-500/20 text-slate-300' : 'text-muted-foreground')}>
              <item.icon className="w-4 h-4" />{item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 3: Create `app/(admin)/layout.tsx`**

```typescript
export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 4: Create `app/(admin)/admin/layout.tsx`**

```typescript
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminMobileHeader } from '@/components/admin/mobile-header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminMobileHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add app/(admin)/ components/admin/ && git commit -m "feat: add admin layout with slate-accented sidebar"
```

---

### Task 2: Admin Dashboard

**Files:**
- Create: `app/(admin)/admin/page.tsx`

**Interfaces:**
- Consumes: `mock-data/policies.json`, `mock-data/agents.json`, `mock-data/applications.json`, `mock-data/analytics.json`; `KPICard` from `components/distribution/kpi-card.tsx`
- Produces: 4 system-wide KPI cards + Recharts line chart overview

- [ ] **Step 1: Create `app/(admin)/admin/page.tsx`**

```typescript
'use client'
import { FileText, Users, DollarSign, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { KPICard } from '@/components/distribution/kpi-card'
import analyticsData from '@/mock-data/analytics.json'
import policiesData from '@/mock-data/policies.json'
import agentsData from '@/mock-data/agents.json'
import applicationsData from '@/mock-data/applications.json'
import type { Policy, Agent, Application } from '@/types'

const policies = policiesData as Policy[]
const agents = agentsData as Agent[]
const applications = applicationsData as Application[]

const activePolicies = policies.filter(p => p.status === 'active').length
const totalPremium = policies.filter(p => p.status === 'active').reduce((sum, p) => sum + p.monthlyPremium * 12, 0)
const activeAgents = agents.filter(a => a.role !== 'viewer').length
const pendingApps = applications.filter(a => a.status === 'under-review' || a.status === 'submitted').length

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System-wide overview — all carriers, all agents</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Policies" value={String(activePolicies)} rawValue={activePolicies} change="+11% this quarter" icon={<FileText className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Annual Premium" value={`$${(totalPremium / 1000).toFixed(0)}K`} rawValue={totalPremium} change="+18% YoY" icon={<DollarSign className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Active Agents" value={String(activeAgents)} rawValue={activeAgents} change="+2 this month" icon={<Users className="w-5 h-5 text-slate-400" />} />
        <KPICard label="Pending Applications" value={String(pendingApps)} rawValue={pendingApps} change={`${pendingApps} awaiting review`} positive={false} icon={<Clock className="w-5 h-5 text-slate-400" />} />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold mb-1">System-Wide Policy Volume</h2>
        <p className="text-xs text-muted-foreground mb-4">Total policies issued across all agents — last 12 months</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={analyticsData.monthlyPolicies} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }} />
            <Line type="monotone" dataKey="policies" stroke="#94A3B8" strokeWidth={2} dot={{ fill: '#94A3B8', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify at http://localhost:3000/admin**

Expected: Slate-accented sidebar, 4 KPI cards showing computed values from mock data, line chart renders.

- [ ] **Step 3: Commit**

```bash
git add app/(admin)/admin/page.tsx && git commit -m "feat: add admin dashboard with system KPIs and line chart"
```

---

### Task 3: Policy Management

**Files:**
- Create: `app/(admin)/admin/policies/page.tsx`

**Interfaces:**
- Consumes: `mock-data/policies.json`, `mock-data/customers.json`; Shadcn Badge; `formatCurrency`, `formatPremium`, `formatDate`
- Produces: Filterable, sortable policy table; mock export toast on button click

- [ ] **Step 1: Install Sonner for toasts**

```bash
npx shadcn@latest add sonner
```

- [ ] **Step 2: Add `<Toaster />` to `app/layout.tsx`**

Add `import { Toaster } from '@/components/ui/sonner'` and `<Toaster />` just before `</body>`:

```typescript
import { Toaster } from '@/components/ui/sonner'
// ...inside RootLayout body:
<ThemeProvider ...>
  {children}
  <Toaster />
</ThemeProvider>
```

- [ ] **Step 3: Create `app/(admin)/admin/policies/page.tsx`**

```typescript
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
```

- [ ] **Step 4: Commit**

```bash
git add app/(admin)/admin/policies/ && git commit -m "feat: add admin policy management table with filter and export"
```

---

### Task 4: User Management

**Files:**
- Create: `app/(admin)/admin/users/page.tsx`
- Create: `components/admin/invite-modal.tsx`

**Interfaces:**
- Consumes: `mock-data/agents.json`; Shadcn Dialog; Sonner toast
- Produces: Agent table with role badges; "Invite User" button opens modal with mock form

- [ ] **Step 1: Create `components/admin/invite-modal.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

export function InviteModal({ open, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')

  const handleInvite = () => {
    if (!email || !role) return
    toast.success('Invitation sent', { description: `${email} will receive an invite email shortly.` })
    setEmail('')
    setRole('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>Send an invitation to join Lifecor as an agent or admin.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Email Address</Label>
            <Input type="email" placeholder="agent@company.com" className="mt-1.5" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Role</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleInvite} disabled={!email || !role} className="flex-1 bg-electric-600 hover:bg-electric-700 text-white">
              Send Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Create `app/(admin)/admin/users/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { InviteModal } from '@/components/admin/invite-modal'
import agentsData from '@/mock-data/agents.json'
import type { Agent, AgentRole } from '@/types'
import { formatDate } from '@/lib/formatters'

const agents = agentsData as Agent[]

const ROLE_STYLES: Record<AgentRole, string> = {
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  agent: 'bg-electric-600/20 text-electric-400 border-electric-600/30',
  viewer: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
}

export default function UsersPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{agents.length} team members</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-electric-600 hover:bg-electric-700 text-white">
          <UserPlus className="mr-2 w-4 h-4" />Invite User
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Team Member', 'Email', 'Role', 'Leads', 'Conversion', 'Policies', 'Joined'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {agents.map(agent => (
              <tr key={agent.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-electric-600/20 text-electric-400 text-xs">{agent.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{agent.email}</td>
                <td className="px-4 py-3">
                  <Badge className={`border capitalize text-xs ${ROLE_STYLES[agent.role]}`}>{agent.role}</Badge>
                </td>
                <td className="px-4 py-3 text-sm">{agent.totalLeads}</td>
                <td className="px-4 py-3 text-sm">{agent.conversionRate}%</td>
                <td className="px-4 py-3 text-sm">{agent.policiesIssued}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(agent.joinedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(admin)/admin/users/ components/admin/invite-modal.tsx && git commit -m "feat: add user management table with invite modal"
```

---

### Task 5: Reports

**Files:**
- Create: `app/(admin)/admin/reports/page.tsx`
- Create: `components/admin/report-modal.tsx`

**Interfaces:**
- Consumes: `mock-data/analytics.json`; Shadcn Dialog; Recharts
- Produces: 3 report cards; clicking each opens a Dialog with the relevant Recharts chart

- [ ] **Step 1: Create `components/admin/report-modal.tsx`**

```typescript
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const TOOLTIP_STYLE = { backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '12px', color: '#F8FAFC' }

interface ReportModalProps {
  open: boolean
  onClose: () => void
  title: string
  data: unknown[]
  type: 'bar' | 'line'
  dataKey: string
  xKey: string
  formatter?: (v: unknown) => string
}

export function ReportModal({ open, onClose, title, data, type, dataKey, xKey, formatter }: ReportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            {type === 'bar' ? (
              <BarChart data={data as Record<string, unknown>[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xKey} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatter} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={formatter ? (v) => [formatter(v), dataKey] : undefined} />
                <Bar dataKey={dataKey} fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={data as Record<string, unknown>[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey={xKey} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatter} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={formatter ? (v) => [formatter(v), dataKey] : undefined} />
                <Line type="monotone" dataKey={dataKey} stroke="#94A3B8" strokeWidth={2} dot={{ fill: '#94A3B8', r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Create `app/(admin)/admin/reports/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { BarChart3, TrendingUp, FileBarChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ReportModal } from '@/components/admin/report-modal'
import analyticsData from '@/mock-data/analytics.json'

type ReportKey = 'loss-ratio' | 'conversion' | 'volume' | null

const LOSS_RATIO_DATA = [
  { month: 'Feb', ratio: 58.2 },
  { month: 'Mar', ratio: 61.4 },
  { month: 'Apr', ratio: 55.8 },
  { month: 'May', ratio: 59.1 },
  { month: 'Jun', ratio: 57.3 },
  { month: 'Jul', ratio: 54.6 },
]

const REPORTS = [
  {
    key: 'loss-ratio' as ReportKey,
    icon: BarChart3,
    title: 'Loss Ratio by Month',
    description: 'Claims paid vs. premiums earned. Target: under 65%.',
    metric: '54.6%',
    metricLabel: 'Current loss ratio',
    trend: 'Down 2.7% from last month',
    trendPositive: true,
    data: LOSS_RATIO_DATA,
    type: 'line' as const,
    dataKey: 'ratio',
    xKey: 'month',
    formatter: (v: unknown) => `${v}%`,
  },
  {
    key: 'conversion' as ReportKey,
    icon: TrendingUp,
    title: 'Conversion Rate by State',
    description: 'Lead-to-policy conversion rates across top 5 states.',
    metric: '41.3%',
    metricLabel: 'Top state (NY)',
    trend: '+3.2% vs. last quarter',
    trendPositive: true,
    data: analyticsData.conversionByState,
    type: 'bar' as const,
    dataKey: 'rate',
    xKey: 'state',
    formatter: (v: unknown) => `${v}%`,
  },
  {
    key: 'volume' as ReportKey,
    icon: FileBarChart,
    title: 'Monthly Application Volume',
    description: 'Total applications submitted across all channels.',
    metric: '134',
    metricLabel: 'Applications in Jul',
    trend: '+6 vs. June',
    trendPositive: true,
    data: analyticsData.monthlyPolicies,
    type: 'bar' as const,
    dataKey: 'policies',
    xKey: 'month',
    formatter: undefined,
  },
]

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportKey>(null)
  const activeData = REPORTS.find(r => r.key === activeReport)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Pre-built analytics reports — click any card to view the full chart</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {REPORTS.map((report, i) => (
          <motion.div
            key={report.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setActiveReport(report.key)}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center mb-4 group-hover:bg-slate-500/30 transition-colors">
              <report.icon className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-semibold mb-1">{report.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{report.description}</p>
            <div className="pt-4 border-t border-border">
              <div className="text-2xl font-bold">{report.metric}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{report.metricLabel}</div>
              <div className={`text-xs mt-1 ${report.trendPositive ? 'text-green-400' : 'text-red-400'}`}>{report.trend}</div>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-4 group-hover:border-slate-500/50 transition-colors">
              View Full Chart
            </Button>
          </motion.div>
        ))}
      </div>

      {activeData && (
        <ReportModal
          open={!!activeReport}
          onClose={() => setActiveReport(null)}
          title={activeData.title}
          data={activeData.data}
          type={activeData.type}
          dataKey={activeData.dataKey}
          xKey={activeData.xKey}
          formatter={activeData.formatter}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify full admin panel**

Navigate: `/admin` → `/admin/policies` → `/admin/users` → `/admin/reports`. Click "Invite User" on users page — modal opens, fill and submit — toast fires. Click a report card — chart modal opens.

- [ ] **Step 4: Full build check**

```bash
npm run build
```

Expected: Zero TypeScript errors, zero ESLint errors. Build completes successfully.

- [ ] **Step 5: Final commit**

```bash
git add app/(admin)/admin/reports/ components/admin/report-modal.tsx && git commit -m "feat: add admin reports page with chart modals"
```

---

### Task 6: Final Polish & Deployment Prep

**Files:**
- Modify: `next.config.ts`

**Interfaces:**
- Produces: Vercel-ready build with no warnings

- [ ] **Step 1: Update `next.config.ts` for production**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
}

export default nextConfig
```

- [ ] **Step 2: Create `vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

- [ ] **Step 3: Final full build and type check**

```bash
npx tsc --noEmit && npm run build
```

Expected: Clean pass with no errors.

- [ ] **Step 4: Final commit**

```bash
git add . && git commit -m "chore: finalize build config and deployment setup"
```

---

**Plan 4 complete.** Delivers: full admin panel — dashboard, policy management, user management with invite modal, reports with chart modals, and Vercel deployment config.

**All 4 plans complete.** The full Lifecor demo platform is ready for execution.
