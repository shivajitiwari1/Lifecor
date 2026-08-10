# Lifecor — Architecture & Functionality

## Overview

Lifecor is a Next.js 14 life insurance demo platform with three distinct user experiences:
- **Consumer (DTC)** — direct-to-consumer quote and application flow
- **Distribution Partner** — advisor dashboard for managing leads, clients, and policies
- **Admin** — internal operations dashboard for policy, user, and report management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 + CSS custom properties |
| UI Components | shadcn/ui (base-ui primitives) |
| Theme | next-themes (`defaultTheme: "dark"`, `attribute: "class"`) |
| Animation | Framer Motion |
| Charts | Recharts |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Data | Static JSON mock data (`/mock-data/`) |
| Deployment | Vercel |

---

## Project Structure

```
lifecor/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── globals.css                     # Global styles + CSS theme variables
│   ├── layout.tsx                      # Root layout (ThemeProvider)
│   ├── (dtc)/                          # DTC flow (7-step demo)
│   │   └── demo/
│   │       ├── page.tsx                # Step 1 — Welcome / personal info
│   │       ├── lifestyle/page.tsx      # Step 2 — Lifestyle assessment
│   │       ├── eligibility/page.tsx    # Step 3 — AI eligibility check
│   │       ├── quotes/page.tsx         # Step 4 — Plan comparison
│   │       ├── recommendation/page.tsx # Step 5 — AI recommendation
│   │       ├── summary/page.tsx        # Step 6 — Application review
│   │       └── approved/page.tsx       # Step 7 — Approval confirmation
│   ├── (distribution)/                 # Partner portal
│   │   └── partner/
│   │       ├── page.tsx                # Dashboard (KPIs + chart + activity)
│   │       ├── pipeline/page.tsx       # Kanban lead pipeline
│   │       ├── clients/page.tsx        # Client table
│   │       ├── clients/[id]/page.tsx   # Client detail view
│   │       ├── analytics/page.tsx      # Analytics charts (3M/6M/1Y)
│   │       └── quote/page.tsx          # Quote generator
│   └── (admin)/                        # Admin portal
│       └── admin/
│           ├── page.tsx                # System dashboard (KPIs + chart)
│           ├── policies/page.tsx       # Policy management table
│           ├── users/page.tsx          # User management + invite
│           └── reports/page.tsx        # Pre-built report charts
├── components/
│   ├── landing/                        # Landing page sections
│   ├── dtc/                            # DTC flow components
│   ├── distribution/                   # Partner portal components
│   ├── admin/                          # Admin components
│   ├── shared/                         # Cross-app (navbar, theme toggle)
│   └── ui/                             # shadcn/ui base components
├── hooks/
│   └── use-chart-colors.ts             # Theme-aware Recharts color hook
├── lib/
│   ├── chart-colors.ts                 # Light/dark chart color constants
│   └── utils.ts                        # cn() tailwind merge utility
├── mock-data/
│   ├── analytics.json                  # Monthly policies, conversion, revenue
│   ├── agents.json                     # Team member profiles
│   ├── applications.json               # Application records
│   ├── customers.json                  # Customer/client data
│   ├── leads.json                      # Lead pipeline data
│   └── policies.json                   # Policy records
└── types/
    └── index.ts                        # Shared TypeScript types
```

---

## Routing & Layouts

### Route Groups

| Group | Layout | Shared UI |
|---|---|---|
| `(dtc)` | Minimal — step progress bar only | `StepProgress` |
| `(distribution)` | Full sidebar + mobile header | `Sidebar`, `MobileHeader` |
| `(admin)` | Full sidebar + mobile header | `AdminSidebar`, `AdminMobileHeader` |
| Root | Landing navbar | `LandingNavbar`, `ThemeToggle` |

### Navigation Guards
No authentication is implemented — all routes are publicly accessible (demo purposes).

---

## Theme System

### CSS Variable Convention
- **`:root`** — light mode defaults (white background, dark text)
- **`.dark`** — dark mode overrides (navy background, light text)
- Applied via `class="dark"` on `<html>` element by `next-themes`

### Key Color Tokens
| Token | Light | Dark |
|---|---|---|
| `--background` | `#FFFFFF` | `hsl(222 47% 6%)` |
| `--foreground` | `hsl(222 47% 6%)` | `hsl(210 40% 98%)` |
| `--card` | `hsl(0 0% 98%)` | `hsl(222 47% 9%)` |
| `--muted-foreground` | `hsl(215 16% 47%)` | `hsl(215 20% 65%)` |
| `--primary` | `hsl(217 91% 50%)` | `hsl(217 91% 60%)` |

### Custom Color Scales
- **`electric`** — `400/500/600/700` (blue, primary brand action color)
- **`navy`** — `600/700/800/900/950` (dark section backgrounds)

### CSS Utilities
| Class | Purpose |
|---|---|
| `.glass-card` | Translucent card for dark-background sections; adapts to light mode |
| `.theme-card` | Solid card (`bg-card border shadow-sm`) for light-background sections |
| `.text-gradient` | Electric blue gradient text |
| `.navy-gradient` | Dark navy hero background gradient |

### Chart Theming
All Recharts charts use `useChartColors()` hook (from `hooks/use-chart-colors.ts`) to dynamically set grid, axis tick, and tooltip colors based on `resolvedTheme`.

---

## Component Architecture

### Landing Components (`components/landing/`)

