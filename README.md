# Aryan Command Center — MONEY-FIRST build

## 🚀 One-Day Build Plan (IST)
**Hour 0-1** — Scaffold & install
1. node scaffold.mjs
2. cd aryan-command-center && pnpm i
3. Copy .env.example → .env (set DATABASE_URL)
4. pnpm db:push

**Hour 1-2** — Seed & smoke test
1. curl -X POST http://localhost:3000/api/seed
2. pnpm dev → open http://localhost:3000 → Click **Auto-plan**
3. Confirm 5 tasks appear under Today’s Checklist; toggle a couple.

**Hour 2-4** — Persist auth (optional now)
- Add Clerk keys; test protected routes later.

**Hour 4-6** — Money features
- Add /api/finance/record integration with Stripe (later).

**Hour 6-8** — Polish UI
- Replace placeholders with charts & counters.

**Deploy** — Push to GitHub → Vercel import → env vars → run.

## Endpoints
- POST /api/seed → creates demo tasks with expected_value
- GET/POST /api/ai/daily-plan → picks **top 5 money-first** tasks & marks today
- GET/POST /api/tasks → list/toggle today’s tasks

## Tests
- pnpm test
