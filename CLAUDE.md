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
| Forms | React Hook Form + Zod |
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
- `PublicLayout` — full-width, own nav header (logo + Log In / Get Started). Used for `/`, `/login`, `/reset-password`.
- `AppLayout` — fixed 240px sidebar + scrollable right content. Used for all authenticated routes.

---

## Folder structure
```
src/
├── lib/
│   ├── supabase.ts              ← createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
│   └── api.ts                  ← axios instance + auth interceptor
├── context/
│   └── AuthContext.tsx         ← user profile, isLoading, logout(), waitForUserLoad(), reloadUser()
├── hooks/
│   ├── useAssessments.ts       ← GET /assessments, GET /assessments/:slug
│   ├── useSession.ts           ← start, answer, submit, list sessions, GET /sessions/:id/answers
│   ├── useReport.ts            ← GET /reports/:sessionId + pdf_url polling
│   └── useAdmin.ts             ← analytics, users, sessions, xlsx import
├── routes/
│   └── MainRoutes.tsx          ← route definitions (mirrors App.tsx)
├── pages/
│   ├── LandingPage/LandingPage.tsx
│   ├── LoginPage/LoginPage.tsx       ← handles both login and register (mode param)
│   ├── RegisterPage/RegisterPage.tsx ← redirects to /login?mode=register
│   ├── ResetPassword/ResetPassword.tsx
│   ├── Dashboard/Dashboard.tsx
│   ├── AssessmentIntro/AssessmentIntro.tsx
│   ├── AssessmentList/AssessmentList.tsx
│   ├── AssessmentView/AssessmentView.tsx
│   ├── Quiz/Quiz.tsx
│   ├── Report/Report.tsx
│   ├── Sessions/Sessions.tsx
│   ├── NotFound/NotFound.tsx
│   └── admin/
│       ├── AdminAnalytics/AdminAnalytics.tsx
│       ├── AdminSessions/AdminSessions.tsx
│       ├── AdminUsers/AdminUsers.tsx
│       ├── AdminUserDetail/AdminUserDetail.tsx
│       └── AdminImport/AdminImport.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── AppLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── common/
│   │   ├── PageWrapper.tsx     ← wraps page content with consistent padding/max-width
│   │   ├── ProgressBar.tsx
│   │   ├── Skeleton.tsx
│   │   └── Header.tsx
│   ├── assessment/
│   │   ├── QuestionRenderer.tsx
│   │   └── SubmissionForm.tsx
│   ├── dashboard/
│   │   └── ScoreCard.tsx
│   ├── landing/
│   │   ├── Hero/Hero.tsx
│   │   ├── Features/Features.tsx
│   │   ├── CTA/CTA.tsx
│   │   └── Testimonials/Testimonials.tsx
│   ├── RadarChart.tsx
│   ├── DimensionCard.tsx
│   ├── RatingInput.tsx         ← 1–5 button group for quiz
│   ├── SubscriptionBadge.tsx   ← tier badge (nascent/developing/maturing/leading)
│   ├── TierBadge.tsx
│   ├── ScoreRing.tsx
│   ├── ErrorBoundary.tsx
│   └── ProtectedRoute.tsx
└── types/
    └── api.ts                  ← TypeScript interfaces matching every API response shape
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

### Registration flow (important — race condition fix)
Registration and login use **different post-auth steps**:

- **Login**: `signInWithPassword` → `onAuthStateChange(SIGNED_IN)` fires → `loadUser()` runs automatically → `await waitForUserLoad()` resolves once it completes → `navigate("/dashboard")`.
- **Register**: `signUp` also fires `SIGNED_IN`, but the backend user record does not exist yet at that moment. `loadUser()` (triggered by the event) calls `GET /auth/me` and **fails** before `POST /auth/register` has been called. By the time `waitForUserLoad()` is reached, `loadUser()` has already completed with failure — the resolver queue is empty and the promise hangs forever.

  **Fix**: after `POST /auth/register`, call `await reloadUser()` explicitly (which re-runs `loadUser()`). Do **not** use `waitForUserLoad()` in the register path.

`AuthContext` exposes both:
- `waitForUserLoad()` — use for login only
- `reloadUser()` — use after registration to force a fresh `GET /auth/me`

After first login: call `POST /auth/register` with `{ company }` to sync the backend user record.
On every app load: call `GET /auth/me` → store result in `AuthContext`.
Subscribe to `supabase.auth.onAuthStateChange` to refresh the stored token automatically.

**User roles:** `"user"` or `"admin"` — comes from `GET /auth/me`.
Gate `/admin/*` routes on `user.role === "admin"` via `<ProtectedRoute adminOnly>`.

---

## Key routes
| Route | Screen | Auth |
|---|---|---|
| / | Landing page | Public |
| /login | Login / Sign Up (mode=register) | Public |
| /reset-password | Password reset | Public |
| /dashboard | Assessment list + session history | Authenticated |
| /assessments/:slug | Assessment intro | Authenticated |
| /sessions/:sessionId/quiz | Active quiz | Authenticated |
| /sessions/:sessionId/report | Scored report + radar chart | Authenticated |
| /sessions | Session history | Authenticated |
| /admin | Analytics dashboard | Admin only |
| /admin/sessions | All sessions table | Admin only |
| /admin/users | Users + role management | Admin only |
| /admin/users/:userId | User detail | Admin only |
| /admin/import | XLSX assessment import | Admin only |

---

## API summary
Base URL: `import.meta.env.VITE_API_URL`

| Method | Path | Purpose |
|---|---|---|
| POST | /auth/register | Sync user after first signup (body: { company? }) |
| GET | /auth/me | Load current user profile |
| GET | /assessments | List published assessments |
| GET | /assessments/:slug | Assessment + questions (filtered by user tier) |
| POST | /sessions/start | Start session (body: { assessment_slug }) → returns sessionId |
| POST | /sessions/:id/answer | Submit one answer (body: { question_id, dimension_id, answer_value }) |
| POST | /sessions/:id/submit | Complete session → triggers scoring |
| GET | /sessions | Current user's session history |
| GET | /sessions/:id/answers | Previously submitted answers for a session (used to restore quiz state on resume) |
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

## Quiz resume pattern (sessionStorage slug)

`Quiz.tsx` reads the assessment slug from `sessionStorage` on mount:
```ts
const [slug] = useState(() => sessionStorage.getItem(`session-${sessionId}-slug`) ?? "");
```
`useAssessment(slug)` is gated on `enabled: !!slug` — if the slug is empty the query never fires and the page spins indefinitely.

**Rule**: any navigation to `/sessions/:id/quiz` must first write the slug to sessionStorage:
```ts
sessionStorage.setItem(`session-${sessionId}-slug`, assessmentSlug);
```

This is done in three places:
1. `AssessmentIntro.tsx` — on "Start Assessment" (creates the session then stores the slug)
2. `Dashboard.tsx` — `onClick` on the "Continue Assessment" link (`s.assessment_slug` from `GET /sessions`)
3. `Sessions.tsx` — `onClick` on the "Resume" link (same source)

`Session.assessment_slug` is already populated by `GET /sessions` — no extra API call needed.

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
- When navigating to `/sessions/:id/quiz` from any link or button, always write `sessionStorage.setItem(`session-${id}-slug`, slug)` in an `onClick` handler first — see Quiz resume pattern above.
- For registration, use `reloadUser()` after `POST /auth/register`, not `waitForUserLoad()` — see Auth pattern above.