| Component | Section Background | Key Behavior |
|---|---|---|
| `hero.tsx` | `navy-gradient` (always dark) | Animated headline, two CTA buttons |
| `problem-section.tsx` | `bg-background` (theme-adaptive) | 3 problem cards with `theme-card` |
| `solution-section.tsx` | `bg-navy-800` (always dark) | 3 metric cards with `glass-card`; explicit `text-white` |
| `how-it-works-section.tsx` | `bg-background` | 4-step process with connecting line |
| `benefits-section.tsx` | `bg-navy-800` (always dark) | 6-benefit grid; explicit `text-white` |
| `partner-benefits-section.tsx` | `bg-background` | Split layout with live stats card |
| `cta-section.tsx` | `bg-navy-800` (always dark) | Final CTA + footer links; explicit `text-white` |

### DTC Components (`components/dtc/`)

| Component | Purpose |
|---|---|
| `step-progress.tsx` | Visual step indicator (1–7) with completion state |
| `toggle-card.tsx` | Selectable option card with radio indicator |
| `quote-card.tsx` | Insurance plan comparison card (Basic/Plus/Premium) |
| `confetti.tsx` | Canvas-based confetti animation on approval |

### Distribution Components (`components/distribution/`)

| Component | Purpose |
|---|---|
| `sidebar.tsx` | Navigation with active state, user profile footer |
| `mobile-header.tsx` | Hamburger menu for mobile |
| `kpi-card.tsx` | Animated metric card with change indicator |
| `area-chart.tsx` | Recharts area chart (policies over time) |
| `kanban-board.tsx` | DnD board orchestrator |
| `kanban-column.tsx` | Droppable column by lead status |
| `lead-card.tsx` | Sortable draggable lead card |

### Admin Components (`components/admin/`)

| Component | Purpose |
|---|---|
| `sidebar.tsx` | Admin nav with primary-color active state |
| `mobile-header.tsx` | Mobile nav for admin |
| `invite-modal.tsx` | User invite dialog with role selection |
| `report-modal.tsx` | Chart dialog (bar or line) with theme-aware colors |

---

## Functionality

### Landing Page
- Responsive navbar with scroll-aware background and theme toggle
- Animated hero with headline, two CTAs (Start Demo, Partner Experience)
- Problem section — 3 pain points of traditional insurance
- Solution section — 3 speed/digital/AI metrics
- How It Works — 4-step visual process flow
- Benefits section — 6 feature cards
- Partner benefits section — live stats preview card
- CTA section with footer links

### DTC Flow (7 Steps)
1. **Welcome** — name, age, state inputs
2. **Lifestyle** — toggle cards for health/activity questions
3. **Eligibility** — loading animation → risk tier display (Low/Medium/High)
4. **Quotes** — 3 plan cards (Basic $250K / Plus $500K / Premium $1M) with monthly premium
5. **Recommendation** — AI-generated recommendation message based on risk + selected plan
6. **Summary** — application review with all entered data
7. **Approved** — confirmation screen with confetti animation and next steps

### Distribution Partner Portal
- **Dashboard** — 4 KPI cards, 12-month area chart, recent activity feed
- **Lead Pipeline** — Kanban board with drag-and-drop (New → Contacted → In Review → Approved)
- **Clients** — searchable/filterable client table with status badges
- **Client Detail** — policy info, contact details, activity timeline
- **Analytics** — bar chart (policies), line chart (conversion %), area chart (revenue) with 3M/6M/1Y tabs
- **Quote Generator** — form to generate quotes for clients

### Admin Portal
- **Dashboard** — 4 system-wide KPIs, 12-month line chart of policy volume
- **Policy Management** — filterable table (20 policies) with status badges, Export CSV button
- **User Management** — agent table with roles, invite modal with email + role selection
- **Reports** — 3 pre-built reports (Loss Ratio, Conversion by Month, Policy Volume) each opening a chart modal

---

## Data Flow

All data is static JSON — no API calls or database connections.

```
mock-data/*.json
    └── imported directly into page/component files
        └── filtered/computed in component scope
            └── passed as props to chart/table/card components
```

### Mock Data Files
| File | Contents |
|---|---|
| `analytics.json` | Monthly policies, conversion trend, revenue, state rates |
| `policies.json` | 20 policy records with status, coverage, premium, customer |
| `agents.json` | 10 agent profiles with roles and performance metrics |
| `applications.json` | Application records with status and timestamps |
| `customers.json` | Customer profiles linked to policies |
| `leads.json` | 12 leads with status for Kanban board |

---

## Key Design Decisions

### Dark sections always use explicit white text
Sections with hardcoded `bg-navy-800` backgrounds use `text-white` / `text-white/60` explicitly, because `text-foreground` adapts to the theme mode (dark in light mode = invisible on dark bg).

### Light sections use CSS variable tokens
Sections with `bg-background` use `text-foreground` / `text-muted-foreground` which automatically adapt — dark text in light mode, light text in dark mode.

### Charts need a hook, not CSS variables
Recharts accepts JavaScript color values, not CSS variables. `useChartColors()` reads `resolvedTheme` from next-themes and returns the appropriate hex/rgba values for grid lines, axis ticks, and tooltips.

### glass-card vs theme-card
- **`glass-card`** — for cards placed on always-dark navy sections (glassmorphism effect)
- **`theme-card`** — for cards placed on `bg-background` sections (adapts cleanly to both modes)
