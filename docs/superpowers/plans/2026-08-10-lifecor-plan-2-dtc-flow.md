# Lifecor Plan 2: DTC Demo Flow (7 Steps)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 7-step consumer journey from welcome screen through to animated approval confirmation.

**Architecture:** Route group `(dtc)` with shared layout that renders a step progress bar. Each step is a full-screen centered card. Zustand `useDemoSession` store holds all answers — the summary step reads from it directly.

**Tech Stack:** Next.js App Router, Framer Motion (page transitions + loading animations), React Hook Form + Zod, Zustand, Lucide React, Shadcn UI

## Global Constraints (inherited from Plan 1)

- All types from `types/index.ts`; all utilities from `lib/`; Zustand from `hooks/useDemoSession.ts`
- Framer Motion page transitions on every route change (slide + fade, 300ms)
- Dark mode default, mobile responsive
- No backend — all AI logic from `lib/mock-ai.ts`
- `sleep()` from `lib/utils.ts` for all artificial delays

---

### Task 1: DTC Layout & Step Progress Bar

**Files:**
- Create: `app/(dtc)/layout.tsx`
- Create: `components/dtc/step-progress.tsx`

**Interfaces:**
- Produces: `<DTCLayout>` wrapper with persistent step progress bar at top; `<StepProgress currentStep={n} />` component

- [ ] **Step 1: Create `components/dtc/step-progress.tsx`**

```typescript
'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = [
  { n: 1, label: 'Welcome' },
  { n: 2, label: 'Lifestyle' },
  { n: 3, label: 'Eligibility' },
  { n: 4, label: 'Quotes' },
  { n: 5, label: 'Recommendation' },
  { n: 6, label: 'Summary' },
  { n: 7, label: 'Approved' },
]

export function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-background/95 backdrop-blur border-b border-border px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                  step.n < currentStep && 'bg-electric-600 text-white',
                  step.n === currentStep && 'bg-electric-600 text-white ring-4 ring-electric-600/30',
                  step.n > currentStep && 'bg-muted text-muted-foreground',
                )}>
                  {step.n < currentStep ? <Check className="w-4 h-4" /> : step.n}
                </div>
                <span className={cn(
                  'text-[10px] mt-1 hidden sm:block transition-colors',
                  step.n <= currentStep ? 'text-foreground' : 'text-muted-foreground',
                )}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  'h-px flex-1 mx-2 transition-all duration-500',
                  step.n < currentStep ? 'bg-electric-600' : 'bg-border',
                )} style={{ minWidth: '16px' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/(dtc)/layout.tsx`**

```typescript
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function DTCLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-lg font-bold">Lifecor</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(dtc)/ components/dtc/ && git commit -m "feat: add DTC layout and step progress bar"
```

---

### Task 2: Step 1 — Welcome

**Files:**
- Create: `app/(dtc)/demo/page.tsx`

**Interfaces:**
- Consumes: `useDemoSession.setField`, `StepProgress`
- Produces: Form collecting name, age, state → navigates to `/demo/lifestyle` on submit

- [ ] **Step 1: Create `app/(dtc)/demo/page.tsx`**

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'Must be at least 18').max(75, 'Maximum age is 75'),
  state: z.string().min(1, 'Please select a state'),
})
type FormData = z.infer<typeof schema>

