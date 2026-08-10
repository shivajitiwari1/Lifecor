# Lifecor Demo Platform — Step-by-Step Functionality

> **What this site does right now.** Everything runs on mock data — no real backend, no database. The goal is a polished, investor-ready demo.

---

## 1. Landing Page (`/`)

The entry point of the site. Visitors see a full marketing page with:

1. **Navbar** — Logo, theme toggle (dark/light), links to "Start Demo" and "Partner Experience"
2. **Hero Section**
   - Headline: *"Life Insurance Built For The Modern World"*
   - Two CTA buttons:
     - **Start Demo** → goes to `/demo` (consumer flow)
     - **Partner Experience** → goes to `/partner` (agent/broker flow)
   - Quick stats: *3 min to get covered · 98% Digital · $0 Paperwork*
3. **Problem Section** — Side-by-side: old insurance pain points vs. Lifecor advantages
4. **Solution Section** — Feature highlights with icons
5. **How It Works** — Visual 3-step walkthrough
6. **Consumer Benefits** — Value props for end users
7. **Partner Benefits** — Value props for agents/brokers
8. **Final CTA Section** — Repeats action buttons at bottom

---

## 2. Consumer Flow — Direct-to-Consumer (DTC) (`/demo`)

A 7-step guided application. A visual progress bar shows which step the user is on. State is stored in memory (Zustand) as the user moves forward.

---

### Step 1 — Welcome (`/demo`)

User fills in basic info:

| Field | Type | Rules |
|-------|------|-------|
| Name | Text | Min 2 characters |
| Age | Number | 18–75 |
| State | Dropdown | All 50 US states |

- Validated with Zod before allowing next step
- Data saved to session store

---

### Step 2 — Lifestyle Assessment (`/demo/lifestyle`)

4 toggle-based questions. A progress ring (0/4 → 4/4) tracks completion. All 4 must be answered to continue.

| Question | Options |
|----------|---------|
| Smoker? | Yes / No |
| Health Conditions | None / Minor / Major |
| Annual Income | Under $50K / $50K–$100K / $100K–$200K / Over $200K |
| Dependents | 0 / 1 / 2 / 3+ |

- Clicking a card selects it and highlights it visually
- Answers saved to session store

---

### Step 3 — Eligibility Engine (`/demo/eligibility`)

**Phase 1 — Loading (3 seconds):**

Shows animated status messages in sequence:
1. "Analyzing your profile..."
2. "Checking risk factors..."
3. "Calculating coverage options..."

**Phase 2 — Results:**

Mock AI calculates a risk score using this logic:
- Smoking → +3 points
- Major conditions → +3 points
- Minor conditions → +1 point
- Age > 55 → +2 points
- Age > 45 → +1 point

**Risk Tiers:**
| Points | Tier | Badge Color |
|--------|------|-------------|
| 0–1 | Ultra-Preferred | Green |
| 2–3 | Preferred | Blue |
| 4+ | Standard | Amber |

**Confidence Score:**
- Ultra-Preferred: ~96%
- Preferred: ~91%
- Standard: ~84%
- (Small random variance added each time)

Page shows: green checkmark animation, risk tier badge, confidence score bar, eligible coverage range ($250K–$1M)

---

### Step 4 — Instant Quotes (`/demo/quotes`)

Displays 3 plan cards side-by-side:

| Plan | Price | Coverage | Highlights |
|------|-------|----------|------------|
| Basic Protection | $18/mo | $250K | 10-year term, no exam, instant approval |
| Plus Protection | $29/mo | $500K | + Terminal illness rider |
| Premium Protection | $47/mo | $1M | 30-year term, disability waiver |

- AI pre-selects the recommended plan (based on income + dependents)
- User can click any card to select it — selected card glows
- Selection saved to session store

---

### Step 5 — AI Recommendation (`/demo/recommendation`)

Shows a bot message (with sparkle icon) that is dynamically generated from the user's profile:

> *"Based on your profile, Premium Protection provides the best balance of affordability and coverage to protect your 2 dependents at ultra-preferred rates."*

- Recommended plan card shown below with glow border
- User clicks "Continue" to proceed

---

### Step 6 — Application Summary (`/demo/summary`)

Review page showing everything collected:

- Name, age, state
- Selected plan name
- Coverage amount
- Monthly premium
- Risk classification badge

**Submit button:**
- Shows "Submitting Application..." spinner for 1.8 seconds
- Then navigates to approval page

---

### Step 7 — Approval (`/demo/approved`)

Celebration screen:
- **Confetti animation** (4 seconds)
- Large green checkmark
- *"[Name], you're Approved!"*
- Next steps timeline:
  1. ✅ Welcome Email Sent
  2. ⏳ Policy Documents (24 hours)
  3. ⏳ Coverage Starts (Immediate)
- Button: **Explore Partner Experience** → `/partner`

---

## 3. Distribution Partner Flow (`/partner`)

For insurance agents and brokers. Has a sidebar navigation with 4 sections.

---

### Dashboard (`/partner`)

Overview of the agent's book of business:

**4 KPI Cards:**
| Metric | Value | Trend |
|--------|-------|-------|
| Total Leads | 247 | +12% this month |
| Conversion Rate | 34.2% | +4.1% vs last month |
| Applications | 89 | +7 this week |
| Policies Issued | 61 | +8 this month |

