# Platform Functionality

Lifecor is a digital-first life insurance platform with three distinct experiences: a consumer application flow, a partner portal for agents and brokers, and an admin dashboard for internal operations. All data is served from static mock datasets — the platform is designed as a high-fidelity demo.

---

## Landing Page

The public-facing homepage introduces Lifecor's value proposition and directs visitors into the appropriate flow.

### Sections

| Section | Purpose |
|---|---|
| Navigation | Logo, theme toggle, links to consumer demo and partner portal |
| Hero | Primary headline, two CTA buttons, three quick-stat callouts |
| Problem | Side-by-side comparison of traditional insurance vs. Lifecor |
| Solution | Three speed, digital, and AI capability highlights |
| How It Works | Four-step visual walkthrough |
| Consumer Benefits | Six feature cards for end users |
| Partner Benefits | Split-layout section with live stats preview |
| Footer CTA | Repeated action buttons and footer links |

### Navigation CTAs

- **Start Demo** → `/demo` (consumer application flow)
- **Partner Experience** → `/partner` (agent and broker portal)

---

## Consumer Application — 7-Step Flow (`/demo`)

A guided, step-by-step application journey. A progress bar persists across all steps. User input is held in an in-memory session store (Zustand) and carried forward through each screen.

---

### Step 1 — Personal Information (`/demo`)

The entry point. Collects basic eligibility data before any personalisation occurs.

| Field | Validation |
|---|---|
| Full Name | Required, minimum 2 characters |
| Age | Required, 18–75 |
| State | Required, selected from all 50 US states |

All fields are validated with Zod before the user can advance.

---

### Step 2 — Lifestyle Assessment (`/demo/lifestyle`)

Four toggle-question cards covering the key risk indicators used in underwriting. A progress ring (0 of 4 → 4 of 4) tracks completion. All four questions must be answered before continuing.

| Question | Options |
|---|---|
| Smoking status | Yes / No |
| Existing health conditions | None / Minor / Major |
| Annual income | Under $50K / $50K–$100K / $100K–$200K / Over $200K |
| Number of dependents | 0 / 1 / 2 / 3 or more |

---

### Step 3 — Eligibility Check (`/demo/eligibility`)

A two-phase screen that simulates real-time underwriting.

**Loading phase (3 seconds)**

Three sequential status messages indicate progress:
1. Analysing your profile
2. Checking risk factors
3. Calculating coverage options

**Results phase**

A point-based algorithm produces a risk classification and confidence score.

| Risk Points | Classification | Badge |
|---|---|---|
| 0–1 | Ultra-Preferred | Green |
| 2–3 | Preferred | Blue |
| 4+ | Standard | Amber |

Confidence scores by tier: Ultra-Preferred ~96%, Preferred ~91%, Standard ~84% — with minor random variance applied per session.

The screen displays: risk classification badge, animated confidence score bar, and eligible coverage range ($250,000–$1,000,000).

---

### Step 4 — Plan Comparison (`/demo/quotes`)

Three plans presented side by side. The AI-recommended plan is highlighted automatically based on the applicant's income and dependents.

| Plan | Monthly Premium | Coverage |
|---|---|---|
| Basic Protection | $18/mo | $250,000 |
| Plus Protection | $29/mo | $500,000 |
| Premium Protection | $47/mo | $1,000,000 |

Selecting a plan highlights the card. The selection is saved to the session store.

---

### Step 5 — AI Recommendation (`/demo/recommendation`)

A dynamically generated recommendation message is displayed, personalised to the applicant's profile:

> *"Based on your profile, Premium Protection provides the best balance of affordability and coverage to protect your 2 dependents at ultra-preferred rates."*

The recommended plan card appears below with a glowing border. The applicant confirms and continues.

---

### Step 6 — Application Summary (`/demo/summary`)

A full review screen before submission.

Displayed information:
- Applicant name, age, and state
- Selected plan and coverage amount
- Monthly premium
- Risk classification badge

The Submit button triggers a 1.8-second loading state ("Submitting Application…") before advancing to confirmation.

---

### Step 7 — Approval Confirmation (`/demo/approved`)

The final screen celebrates the approved application.

