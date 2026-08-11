# DTC Flow Narrative Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 7-step consumer application flow from generic forms into a cinematic, premium onboarding experience matching the narrative-led redesign spec.

**Architecture:** Each step is a `'use client'` Next.js page in `app/(dtc)/demo/`. New UI components live in `components/dtc/`. The DTC layout is a server component that renders a new `DtcProgressBar` client component. All session state flows through the `useDemoSession` Zustand store.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand, shadcn/ui (base only)

## Global Constraints

- `'use client'` required at top of every interactive component file
- Import motion from `'framer-motion'` — e.g. `import { motion, AnimatePresence } from 'framer-motion'`
- Zustand hook: `import { useDemoSession } from '@/hooks/useDemoSession'` → destructure `{ session, setField }`
- Available session fields: `name` (string), `age` (number), `state` (string), `smoker` (boolean), `existingConditions` ('none'|'minor'|'major'), `annualIncome` (number), `dependents` (0|1|2|3), `selectedPlan` ('basic'|'plus'|'premium'|null), `riskTier`, `confidenceScore`
- Navigation: `import { useRouter } from 'next/navigation'` then `router.push('/demo/next-step')`
- Tailwind classes only — no inline styles except Framer Motion `animate` values
- Electric blue: `electric-500` / `electric-600`. Amber accent: `amber-400`. Navy bg: `navy-950`
- After Task 1: do NOT import or render `<StepProgress>` inside any page — the layout handles it

---

### Task 1: DTC Layout — Move Step Progress to Fixed Bottom Strip

**Files:**
- Modify: `components/dtc/step-progress.tsx`
- Create: `components/dtc/dtc-progress-bar.tsx`
- Modify: `app/(dtc)/layout.tsx`
- Modify (remove StepProgress): `app/(dtc)/demo/page.tsx`, `app/(dtc)/demo/lifestyle/page.tsx`, `app/(dtc)/demo/eligibility/page.tsx`, `app/(dtc)/demo/quotes/page.tsx`, `app/(dtc)/demo/recommendation/page.tsx`, `app/(dtc)/demo/summary/page.tsx`, `app/(dtc)/demo/approved/page.tsx`

**Interfaces:**
- Produces: `DtcProgressBar` — zero-prop client component, auto-detects step from URL

- [ ] **Step 1: Rewrite StepProgress as a fixed bottom strip**

Replace entire contents of `components/dtc/step-progress.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'

const STEPS = ['Welcome', 'Lifestyle', 'Eligibility', 'Quotes', 'Recommendation', 'Summary', 'Approved']

export function StepProgress({ currentStep }: { currentStep: number }) {
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t border-border/40 px-6 py-3">
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Step {currentStep} of {STEPS.length}
        </span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-electric-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs text-muted-foreground">{STEPS[currentStep - 1]}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create DtcProgressBar — client component that reads URL**

Create `components/dtc/dtc-progress-bar.tsx`:

```tsx
'use client'
import { usePathname } from 'next/navigation'
import { StepProgress } from './step-progress'

const PATH_TO_STEP: Record<string, number> = {
  '/demo': 1,
  '/demo/lifestyle': 2,
  '/demo/eligibility': 3,
  '/demo/quotes': 4,
  '/demo/recommendation': 5,
  '/demo/summary': 6,
  '/demo/approved': 7,
}

export function DtcProgressBar() {
  const pathname = usePathname()
  // Step 1 (/demo) uses its own top progress line — hide the bottom strip there
  if (pathname === '/demo') return null
  const currentStep = PATH_TO_STEP[pathname] ?? 1
  return <StepProgress currentStep={currentStep} />
}
```

- [ ] **Step 3: Update DTC layout to use DtcProgressBar**

Replace entire contents of `app/(dtc)/layout.tsx`:

```tsx
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { DtcProgressBar } from '@/components/dtc/dtc-progress-bar'

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
      <main className="flex-1 flex flex-col pb-16">
        {children}
      </main>
      <DtcProgressBar />
    </div>
  )
}
```

- [ ] **Step 4: Remove StepProgress from all 7 page files**

In each of the following files, delete the import line `import { StepProgress } from '@/components/dtc/step-progress'` and delete the JSX element `<StepProgress currentStep={N} />` (it appears as the first child inside the fragment `<>`):
- `app/(dtc)/demo/page.tsx`
- `app/(dtc)/demo/lifestyle/page.tsx`
- `app/(dtc)/demo/eligibility/page.tsx` — also remove the outer `<>` fragment wrapper, keeping the inner `<div className="flex-1 ...">` as the single return root
- `app/(dtc)/demo/quotes/page.tsx`
- `app/(dtc)/demo/recommendation/page.tsx`
- `app/(dtc)/demo/summary/page.tsx`
- `app/(dtc)/demo/approved/page.tsx`

- [ ] **Step 5: Visual verify**

Run `npx next dev`. Visit `http://localhost:3000/demo`. Confirm:
- No step progress bar at the top of the page
- A thin strip appears fixed at the bottom of the viewport showing "Step 1 of 7 — Welcome" with a filled progress line
- Navigate to `/demo/lifestyle` — strip updates to "Step 2 of 7 — Lifestyle"

