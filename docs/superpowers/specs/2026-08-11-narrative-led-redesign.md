# Lifecor — Narrative-Led Full Redesign Spec

**Date:** 2026-08-11  
**Scope:** Consumer flow (Steps 1–7) + Partner portal (Command, Clients, Analytics)  
**Approach:** Narrative-Led — every screen serves a defined emotional beat and visual story

---

## 1. Design Principles

### Emotional Arc (Consumer Flow)
| Step | Emotion | Design Goal |
|---|---|---|
| 1 — Welcome | Curious | Draw them in, no form intimidation |
| 2 — Lifestyle | Engaged | Interactive, conversational, not a questionnaire |
| 3 — Eligibility | Anticipation | Cinematic AI moment |
| 4 — Quotes | Impressed | Coverage as a story, not a price |
| 5 — Recommendation | Confident | Bold, personal, direct |
| 6 — Summary | Relief | Everything makes sense, reassuring |
| 7 — Approval | Excited | Maximum delight |

### Visual Tokens
- **Spacing:** Generous — breathing room signals premium
- **Typography:** Inter, used boldly — large numbers, tight secondary labels
- **Colour:** Electric blue (primary), amber-400 (human moments — wins, approvals), red (problems)
- **Motion:** Directional — forward = right/up, back = left/down. Every transition intentional.
- **Shadcn:** Used as a base only. No default appearances visible in the final output.

---

## 2. Consumer Flow

### Step 1 — Welcome (Full Rebuild)

**Current state:** Generic centered card with three standard form inputs.

**New design:**
- Full-bleed dark navy canvas, single slow-moving gradient orb (electric blue, top-right)
- One question visible at a time — sequential reveal, typeform-style
- Sequence:
  1. *"Before we start — what's your name?"* → user types → Enter confirms
  2. Name animates into a confirmed chip (electric blue pill, top of screen) → *"And how old are you, [Name]?"* slides up
  3. Age confirms → *"Which state do you live in?"* appears with a searchable dropdown
- Progress: thin horizontal line at very top of viewport (replaces step progress bar on this screen)
- Step progress bar moves to a subtle strip at the bottom of all DTC screens
- No visible labels, no form borders. Error states appear as a gentle shake + red text inline.
- Copy tone: conversational, first-person, warm

**Components to build:**
- `ConversationalField` — animated single-field reveal with confirm chip
- `ConfirmedChip` — pill showing locked-in answer

---

### Step 2 — Lifestyle Assessment (Significant Rebuild)

**Current state:** 4 toggle cards shown simultaneously on one screen.

**New design:**
- One question per full screen — slide transition between questions (x-axis, directional)
- Each question: large headline (32px+), two to four large option tiles (min 120px tall)
- Selected tile: floods with electric blue fill, white text, scale-up micro-animation
- Unselected tiles: dim slightly (opacity-60) when a selection is made
- Back/forward navigation: swipe gesture + keyboard arrow support + bottom nav arrows
- Progress ring moves to top-right corner, small (40px)
- Question 4 screens total, each is its own mount/unmount cycle

**Copy upgrades:**
- *"Do you smoke or use tobacco products?"*
- *"Any existing health conditions?"*
- *"What's your approximate annual income?"*
- *"How many people depend on your income?"*

**Components to build:**
- `QuestionScreen` — full-screen single-question layout with slide transition
- Updated `ToggleCard` — larger, full-flood selected state

---

### Step 3 — Eligibility (Minor Upgrade)

**Current state:** Text status messages with a loading bar.

**New design:**
- Replace spinner/text with an **orbital animation**: three concentric rings rotating at different speeds around a central Lifecor shield icon
- Each ring "locks" (stops, glows green) as each analysis phase completes:
  1. Ring 1 locks: *"Profile analysed"*
  2. Ring 2 locks: *"Risk factors checked"*
  3. Ring 3 locks: *"Eligibility confirmed"*
- Results phase unchanged — risk tier badge, confidence score bar, coverage range
- Animation built with Framer Motion `animate` + `transition` on rotation