export default function WelcomePage() {
  const router = useRouter()
  const { setField } = useDemoSession()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    setField('name', data.name)
    setField('age', data.age)
    setField('state', data.state)
    router.push('/demo/lifestyle')
  }

  return (
    <>
      <StepProgress currentStep={1} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Lifecor</h1>
            <p className="text-muted-foreground">Let's get you covered in minutes. Tell us a bit about yourself.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Jane Smith" className="mt-1.5" {...register('name')} />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="32" className="mt-1.5" {...register('age')} />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
            </div>
            <div>
              <Label>State</Label>
              <Select onValueChange={(v) => setValue('state', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>}
            </div>
            <Button type="submit" className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-2">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify page at http://localhost:3000/demo**

Expected: Step 1 highlighted in progress bar, form renders, submitting navigates to `/demo/lifestyle` (404 until next task).

- [ ] **Step 3: Commit**

```bash
git add app/(dtc)/demo/ && git commit -m "feat: add DTC step 1 welcome form"
```

---

### Task 3: Step 2 — Lifestyle Assessment

**Files:**
- Create: `app/(dtc)/demo/lifestyle/page.tsx`
- Create: `components/dtc/toggle-card.tsx`

**Interfaces:**
- Consumes: `useDemoSession.setField`, `StepProgress`
- Produces: 4 toggle-card questions, animated progress ring, navigates to `/demo/eligibility`

- [ ] **Step 1: Create `components/dtc/toggle-card.tsx`**

```typescript
'use client'
import { cn } from '@/lib/utils'

interface ToggleCardProps {
  label: string
  selected: boolean
  onClick: () => void
  icon?: React.ReactNode
}

export function ToggleCard({ label, selected, onClick, icon }: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3',
        selected
          ? 'border-electric-500 bg-electric-600/20 text-foreground'
          : 'border-border bg-card hover:border-electric-500/50 text-muted-foreground hover:text-foreground',
      )}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium text-sm">{label}</span>
      <div className={cn(
        'ml-auto w-5 h-5 rounded-full border-2 transition-all',
        selected ? 'border-electric-500 bg-electric-500' : 'border-muted-foreground',
      )}>
        {selected && <div className="w-full h-full rounded-full bg-white scale-50" />}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Create `app/(dtc)/demo/lifestyle/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/dtc/step-progress'
import { ToggleCard } from '@/components/dtc/toggle-card'
import { useDemoSession } from '@/hooks/useDemoSession'
import type { DTCSession } from '@/types'

export default function LifestylePage() {
  const router = useRouter()
  const { setField, session } = useDemoSession()
  const [smoker, setSmoker] = useState<boolean | null>(session.smoker ?? null)
  const [conditions, setConditions] = useState<DTCSession['existingConditions'] | null>(session.existingConditions ?? null)
  const [income, setIncome] = useState<number | null>(session.annualIncome ?? null)
  const [dependents, setDependents] = useState<DTCSession['dependents'] | null>(session.dependents ?? null)

  const answeredCount = [smoker, conditions, income, dependents].filter(v => v !== null).length
  const progress = (answeredCount / 4) * 100
  const canContinue = answeredCount === 4

  const handleContinue = () => {
    setField('smoker', smoker!)
    setField('existingConditions', conditions!)
    setField('annualIncome', income!)
    setField('dependents', dependents!)
    router.push('/demo/eligibility')
  }

  return (
    <>
      <StepProgress currentStep={2} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Lifestyle Assessment</h1>
              <p className="text-muted-foreground text-sm">Answer 4 quick questions to personalize your quotes</p>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="4"
                  className="text-electric-500 transition-all duration-500"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress / 100)}`}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{answeredCount}/4</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2">Do you smoke?</p>
              <div className="grid grid-cols-2 gap-3">
                <ToggleCard label="No, I don't smoke" selected={smoker === false} onClick={() => setSmoker(false)} icon="🚭" />
                <ToggleCard label="Yes, I smoke" selected={smoker === true} onClick={() => setSmoker(true)} icon="🚬" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Existing health conditions?</p>
              <div className="grid grid-cols-3 gap-3">
                {([['none', 'None', '✅'], ['minor', 'Minor', '⚠️'], ['major', 'Major', '🏥']] as const).map(([v, l, icon]) => (
                  <ToggleCard key={v} label={l} icon={icon} selected={conditions === v} onClick={() => setConditions(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Annual household income</p>
              <div className="grid grid-cols-2 gap-3">
                {([[$0, 'Under $50K', '💼'], [60000, '$50K–$100K', '💼'], [120000, '$100K–$200K', '💰'], [250000, 'Over $200K', '🏦']] as const).map(([v, l, icon]) => (
                  <ToggleCard key={v} label={l} icon={icon} selected={income === v} onClick={() => setIncome(v)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Number of dependents</p>
              <div className="grid grid-cols-4 gap-3">
                {([0, 1, 2, 3] as const).map(v => (
                  <ToggleCard key={v} label={v === 3 ? '3+' : String(v)} selected={dependents === v} onClick={() => setDependents(v)} />
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleContinue} disabled={!canContinue} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-8 disabled:opacity-40">
            Continue <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </>
  )
}
```

Note: Replace `$0` in the income array with `0` (the value should be number `0`).

- [ ] **Step 3: Fix the income array value — replace `$0` with `0`**

In the income grid map, the first value must be `0` (number), not `$0`. The label `'Under $50K'` is the display text; the value is `0`.

- [ ] **Step 4: Commit**

```bash
git add app/(dtc)/demo/lifestyle/ components/dtc/toggle-card.tsx && git commit -m "feat: add DTC step 2 lifestyle assessment"
```

---

### Task 4: Step 3 — Eligibility Engine

**Files:**
- Create: `app/(dtc)/demo/eligibility/page.tsx`

**Interfaces:**
- Consumes: `useDemoSession.session`, `generateQuoteResult()`, `calculateRiskTier()`, `calculateConfidenceScore()`
- Produces: Animated 3-phase loading sequence → results card with risk tier badge, confidence score meter, coverage range

- [ ] **Step 1: Create `app/(dtc)/demo/eligibility/page.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Shield, TrendingUp, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'
import { calculateRiskTier, calculateConfidenceScore } from '@/lib/mock-ai'
import { sleep } from '@/lib/utils'

const LOADING_PHASES = [
  'Analyzing your profile...',
  'Checking risk factors...',
  'Calculating coverage options...',
]

const TIER_COLORS = {
  'ultra-preferred': 'bg-green-500/20 text-green-400 border-green-500/40',
  'preferred': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  'standard': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
}

export default function EligibilityPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const [phase, setPhase] = useState<'loading' | 'results'>('loading')
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [riskTier, setRiskTier] = useState<ReturnType<typeof calculateRiskTier>>('preferred')
  const [confidenceScore, setConfidenceScore] = useState(0)

  useEffect(() => {
    const run = async () => {
      for (let i = 0; i < LOADING_PHASES.length; i++) {
        setLoadingIndex(i)
        await sleep(1000)
      }
      const tier = calculateRiskTier(session)
      const score = calculateConfidenceScore(session)
      setRiskTier(tier)
      setConfidenceScore(score)
      setField('riskTier', tier)
      setField('confidenceScore', score)
      setPhase('results')
    }
    run()
  }, [])

  return (
    <>
      <StepProgress currentStep={3} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {phase === 'loading' ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center max-w-md w-full">
              <div className="w-20 h-20 rounded-full border-4 border-electric-600/30 border-t-electric-600 animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
              <AnimatePresence mode="wait">
                <motion.p key={loadingIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  className="text-muted-foreground text-lg">
                  {LOADING_PHASES[loadingIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-6">
                {LOADING_PHASES.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= loadingIndex ? 'bg-electric-500' : 'bg-muted'}`} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-1">You're Eligible!</h1>
                <p className="text-muted-foreground">Great news — here's your profile assessment</p>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-electric-400" />
                    <span className="font-medium">Risk Classification</span>
                  </div>
                  <Badge className={`border ${TIER_COLORS[riskTier]} capitalize`}>
                    {riskTier.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-electric-400" />
                      <span className="font-medium">Confidence Score</span>
                    </div>
                    <span className="text-2xl font-bold text-electric-400">{confidenceScore}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${confidenceScore}%` }} transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-electric-600 to-electric-400 rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-electric-400" />
                    <span className="font-medium">Coverage Range</span>
                  </div>
                  <span className="font-bold text-foreground">$250K – $1M</span>
                </div>
              </div>

              <Button onClick={() => router.push('/demo/quotes')} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold mt-6">
                View Your Quotes <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(dtc)/demo/eligibility/ && git commit -m "feat: add DTC step 3 eligibility engine with AI animation"
```

---

### Task 5: Step 4 — Instant Quotes

**Files:**
- Create: `app/(dtc)/demo/quotes/page.tsx`
- Create: `components/dtc/quote-card.tsx`

**Interfaces:**
- Consumes: `useDemoSession.session`, `generateQuoteResult()`
- Produces: 3 pricing cards (Basic/Plus/Premium), selection stored in Zustand, navigates to `/demo/recommendation`

- [ ] **Step 1: Create `components/dtc/quote-card.tsx`**

```typescript
'use client'
import { Check, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import type { QuotePlan } from '@/types'

interface QuoteCardProps {
  plan: QuotePlan
  selected: boolean
  onSelect: () => void
}

export function QuoteCard({ plan, selected, onSelect }: QuoteCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'relative w-full text-left rounded-2xl border-2 p-6 transition-all duration-300 group',
        selected
          ? 'border-electric-500 bg-electric-600/10 blue-glow'
          : 'border-border bg-card hover:border-electric-500/50 hover:-translate-y-1',
      )}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-electric-600 text-white text-xs font-bold">
          <Star className="w-3 h-3" /> Most Popular
        </div>
      )}
      <div className="mb-4">
        <div className="text-sm font-medium text-muted-foreground mb-1">{plan.name}</div>
        <div className="text-4xl font-extrabold text-foreground">{formatPremium(plan.monthlyPremium)}</div>
        <div className="text-sm text-electric-400 font-medium mt-1">{formatCurrency(plan.coverageAmount)} coverage</div>
      </div>
      <ul className="space-y-2 mb-4">
        {plan.benefits.map(b => (
          <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      <div className={cn(
        'w-full h-10 rounded-xl border-2 flex items-center justify-center text-sm font-semibold transition-all',
        selected
          ? 'border-electric-500 bg-electric-600 text-white'
          : 'border-border text-muted-foreground group-hover:border-electric-500/50',
      )}>
        {selected ? 'Selected' : 'Select Plan'}
      </div>
    </button>
  )
}
```

- [ ] **Step 2: Create `app/(dtc)/demo/quotes/page.tsx`**

```typescript
'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/dtc/step-progress'
import { QuoteCard } from '@/components/dtc/quote-card'
import { useDemoSession } from '@/hooks/useDemoSession'
import { generateQuoteResult } from '@/lib/mock-ai'
import type { DTCSession } from '@/types'

export default function QuotesPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const quoteResult = useMemo(() => generateQuoteResult(session), [session])
  const [selected, setSelected] = useState<DTCSession['selectedPlan']>(session.selectedPlan ?? null)

  const handleContinue = () => {
    if (!selected) return
    setField('selectedPlan', selected)
    router.push('/demo/recommendation')
  }

  const planKey = (name: string): DTCSession['selectedPlan'] =>
    name.toLowerCase() as DTCSession['selectedPlan']

  return (
    <>
      <StepProgress currentStep={4} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Your Personalized Quotes</h1>
            <p className="text-muted-foreground">Choose the plan that works best for you</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {quoteResult.plans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <QuoteCard
                  plan={plan}
                  selected={selected === planKey(plan.name)}
                  onSelect={() => setSelected(planKey(plan.name))}
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={handleContinue} disabled={!selected} className="bg-electric-600 hover:bg-electric-700 text-white h-12 px-10 text-base font-semibold disabled:opacity-40">
              Continue with {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : 'Selected Plan'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/(dtc)/demo/quotes/ components/dtc/quote-card.tsx && git commit -m "feat: add DTC step 4 instant quotes with selection"
```

---

### Task 6: Step 5 — AI Recommendation

**Files:**
- Create: `app/(dtc)/demo/recommendation/page.tsx`

**Interfaces:**
- Consumes: `useDemoSession.session`, `getAIRecommendationMessage()`
- Produces: Animated AI message bubble, highlighted recommended plan, navigates to `/demo/summary`

- [ ] **Step 1: Create `app/(dtc)/demo/recommendation/page.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'
import { getAIRecommendationMessage, getRecommendedPlan } from '@/lib/mock-ai'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import { sleep } from '@/lib/utils'

const PLAN_DETAILS = {
  basic: { coverage: 250000, premium: 18 },
  plus: { coverage: 500000, premium: 29 },
  premium: { coverage: 1000000, premium: 47 },
}

export default function RecommendationPage() {
  const router = useRouter()
  const { session } = useDemoSession()
  const [showMessage, setShowMessage] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const recommended = getRecommendedPlan(session)
  const message = getAIRecommendationMessage(session)
  const details = PLAN_DETAILS[session.selectedPlan ?? recommended]

  useEffect(() => {
    const run = async () => {
      await sleep(400)
      setShowMessage(true)
      await sleep(1200)
      setShowPlan(true)
    }
    run()
  }, [])

  return (
    <>
      <StepProgress currentStep={5} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">AI Recommendation</h1>
            <p className="text-muted-foreground">Based on your profile, here's what we recommend</p>
          </motion.div>

          {showMessage && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5 mb-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-electric-600/20 border border-electric-600/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-electric-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-electric-400">Lifecor AI</span>
                  <Sparkles className="w-3 h-3 text-electric-400" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
              </div>
            </motion.div>
          )}

          {showPlan && (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
              className="rounded-2xl border-2 border-electric-500 bg-electric-600/10 p-6 mb-8 blue-glow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-electric-400 font-medium mb-1">Recommended Plan</div>
                  <div className="text-2xl font-bold capitalize">{session.selectedPlan ?? recommended} Protection</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold">{formatPremium(details.premium)}</div>
                  <div className="text-sm text-muted-foreground">{formatCurrency(details.coverage)} coverage</div>
                </div>
              </div>
            </motion.div>
          )}

          {showPlan && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Button onClick={() => router.push('/demo/summary')} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold">
                Review My Application <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(dtc)/demo/recommendation/ && git commit -m "feat: add DTC step 5 AI recommendation"
```

---

### Task 7: Step 6 — Application Summary

**Files:**
- Create: `app/(dtc)/demo/summary/page.tsx`

**Interfaces:**
- Consumes: `useDemoSession.session` (all fields), `generateQuoteResult()`
- Produces: Full applicant details review card, submit button navigates to `/demo/approved`

- [ ] **Step 1: Create `app/(dtc)/demo/summary/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, MapPin, Shield, DollarSign, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StepProgress } from '@/components/dtc/step-progress'
import { useDemoSession } from '@/hooks/useDemoSession'
import { getRecommendedPlan, generateQuoteResult } from '@/lib/mock-ai'
import { formatCurrency, formatPremium } from '@/lib/formatters'
import { sleep } from '@/lib/utils'

export default function SummaryPage() {
  const router = useRouter()
  const { session } = useDemoSession()
  const [submitting, setSubmitting] = useState(false)
  const plan = session.selectedPlan ?? getRecommendedPlan(session)
  const result = generateQuoteResult(session)
  const planDetails = result.plans.find(p => p.name.toLowerCase() === plan)!

  const handleSubmit = async () => {
    setSubmitting(true)
    await sleep(1800)
    router.push('/demo/approved')
  }

  const rows = [
    { icon: User, label: 'Applicant', value: session.name ?? '—' },
    { icon: User, label: 'Age', value: `${session.age} years old` },
    { icon: MapPin, label: 'State', value: session.state ?? '—' },
    { icon: Shield, label: 'Plan', value: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Protection` },
    { icon: Shield, label: 'Coverage', value: formatCurrency(planDetails?.coverageAmount ?? 0) },
    { icon: DollarSign, label: 'Monthly Premium', value: formatPremium(planDetails?.monthlyPremium ?? 0) },
  ]

  return (
    <>
      <StepProgress currentStep={6} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Review Your Application</h1>
            <p className="text-muted-foreground">Please confirm the details below before submitting</p>
          </div>

          <div className="glass-card rounded-2xl divide-y divide-border mb-8">
            {rows.map(row => (
              <div key={row.label} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <row.icon className="w-4 h-4" />
                  <span className="text-sm">{row.label}</span>
                </div>
                <span className="font-semibold text-sm">{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-sm text-muted-foreground">Risk Classification</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/40 border capitalize">
                {session.riskTier?.replace('-', ' ') ?? 'Preferred'}
              </Badge>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-electric-600 hover:bg-electric-700 text-white h-12 text-base font-semibold">
            {submitting ? (
              <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Submitting Application...</>
            ) : (
              'Submit Application'
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">By submitting you agree to our Terms of Service and Privacy Policy</p>
        </motion.div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/(dtc)/demo/summary/ && git commit -m "feat: add DTC step 6 application summary"
```

---

### Task 8: Step 7 — Approval Celebration

**Files:**
- Create: `app/(dtc)/demo/approved/page.tsx`
- Create: `components/dtc/confetti.tsx`

**Interfaces:**
- Consumes: `useDemoSession.session`
- Produces: Confetti burst, animated checkmark, next steps timeline, partner CTA

- [ ] **Step 1: Create `components/dtc/confetti.tsx`**

```typescript
'use client'
import { useEffect, useRef } from 'react'

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; vr: number }[] = []
    const colors = ['#3B82F6', '#60A5FA', '#2563EB', '#FFFFFF', '#93C5FD']

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 14 - 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      })
    }

    let frame: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.rotation += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5)
        ctx.restore()
        if (p.y > canvas.height) particles.splice(i, 1)
      })
      if (particles.length > 0) frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}