- Confetti animation plays for 4 seconds
- Personalised approval message: *"[Name], you're Approved!"*
- Next-steps timeline:
  1. Welcome email sent (complete)
  2. Policy documents ready within 24 hours (pending)
  3. Coverage active immediately (pending)
- CTA: **Explore Partner Experience** → `/partner`

---

## Partner Portal (`/partner`)

For insurance agents and brokers. A sidebar navigation provides access to five sections.

---

### Dashboard (`/partner`)

Headline metrics and recent activity at a glance.

**KPI Cards**

| Metric | Value | Change |
|---|---|---|
| Total Leads | 247 | +12% this month |
| Conversion Rate | 34.2% | +4.1% vs last month |
| Applications | 89 | +7 this week |
| Policies Issued | 61 | +8 this month |

Below the KPIs: a 12-month area chart of policies issued, and a live activity feed showing the five most recent events (e.g. approvals, new leads).

---

### Lead Pipeline (`/partner/pipeline`)

A drag-and-drop Kanban board for tracking leads through the sales process.

| Column | Stage |
|---|---|
| New | Uncontacted leads |
| Contacted | Reached out, awaiting response |
| In Review | Application in progress |
| Approved | Deal closed |

Leads can be dragged between columns. Each card shows the lead's name and contact details. Board state resets on page refresh.

---

### Clients (`/partner/clients`)

A searchable table of all 20 client records. The search bar filters by name or state in real time.

**Table columns:** Name, Email, State, Age, Plan, Coverage, Monthly Premium, Status

Status badges:
- **Active** — green
- **Pending** — amber
- **Lapsed** — red

Clicking a row opens the client detail page.

---

### Client Detail (`/partner/clients/[id]`)

A full profile view for an individual client.

- **Profile card** — Name, age, state, email, phone, client-since date
- **Policy card** — Plan, coverage amount, monthly premium, policy type (term 10/20/30 or whole life), status, issued and expiry dates
- **Notes timeline** — Three timestamped agent interaction notes

---

### Quick Quote (`/partner/quote`)

Generates instant quotes for a prospect without requiring them to go through the consumer flow.

Inputs: Age, State, Annual Income

After a 2-second calculation simulation, results display:
- Confidence score
- Three plan cards with selection capability

---

### Analytics (`/partner/analytics`)

Performance charts with a 3M / 6M / 1Y time range selector.

| Chart | Type | Metric |
|---|---|---|
| Monthly Policies Issued | Bar | Count per month |
| Conversion Rate Trend | Line | Rate % per month |
| Revenue Estimate | Area | Estimated monthly commission |

All charts adapt automatically to light and dark mode.

---

## Admin Dashboard (`/admin`)

System-wide visibility for platform administrators. Sidebar navigation provides access to three sections.

---

### Dashboard (`/admin`)

**KPI Cards**

| Metric | Source |
|---|---|
| Total Policies | Count of active policies |
| Annual Premium Volume | Sum of all monthly premiums × 12 |
| Active Agents | Count from agent records |
| Pending Applications | Submitted + under-review count |

Below the KPIs: a 12-month line chart showing system-wide policy issuance volume.

---

### Policy Management (`/admin/policies`)

A full table of all platform policies with filtering and export.

- **Status filter** — All / Active / Pending / Lapsed / Cancelled
- **Table columns** — Policy ID, Customer, Plan, Type, Coverage, Premium, Status, Issue Date
- **Export CSV** — Triggers a confirmation toast (file download not implemented in demo)

---

### Team Management (`/admin/users`)

Agent and administrator records with role management.

- **Table columns** — Name, Email, Role, Total Leads, Conversion Rate, Policies Issued, Join Date
- **Role badges** — Admin (purple), Agent (blue), Viewer (grey)
- **Invite User** — Opens a modal for entering email and assigning a role; submission triggers a confirmation toast

---

## Site-Wide Features

| Feature | Implementation |
|---|---|
| Dark / Light Mode | Toggle in navbar; default is dark; preference persists via next-themes |
| Responsive Design | Mobile sidebar becomes a sheet drawer; tables scroll horizontally |
| Form Validation | Zod schemas validated client-side before any step advances |
| Toast Notifications | Confirmation messages for export, invite, and submit actions via Sonner |
| Animations | Framer Motion on page transitions, card entrances, and progress elements |
| Loading States | Skeleton loaders and spinner overlays during simulated processing |
