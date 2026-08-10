# Lifecor Demo Platform — Design Spec

**Date:** 2026-08-10  
**Status:** Approved  
**Goal:** Investor-ready, visually stunning demo platform for Lifecor — a modern life insurance startup. The platform must communicate the full Lifecor value proposition within 3 minutes of use.

---

## 1. Project Overview

This is a clickable prototype / demo platform, NOT a production insurance system. All data is mocked. No backend required. The platform targets three audiences:

- **Investors** — understand the market opportunity, product vision, and UX quality
- **Distribution Partners** (agents, brokers, advisors) — understand simplicity, conversion improvement, faster sales cycle
- **Insurance Professionals** — understand workflow efficiency and digital transformation

**Success metric:** A visitor understands Lifecor's value proposition within 3 minutes of landing.

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Shadcn UI |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Theme | Dark default, light mode toggle |
| Deployment | Vercel |

---

## 3. Brand Identity

- **Primary background:** Deep Navy `#0A0F1E`
- **Primary accent:** Electric Blue `#2563EB` / `#3B82F6`
- **Text:** White `#FFFFFF` / Slate gray `#94A3B8`
- **Secondary surfaces:** Slate `#1E293B`, `#0F172A`
- **Design inspiration:** Stripe, Mercury, Brex — premium fintech aesthetic
- **Avoid:** Corporate insurance look, Bootstrap, outdated enterprise UI

---

## 4. Architecture — Route Structure

```
app/
├── page.tsx                         ← Landing page
├── layout.tsx                       ← Root layout (theme, fonts)
├── (dtc)/
│   └── demo/
│       ├── page.tsx                 ← Step 1: Welcome
│       ├── lifestyle/page.tsx       ← Step 2: Lifestyle assessment
│       ├── eligibility/page.tsx     ← Step 3: AI eligibility engine
│       ├── quotes/page.tsx          ← Step 4: Instant quotes
│       ├── recommendation/page.tsx  ← Step 5: AI recommendation
│       ├── summary/page.tsx         ← Step 6: Application summary
│       └── approved/page.tsx        ← Step 7: Approval celebration
├── (distribution)/
│   └── partner/
│       ├── page.tsx                 ← Dashboard (KPIs + chart)
│       ├── pipeline/page.tsx        ← Lead pipeline (kanban)
│       ├── clients/page.tsx         ← Client management
│       ├── clients/[id]/page.tsx    ← Client detail
│       ├── quote/page.tsx           ← Quote generator
│       └── analytics/page.tsx       ← Analytics & charts
└── (admin)/
    └── admin/
        ├── page.tsx                 ← Admin dashboard
        ├── policies/page.tsx        ← Policy management
        ├── users/page.tsx           ← User management
        └── reports/page.tsx         ← Reporting
```

---

## 5. Shared Code Structure

```
components/
├── ui/              ← Shadcn primitives (Button, Card, Badge, etc.)
├── shared/          ← Navbar, sidebars, layout shells, StepProgress
└── charts/          ← Recharts wrappers

mock-data/
├── customers.json
├── policies.json
├── quotes.json
├── agents.json
└── applications.json

lib/
├── mock-ai.ts       ← Simulated AI scoring/recommendation logic
├── formatters.ts    ← Currency, date, percentage helpers
└── utils.ts         ← cn() and shared utilities

hooks/
├── useDemoSession.ts ← Zustand store for DTC flow state
└── useTheme.ts

types/
├── customer.ts
├── policy.ts
├── quote.ts
└── agent.ts
```

---

## 6. Landing Page (`/`)

**Hero:** Full-screen section with animated gradient backdrop (navy → blue). Large headline: *"Life Insurance Built For The Modern World."* Two CTA buttons: **Start Demo** (→ `/demo`) and **Partner Experience** (→ `/partner`). Framer Motion entrance animation.

**Scroll Sections (7):**

1. **Problem** — 3 pain-point cards (Slow, Paper-heavy, Confusing) with icons and brief copy
2. **Solution** — Lifecor's 3 pillars with animated counters (e.g. "3 minutes to coverage")
3. **How It Works** — Horizontal step stepper with scroll-triggered Framer Motion reveal
4. **Demo Preview** — Animated mockup of the quote screen (screenshot or live mini-embed)
5. **Key Benefits** — Feature grid (6 cards): Digital-first, Instant quotes, AI-powered, etc.
6. **Partner Benefits** — Split layout for agents vs. brokers with distinct benefit lists
7. **CTA Footer** — Email capture form + "Book a Demo" button

**Global UX:** Sticky nav with logo + "Start Demo" CTA, smooth scroll, skeleton loaders on any async sections.

---

## 7. DTC Flow (`/demo/*`)

Persistent step progress bar at top (steps 1–7 with labels). Each step is a full-screen centered card with Framer Motion page transitions (slide + fade). Zustand store holds all user answers so the Summary step auto-populates.

### Step 1 — Welcome (`/demo`)
Fields: Name, Age, State (dropdown). Animated "Continue" button with arrow icon.

### Step 2 — Lifestyle Assessment (`/demo/lifestyle`)
4 questions presented as large toggle cards:
- Smoker? (Yes / No)
- Existing conditions? (None / Minor / Major)
- Annual income? (slider: $20k–$500k+)
- Dependents? (0 / 1–2 / 3+)

Dynamic progress ring updates as questions are answered.

### Step 3 — Eligibility Engine (`/demo/eligibility`)
- 3-second animated loading sequence: "Analyzing Profile... Checking Risk Factors... Calculating Coverage..."
- Results card reveals with staggered animation:
  - **Eligible** badge (green)
  - **Risk Tier:** Standard / Preferred / Ultra-Preferred
  - **Coverage Range:** $250k–$1M
  - **Confidence Score:** 94% (animated meter)