```

- [ ] **Step 2: Create `app/(dtc)/demo/approved/page.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Mail, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/dtc/step-progress'
import { Confetti } from '@/components/dtc/confetti'
import { useDemoSession } from '@/hooks/useDemoSession'

const NEXT_STEPS = [
  { icon: Mail, title: 'Welcome Email Sent', description: 'Check your inbox for policy confirmation', done: true },
  { icon: FileText, title: 'Policy Documents', description: 'Available in your account within 24 hours', done: false },
  { icon: Calendar, title: 'Coverage Starts', description: 'Your coverage begins immediately upon approval', done: false },
]

export default function ApprovedPage() {
  const { session } = useDemoSession()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {showConfetti && <Confetti />}
      <StepProgress currentStep={7} />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="text-4xl font-extrabold mb-2">
              {session.name ? `${session.name.split(' ')[0]}, you're` : "You're"}{' '}
              <span className="text-gradient">Approved!</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10">
              Welcome to Lifecor. Your coverage is now active.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6 text-left mb-8">
            <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">What Happens Next</h3>
            <div className="space-y-4">
              {NEXT_STEPS.map((step, i) => (
                <div key={step.title} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-green-500/20 border border-green-500/40' : 'bg-muted border border-border'}`}>
                    <step.icon className={`w-4 h-4 ${step.done ? 'text-green-400' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <Button asChild className="bg-electric-600 hover:bg-electric-700 text-white h-12 px-8">
              <Link href="/partner">Explore Partner Experience <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Verify full DTC flow end-to-end**

Navigate: `/demo` → fill form → `/demo/lifestyle` → answer all 4 → `/demo/eligibility` → watch animation → `/demo/quotes` → select plan → `/demo/recommendation` → `/demo/summary` → submit → `/demo/approved`.

Expected: Confetti fires, checkmark animates in, next steps timeline shows.

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add app/(dtc)/demo/approved/ components/dtc/confetti.tsx && git commit -m "feat: add DTC step 7 approval celebration with confetti"
```

---

**Plan 2 complete.** Delivers: full 7-step DTC consumer flow with AI simulation, confetti, and shared Zustand session state.

Proceed to Plan 3 (Distribution Dashboard) next.
