# Backend Endpoint Requests — Red Elk Frontend

Hi! As the frontend engineer, I've been going through the app flow carefully and identified a few endpoints that would unlock important UX improvements we currently can't build without backend support. I've been as specific as possible so you can implement exactly what's needed with no back-and-forth.

Please let me know if any of these are a concern — happy to discuss scoping or alternatives.

---

## Priority 1 — High Impact

### 1. `GET /sessions/:sessionId/answers`

**Why we need this:**
Right now, if a user starts a quiz, closes the browser tab, and comes back, they lose all their progress and have to start from scratch. The quiz answers are sent to the backend one-by-one as the user progresses (via `POST /sessions/:id/answer`), so the backend already has all their saved answers — we just have no way to retrieve them.

**What we'll do with it:**
On quiz page mount, if the session is `in_progress`, we'll fetch saved answers, pre-populate the answers state, and jump the user to the first unanswered question. This turns a frustrating experience into a seamless resume.

**Request:** `GET /sessions/:sessionId/answers`

Auth: Bearer token (user must own the session)

**Response:**
```json
[
  {
    "question_id": "s1",
    "dimension_id": "strategy",
    "answer_value": 3
  },
  {
    "question_id": "s2",
    "dimension_id": "strategy",
    "answer_value": 5
  }
]
```

Returns an empty array `[]` if no answers have been saved yet. Returns `403` if the session belongs to a different user. Returns `404` if the session doesn't exist.

---

### 2. `POST /reports/:sessionId/email`

**Why we need this:**
Users can currently only download their PDF report. Many users will want to share it or refer back to it later. Sending the PDF to their registered email is the simplest way to enable this — no sharing links or external storage needed on the frontend side.

**What we'll do with it:**
A single "Email me this report" button on the Report page. One click → API call → toast confirmation: "Report sent to your email." No request body needed since the authenticated user's email is already known to the backend.

**Request:** `POST /reports/:sessionId/email`

Auth: Bearer token (user must own the session)

No request body.

**Response:**
```json
{ "ok": true }
```

Returns `404` if the session/report doesn't exist. Returns `409` if the PDF hasn't been generated yet (we'll show a "PDF not ready yet" message in that case).

---

## Priority 2 — Medium Impact

### 3. `GET /admin/users/:userId/sessions`

**Why we need this:**
The admin Users table shows all users, but there's no way to drill into a specific user's history. If a user reports a problem, the admin has to cross-reference the All Sessions table manually using truncated IDs — painful and error-prone.

**What we'll do with it:**
Clicking a user's email in the Users table navigates to `/admin/users/:userId` — a detail page showing that user's full session history with links to each report. The frontend page is already built; it just needs this endpoint.

**Request:** `GET /admin/users/:userId/sessions`

Auth: Bearer token (admin only — return `403` for non-admins)

**Response:** Array of the same `AdminSessionOut` shape already returned by `GET /admin/sessions`:
```json
[
  {
    "id": "f47ac10b-...",
    "user_id": "550e8400-...",
    "assessment_id": "a1b2c3d4-...",
    "status": "completed",
    "tier_at_time": "basic",
    "started_at": "2024-01-15T10:30:00Z",
    "completed_at": "2024-01-15T10:45:00Z"
  }
]
```

Returns `404` if the user doesn't exist. Returns an empty array `[]` if the user has no sessions.

---

### 4. `GET /admin/analytics` — Add date range query params

**Why we need this:**
The analytics dashboard currently shows all-time aggregate data. Admins have no way to see trends — e.g., "how are scores changing month over month?" or "how many sessions did we get in the last 30 days?". This is the single most-requested admin feature.

**What we need:**
Add optional `from` and `to` query parameters to the existing `GET /admin/analytics` endpoint. If omitted, behaviour stays exactly as it is today (all-time). No new endpoint needed — just extend the existing one.

**Request:** `GET /admin/analytics?from=2024-01-01T00:00:00Z&to=2024-01-31T23:59:59Z`

Both params are ISO 8601 datetimes. Both optional. If only `from` is provided, return from that date to now. If only `to` is provided, return from the beginning to that date.

**Response:** Exact same shape as the current `AnalyticsOut` response — no change to the response schema, just filtered data.

---

## Priority 3 — Nice to Have

### 5. `GET /admin/sessions/export` — CSV download

**Why we need this:**
Admins often need to analyse session data externally (Excel, BI tools, reporting). Without an export, they have to manually copy data from the paginated table.

**Request:** `GET /admin/sessions/export`

Auth: Bearer token (admin only)

**Response:** `Content-Type: text/csv` with `Content-Disposition: attachment; filename="sessions.csv"`

Suggested columns:
```
session_id, user_id, assessment_id, status, tier_at_time, started_at, completed_at
```

No request body. No pagination — return all sessions.

---

### 6. `GET /admin/users/export` — CSV download

**Why we need this:**
Same rationale as sessions export. Useful for CRM, email campaigns, user analytics.

**Request:** `GET /admin/users/export`

Auth: Bearer token (admin only)

**Response:** `Content-Type: text/csv` with `Content-Disposition: attachment; filename="users.csv"`

Suggested columns:
```
user_id, email, company, tier, role, created_at
```

No request body. No pagination — return all users.

---

## Summary Table

| Priority | Method | Path | Unblocks |
|---|---|---|---|
| High | GET | `/sessions/:sessionId/answers` | Quiz resume after tab close |
| High | POST | `/reports/:sessionId/email` | Email report to user |
| Medium | GET | `/admin/users/:userId/sessions` | Admin user detail page |
| Medium | GET | `/admin/analytics?from=&to=` | Date range filter on analytics |
| Low | GET | `/admin/sessions/export` | CSV download for sessions |
| Low | GET | `/admin/users/export` | CSV download for users |

Thanks so much — let me know if you have questions on any of these!
