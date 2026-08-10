# Lifecor Plan 1: Project Setup, Infrastructure & Landing Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js 15+ project, configure brand tokens, create all shared types/mock data/utilities, and build the complete landing page.

**Architecture:** Single Next.js 15 App Router project. Route groups `(dtc)`, `(distribution)`, `(admin)` for later plans. All data from static JSON in `/mock-data`. No backend.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Tailwind CSS, Shadcn UI, Framer Motion, Lucide React, Zustand, next-themes

## Global Constraints

- Next.js 15+ App Router only — no Pages Router
- TypeScript strict mode (`"strict": true` in tsconfig)
- Dark mode default; light mode via `next-themes` with `attribute="class"`
- Brand: Deep Navy `#0A0F1E` bg, Electric Blue `#2563EB`/`#3B82F6` accent, white text
- No backend — all data from `/mock-data/*.json`
- Framer Motion on every page transition
- Mobile responsive — all layouts adapt ≤768px
- Lucide React for all icons; no other icon libraries

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.ts`

**Interfaces:**
- Produces: Runnable Next.js 15 dev server at localhost:3000

- [ ] **Step 1: Initialize Next.js project**

Run from `e:/Demo Website/Lifecor`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --yes
```

- [ ] **Step 2: Install all dependencies**

```bash
npm install framer-motion recharts lucide-react react-hook-form @hookform/resolvers zod zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities next-themes clsx tailwind-merge class-variance-authority tailwindcss-animate
```

- [ ] **Step 3: Initialize Shadcn UI**

```bash
npx shadcn@latest init --defaults
```

- [ ] **Step 4: Add Shadcn components**

```bash
npx shadcn@latest add button card badge input label select tabs progress skeleton dialog sheet separator avatar dropdown-menu toast sonner
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000 with default Next.js page.

- [ ] **Step 6: Commit**

```bash
git init && git add . && git commit -m "chore: initialize Next.js 15 project with all dependencies"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `types/customer.ts`
- Create: `types/policy.ts`
- Create: `types/quote.ts`
- Create: `types/agent.ts`
- Create: `types/application.ts`
- Create: `types/index.ts`

**Interfaces:**
- Produces: All shared types used across Plans 1–4

- [ ] **Step 1: Create `types/customer.ts`**

```typescript
export interface Customer {
  id: string
  name: string
  age: number
  state: string
  annualIncome: number
  smoker: boolean
  existingConditions: 'none' | 'minor' | 'major'
  dependents: 0 | 1 | 2 | 3
  email: string
  phone: string
  createdAt: string
}

export interface DTCSession {
  name: string
  age: number
  state: string
  smoker: boolean
  existingConditions: 'none' | 'minor' | 'major'
  annualIncome: number
  dependents: 0 | 1 | 2 | 3
  selectedPlan: 'basic' | 'plus' | 'premium' | null
  riskTier: 'standard' | 'preferred' | 'ultra-preferred' | null
  confidenceScore: number | null
}
```

- [ ] **Step 2: Create `types/policy.ts`**

```typescript
export type PolicyType = 'term-10' | 'term-20' | 'term-30' | 'whole-life'
export type PolicyStatus = 'active' | 'pending' | 'lapsed' | 'cancelled'

export interface Policy {
  id: string
  customerId: string
  type: PolicyType
  coverageAmount: number
  monthlyPremium: number
  status: PolicyStatus
  issuedDate: string | null
  expiryDate: string | null
  plan: 'basic' | 'plus' | 'premium'
}
```

- [ ] **Step 3: Create `types/quote.ts`**

```typescript
export interface QuotePlan {
  name: 'Basic' | 'Plus' | 'Premium'
  monthlyPremium: number
  coverageAmount: number
  benefits: string[]
  recommended: boolean
}

export interface QuoteResult {
  plans: QuotePlan[]
  riskTier: 'standard' | 'preferred' | 'ultra-preferred'
  confidenceScore: number
  eligibilityStatus: 'eligible' | 'ineligible' | 'review-required'
}
```

- [ ] **Step 4: Create `types/agent.ts`**

```typescript
export type AgentRole = 'admin' | 'agent' | 'viewer'
export type LeadStatus = 'new' | 'contacted' | 'in-review' | 'approved'

export interface Agent {
  id: string
  name: string
  email: string
  role: AgentRole
  avatar: string
  totalLeads: number
  conversionRate: number
  policiesIssued: number
  joinedDate: string
}

export interface Lead {
  id: string
  clientName: string
  coverageAmount: number
  lastContactDate: string
  status: LeadStatus
  agentId: string
  state: string
  age: number
}
```

- [ ] **Step 5: Create `types/application.ts`**

```typescript
export type ApplicationStatus = 'submitted' | 'under-review' | 'approved' | 'declined'

export interface Application {
  id: string
  customerId: string
  agentId: string | null
  plan: 'basic' | 'plus' | 'premium'
  coverageAmount: number
  monthlyPremium: number
  status: ApplicationStatus
  submittedDate: string
  decidedDate: string | null
}
```

