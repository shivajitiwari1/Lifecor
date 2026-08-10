# Platform Architecture

Lifecor is a modern, digital-first life insurance platform built with Next.js 15 and the App Router. It serves three distinct audiences through dedicated portals: consumers applying for coverage, distribution partners managing their book of business, and administrators overseeing platform operations.

---

## Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server components, file-based routing, Vercel-native |
| Language | TypeScript | Type safety across all layers |
| Styling | Tailwind CSS + CSS custom properties | Utility-first with theme token support |
| UI Primitives | shadcn/ui | Accessible, composable component base |
| Animations | Framer Motion | Smooth, physics-based transitions |
| Charts | Recharts | Composable React chart library |
| Drag & Drop | @dnd-kit | Accessible drag interactions for lead pipeline |
| State | Zustand | Lightweight in-memory session store |
| Theme | next-themes | Dark/light mode with class-based switching |
| Deployment | Vercel | Zero-config CI/CD for Next.js |

---

## Project Structure

```
lifecor/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── globals.css                     # CSS theme variables
│   ├── layout.tsx                      # Root layout (ThemeProvider)
│   ├── (dtc)/demo/                     # Consumer flow — 7 steps
│   │   ├── page.tsx                    # Step 1 — Personal info
│   │   ├── lifestyle/page.tsx          # Step 2 — Lifestyle questions
│   │   ├── eligibility/page.tsx        # Step 3 — Risk assessment
│   │   ├── quotes/page.tsx             # Step 4 — Plan comparison
│   │   ├── recommendation/page.tsx     # Step 5 — AI recommendation
│   │   ├── summary/page.tsx            # Step 6 — Application review
│   │   └── approved/page.tsx           # Step 7 — Confirmation
│   ├── (distribution)/partner/         # Partner portal
│   │   ├── page.tsx                    # Dashboard
│   │   ├── pipeline/page.tsx           # Lead kanban
│   │   ├── clients/page.tsx            # Client list
│   │   ├── clients/[id]/page.tsx       # Client detail
│   │   ├── analytics/page.tsx          # Performance analytics
│   │   └── quote/page.tsx              # Quote generator
│   └── (admin)/admin/                  # Admin portal
│       ├── page.tsx                    # System dashboard
│       ├── policies/page.tsx           # Policy management
│       ├── users/page.tsx              # Team management
│       └── reports/page.tsx            # Reporting
├── components/
│   ├── landing/                        # Marketing page sections
│   ├── dtc/                            # Consumer flow components
│   ├── distribution/                   # Partner portal components
│   ├── admin/                          # Admin components
│   ├── shared/                         # Cross-app components
│   └── ui/                             # shadcn/ui primitives
├── hooks/
│   └── use-chart-colors.ts             # Theme-aware chart color hook
├── lib/
│   ├── mock-ai.ts                      # Risk scoring and quote logic
│   ├── formatters.ts                   # Currency and date formatting
│   └── utils.ts                        # Tailwind class merge utility
├── mock-data/                          # Static JSON datasets
└── types/                              # Shared TypeScript interfaces
```

---

## Routing & Layouts

Next.js route groups isolate each portal's layout without affecting the URL structure.

| Route Group | Layout | Shared UI |
|---|---|---|
| `(dtc)` | Minimal — step progress bar only | `StepProgress` |
| `(distribution)` | Full sidebar + mobile header | `Sidebar`, `MobileHeader` |
| `(admin)` | Full sidebar + mobile header | `AdminSidebar`, `AdminMobileHeader` |
| Root | Landing navbar | `LandingNavbar`, `ThemeToggle` |

All routes are publicly accessible — no authentication is required in this demo configuration.

---

## Theme System

### Token Architecture

The theme uses CSS custom properties scoped to `:root` (light) and `.dark` (dark), toggled via `next-themes`.

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--background` | `#FFFFFF` | `hsl(222 47% 6%)` |
| `--foreground` | `hsl(222 47% 6%)` | `hsl(210 40% 98%)` |
| `--card` | `hsl(0 0% 98%)` | `hsl(222 47% 9%)` |
| `--muted-foreground` | `hsl(215 16% 47%)` | `hsl(215 20% 65%)` |
| `--primary` | `hsl(217 91% 50%)` | `hsl(217 91% 60%)` |

### Custom Color Scales

