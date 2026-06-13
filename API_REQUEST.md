# API requests — Action Plan & Benchmarks screens

_Generated while implementing the Atlas-direction redesign. Tracks the **only two
screens that still run on frontend mock data**; every other screen is wired to the
existing API._

## TL;DR

The **Action Plan** (`/action-plan`) and **Benchmarks** (`/benchmarks`) screens are fully
built and design-approved, but no backend endpoints exist for them yet. They currently render
illustrative sample data from [`src/data/preview.ts`](src/data/preview.ts) and are labelled
**"Preview · …"** in the topbar until these land.

Two endpoints would replace the mocks entirely. Both are **report-scoped** (derived from a
completed session's scoring), mirroring `GET /reports/:sessionId`.

---

## 1. `GET /reports/:sessionId/action-plan`

Prioritised initiatives derived from the session's dimension scores — what to do next to reach
the next maturity tier.

**Frontend consumer:** [`src/pages/ActionPlan/ActionPlan.tsx`](src/pages/ActionPlan/ActionPlan.tsx)
(currently `ACTION_PLAN_PREVIEW` + `PREVIEW_OVERALL`).

**Suggested response shape:**
```jsonc
{
  "session_id": "uuid",
  "overall_score": 71,            // current overall maturity (0–100); drives the "now → projected" bar
  "summary": {
    "initiatives": 6,             // total recommended initiatives
    "quick_wins": 2,              // count with status "quick-win"
    "est_lift": 14                // projected total points lift if all completed
  },
  "items": [
    {
      "id": "p1",
      "title": "Stand up automated model monitoring",
      "dimension": "Governance & Risk",   // dimension display name (matches report radar labels)
      "impact": "High",                     // "High" | "Medium" | "Low"
      "effort": "Medium",                   // "High" | "Medium" | "Low"
      "weeks": 8,                           // estimated timeframe in weeks
      "status": "recommended",              // "quick-win" | "recommended" | "planned"
      "owner": "Platform / MLOps",          // suggested owning team (nullable)
      "desc": "Deploy drift, bias and performance alerting across all production models.",
      "lift": 9                             // projected points lift for this initiative
    }
    // …
  ]
}
```

**Notes**
- `impact`/`effort`/`status` are closed enums — the UI maps them to colour + dot ramps, so
  please keep the exact string values above.
- The hero renders `overall_score → overall_score + summary.est_lift` as a projected-maturity bar,
  so `est_lift` should equal (or be consistent with) the sum of `items[].lift`.
- `items` is pre-sortable on the client (quick-win → recommended → planned), but returning a
  sensible default order is welcome.

---

## 2. `GET /reports/:sessionId/benchmarks`

The user's per-dimension scores compared against sector peers (average + top quartile).

**Frontend consumer:** [`src/pages/Benchmarks/Benchmarks.tsx`](src/pages/Benchmarks/Benchmarks.tsx)
(currently `BENCHMARKS_PREVIEW`).

**Suggested response shape:**
```jsonc
{
  "session_id": "uuid",
  "sector": "Financial Services",   // peer cohort label
  "peers": 208,                     // number of orgs in the cohort
  "percentile": 82,                 // user's overall percentile within the cohort (0–100)
  "dims": [
    {
      "dimension": "strategy",          // stable id (matches report radar `dimension`)
      "label": "Strategy & Vision",     // display name
      "you": 82,                        // this user's score (0–100)
      "sector": 64,                     // cohort average (0–100)
      "top": 86                         // cohort top-quartile / top-25% threshold (0–100)
    }
    // … one per dimension
  ]
}
```

**Notes**
- `dims` should cover the same dimensions (and ideally the same order) as the session's report
  `radar_data`, so the radar overlay and per-row comparison line up.
- `you` should match the report's per-dimension score for the same session.
- The UI derives "dimensions above average" and the lead/gap callouts from `you` vs `sector`,
  so both must be on the same 0–100 scale.

---

## Cross-links already in place (will activate once data is real)

- **Report → Action plan**: the priority callout button links to `/action-plan`.
- **Report → Benchmarks**: the "Compare to peers" button links to `/benchmarks`.
- **Sidebar**: "Action plan" and "Benchmarks" entries are live.

Until the endpoints exist these routes show the preview sample data. No frontend routing or
layout changes are required when the APIs land — only swapping the mock import in the two page
components for the corresponding query hook.