- [ ] **Step 6: Commit**

```bash
git add components/dtc/step-progress.tsx components/dtc/dtc-progress-bar.tsx "app/(dtc)/layout.tsx" "app/(dtc)/demo/page.tsx" "app/(dtc)/demo/lifestyle/page.tsx" "app/(dtc)/demo/eligibility/page.tsx" "app/(dtc)/demo/quotes/page.tsx" "app/(dtc)/demo/recommendation/page.tsx" "app/(dtc)/demo/summary/page.tsx" "app/(dtc)/demo/approved/page.tsx"
git commit -m "refactor: move step progress to fixed bottom strip via layout"
```

---

### Task 2: Step 1 — Conversational Welcome (Full Rebuild)

**Files:**
- Create: `components/dtc/confirmed-chip.tsx`
- Create: `components/dtc/conversational-field.tsx`
- Modify: `app/(dtc)/demo/page.tsx`

**Interfaces:**
- Consumes: `setField` from `useDemoSession`
- Produces: On all 3 questions answered, calls `router.push('/demo/lifestyle')`

- [ ] **Step 1: Create ConfirmedChip**

Create `components/dtc/confirmed-chip.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'

export function ConfirmedChip({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-600/20 border border-electric-500/40 text-sm"
    >
      <span className="text-muted-foreground">{label}</span>
      <span className="text-electric-400 font-semibold">{value}</span>
    </motion.div>
  )
}
```

- [ ] **Step 2: Create ConversationalField**

Create `components/dtc/conversational-field.tsx`:

```tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Option { value: string; label: string }

interface ConversationalFieldProps {
  question: string
  placeholder?: string
  type?: 'text' | 'number' | 'select'
  options?: Option[]
  validate?: (val: string) => string | null
  onConfirm: (value: string) => void
  autoFocus?: boolean
}

export function ConversationalField({
  question, placeholder, type = 'text', options, validate, onConfirm, autoFocus,
}: ConversationalFieldProps) {
  const [value, setValue] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 80)
  }, [autoFocus])

  const handleConfirm = () => {
    const err = validate?.(value) ?? (value.trim() ? null : 'Please enter a value')
    if (err) { setError(err); return }
    setError(null)
    onConfirm(value)
  }

  const filteredOptions = (options ?? []).filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg"
    >
      <p className="text-3xl font-semibold text-foreground mb-8 leading-tight">{question}</p>

      {type === 'select' ? (
        <div className="space-y-2">
          <input
            ref={inputRef}
            value={search}
            onChange={e => { setSearch(e.target.value); setValue('') }}
            placeholder="Search states..."
            className="w-full bg-transparent border-b-2 border-border focus:border-electric-500 outline-none text-2xl font-light text-foreground pb-2 transition-colors placeholder:text-muted-foreground/40"
          />
          {search.length > 0 && (
            <div className="max-h-52 overflow-y-auto space-y-1 mt-2">
              {filteredOptions.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => { setValue(opt.value); setSearch(opt.label) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    value === opt.value
                      ? 'bg-electric-600/20 text-electric-400'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          placeholder={placeholder}
          className="w-full bg-transparent border-b-2 border-border focus:border-electric-500 outline-none text-4xl font-light text-foreground pb-3 transition-colors placeholder:text-muted-foreground/30"
        />
      )}

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-red-400 text-sm mt-2"
          >{error}</motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleConfirm}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full bg-electric-600 text-white font-medium hover:bg-electric-500 transition-colors"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}
```

- [ ] **Step 3: Rebuild app/(dtc)/demo/page.tsx**

