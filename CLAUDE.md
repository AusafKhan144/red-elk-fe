# Red Elk — Frontend Agent Reference

## What this is
React 18 / TypeScript / Vite SPA for the Red Elk AI Maturity Assessment platform.
REST-consuming only — all business logic, scoring, and auth live in the backend API.
Frontend is responsible for: UI, routing, auth token management, and calling the API.

---

## Stack
| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Auth | @supabase/supabase-js v2 — JWT only, no local auth logic |
| HTTP | Axios with request interceptor (attaches Supabase JWT automatically) |
| Server state | TanStack Query v5 (React Query) |
| Forms | React Hook Form |
| Charts | Recharts — RadarChart for reports, BarChart for admin analytics |
| Styling | Tailwind CSS |

---

## Env vars (.env)
```
VITE_API_URL=https://red-elk-be.railway.app
VITE_SUPABASE_URL=https://tjjbiekkcfxsrzwonppd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   ← anon/public key, safe to expose to browser
```

---

## Layouts
Two layouts — never mix them:
- `PublicLayout` — full-width, own nav header (logo + Log In / Get Started). Used for `/` and `/login`.
- `AppLayout` — fixed 240px sidebar + scrollable right content. Used for all authenticated routes.

---

## Folder structure
```
src/
├── lib/
│   ├── supabase.ts         ← createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
│   └── api.ts              ← axios instance + auth interceptor
├── context/
│   └── AuthContext.tsx     ← user profile, isLoading, logout()
├── hooks/
│   ├── useAssessments.ts   ← GET /assessments, GET /assessments/:slug
│   ├── useSession.ts       ← start, answer, submit, list sessions
│   ├── useReport.ts        ← GET /reports/:sessionId + pdf_url polling
│   └── useAdmin.ts         ← analytics, users, sessions, xlsx import
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── AssessmentIntro.tsx
│   ├── Quiz.tsx
│   ├── Report.tsx
│   ├── Sessions.tsx
│   └── admin/
│       ├── AdminAnalytics.tsx
│       ├── AdminSessions.tsx
│       ├── AdminUsers.tsx
│       └── AdminImport.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── AppLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── RadarChart.tsx
│   ├── DimensionCard.tsx
│   ├── RatingInput.tsx        ← 1–5 button group for quiz
│   ├── TierBadge.tsx
│   └── ProtectedRoute.tsx
└── types/
    └── api.ts                 ← TypeScript interfaces matching every API response shape
```

---

## Auth pattern
Supabase JS handles login/signup. After sign-in, attach `session.access_token`
as `Authorization: Bearer <token>` on every API call via the Axios interceptor in `src/lib/api.ts`.

```ts
// src/lib/api.ts
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

After first login: call `POST /auth/register` with `{ company }` to sync the backend user record.
On every app load: call `GET /auth/me` → store result in `AuthContext`.
Subscribe to `supabase.auth.onAuthStateChange` to refresh the stored token automatically.

**User roles:** `"user"` or `"admin"` — comes from `GET /auth/me`.
Gate `/admin/*` routes on `user.role === "admin"`.

---

## Key routes
| Route | Screen | Auth |
|---|---|---|
| / | Landing page | Public |
| /login | Login / Sign Up | Public |
| /dashboard | Assessment list + session history | Authenticated |
| /assessments/:slug | Assessment intro | Authenticated |
| /sessions/:sessionId/quiz | Active quiz | Authenticated |
| /sessions/:sessionId/report | Scored report + radar chart | Authenticated |
| /sessions | Session history | Authenticated |
| /admin | Analytics dashboard | Admin only |
| /admin/sessions | All sessions table | Admin only |
| /admin/users | Users + role management | Admin only |
| /admin/import | XLSX assessment import | Admin only |

---

## API summary
Base URL: `import.meta.env.VITE_API_URL`

| Method | Path | Purpose |
|---|---|---|
| POST | /auth/register | Sync user after first login (body: { company? }) |
| GET | /auth/me | Load current user profile |
| GET | /assessments | List published assessments |
| GET | /assessments/:slug | Assessment + questions (filtered by user tier) |
| POST | /sessions/start | Start session (body: { assessment_slug }) → returns sessionId |
| POST | /sessions/:id/answer | Submit one answer (body: { question_id, dimension_id, answer_value }) |
| POST | /sessions/:id/submit | Complete session → triggers scoring |
| GET | /sessions | Current user's session history |
| GET | /reports/:sessionId | Scored report with radar_data |
| GET | /reports/:sessionId/pdf | Redirect (302) to PDF URL |
| GET | /admin/analytics | Platform stats + dimension averages |
| GET | /admin/sessions | All sessions (admin) |
| GET | /admin/users | All users (admin) |
| PATCH | /admin/users/:id/role | Set role "admin" or "user" |
| POST | /admin/assessments/from-xlsx | Upload XLSX → upsert assessment |

---

## Tier results (for report UI)
| tier_result | Score | Badge colour |
|---|---|---|
| nascent | 0–30 | Red |
| developing | 30–55 | Amber |
| maturing | 55–75 | Blue |
| leading | 75–100 | Green |

---

## Behaviour rules
- Send each quiz answer immediately via `POST /sessions/{id}/answer` — **never batch at submit**.
- Poll `GET /reports/{session_id}` every 3s until `pdf_url` is non-null before enabling the download button. Cap at 30 retries (~90s).
- On 401 from API → `supabase.auth.signOut()` + redirect to `/login`.
- Admin sidebar section hidden when `user.role !== "admin"`.
- Tier gating is enforced server-side — **never re-filter questions in the frontend**.

---

## Claude Instructions
- Use TanStack Query for all data fetching — no raw `useEffect` fetches.
- Keep all API calls in `src/hooks/` — pages call hooks only, never `api` directly.
- Never hardcode the API URL — always use `import.meta.env.VITE_API_URL`.
- The landing page (`/`) uses `PublicLayout`, not `AppLayout`.
- After any route or endpoint change, verify against the Key routes and API summary tables above.
- Do not add Stripe, email, or payment logic — tier upgrades are out of scope.