- [ ] **Step 6: Create `types/index.ts`**

```typescript
export * from './customer'
export * from './policy'
export * from './quote'
export * from './agent'
export * from './application'
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add types/ && git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: Mock Data JSON Files

**Files:**
- Create: `mock-data/customers.json`
- Create: `mock-data/policies.json`
- Create: `mock-data/leads.json`
- Create: `mock-data/agents.json`
- Create: `mock-data/applications.json`
- Create: `mock-data/analytics.json`

**Interfaces:**
- Produces: All static data consumed by every page in Plans 2–4

- [ ] **Step 1: Create `mock-data/customers.json`**

```json
[
  {"id":"c001","name":"James Carter","age":34,"state":"California","annualIncome":95000,"smoker":false,"existingConditions":"none","dependents":2,"email":"james.carter@email.com","phone":"555-0101","createdAt":"2024-01-15"},
  {"id":"c002","name":"Sarah Mitchell","age":42,"state":"Texas","annualIncome":120000,"smoker":false,"existingConditions":"minor","dependents":3,"email":"sarah.mitchell@email.com","phone":"555-0102","createdAt":"2024-02-03"},
  {"id":"c003","name":"Michael Torres","age":28,"state":"Florida","annualIncome":65000,"smoker":true,"existingConditions":"none","dependents":0,"email":"michael.torres@email.com","phone":"555-0103","createdAt":"2024-02-18"},
  {"id":"c004","name":"Emily Chen","age":31,"state":"New York","annualIncome":145000,"smoker":false,"existingConditions":"none","dependents":1,"email":"emily.chen@email.com","phone":"555-0104","createdAt":"2024-03-05"},
  {"id":"c005","name":"David Williams","age":55,"state":"Illinois","annualIncome":82000,"smoker":false,"existingConditions":"minor","dependents":2,"email":"david.williams@email.com","phone":"555-0105","createdAt":"2024-03-22"},
  {"id":"c006","name":"Lisa Johnson","age":39,"state":"Arizona","annualIncome":73000,"smoker":false,"existingConditions":"none","dependents":2,"email":"lisa.johnson@email.com","phone":"555-0106","createdAt":"2024-04-10"},
  {"id":"c007","name":"Robert Brown","age":47,"state":"Washington","annualIncome":108000,"smoker":true,"existingConditions":"major","dependents":1,"email":"robert.brown@email.com","phone":"555-0107","createdAt":"2024-04-28"},
  {"id":"c008","name":"Jennifer Davis","age":26,"state":"Colorado","annualIncome":58000,"smoker":false,"existingConditions":"none","dependents":0,"email":"jennifer.davis@email.com","phone":"555-0108","createdAt":"2024-05-14"},
  {"id":"c009","name":"Christopher Wilson","age":51,"state":"Georgia","annualIncome":134000,"smoker":false,"existingConditions":"minor","dependents":3,"email":"chris.wilson@email.com","phone":"555-0109","createdAt":"2024-06-01"},
  {"id":"c010","name":"Amanda Martinez","age":33,"state":"Nevada","annualIncome":79000,"smoker":false,"existingConditions":"none","dependents":1,"email":"amanda.martinez@email.com","phone":"555-0110","createdAt":"2024-06-18"},
  {"id":"c011","name":"Kevin Anderson","age":44,"state":"Michigan","annualIncome":91000,"smoker":false,"existingConditions":"none","dependents":2,"email":"kevin.anderson@email.com","phone":"555-0111","createdAt":"2024-07-05"},
  {"id":"c012","name":"Michelle Taylor","age":29,"state":"Oregon","annualIncome":67000,"smoker":false,"existingConditions":"none","dependents":0,"email":"michelle.taylor@email.com","phone":"555-0112","createdAt":"2024-07-22"},
  {"id":"c013","name":"Brian Thomas","age":38,"state":"Virginia","annualIncome":115000,"smoker":true,"existingConditions":"minor","dependents":2,"email":"brian.thomas@email.com","phone":"555-0113","createdAt":"2024-08-08"},
  {"id":"c014","name":"Stephanie Jackson","age":35,"state":"Minnesota","annualIncome":88000,"smoker":false,"existingConditions":"none","dependents":1,"email":"steph.jackson@email.com","phone":"555-0114","createdAt":"2024-08-25"},
  {"id":"c015","name":"Andrew White","age":62,"state":"Ohio","annualIncome":76000,"smoker":false,"existingConditions":"major","dependents":0,"email":"andrew.white@email.com","phone":"555-0115","createdAt":"2024-09-12"},
  {"id":"c016","name":"Rachel Harris","age":27,"state":"Utah","annualIncome":54000,"smoker":false,"existingConditions":"none","dependents":0,"email":"rachel.harris@email.com","phone":"555-0116","createdAt":"2024-09-30"},
  {"id":"c017","name":"Daniel Clark","age":46,"state":"Pennsylvania","annualIncome":127000,"smoker":false,"existingConditions":"none","dependents":3,"email":"daniel.clark@email.com","phone":"555-0117","createdAt":"2024-10-15"},
  {"id":"c018","name":"Jessica Lewis","age":32,"state":"North Carolina","annualIncome":69000,"smoker":false,"existingConditions":"none","dependents":1,"email":"jessica.lewis@email.com","phone":"555-0118","createdAt":"2024-11-01"},
  {"id":"c019","name":"Matthew Robinson","age":40,"state":"Tennessee","annualIncome":98000,"smoker":true,"existingConditions":"minor","dependents":2,"email":"matt.robinson@email.com","phone":"555-0119","createdAt":"2024-11-18"},
  {"id":"c020","name":"Ashley Walker","age":24,"state":"Missouri","annualIncome":48000,"smoker":false,"existingConditions":"none","dependents":0,"email":"ashley.walker@email.com","phone":"555-0120","createdAt":"2024-12-05"}
]
```

- [ ] **Step 2: Create `mock-data/agents.json`**

```json
[
  {"id":"a001","name":"Sarah Mitchell","email":"sarah@lifecor.com","role":"agent","avatar":"SM","totalLeads":89,"conversionRate":38.2,"policiesIssued":34,"joinedDate":"2023-03-15"},
  {"id":"a002","name":"Marcus Johnson","email":"marcus@lifecor.com","role":"agent","avatar":"MJ","totalLeads":112,"conversionRate":29.5,"policiesIssued":33,"joinedDate":"2023-01-10"},
  {"id":"a003","name":"Priya Patel","email":"priya@lifecor.com","role":"admin","avatar":"PP","totalLeads":145,"conversionRate":42.1,"policiesIssued":61,"joinedDate":"2022-11-20"},
  {"id":"a004","name":"Carlos Rivera","email":"carlos@lifecor.com","role":"agent","avatar":"CR","totalLeads":67,"conversionRate":31.3,"policiesIssued":21,"joinedDate":"2023-06-01"},
  {"id":"a005","name":"Emily Zhang","email":"emily@lifecor.com","role":"viewer","avatar":"EZ","totalLeads":23,"conversionRate":21.7,"policiesIssued":5,"joinedDate":"2024-01-15"},
  {"id":"a006","name":"David Kim","email":"david@lifecor.com","role":"agent","avatar":"DK","totalLeads":78,"conversionRate":35.9,"policiesIssued":28,"joinedDate":"2023-04-22"},
  {"id":"a007","name":"Amanda Foster","email":"amanda@lifecor.com","role":"agent","avatar":"AF","totalLeads":56,"conversionRate":26.8,"policiesIssued":15,"joinedDate":"2023-08-10"},
  {"id":"a008","name":"James O'Brien","email":"james@lifecor.com","role":"agent","avatar":"JO","totalLeads":94,"conversionRate":33.0,"policiesIssued":31,"joinedDate":"2023-02-28"},
  {"id":"a009","name":"Natasha Williams","email":"natasha@lifecor.com","role":"admin","avatar":"NW","totalLeads":203,"conversionRate":44.3,"policiesIssued":90,"joinedDate":"2022-09-05"},
  {"id":"a010","name":"Tom Hartley","email":"tom@lifecor.com","role":"viewer","avatar":"TH","totalLeads":12,"conversionRate":16.7,"policiesIssued":2,"joinedDate":"2024-04-01"}
]
```

- [ ] **Step 3: Create `mock-data/policies.json`**

```json
[
  {"id":"p001","customerId":"c001","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"active","issuedDate":"2024-02-01","expiryDate":"2044-02-01","plan":"plus"},
  {"id":"p002","customerId":"c002","type":"term-30","coverageAmount":1000000,"monthlyPremium":47,"status":"active","issuedDate":"2024-02-20","expiryDate":"2054-02-20","plan":"premium"},
  {"id":"p003","customerId":"c003","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"pending","issuedDate":null,"expiryDate":null,"plan":"basic"},
  {"id":"p004","customerId":"c004","type":"term-20","coverageAmount":1000000,"monthlyPremium":47,"status":"active","issuedDate":"2024-03-20","expiryDate":"2044-03-20","plan":"premium"},
  {"id":"p005","customerId":"c005","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"active","issuedDate":"2024-04-08","expiryDate":"2044-04-08","plan":"plus"},
  {"id":"p006","customerId":"c006","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"lapsed","issuedDate":"2024-04-25","expiryDate":"2034-04-25","plan":"basic"},
  {"id":"p007","customerId":"c007","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"pending","issuedDate":null,"expiryDate":null,"plan":"plus"},
  {"id":"p008","customerId":"c008","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"active","issuedDate":"2024-05-30","expiryDate":"2034-05-30","plan":"basic"},
  {"id":"p009","customerId":"c009","type":"term-30","coverageAmount":1000000,"monthlyPremium":47,"status":"active","issuedDate":"2024-06-18","expiryDate":"2054-06-18","plan":"premium"},
  {"id":"p010","customerId":"c010","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"active","issuedDate":"2024-07-05","expiryDate":"2044-07-05","plan":"plus"},
  {"id":"p011","customerId":"c011","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"active","issuedDate":"2024-07-22","expiryDate":"2044-07-22","plan":"plus"},
  {"id":"p012","customerId":"c012","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"active","issuedDate":"2024-08-08","expiryDate":"2034-08-08","plan":"basic"},
  {"id":"p013","customerId":"c013","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"pending","issuedDate":null,"expiryDate":null,"plan":"plus"},
  {"id":"p014","customerId":"c014","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"active","issuedDate":"2024-09-12","expiryDate":"2044-09-12","plan":"plus"},
  {"id":"p015","customerId":"c015","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"lapsed","issuedDate":"2024-09-30","expiryDate":"2034-09-30","plan":"basic"},
  {"id":"p016","customerId":"c016","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"active","issuedDate":"2024-10-17","expiryDate":"2034-10-17","plan":"basic"},
  {"id":"p017","customerId":"c017","type":"term-30","coverageAmount":1000000,"monthlyPremium":47,"status":"active","issuedDate":"2024-11-03","expiryDate":"2054-11-03","plan":"premium"},
  {"id":"p018","customerId":"c018","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"active","issuedDate":"2024-11-20","expiryDate":"2034-11-20","plan":"basic"},
  {"id":"p019","customerId":"c019","type":"term-20","coverageAmount":500000,"monthlyPremium":29,"status":"pending","issuedDate":null,"expiryDate":null,"plan":"plus"},
  {"id":"p020","customerId":"c020","type":"term-10","coverageAmount":250000,"monthlyPremium":18,"status":"active","issuedDate":"2024-12-22","expiryDate":"2034-12-22","plan":"basic"}
]
```

- [ ] **Step 4: Create `mock-data/leads.json`**

```json
[
  {"id":"l001","clientName":"James Carter","coverageAmount":500000,"lastContactDate":"2025-01-10","status":"approved","agentId":"a001","state":"California","age":34},
  {"id":"l002","clientName":"Sarah Mitchell","coverageAmount":1000000,"lastContactDate":"2025-01-15","status":"approved","agentId":"a001","state":"Texas","age":42},
  {"id":"l003","clientName":"Michael Torres","coverageAmount":250000,"lastContactDate":"2025-01-18","status":"in-review","agentId":"a001","state":"Florida","age":28},
  {"id":"l004","clientName":"Emily Chen","coverageAmount":1000000,"lastContactDate":"2025-01-20","status":"contacted","agentId":"a001","state":"New York","age":31},
  {"id":"l005","clientName":"David Williams","coverageAmount":500000,"lastContactDate":"2025-01-22","status":"new","agentId":"a001","state":"Illinois","age":55},
  {"id":"l006","clientName":"Lisa Johnson","coverageAmount":250000,"lastContactDate":"2025-01-23","status":"new","agentId":"a001","state":"Arizona","age":39},
  {"id":"l007","clientName":"Robert Brown","coverageAmount":500000,"lastContactDate":"2025-01-19","status":"in-review","agentId":"a001","state":"Washington","age":47},
  {"id":"l008","clientName":"Jennifer Davis","coverageAmount":250000,"lastContactDate":"2025-01-21","status":"contacted","agentId":"a001","state":"Colorado","age":26},
  {"id":"l009","clientName":"Christopher Wilson","coverageAmount":1000000,"lastContactDate":"2025-01-14","status":"approved","agentId":"a001","state":"Georgia","age":51},
  {"id":"l010","clientName":"Amanda Martinez","coverageAmount":500000,"lastContactDate":"2025-01-24","status":"new","agentId":"a001","state":"Nevada","age":33},
  {"id":"l011","clientName":"Kevin Anderson","coverageAmount":500000,"lastContactDate":"2025-01-17","status":"contacted","agentId":"a001","state":"Michigan","age":44},
  {"id":"l012","clientName":"Michelle Taylor","coverageAmount":250000,"lastContactDate":"2025-01-25","status":"new","agentId":"a001","state":"Oregon","age":29},
  {"id":"l013","clientName":"Brian Thomas","coverageAmount":500000,"lastContactDate":"2025-01-16","status":"in-review","agentId":"a001","state":"Virginia","age":38},
  {"id":"l014","clientName":"Stephanie Jackson","coverageAmount":500000,"lastContactDate":"2025-01-13","status":"approved","agentId":"a001","state":"Minnesota","age":35},
  {"id":"l015","clientName":"Andrew White","coverageAmount":250000,"lastContactDate":"2025-01-26","status":"new","agentId":"a001","state":"Ohio","age":62}
]
```

- [ ] **Step 5: Create `mock-data/applications.json`**

```json
[
  {"id":"app001","customerId":"c001","agentId":"a001","plan":"plus","coverageAmount":500000,"monthlyPremium":29,"status":"approved","submittedDate":"2024-01-28","decidedDate":"2024-02-01"},
  {"id":"app002","customerId":"c002","agentId":"a002","plan":"premium","coverageAmount":1000000,"monthlyPremium":47,"status":"approved","submittedDate":"2024-02-15","decidedDate":"2024-02-20"},
  {"id":"app003","customerId":"c003","agentId":null,"plan":"basic","coverageAmount":250000,"monthlyPremium":18,"status":"under-review","submittedDate":"2025-01-20","decidedDate":null},
  {"id":"app004","customerId":"c004","agentId":"a003","plan":"premium","coverageAmount":1000000,"monthlyPremium":47,"status":"approved","submittedDate":"2024-03-15","decidedDate":"2024-03-20"},
  {"id":"app005","customerId":"c007","agentId":"a001","plan":"plus","coverageAmount":500000,"monthlyPremium":29,"status":"under-review","submittedDate":"2025-01-22","decidedDate":null},
  {"id":"app006","customerId":"c013","agentId":"a002","plan":"plus","coverageAmount":500000,"monthlyPremium":29,"status":"under-review","submittedDate":"2025-01-23","decidedDate":null},
  {"id":"app007","customerId":"c019","agentId":"a001","plan":"plus","coverageAmount":500000,"monthlyPremium":29,"status":"submitted","submittedDate":"2025-01-25","decidedDate":null}
]
```

- [ ] **Step 6: Create `mock-data/analytics.json`**

```json
{
  "monthlyPolicies": [
    {"month":"Aug","policies":45},{"month":"Sep","policies":52},{"month":"Oct","policies":61},
    {"month":"Nov","policies":58},{"month":"Dec","policies":71},{"month":"Jan","policies":89},
    {"month":"Feb","policies":94},{"month":"Mar","policies":103},{"month":"Apr","policies":98},
    {"month":"May","policies":112},{"month":"Jun","policies":127},{"month":"Jul","policies":134}
  ],
  "conversionTrend": [
    {"month":"Feb","rate":28.4},{"month":"Mar","rate":30.1},{"month":"Apr","rate":31.8},
    {"month":"May","rate":33.2},{"month":"Jun","rate":34.9},{"month":"Jul","rate":34.2}
  ],
  "revenueEstimate": [
    {"month":"Feb","revenue":52200},{"month":"Mar","revenue":60276},{"month":"Apr","revenue":57204},
    {"month":"May","revenue":65352},{"month":"Jun","revenue":74079},{"month":"Jul","revenue":78138}
  ],
  "conversionByState": [
    {"state":"CA","rate":38.5},{"state":"TX","rate":34.2},{"state":"FL","rate":29.8},
    {"state":"NY","rate":41.3},{"state":"IL","rate":31.7}
  ]
}
```

- [ ] **Step 7: Commit**

```bash
git add mock-data/ && git commit -m "feat: add all mock data JSON files"
```

---

### Task 4: Global Styles, Brand Config & Theme

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `components/shared/theme-provider.tsx`
- Create: `components/shared/theme-toggle.tsx`

**Interfaces:**
- Produces: Brand color tokens accessible via Tailwind classes (`bg-navy-900`, `text-electric-500`), dark/light mode via `useTheme()`

- [ ] **Step 1: Replace `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050A14', 900: '#0A0F1E', 800: '#0F172A', 700: '#1E293B', 600: '#334155',
        },
        electric: {
          400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

- [ ] **Step 2: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 47% 6%;
    --foreground: 210 40% 98%;
    --card: 222 47% 9%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 6%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;
    --radius: 0.75rem;
  }
  .light {
    --background: 0 0% 100%;
    --foreground: 222 47% 6%;
    --card: 0 0% 98%;
    --card-foreground: 222 47% 6%;
    --primary: 217 91% 50%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 94%;
    --secondary-foreground: 222 47% 6%;
    --muted: 210 40% 94%;
    --muted-foreground: 215 16% 47%;
    --border: 214 32% 88%;
    --input: 214 32% 88%;
    --ring: 217 91% 50%;
  }
}
@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; font-feature-settings: 'rlig' 1, 'calt' 1; }
}
@layer utilities {
  .text-gradient { @apply bg-gradient-to-r from-electric-400 to-electric-600 bg-clip-text text-transparent; }
  .glass-card { @apply bg-white/5 backdrop-blur-sm border border-white/10; }
  .navy-gradient { background: linear-gradient(135deg, #050A14 0%, #0A0F1E 50%, #0F1729 100%); }
  .blue-glow { box-shadow: 0 0 30px rgba(59,130,246,0.3); }
}
```

- [ ] **Step 3: Create `components/shared/theme-provider.tsx`**

```typescript
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

- [ ] **Step 4: Create `components/shared/theme-toggle.tsx`**

```typescript
'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="rounded-full">
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

- [ ] **Step 5: Replace `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/shared/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lifecor — Life Insurance Built For The Modern World',
  description: 'Get covered in minutes with a digital-first experience.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Verify dark navy background at localhost:3000**

```bash
npm run dev
```

Expected: Deep navy background renders on the default page.

- [ ] **Step 7: Commit**

```bash
git add . && git commit -m "feat: configure brand tokens, global styles, and theme system"
```

---

### Task 5: Shared Utilities, Mock AI & Zustand Store

**Files:**
- Create: `lib/utils.ts`
- Create: `lib/formatters.ts`
- Create: `lib/mock-ai.ts`
- Create: `hooks/useDemoSession.ts`
- Create: `hooks/useLeadsPipeline.ts`

**Interfaces:**
- Produces:
  - `cn(...inputs)` → `string`
  - `formatCurrency(n)` → `string`
  - `formatPercent(n)` → `string`
  - `formatDate(s)` → `string`
  - `calculateRiskTier(session)` → `'standard' | 'preferred' | 'ultra-preferred'`
  - `calculateConfidenceScore(session)` → `number`
  - `generateQuoteResult(session)` → `QuoteResult`
  - `getAIRecommendationMessage(session)` → `string`
  - `useDemoSession` Zustand store
  - `useLeadsPipeline` Zustand store

- [ ] **Step 1: Create `lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

- [ ] **Step 2: Create `lib/formatters.ts`**

```typescript
export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatPremium(monthly: number): string {
  return `$${monthly}/mo`
}
```

- [ ] **Step 3: Create `lib/mock-ai.ts`**

```typescript
import type { DTCSession, QuoteResult } from '@/types'

export function calculateRiskTier(session: Partial<DTCSession>): 'standard' | 'preferred' | 'ultra-preferred' {
  let pts = 0
  if (session.smoker) pts += 3
  if (session.existingConditions === 'major') pts += 3
  if (session.existingConditions === 'minor') pts += 1
  if ((session.age ?? 0) > 55) pts += 2
  else if ((session.age ?? 0) > 45) pts += 1
  if (pts >= 4) return 'standard'
  if (pts >= 2) return 'preferred'
  return 'ultra-preferred'
}

export function calculateConfidenceScore(session: Partial<DTCSession>): number {
  const tier = calculateRiskTier(session)
  const base = tier === 'ultra-preferred' ? 96 : tier === 'preferred' ? 91 : 84
  return Math.min(99, Math.max(80, base + Math.floor(Math.random() * 3) - 1))
}

export function getRecommendedPlan(session: Partial<DTCSession>): 'basic' | 'plus' | 'premium' {
  const income = session.annualIncome ?? 0
  const deps = session.dependents ?? 0
  if (income > 120000 || deps >= 3) return 'premium'
  if (income > 60000 || deps >= 1) return 'plus'
  return 'basic'
}

export function generateQuoteResult(session: Partial<DTCSession>): QuoteResult {
  const riskTier = calculateRiskTier(session)
  const confidenceScore = calculateConfidenceScore(session)
  const rec = getRecommendedPlan(session)
  return {
    riskTier,
    confidenceScore,
    eligibilityStatus: 'eligible',
    plans: [
      { name: 'Basic', monthlyPremium: 18, coverageAmount: 250000, recommended: rec === 'basic',
        benefits: ['$250,000 death benefit', '10-year term', 'No medical exam', 'Instant approval'] },
      { name: 'Plus', monthlyPremium: 29, coverageAmount: 500000, recommended: rec === 'plus',
        benefits: ['$500,000 death benefit', '20-year term', 'No medical exam', 'Instant approval', 'Terminal illness rider'] },
      { name: 'Premium', monthlyPremium: 47, coverageAmount: 1000000, recommended: rec === 'premium',
        benefits: ['$1,000,000 death benefit', '30-year term', 'No medical exam', 'Instant approval', 'Terminal illness rider', 'Disability waiver'] },
    ],
  }
}

export function getAIRecommendationMessage(session: Partial<DTCSession>): string {
  const plan = getRecommendedPlan(session)
  const planNames = { basic: 'Basic Protection', plus: 'Plus Protection', premium: 'Premium Protection' }
  const depNote = (session.dependents ?? 0) > 0 ? ` to protect your ${session.dependents} dependent${session.dependents === 1 ? '' : 's'}` : ''
  return `Based on your profile, ${planNames[plan]} provides the best balance of affordability and coverage${depNote}. With a ${calculateRiskTier(session).replace('-', ' ')} risk classification, you qualify for our most competitive rates.`
}
```

- [ ] **Step 4: Create `hooks/useDemoSession.ts`**

```typescript
import { create } from 'zustand'
import type { DTCSession } from '@/types'

interface DemoSessionStore {
  session: Partial<DTCSession>
  setField: <K extends keyof DTCSession>(key: K, value: DTCSession[K]) => void
  resetSession: () => void
}

export const useDemoSession = create<DemoSessionStore>((set) => ({
  session: {},
  setField: (key, value) => set((s) => ({ session: { ...s.session, [key]: value } })),
  resetSession: () => set({ session: {} }),
}))
```

- [ ] **Step 5: Create `hooks/useLeadsPipeline.ts`**

```typescript
import { create } from 'zustand'
import type { Lead, LeadStatus } from '@/types'
import leadsData from '@/mock-data/leads.json'

interface LeadsPipelineStore {
  leads: Lead[]
  moveLeadToStatus: (leadId: string, status: LeadStatus) => void
}

export const useLeadsPipeline = create<LeadsPipelineStore>((set) => ({
  leads: leadsData as Lead[],
  moveLeadToStatus: (leadId, status) =>
    set((s) => ({ leads: s.leads.map(l => l.id === leadId ? { ...l, status } : l) })),
}))
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add lib/ hooks/ && git commit -m "feat: add utilities, mock AI engine, and Zustand stores"
```

---

### Task 6: Landing Page Navbar

**Files:**
- Create: `components/shared/landing-navbar.tsx`

**Interfaces:**
- Produces: `<LandingNavbar />` — sticky, scroll-aware nav with logo, links, theme toggle, CTA

- [ ] **Step 1: Create `components/shared/landing-navbar.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-electric-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Lifecor</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['#how-it-works','#benefits','#partners'].map((href, i) => (
              <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {['How It Works','Benefits','Partners'][i]}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild size="sm" className="bg-electric-600 hover:bg-electric-700 text-white">
              <Link href="/demo">Start Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/shared/ && git commit -m "feat: add landing page navbar"
```

---

### Task 7: Landing Page — All Sections

**Files:**
- Create: `components/landing/hero.tsx`
- Create: `components/landing/problem-section.tsx`
- Create: `components/landing/solution-section.tsx`
- Create: `components/landing/how-it-works-section.tsx`
- Create: `components/landing/benefits-section.tsx`
- Create: `components/landing/partner-benefits-section.tsx`
- Create: `components/landing/cta-section.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Produces: Complete, scrollable landing page at `/`

- [ ] **Step 1: Create `components/landing/hero.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden navy-gradient">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-electric-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/20 border border-electric-600/30 text-electric-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-400 animate-pulse" />
            Now in Beta — Join 10,000+ covered individuals
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Life Insurance Built{' '}
            <span className="text-gradient">For The Modern World</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Get covered in minutes with a digital-first experience designed for consumers and distribution partners.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-electric-600 hover:bg-electric-700 text-white px-8 h-12 text-base font-semibold">
              <Link href="/demo">Start Demo <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 hover:border-white/40 text-white px-8 h-12 text-base">
              <Link href="/partner"><Play className="mr-2 w-4 h-4" />Partner Experience</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[{ value: '3 min', label: 'To get covered' }, { value: '98%', label: 'Digital process' }, { value: '$0', label: 'Paperwork' }].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Create `components/landing/problem-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import { Clock, FileText, HelpCircle } from 'lucide-react'

const problems = [
  { icon: Clock, title: 'Weeks of waiting', description: 'Traditional life insurance takes 4–8 weeks. Medical exams, paperwork, phone calls — all required.' },
  { icon: FileText, title: 'Mountains of paperwork', description: '30+ page applications. Fax machines. Physical signatures. Manual underwriting from the 1980s.' },
  { icon: HelpCircle, title: 'Confusing & opaque', description: 'Hidden fees, complex policy language, and zero transparency into how decisions are made.' },
]

export function ProblemSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Traditional life insurance is <span className="text-red-400">broken</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">People go uninsured because the process is too slow, too confusing, and too painful.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 group hover:border-red-400/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                <p.icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/landing/solution-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import { Zap, Smartphone, Brain } from 'lucide-react'

const items = [
  { icon: Zap, title: 'Fast', value: '3 min', description: 'From application to approval in minutes, not weeks.' },
  { icon: Smartphone, title: 'Digital-First', value: '100%', description: 'Entirely online. No exams, no paperwork, no phone calls.' },
  { icon: Brain, title: 'AI-Powered', value: '94%', description: 'Intelligent underwriting with a 94% average confidence score.' },
]

export function SolutionSection() {
  return (
    <section className="py-24 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Lifecor is <span className="text-gradient">different</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We rebuilt the entire experience from the ground up.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 group hover:border-electric-500/40 transition-all duration-300 text-center">
              <div className="w-14 h-14 rounded-2xl bg-electric-600/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-600/30 transition-colors">
                <item.icon className="w-7 h-7 text-electric-400" />
              </div>
              <div className="text-5xl font-extrabold text-gradient mb-2">{item.value}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/landing/how-it-works-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import { User, Activity, FileCheck, CheckCircle } from 'lucide-react'

const steps = [
  { icon: User, step: '01', title: 'Tell us about yourself', description: 'Share your age, state, and lifestyle details in under 2 minutes.' },
  { icon: Activity, step: '02', title: 'AI analyzes your profile', description: 'Our AI assesses your risk and calculates eligibility instantly.' },
  { icon: FileCheck, step: '03', title: 'Choose your plan', description: 'Review personalized quote options and select coverage that fits.' },
  { icon: CheckCircle, step: '04', title: "You're covered", description: 'Submit and receive approval confirmation in minutes.' },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Four simple steps to complete coverage</p>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-electric-600/50 to-transparent" />
          {steps.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="text-center relative">
              <div className="w-20 h-20 rounded-2xl bg-electric-600/20 border border-electric-600/40 flex items-center justify-center mx-auto mb-6 relative z-10">
                <step.icon className="w-8 h-8 text-electric-400" />
              </div>
              <div className="text-xs font-bold text-electric-500 mb-2">{step.step}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `components/landing/benefits-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import { Shield, Clock, CreditCard, Phone, Award, Lock } from 'lucide-react'

const benefits = [
  { icon: Shield, title: 'No Medical Exam', description: 'Coverage up to $1M — no exams required.' },
  { icon: Clock, title: 'Instant Decisions', description: 'Approved or declined in minutes, not weeks.' },
  { icon: CreditCard, title: 'Transparent Pricing', description: 'Fixed premiums that never change. No hidden fees.' },
  { icon: Phone, title: '100% Digital', description: 'Manage your policy entirely online or via mobile.' },
  { icon: Award, title: 'A-Rated Coverage', description: 'Backed by top-rated insurance carriers.' },
  { icon: Lock, title: 'Bank-Level Security', description: 'Your data is encrypted at every step.' },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Lifecor</h2>
          <p className="text-muted-foreground text-lg">Everything you need, nothing you don't.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 group hover:border-electric-500/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-electric-600/20 flex items-center justify-center mb-4 group-hover:bg-electric-600/30 transition-colors">
                <b.icon className="w-5 h-5 text-electric-400" />
              </div>
              <h3 className="text-base font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create `components/landing/partner-benefits-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Users, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PartnerBenefitsSection() {
  return (
    <section id="partners" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-600/20 border border-electric-600/30 text-electric-400 text-sm font-medium mb-6">For Distribution Partners</div>
            <h2 className="text-4xl font-bold mb-6">Close deals <span className="text-gradient">3x faster</span></h2>
            <p className="text-muted-foreground text-lg mb-8">Give clients the modern insurance experience they expect. Our partner platform streamlines your workflow from lead to policy.</p>
            <div className="space-y-4 mb-8">
              {[
                { icon: TrendingUp, text: '34% average conversion rate — industry leading' },
                { icon: Users, text: 'Manage all your clients in one unified dashboard' },
                { icon: BarChart3, text: 'Real-time analytics on leads, conversions, and revenue' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-electric-600/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-electric-400" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
            <Button asChild className="bg-electric-600 hover:bg-electric-700 text-white">
              <Link href="/partner">Explore Partner Experience</Link>
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="glass-card rounded-2xl p-8 space-y-4">
            {[
              { label: 'Total Leads', value: '247', change: '+12%' },
              { label: 'Conversion Rate', value: '34.2%', change: '+4.1%' },
              { label: 'Policies Issued', value: '61', change: '+8' },
              { label: 'Est. Commission', value: '$18,300', change: '+$2,100' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span className="text-muted-foreground text-sm">{m.label}</span>
                <div className="text-right">
                  <div className="font-semibold">{m.value}</div>
                  <div className="text-green-400 text-xs">{m.change} this month</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Create `components/landing/cta-section.tsx`**

```typescript
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="py-24 bg-navy-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="w-16 h-16 rounded-2xl bg-electric-600/20 border border-electric-600/40 flex items-center justify-center mx-auto mb-8">
            <Shield className="w-8 h-8 text-electric-400" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready to experience the future of life insurance?</h2>
          <p className="text-muted-foreground text-lg mb-10">See how Lifecor makes coverage fast, simple, and accessible.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-electric-600 hover:bg-electric-700 text-white px-8 h-12">
              <Link href="/demo">Start Demo <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white px-8 h-12">
              <Link href="/partner">Partner Experience</Link>
            </Button>
          </div>
        </motion.div>
        <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-electric-400" />© 2025 Lifecor. All rights reserved.</span>
          <div className="flex gap-6">
            {['Privacy','Terms','Contact'].map(l => <Link key={l} href="#" className="hover:text-foreground transition-colors">{l}</Link>)}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 8: Create `app/page.tsx`**

```typescript
import { LandingNavbar } from '@/components/shared/landing-navbar'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { BenefitsSection } from '@/components/landing/benefits-section'
import { PartnerBenefitsSection } from '@/components/landing/partner-benefits-section'
import { CTASection } from '@/components/landing/cta-section'

export default function LandingPage() {
  return (
    <main>
      <LandingNavbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PartnerBenefitsSection />
      <CTASection />
    </main>
  )
}
```

- [ ] **Step 9: Verify full landing page scrolls with all sections**

```bash
npm run dev
```

Open http://localhost:3000. Scroll through all 7 sections. Expected: Entrance animations, navy/blue theme throughout, no console errors.

- [ ] **Step 10: Build check**

```bash
npm run build
```

Expected: Build completes with no TypeScript or ESLint errors.

- [ ] **Step 11: Commit**

```bash
git add . && git commit -m "feat: complete landing page with all 7 sections"
```

---

**Plan 1 complete.** Delivers: runnable dev server, all types, all mock data, brand system, utilities, Zustand stores, and full landing page.

Proceed to Plan 2 (DTC Flow) next.