**Charts & Activity:**
- Area chart: Policies issued over the last 12 months
- Recent activity feed (5 items): e.g., "James Carter policy approved · 2 min ago"

---

### Lead Pipeline (`/partner/pipeline`)

Kanban board with 4 columns:

| Column | Meaning |
|--------|---------|
| New | Fresh leads not yet contacted |
| Contacted | Reached out, waiting for response |
| In Review | Application in progress |
| Approved | Deal closed |

- **Drag and drop** leads between columns (powered by dnd-kit)
- Each lead card shows name + contact info
- State resets on page refresh (no persistence)

---

### Clients (`/partner/clients`)

Searchable table of all 20 mock clients:

- **Search bar** — filters by name or state
- **Table columns:** Name, Email, State, Age, Plan, Coverage, Premium, Status
- Status badges: Green (Active) / Amber (Pending) / Red (Lapsed)
- **Click a row** → opens client detail page

---

### Client Detail (`/partner/clients/[id]`)

Full profile for a single client:

- **Profile card:** Avatar, name, age, state, email, phone, client since date
- **Policy card:** Plan, coverage amount, premium, type (term-10/20/30, whole-life), status, issued/expiry dates
- **Notes timeline:** 3 timestamped notes showing agent interaction history

---

### Quote Generator (`/partner/quote`)

Quick tool to generate quotes for a prospect:

1. Agent enters: Age, State, Annual Income
2. Clicks **Generate Quotes** — 2 second loading animation
3. Results appear with:
   - Confidence score
   - 3 plan cards (same as consumer flow)
   - Agent can select a preferred plan

---

### Analytics (`/partner/analytics`)

Three charts with a time range selector (3M / 6M / 1Y):

| Chart | Type | Data |
|-------|------|------|
| Monthly Policies Issued | Bar chart | Count per month |
| Conversion Trend | Line chart | Rate % per month |
| Revenue Estimate | Area chart | Estimated commission $ |

- All data is from `analytics.json` mock file
- Charts adapt to dark/light mode automatically

---

## 4. Admin Dashboard (`/admin`)

System-wide view for platform administrators.

---

### Admin Dashboard (`/admin`)

**4 KPI Cards:**
| Metric | Source |
|--------|--------|
| Total Policies | Count of active policies |
| Annual Premium | Sum of all monthly premiums × 12 |
| Active Agents | Count from agents.json |
| Pending Applications | Count of submitted + under-review |

- Line chart: System-wide policy volume (last 12 months)

---

### Policy Management (`/admin/policies`)

Table of all policies across the platform:

- **Filter dropdown** — All / Active / Pending / Lapsed / Cancelled
- **Table columns:** Policy ID, Customer, Plan, Type, Coverage, Premium, Status, Issued Date
- **Export CSV button** — shows a toast notification (no actual file download)

---

### User Management (`/admin/users`)

Table of all agents/team members:

- **Columns:** Name, Email, Role, Total Leads, Conversion Rate, Policies Issued, Join Date
- **Role badges:** Admin (purple) / Agent (blue) / Viewer (gray)
- **Invite User button** — opens a modal form (submission shows toast, doesn't save)

---

## 5. Site-Wide Features

These work everywhere:

| Feature | How it works |
|---------|-------------|
| **Dark / Light Mode** | Toggle in navbar. Preference stored via next-themes. Default is dark. |
| **Responsive Design** | Mobile sidebar becomes a sheet drawer. Tables scroll horizontally. |
| **Toast Notifications** | Shown for actions like "Export CSV", "Invite sent" (via Sonner) |
| **Form Validation** | Zod schemas validate before any step advances |
| **Animations** | Framer Motion on page transitions, card entrances, progress bars |
| **Skeleton Loaders** | Shown during simulated loading states |

---

## 6. What Is NOT Real

| Feature | Reality |
|---------|---------|
| AI underwriting | Point-based algorithm in `lib/mock-ai.ts` |
| Quote prices | Hardcoded ($18 / $29 / $47) |
| User accounts | No auth — anyone can access any page |
| Data persistence | Resets on refresh (Zustand in-memory only) |
| Email sending | Not implemented |
| CSV export | Shows toast only, no file |
| Invite user | Shows toast only, no save |
| Drag-drop pipeline | Resets on refresh |
| Payment processing | Not present |

---

## 7. Route Map Summary

```
/                           → Landing page
/demo                       → DTC Step 1: Welcome
/demo/lifestyle             → DTC Step 2: Lifestyle questions
/demo/eligibility           → DTC Step 3: Eligibility check
/demo/quotes                → DTC Step 4: Quote selection
/demo/recommendation        → DTC Step 5: AI recommendation
/demo/summary               → DTC Step 6: Application review
/demo/approved              → DTC Step 7: Approval confirmation

/partner                    → Distribution dashboard
/partner/pipeline           → Lead kanban board
/partner/clients            → Client list
/partner/clients/[id]       → Individual client detail
/partner/quote              → Quick quote tool
/partner/analytics          → Charts & analytics

/admin                      → Admin dashboard
/admin/policies             → Policy management table
/admin/users                → User/agent management
/admin/reports              → (Reports page)
```