- **`electric`** — 400/500/600/700 — primary brand blue, used for CTAs and accents
- **`navy`** — 600/700/800/900/950 — dark section backgrounds throughout the landing page

### Utility Classes

| Class | Purpose |
|---|---|
| `.glass-card` | Translucent card for always-dark navy sections; adapts to light mode |
| `.theme-card` | Solid card (`bg-card border shadow-sm`) for theme-adaptive sections |
| `.text-gradient` | Electric blue gradient applied to headline text |
| `.navy-gradient` | Dark navy radial gradient for the hero background |

### Chart Color Hook

Recharts requires JavaScript color values, not CSS variables. `useChartColors()` reads `resolvedTheme` from next-themes and returns the appropriate hex/rgba values for grid lines, axis labels, and tooltips.

---

## Component Architecture

### Landing Page Components

| Component | Background | Key Behaviour |
|---|---|---|
| `hero.tsx` | `navy-gradient` (always dark) | Animated headline, two CTA buttons |
| `problem-section.tsx` | `bg-background` | 3 problem cards using `theme-card` |
| `solution-section.tsx` | `bg-navy-800` (always dark) | 3 metric cards with `glass-card`; explicit `text-white` |
| `how-it-works-section.tsx` | `bg-background` | 4-step process with connecting line |
| `benefits-section.tsx` | `bg-navy-800` (always dark) | 6-benefit grid; explicit `text-white` |
| `partner-benefits-section.tsx` | `bg-background` | Split layout with live stats card |
| `cta-section.tsx` | `bg-navy-800` (always dark) | Final CTA and footer links |

### Consumer Flow Components

| Component | Purpose |
|---|---|
| `step-progress.tsx` | Visual step indicator (1–7) with completion state |
| `toggle-card.tsx` | Selectable option tile with radio behaviour |
| `quote-card.tsx` | Plan comparison card (Basic / Plus / Premium) |
| `confetti.tsx` | Canvas-based confetti celebration on approval |

### Partner Portal Components

| Component | Purpose |
|---|---|
| `sidebar.tsx` | Navigation with active state and user profile footer |
| `mobile-header.tsx` | Hamburger menu for mobile viewports |
| `kpi-card.tsx` | Metric card with change indicator and trend colour |
| `area-chart.tsx` | 12-month area chart for policy volume |
| `kanban-board.tsx` | DnD board with column orchestration |
| `kanban-column.tsx` | Droppable column per lead status |
| `lead-card.tsx` | Draggable lead card |

### Admin Components

| Component | Purpose |
|---|---|
| `sidebar.tsx` | Admin navigation with primary-colour active state |
| `invite-modal.tsx` | User invite dialog with role selection |
| `report-modal.tsx` | Chart modal (bar or line) with theme-aware colours |

---

## Data Layer

All data is served from static JSON files. No API calls or database connections exist.

```
mock-data/*.json
    └── imported directly into page/component files
        └── filtered and computed in component scope
            └── passed as props to chart/table/card components
```

### Data Files

| File | Contents |
|---|---|
| `analytics.json` | Monthly policies, conversion rates, revenue estimates |
| `policies.json` | 20 policy records — status, coverage, premium, customer |
| `agents.json` | 10 agent profiles with roles and performance metrics |
| `applications.json` | Application records with status and timestamps |
| `customers.json` | Customer profiles linked to policies |
| `leads.json` | 12 leads with status for the Kanban board |

---

## Key Design Decisions

### Always-dark sections use explicit text colours
Sections with hardcoded `bg-navy-800` backgrounds use `text-white` and `text-white/60` explicitly. Using `text-foreground` in these sections would invert the text colour in light mode, making it invisible against the dark background.

### Theme-adaptive sections use CSS variable tokens
Sections with `bg-background` use `text-foreground` and `text-muted-foreground`, which automatically adapt — dark text in light mode, light text in dark mode.

### Charts require a hook, not CSS variables
Recharts processes colour values in JavaScript at render time. `useChartColors()` solves this by reading `resolvedTheme` and returning appropriate hex values for grid lines, tick labels, and tooltips, keeping charts theme-consistent.

### `glass-card` vs `theme-card`
- **`glass-card`** — used inside always-dark navy sections (glassmorphism with `backdrop-blur`)
- **`theme-card`** — used inside `bg-background` sections (adapts cleanly to both light and dark mode)