Replace entire file contents:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useDemoSession } from '@/hooks/useDemoSession'
import { ConversationalField } from '@/components/dtc/conversational-field'
import { ConfirmedChip } from '@/components/dtc/confirmed-chip'

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
]

type Step = 'name' | 'age' | 'state'

export default function DemoPage() {
  const router = useRouter()
  const { setField } = useDemoSession()
  const [step, setStep] = useState<Step>('name')
  const [confirmedName, setConfirmedName] = useState('')
  const [confirmedAge, setConfirmedAge] = useState('')

  const handleName = (val: string) => {
    setField('name', val)
    setConfirmedName(val)
    setStep('age')
  }

  const handleAge = (val: string) => {
    setField('age', parseInt(val))
    setConfirmedAge(val)
    setStep('state')
  }

  const handleState = (val: string) => {
    setField('state', val)
    router.push('/demo/lifestyle')
  }

  const topProgress = step === 'name' ? '10%' : step === 'age' ? '50%' : '90%'

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Orb */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top progress line (replaces bottom strip on this screen only) */}
      <div className="fixed top-14 left-0 right-0 h-0.5 bg-muted/40 z-40">
        <motion.div
          className="h-full bg-electric-500"
          animate={{ width: topProgress }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Confirmed chips */}
      <div className="flex gap-3 mb-12 flex-wrap justify-center min-h-8">
        <AnimatePresence>
          {confirmedName && <ConfirmedChip key="name" label="Name" value={confirmedName} />}
          {confirmedAge && <ConfirmedChip key="age" label="Age" value={confirmedAge} />}
        </AnimatePresence>
      </div>

      {/* Active question */}
      <AnimatePresence mode="wait">
        {step === 'name' && (
          <ConversationalField
            key="name"
            question="Before we start — what's your name?"
            placeholder="Jane Smith"
            validate={v => v.trim().length < 2 ? 'Name must be at least 2 characters' : null}
            onConfirm={handleName}
            autoFocus
          />
        )}
        {step === 'age' && (
          <ConversationalField
            key="age"
            question={`And how old are you, ${confirmedName}?`}
            placeholder="32"
            type="number"
            validate={v => {
              const n = parseInt(v)
              return isNaN(n) || n < 18 || n > 75 ? 'Age must be between 18 and 75' : null
            }}
            onConfirm={handleAge}
            autoFocus
          />
        )}
        {step === 'state' && (
          <ConversationalField
            key="state"
            question="Which state do you live in?"
            type="select"
            options={US_STATES}
            validate={v => !v ? 'Please select a state' : null}
            onConfirm={handleState}
            autoFocus
          />
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 4: Visual verify**

Run `npx next dev`. Visit `http://localhost:3000/demo`. Confirm:
- Dark navy full-screen (no white card, no border)
- Soft blue orb glow in the top-right corner
- Thin progress line just below the header
- Large question text: "Before we start — what's your name?"
- Minimal underline-only input field
- Type a name → press Continue → name chip appears at top, age question slides in
- Age entered → state search dropdown appears
- Select a state → redirects to `/demo/lifestyle`

- [ ] **Step 5: Commit**

```bash
git add components/dtc/confirmed-chip.tsx components/dtc/conversational-field.tsx "app/(dtc)/demo/page.tsx"
git commit -m "feat: rebuild Step 1 as conversational typeform-style welcome"
```

---

### Task 3: Step 2 — Full-Screen Lifestyle Assessment

**Files:**
- Create: `components/dtc/question-screen.tsx`
- Modify: `app/(dtc)/demo/lifestyle/page.tsx`

**Interfaces:**
- Consumes: `setField` from `useDemoSession` — keys: `smoker` (boolean), `existingConditions` ('none'|'minor'|'major'), `annualIncome` (number), `dependents` (0|1|2|3)
- Produces: Navigates to `/demo/eligibility` after all 4 answered

- [ ] **Step 1: Create QuestionScreen component**

Create `components/dtc/question-screen.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'

interface Option {
  value: string | number | boolean
  label: string
  emoji?: string
}

interface QuestionScreenProps {
  question: string
  options: Option[]
  selected: string | number | boolean | null | undefined
  onSelect: (value: string | number | boolean) => void
  direction: 1 | -1
  questionKey: string
}

export function QuestionScreen({ question, options, selected, onSelect, direction, questionKey }: QuestionScreenProps) {
  return (
    <motion.div
      key={questionKey}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full max-w-xl"
    >
      <h2 className="text-3xl font-semibold text-foreground mb-10 leading-tight">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          const isSelected = selected === opt.value
          return (
            <motion.button
              key={String(opt.value)}
              type="button"
              onClick={() => onSelect(opt.value)}
              whileTap={{ scale: 0.97 }}
              className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 min-h-[120px] flex flex-col justify-end ${
                isSelected
                  ? 'bg-electric-600 border-electric-500 text-white'
                  : 'bg-card border-border text-foreground hover:border-electric-500/50'
              }`}
            >
              {opt.emoji && <span className="text-3xl mb-3 block">{opt.emoji}</span>}
              <span className={`font-semibold text-lg leading-tight ${isSelected ? 'text-white' : ''}`}>
                {opt.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Rebuild lifestyle page**

Replace entire contents of `app/(dtc)/demo/lifestyle/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDemoSession } from '@/hooks/useDemoSession'
import { QuestionScreen } from '@/components/dtc/question-screen'

const QUESTIONS = [
  {
    key: 'smoker' as const,
    question: 'Do you smoke or use tobacco products?',
    options: [
      { value: false, label: 'No', emoji: '✅' },
      { value: true, label: 'Yes', emoji: '🚬' },
    ],
  },
  {
    key: 'existingConditions' as const,
    question: 'Any existing health conditions?',
    options: [
      { value: 'none', label: 'None', emoji: '💪' },
      { value: 'minor', label: 'Minor', emoji: '🩺' },
      { value: 'major', label: 'Major', emoji: '🏥' },
    ],
  },
  {
    key: 'annualIncome' as const,
    question: "What's your approximate annual income?",
    options: [
      { value: 40000, label: 'Under $50K', emoji: '💼' },
      { value: 75000, label: '$50K – $100K', emoji: '📈' },
      { value: 150000, label: '$100K – $200K', emoji: '🏦' },
      { value: 250000, label: 'Over $200K', emoji: '🚀' },
    ],
  },
  {
    key: 'dependents' as const,
    question: 'How many people depend on your income?',
    options: [
      { value: 0, label: 'Just me', emoji: '🧍' },
      { value: 1, label: '1 person', emoji: '👫' },
      { value: 2, label: '2 people', emoji: '👨‍👩‍👧' },
      { value: 3, label: '3 or more', emoji: '👨‍👩‍👧‍👦' },
    ],
  },
]

export default function LifestylePage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const current = QUESTIONS[currentIndex]
  const selected = session[current.key]
  const canAdvance = selected !== null && selected !== undefined

  const goNext = () => {
    if (!canAdvance) return
    if (currentIndex === QUESTIONS.length - 1) {
      router.push('/demo/eligibility')
    } else {
      setDirection(1)
      setCurrentIndex(i => i + 1)
    }
  }

  const goBack = () => {
    if (currentIndex === 0) { router.push('/demo'); return }
    setDirection(-1)
    setCurrentIndex(i => i - 1)
  }

  const answeredCount = QUESTIONS.filter(q => session[q.key] !== null && session[q.key] !== undefined).length

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative">
      {/* Progress ring */}
      <div className="fixed top-20 right-6 z-40">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted" />
          <motion.circle
            cx="24" cy="24" r="20" fill="none" strokeWidth="2" className="text-electric-500"
            stroke="currentColor"
            strokeDasharray={String(2 * Math.PI * 20)}
            strokeLinecap="round"
            transform="rotate(-90 24 24)"
            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - answeredCount / QUESTIONS.length) }}
            transition={{ duration: 0.4 }}
          />
          <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor" className="fill-foreground">
            {answeredCount}/{QUESTIONS.length}
          </text>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <QuestionScreen
          key={current.key}
          questionKey={current.key}
          question={current.question}
          options={current.options as { value: string | number | boolean; label: string; emoji?: string }[]}
          selected={selected as string | number | boolean | null | undefined}
          onSelect={val => setField(current.key, val)}
          direction={direction}
        />
      </AnimatePresence>

      {/* Navigation — sits above the fixed bottom strip (pb-20 accounts for the strip) */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-between items-center px-8 max-w-xl mx-auto w-full">
        <button type="button" onClick={goBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <motion.button
          type="button"
          onClick={goNext}
          disabled={!canAdvance}
          whileHover={canAdvance ? { scale: 1.03 } : {}}
          whileTap={canAdvance ? { scale: 0.97 } : {}}
          className={`flex items-center gap-1 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
            canAdvance
              ? 'bg-electric-600 text-white hover:bg-electric-500'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {currentIndex === QUESTIONS.length - 1 ? 'See My Eligibility' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Visual verify**

Visit `/demo/lifestyle`. Confirm:
- Full-screen white/dark background, one large question visible
- 2-column grid of big tiles (120px+ tall) with emoji + label
- Selecting a tile floods it electric blue, others dim slightly
- Progress ring in top-right ticks from 0/4 to 1/4
- Back/Next buttons at bottom above the strip
- Slides to next question on Next — slide direction is rightward
- Going back slides leftward
- After Q4 answered, "See My Eligibility" button → `/demo/eligibility`

- [ ] **Step 4: Commit**

```bash
git add components/dtc/question-screen.tsx "app/(dtc)/demo/lifestyle/page.tsx"
git commit -m "feat: rebuild Step 2 as full-screen per-question lifestyle assessment"
```

---

### Task 4: Step 3 — Orbital Loader for Eligibility

**Files:**
- Create: `components/dtc/orbital-loader.tsx`
- Modify: `app/(dtc)/demo/eligibility/page.tsx`

**Interfaces:**
- Produces: `<OrbitalLoader phase={0|1|2|3} />` — 0 = all spinning, 1/2/3 = rings lock green sequentially

- [ ] **Step 1: Create OrbitalLoader**

Create `components/dtc/orbital-loader.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const RINGS = [
  { size: 88, duration: 3, color: '#3B82F6' },
  { size: 128, duration: 5, color: '#60A5FA' },
  { size: 168, duration: 8, color: '#93C5FD' },
]

const PHASES = ['Profile analysed', 'Risk factors checked', 'Eligibility confirmed']

export function OrbitalLoader({ phase }: { phase: number }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {RINGS.map((ring, i) => {
          const locked = phase > i
          const offset = (180 - ring.size) / 2
          return (
            <div key={i} className="absolute" style={{ top: offset, left: offset, width: ring.size, height: ring.size }}>
              <motion.div
                className="w-full h-full rounded-full border-2"
                style={{
                  borderColor: locked ? '#22C55E' : ring.color,
                  opacity: locked ? 1 : 0.5,
                }}
                animate={locked ? { rotate: 0 } : { rotate: 360 }}
                transition={
                  locked
                    ? { duration: 0.2 }
                    : { duration: ring.duration, repeat: Infinity, ease: 'linear' }
                }
              />
              {locked && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 rounded-full border border-green-500/20"
                />
              )}
            </div>
          )
        })}
        {/* Shield center */}
        <motion.div
          animate={{ scale: phase === 3 ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-14 h-14 rounded-2xl bg-electric-600/20 border border-electric-500/40 flex items-center justify-center"
        >
          <Shield className={`w-7 h-7 transition-colors duration-500 ${phase === 3 ? 'text-green-400' : 'text-electric-400'}`} />
        </motion.div>
      </div>

      {/* Phase labels */}
      <div className="space-y-2 text-center">
        {PHASES.map((label, i) => (
          <motion.p
            key={label}
            animate={{ opacity: phase > i ? 1 : phase === i ? 0.6 : 0.25 }}
            className={`text-sm transition-colors ${phase > i ? 'text-green-400' : 'text-muted-foreground'}`}
          >
            {phase > i ? '✓ ' : '○ '}{label}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update eligibility page to use OrbitalLoader**

In `app/(dtc)/demo/eligibility/page.tsx`:

Add import at the top:
```tsx
import { OrbitalLoader } from '@/components/dtc/orbital-loader'
```

Add new state (alongside existing `phase` and `loadingIndex` states):
```tsx
const [orbitalPhase, setOrbitalPhase] = useState(0)
```

In the existing `useEffect` `run` async function, after the `for` loop that calls `setLoadingIndex`, add these timeouts BEFORE the loop (add them right at the start of `run`):
```tsx
setTimeout(() => setOrbitalPhase(1), 900)
setTimeout(() => setOrbitalPhase(2), 1800)
setTimeout(() => setOrbitalPhase(3), 2700)
```

Replace the loading JSX block (the `<div>` containing the spin circle + `LOADING_PHASES` messages) with:
```tsx
<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
  <OrbitalLoader phase={orbitalPhase} />
</motion.div>
```

- [ ] **Step 3: Visual verify**

Complete the full flow: `/demo` → enter name/age/state → answer 4 lifestyle questions → arrive at `/demo/eligibility`. Watch:
- Three rings spin around shield at different speeds
- At ~0.9s: ring 1 turns green, "Profile analysed" shows ✓
- At ~1.8s: ring 2 turns green, "Risk factors checked" shows ✓
- At ~2.7s: ring 3 turns green + shield briefly scales up
- Results appear (risk tier badge, confidence bar, coverage range) — unchanged

- [ ] **Step 4: Commit**

```bash
git add components/dtc/orbital-loader.tsx "app/(dtc)/demo/eligibility/page.tsx"
git commit -m "feat: replace spinner with orbital ring loader on Step 3 eligibility"
```

---

### Task 5: Step 4 — Coverage Story Panels (Full Rebuild)

**Files:**
- Create: `components/dtc/coverage-meter.tsx`
- Create: `components/dtc/coverage-panel.tsx`
- Modify: `app/(dtc)/demo/quotes/page.tsx`

**Interfaces:**
- Consumes: `generateQuoteResult(session)` from `@/lib/mock-ai` — returns `{ plans: QuotePlan[], recommendedPlan: 'basic'|'plus'|'premium', riskTier: string, confidenceScore: number }`
- `QuotePlan` shape: `{ id: 'basic'|'plus'|'premium', name: string, monthlyPremium: number, coverageAmount: number, benefits: string[] }`
- Note: the summary page uses `result.plans.find(p => p.name.toLowerCase() === plan)` — plan `id` and lowercased `name` are equivalent (e.g. id `'plus'` and name `'Plus Protection'` → lowercase `'plus protection'`). The quotes page now uses `p.id` directly.
- Consumes: `setField('selectedPlan', planId)` from `useDemoSession`
- Produces: Navigates to `/demo/recommendation`

- [ ] **Step 1: Create CoverageMeter**

Create `components/dtc/coverage-meter.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'

interface CoverageMeterProps {
  value: number
  max?: number
  label: string
}

export function CoverageMeter({ value, max = 1000000, label }: CoverageMeterProps) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$250K</span>
        <span className="font-semibold text-electric-400">{label}</span>
        <span>$1M</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-electric-600 to-electric-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create CoveragePanel**

Create `components/dtc/coverage-panel.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { CoverageMeter } from './coverage-meter'

const STORIES: Record<string, string> = {
  basic: "Covers your family's immediate expenses and replaces your income for 5 years.",
  plus: "Protects your mortgage, your children's education, and a decade of household income.",
  premium: 'Complete peace of mind — income replacement, education, mortgage, and long-term financial security.',
}

interface Plan {
  id: string
  name: string
  monthlyPremium: number
  coverageAmount: number
  benefits: string[]
}

interface CoveragePanelProps {
  plan: Plan
  isRecommended: boolean
  isSelected: boolean
  onSelect: () => void
  direction: 1 | -1
}

export function CoveragePanel({ plan, isRecommended, isSelected, onSelect, direction }: CoveragePanelProps) {
  const story = STORIES[plan.id] ?? plan.name
  const coverageLabel =
    plan.coverageAmount >= 1000000
      ? '$1,000,000'
      : `$${(plan.coverageAmount / 1000).toFixed(0)},000`

  return (
    <motion.div
      key={plan.id}
      initial={{ opacity: 0, x: direction * 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -60 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="w-full max-w-2xl"
    >
      {isRecommended && (
        <div className="mb-3 flex justify-end">
          <span className="px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-400 text-xs font-semibold">
            ★ Recommended for you
          </span>
        </div>
      )}

      <div className={`rounded-3xl p-8 border-2 transition-colors ${
        isSelected ? 'border-electric-500 bg-electric-600/5' : 'border-border bg-card'
      }`}>
        <p className="text-2xl font-semibold text-foreground leading-snug mb-8">{story}</p>

        <div className="mb-8">
          <CoverageMeter value={plan.coverageAmount} label={coverageLabel} />
        </div>

        <ul className="space-y-3 mb-8">
          {plan.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm">
              <Check className="w-4 h-4 text-electric-400 mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        <div className="border-t border-border pt-6 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground text-xs mb-1">Monthly premium</p>
            <p className="text-4xl font-bold text-foreground">
              ${plan.monthlyPremium}
              <span className="text-lg text-muted-foreground font-normal">/mo</span>
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onSelect}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              isSelected
                ? 'bg-electric-600 text-white'
                : 'bg-muted text-foreground hover:bg-electric-600/20 hover:text-electric-400'
            }`}
          >
            {isSelected ? 'Selected ✓' : 'Select this plan'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Rebuild quotes page**

Replace entire contents of `app/(dtc)/demo/quotes/page.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDemoSession } from '@/hooks/useDemoSession'
import { generateQuoteResult } from '@/lib/mock-ai'
import { CoveragePanel } from '@/components/dtc/coverage-panel'

export default function QuotesPage() {
  const router = useRouter()
  const { session, setField } = useDemoSession()
  const result = generateQuoteResult(session)
  const plans = result.plans

  const recommendedIndex = Math.max(plans.findIndex(p => p.id === result.recommendedPlan), 0)
  const [currentIndex, setCurrentIndex] = useState(recommendedIndex)
  const [direction, setDirection] = useState<1 | -1>(1)

  const currentPlan = plans[currentIndex]

  const goTo = (index: number) => {
    if (index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  const handleContinue = () => {
    if (!session.selectedPlan) setField('selectedPlan', currentPlan.id as 'basic' | 'plus' | 'premium')
    router.push('/demo/recommendation')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-electric-400 mb-2">Your Coverage Options</p>
          <h1 className="text-3xl font-bold text-foreground">Choose your protection</h1>
        </div>

        <AnimatePresence mode="wait">
          <CoveragePanel
            key={currentPlan.id}
            plan={currentPlan}
            isRecommended={currentPlan.id === result.recommendedPlan}
            isSelected={session.selectedPlan === currentPlan.id}
            onSelect={() => setField('selectedPlan', currentPlan.id as 'basic' | 'plus' | 'premium')}
            direction={direction}
          />
        </AnimatePresence>

        {/* Dot nav */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button type="button" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex gap-2 items-center">
            {plans.map((_, i) => (
              <button key={i} type="button" onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-electric-500 w-6 h-2' : 'bg-muted w-2 h-2'
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === plans.length - 1}
            className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-8 text-center">
          <motion.button
            type="button"
            onClick={handleContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-electric-600 text-white font-semibold hover:bg-electric-500 transition-colors"
          >
            {session.selectedPlan
              ? `Continue with ${plans.find(p => p.id === session.selectedPlan)?.name ?? currentPlan.name}`
              : `Continue with ${currentPlan.name}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 4: Visual verify**

Visit `/demo/quotes`. Confirm:
- One plan shown at a time (not 3 cards)
- Story text at top (e.g. "Protects your mortgage, your children's education...")
- Coverage meter animates to fill
- Benefits list
- Price revealed at bottom after story and benefits
- Amber "Recommended for you" badge on the recommended plan
- Left/right arrows + dot indicators navigate between plans
- Sliding transition when switching plans
- Continue button shows selected plan name

- [ ] **Step 5: Commit**

```bash
git add components/dtc/coverage-meter.tsx components/dtc/coverage-panel.tsx "app/(dtc)/demo/quotes/page.tsx"
git commit -m "feat: rebuild Step 4 as coverage story panels — price revealed after narrative"
```

---

### Task 6: Steps 5, 6, 7 — Polish

**Files:**
- Modify: `app/(dtc)/demo/recommendation/page.tsx`
- Create: `components/dtc/policy-card.tsx`
- Modify: `app/(dtc)/demo/summary/page.tsx`
- Modify: `app/(dtc)/demo/approved/page.tsx`

**Interfaces:**
- Consumes: `useDemoSession` — reads `session.name`, `session.selectedPlan`, `session.riskTier`
- Consumes: `formatCurrency`, `formatPremium` from `@/lib/formatters`

- [ ] **Step 1: Polish recommendation page (Step 5)**

In `app/(dtc)/demo/recommendation/page.tsx`, make these 3 targeted edits:

**Edit 1** — Remove the heading block (lines 43–47: the `<motion.div>` containing h1 "AI Recommendation" and the subheader p tag). Delete those lines entirely.

**Edit 2** — Change the AI message text size. Find `<p className="text-sm text-muted-foreground leading-relaxed">{message}</p>` and change `text-sm` to `text-lg`.

**Edit 3** — After the closing `</motion.div>` of `showPlan` plan card and before the `showPlan && <motion.div>` button block, add:
```tsx
{showPlan && (
  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
    className="text-sm text-muted-foreground text-center mb-4">
    At{' '}
    <span className="text-electric-400 capitalize">{session.riskTier?.replace('-', ' ') ?? 'preferred'} rates</span>
    {' '}— you&apos;re getting our best pricing.
  </motion.p>
)}
```

- [ ] **Step 2: Create PolicyCard**

Create `components/dtc/policy-card.tsx`:

```tsx
'use client'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

interface PolicyCardProps {
  name: string
  planName: string
  coverageAmount: string
  monthlyPremium: string
}

export function PolicyCard({ name, planName, coverageAmount, monthlyPremium }: PolicyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/10 p-8 relative overflow-hidden"
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
      {/* Glow */}
      <div className="absolute -top-8 -right-8 w-36 h-36 bg-electric-600/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-electric-400" />
            <span className="text-white font-bold text-sm tracking-widest">LIFECOR</span>
          </div>
          <span className="text-white/40 text-xs uppercase tracking-wide">{planName}</span>
        </div>

        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Policyholder</p>
          <p className="text-white text-xl font-semibold">{name}</p>
        </div>

        <div className="mb-6">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Coverage Amount</p>
          <p className="text-3xl font-bold text-white">{coverageAmount}</p>
        </div>

        <div className="flex items-end justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Monthly Premium</p>
            <p className="text-electric-400 text-lg font-semibold">{monthlyPremium}</p>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-3 rounded-sm bg-white/20" />
            <div className="w-4 h-3 rounded-sm bg-electric-500/60" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: Update summary page (Step 6)**

In `app/(dtc)/demo/summary/page.tsx`:

Add import:
```tsx
import { PolicyCard } from '@/components/dtc/policy-card'
```

Replace the existing `<div className="glass-card rounded-2xl divide-y divide-border mb-8">` block (the rows list) with:

```tsx
<div className="space-y-6 mb-8">
  <PolicyCard
    name={session.name ?? ''}
    planName={`${plan.charAt(0).toUpperCase() + plan.slice(1)} Protection`}
    coverageAmount={formatCurrency(planDetails?.coverageAmount ?? 0)}
    monthlyPremium={formatPremium(planDetails?.monthlyPremium ?? 0)}
  />
  <div className="flex flex-col gap-2 text-center">
    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
      Coverage starts immediately
    </p>
    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
      No medical exam required
    </p>
  </div>
</div>
```

Also update the existing h1 heading text from `"Review Your Application"` to `"Your policy is ready."` and the subheader from `"Please confirm the details below before submitting"` to `"Take a moment to review, then activate your coverage."`.

- [ ] **Step 4: Update approved page (Step 7)**

In `app/(dtc)/demo/approved/page.tsx`, make these 4 targeted edits:

**Edit 1** — The success circle `<motion.div>`: change `className` from `"w-24 h-24 ..."` to `"w-40 h-40 ..."`. Change the icon inside from `"w-12 h-12"` to `"w-16 h-16"`.

**Edit 2** — After the `<h1>` line and before the closing `</motion.div>` of the main text block, insert:
```tsx
<p className="text-amber-400 font-medium text-lg mt-2">Your policy is active right now.</p>
```

**Edit 3** — In the `NEXT_STEPS` array, the first step item has `done: true`. In the JSX that renders each step, find the block for `step.done` items (the green circle div). Replace the entire `<div className={step.done ? ...}>` icon wrapper for the "done" case with:
```tsx
<div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/20 border border-green-500/40">
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
  </span>
</div>
```

**Edit 4** — Change the Link button text from `"Explore Partner Experience"` to `"See how agents use Lifecor"`.

- [ ] **Step 5: Visual verify**

- `/demo/recommendation`: No "AI Recommendation" heading, message is `text-lg`, pricing note shows below the plan card
- `/demo/summary`: Shows the physical-card-style PolicyCard (dark navy, Lifecor logo, embossed name), two green bullets below, updated heading
- `/demo/approved`: Larger checkmark circle, amber line "Your policy is active right now.", pulsing green dot on email step, updated button

- [ ] **Step 6: Commit**

```bash
git add "app/(dtc)/demo/recommendation/page.tsx" components/dtc/policy-card.tsx "app/(dtc)/demo/summary/page.tsx" "app/(dtc)/demo/approved/page.tsx"
git commit -m "feat: polish Steps 5–7 — bold recommendation, policy card summary, approval delight"
```