**Components to build:**
- `OrbitalLoader` — three-ring animated loader with lock-in sequence

---

### Step 4 — Quotes (Full Rebuild)

**Current state:** Three pricing cards side-by-side.

**New design:**
- Single full-width panel, one plan shown at a time
- Navigation: left/right arrows + dot indicators (3 dots for 3 plans)
- Recommended plan shown first and pre-selected
- Each plan panel structure:
  1. **Coverage story headline** (large, top): e.g. *"Protects your family's mortgage and 12 years of living expenses"* — dynamically generated from coverage amount + dependents
  2. **Coverage meter**: animated horizontal bar filling left-to-right showing relative coverage ($250K → $500K → $1M scale)
  3. **What this covers**: 3–4 benefit lines with check icons
  4. **Price** (bottom, smaller): *"$29 / month"* — cost appears last, after the story
  5. **Select this plan** button

- Recommended plan: amber "Recommended for you" badge top-right of panel
- Transition between plans: slide animation (directional)

**Copy for each plan story:**
- Basic ($250K): *"Covers your family's immediate expenses and replaces your income for 5 years."*
- Plus ($500K): *"Protects your mortgage, your children's education, and a decade of household income."*
- Premium ($1M): *"Complete peace of mind — income replacement, education, mortgage, and long-term financial security."*

**Components to build:**
- `CoveragePanel` — full-width single-plan story view
- `CoverageMeter` — animated fill bar
- Updated navigation dots + arrow controls

---

### Step 5 — Recommendation (Minor Polish)

**Current state:** AI message card + recommended plan card, timed reveal. Already strong.

**Changes:**
- Remove "AI Recommendation" heading — redundant, the bot icon communicates this
- Make AI message text larger (text-base → text-lg)
- Bot message copy leads more boldly: *"[Name], this is the right plan for you."* as opening line before the explanation
- Recommended plan card: add one human detail — *"At [risk tier] rates, you're getting our best pricing."*

---

### Step 6 — Summary (Medium Rebuild)

**Current state:** Plain text review of collected data.

**New design:**
- Replace plain list with a **visual policy card** — styled like a physical insurance card
- Card design: dark navy background, Lifecor logo top-left, cardholder name embossed (large, white), coverage amount prominent, plan name, monthly premium
- Card has subtle gradient sheen (CSS shine effect, not interactive)
- Below the card: two confirmation lines — *"Coverage starts immediately"* + *"No medical exam required"*
- Submit button at bottom, unchanged behaviour

**Components to build:**
- `PolicyCard` — physical card visual (CSS-only, no external deps)

---

### Step 7 — Approval (Minor Polish)

**Current state:** Confetti, checkmark, personalised message, next steps. Already strong.

**Changes:**
- Approval circle grows larger (w-32 h-32 → w-40 h-40), takes more visual presence
- Add a secondary line in amber-400 below the headline: *"Your policy is active right now."*
- Next steps section: add a subtle pulsing green dot next to "Welcome Email Sent" to show it's live
- Button copy: *"See how agents use Lifecor →"* (more evocative than "Explore Partner Experience")

---

## 3. Partner Portal

### Navigation Restructure

**Remove:** Dashboard, Lead Pipeline (as separate nav items)  
**Keep/Rename:**
- **Command** (new — merges Dashboard + Pipeline)
- **Clients** (rebuilt)
- **Analytics** (polished)

Sidebar bottom: agent name, avatar, and a live counter — *"3 approved today"* in amber-400.

---

### Command (Full Rebuild)

**Replaces:** Dashboard page + Lead Pipeline page

**Layout:** Two-column split (60/40)

**Left column — Today's Pulse:**
- One dominant number: total policies this month (text-7xl, bold, electric blue)
- Spark line beneath it (last 30 days, mini Recharts LineChart, no axes)
- Sentence below: *"You're tracking 18% ahead of last month."* (dynamically computed)
- Three tight secondary stats in a horizontal strip (no card boxes):
  - Leads in pipeline / Conversion rate / Avg approval time (mock value: "2.4 days")