### Step 4 — Instant Quotes (`/demo/quotes`)
3 pricing cards side-by-side:

| Plan | Monthly Premium | Coverage |
|------|----------------|----------|
| Basic | $18/mo | $250,000 |
| Plus ⭐ | $29/mo | $500,000 |
| Premium | $47/mo | $1,000,000 |

"Most Popular" badge on Plus. Cards have hover lift + blue glow effect on selection.

### Step 5 — Policy Recommendation (`/demo/recommendation`)
AI message bubble animates in: *"Based on your profile, Premium Protection provides the best balance of affordability and coverage for your dependents."* Recommended plan highlighted with a distinct border.

### Step 6 — Application Summary (`/demo/summary`)
Clean review card showing:
- Applicant name, age, state
- Selected plan + monthly premium
- Coverage amount
- Risk tier

"Submit Application" button triggers 1.5s loading state then navigates to approval.

### Step 7 — Approved (`/demo/approved`)
- Confetti/particle burst celebration animation
- Large animated checkmark (green)
- Headline: **"You're Approved"**
- Next steps timeline (Policy issued → Welcome email → Coverage starts)
- "Explore Partner Experience" CTA

---

## 8. Distribution Dashboard (`/partner/*`)

Persistent left sidebar: Lifecor logo, nav links, agent profile at bottom (mock: "Sarah Mitchell, Senior Advisor"). All data from mock JSON files.

### Dashboard (`/partner`)
- 4 KPI cards with animated count-up on mount:
  - Total Leads: 247
  - Conversion Rate: 34.2%
  - Applications: 89
  - Policies Issued: 61
- Area chart (Recharts) — monthly trend, last 6 months
- Recent activity feed (last 5 actions with timestamps)

### Lead Pipeline (`/partner/pipeline`)
Kanban board using `@dnd-kit/core`:
- 4 columns: New | Contacted | In Review | Approved
- Each card: client name, coverage amount, last contact date, avatar
- Drag-and-drop between columns (state managed in Zustand)
- 20 mock leads distributed across columns

### Client Management (`/partner/clients`)
- Searchable + filterable table (filter by status: Active / Pending / Lapsed)
- 20 mock clients with name, policy type, premium, status badge
- Click-through to `/partner/clients/[id]`:
  - Profile section (avatar, contact info)
  - Policy status badge + coverage details
  - Notes section (read-only mock)

### Quote Generator (`/partner/quote`)
Form: Age, State (dropdown), Annual Income, Coverage Amount Needed. Submit → 2s animated "Calculating..." state → 3 quote result cards (same design as DTC Step 4). Results include per-month premium and estimated approval probability.

### Analytics (`/partner/analytics`)
3 Recharts graphs:
- **Monthly Policies Issued** (bar chart, 12 months)
- **Conversion Trend** (line chart, 6 months)
- **Revenue Estimate** (area chart, 6 months, estimated commissions)

Date range selector (3M / 6M / 1Y). All data from mock JSON.

---

## 9. Admin Panel (`/admin/*`)

Same sidebar pattern with slate accent color (visually distinct from partner experience) to signal a different context. Positioned as "future scalability" showcase.

### Admin Dashboard (`/admin`)
System-wide KPIs:
- Total Policies: 1,842
- Total Premium: $2.4M
- Active Agents: 34
- Pending Applications: 127

Recharts overview chart (line, total policies over time).

### Policy Management (`/admin/policies`)
Table with columns: Policy ID, Customer, Type, Premium, Status, Issued Date. Filter by status (Active / Pending / Lapsed). Sortable columns. Export button (mock — shows toast "Export started").

### User Management (`/admin/users`)
Agent/user table with role badges (Admin / Agent / Viewer). "Invite User" button opens a modal (mock form, submits with success toast).

### Reports (`/admin/reports`)
3 pre-built report cards:
- Loss Ratio by Month
- Conversion Rate by State
- Monthly Application Volume

Each card opens a modal with a Recharts chart. Data from mock JSON.

---

## 10. Mock Data

All stored as JSON in `/mock-data/`:

- `customers.json` — 20 customers (name, age, state, income, dependents, smoker status)
- `policies.json` — 20 policies (type, premium, coverage, status, issued date, customer ID)
- `quotes.json` — Quote results keyed by age/income bracket
- `agents.json` — 10 agents (name, role, metrics)
- `applications.json` — 20 applications (status, customer ID, plan, submitted date)

---

## 11. Simulated AI Features

All powered by deterministic mock logic in `/lib/mock-ai.ts`:

- **Risk Assessment:** Score derived from age + smoker status + conditions → maps to Standard / Preferred / Ultra-Preferred
- **Eligibility Score:** Confidence percentage = 100 - (age factor + risk factor)
- **Policy Recommendation:** Simple rule: income < $60k → Basic; $60k–$120k → Plus; > $120k → Premium
- **Smart Underwriting message:** Template string filled with user's name and selected plan

All responses use 1.5–3s simulated delays with loading animations to feel realistic.

---

## 12. Global UX Requirements

- Framer Motion page transitions on every route change (slide + fade, 300ms)
- Skeleton loaders on all data-heavy sections
- Animated count-up on all numeric KPIs
- Hover effects on all interactive cards
- Mobile responsive (all layouts adapt to ≤768px)
- Dark mode default; light mode toggle in navbar
- Lighthouse score target: 90+

---

## 13. Key Design Constraints

- No backend. No database. All data from JSON files and in-memory Zustand state.
- Visual storytelling always wins over technical complexity.
- Every animation must feel premium — no overuse, no jank.
- Avoid Bootstrap, generic UI kits, corporate insurance aesthetic.