- No KPI cards — stats are inline text with muted labels

**Right column — Live Pipeline:**
- Horizontal swimlane view (not vertical Kanban columns)
- Four stages flow left → right: New → Contacted → In Review → Approved
- Each stage is a vertical strip with lead cards stacked
- Lead cards: name, days in stage (e.g. *"Day 3"*), one-line status
- **Focus card**: one lead highlighted in amber border — *"Follow up today"* label
- Drag-and-drop preserved internally but visually feels fluid, not like a Kanban board

**Components to build/rebuild:**
- `PulseStat` — dominant number + spark line
- `SwimlanePipeline` — horizontal stage view
- `FocusLeadCard` — amber-highlighted priority lead

---

### Clients (Full Rebuild)

**Current state:** Searchable data table with status badges.

**New design:**
- Card grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each client card:
  - Avatar with coloured status ring (green = active, amber = pending, red = lapsed)
  - Name + plan name
  - Coverage amount (prominent)
  - Last interaction date
  - One contextual action label: *"Renews in 45 days"* / *"Payment overdue"* / *"Eligible for upgrade"*
- Filter tabs at top: **All · Active · Needs Attention · Recent**
- "Needs Attention" tab is pre-highlighted on load — agents see who needs action first
- Search bar stays (name or state)
- **Clicking a card:** opens a slide-over panel (not a new page)
  - Slide-over contains: full client profile, policy details, notes timeline
  - Keeps the client grid visible in background (context preserved)

**Components to build:**
- `ClientCard` — card with status ring avatar
- `ClientSlideOver` — slide-over panel (uses shadcn Sheet)
- Updated filter tabs

---

### Analytics (Light Polish)

**Current state:** Bar chart, line chart, area chart with 3M/6M/1Y tabs. Already solid.

**Changes:**
- Add a **"Best Month" callout** above the charts: dynamically computed from `analyticsData.monthlyPolicies` — find the month with the highest count and render *"[Month] [Year] — [N] policies. Your strongest month."* in a small amber-tinted card
- Clean up axis label formatting (already partially done)
- Bar chart cursor fix already shipped
- No structural changes

---

## 4. Motion Design Rules

Applied across all rebuilt screens:

| Pattern | Implementation |
|---|---|
| Page entry | `opacity: 0 → 1`, `y: 20 → 0`, `duration: 0.4s` |
| Step forward | `x: 40 → 0` in, `x: -40 → out` |
| Step backward | `x: -40 → 0` in, `x: 40 → out` |
| Card select | `scale: 1 → 0.98 → 1`, fill transition `200ms` |
| Number reveal | Count-up animation on mount |
| Orbital rings | `rotate: 0 → 360`, different durations per ring (3s, 5s, 8s) |
| Lock-in | `scale: 1.05 → 1`, color transition to green |

---

## 5. Copywriting Rules

- No generic SaaS copy (*"Welcome back"*, *"Here's what's happening today"*)
- Use the user's name wherever stored in session
- Lead with outcomes, not features (*"Protects your mortgage"* not *"$500K coverage"*)
- Numbers are specific (*"12 years"* not *"long-term"*)
- Agent copy focuses on their wins, not their tasks

---

## 6. What Does NOT Change

- Step 3 eligibility results display (risk tier + confidence score) — already premium
- Step 7 confetti animation — already strong
- Landing page hero, problem, solution, how-it-works sections — already match brief
- Bar chart hover fix — already shipped
- Admin portal — out of scope for this redesign

---

## 7. Implementation Order

Suggested sequence to minimise risk and allow early testing:

1. Visual tokens + motion utilities (shared foundation)
2. Step 1 rebuild (ConversationalField)
3. Step 2 rebuild (QuestionScreen)
4. Step 4 rebuild (CoveragePanel)
5. Step 3 orbital loader
6. Step 6 PolicyCard
7. Steps 5 + 7 minor polish
8. Partner Command page
9. Partner Clients rebuild
10. Partner Analytics callout card
