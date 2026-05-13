# 법무법인 도원 — 홈페이지 리뉴얼

> Built per `dowon-website-prd.md` (v1.0, 2026.05). Modern Editorial Law design,
> integrated insurance/medical/subrogation/recovery model with AI-augmented
> intake, search, and analysis tools.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS variables (`app/globals.css`) |
| Fonts | Cormorant Garamond · Noto Serif KR · Pretendard · JetBrains Mono |
| Data | Supabase (PostgreSQL + pgvector + RLS) |
| AI | Claude (Anthropic SDK) + OpenAI (embeddings) |
| Hosting | Vercel (cron via `vercel.json`) |

## Local dev

```bash
npm install
cp .env.local.example .env.local        # fill keys (see below)
npm run dev                              # http://localhost:3000
```

### Required environment variables

See `.env.local.example` for the full list. Minimum set for local dev:

- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` — AI tools
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — DB
- `ADMIN_EMAIL_WHITELIST` — comma-separated emails allowed at `/admin`
- `CRON_SECRET` — bearer token for `/api/cron/*`

### One-time DB setup

1. Apply migrations in Supabase SQL editor (in order):
   - `supabase/migrations/0001_init.sql` — schema + RLS
   - `supabase/migrations/0002_match_rpc.sql` — pgvector RPCs
2. Seed local fixtures:
   ```bash
   npm run seed
   npm run embeddings
   ```

## Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TS validation |
| `npm run seed` | Push `lib/data/*` to Supabase |
| `npm run embeddings` | OpenAI embed cases + columns into pgvector |

## Layout

```
app/
  (marketing)/      Public pages — home, about, practice, people, library, contact
  (tools)/tools/    AI tools — triage, subrogation-check, policy-reader
  (admin)/admin/    Lawyer-only CMS + AI queue (middleware-gated)
  api/
    ai/             Triage, library-search, subrogation, lawyer-match, policy/medical analyze
    cron/           Daily case harvest, weekly newsletter (Vercel Cron)
    admin/          Logout
components/
  layout/           Header, Footer, Container
  home/             Hero, IntegratedModel, PersonaGateway, ProofPoints, RecentInsights, CtaStrip
  ui/               Button, Card, Tag, SectionHeader, Tabs, FilterSidebar, Counter, Eyebrow
  practice/, lawyer/, library/, tools/, contact/, ai/
lib/
  ai/               Anthropic/OpenAI wrappers, audit logger, JSON extractor
  data/             Lawyers, library, practice areas (seed source)
  supabase/         Server + browser clients
  admin/            Cookie-based auth
  notifications.ts  Slack + Resend (no-op when keys absent)
supabase/
  migrations/       0001_init.sql, 0002_match_rpc.sql
scripts/
  seed-supabase.ts, ingest-embeddings.ts, scaffold-routes.mjs
```

## Phases (from PRD §8)

- **Phase 0** — Scaffolding (done)
- **Phase 1** — Static site (done)
- **Phase 2** — AI external tools: triage, semantic search, subrogation, lawyer match (done)
- **Phase 3** — Admin CMS, policy/medical analyzers, daily harvest cron, weekly newsletter (done)
- **Phase 4** — Ops & growth (analytics, A/B, voice AI exploration)

## Legal

All AI-facing surfaces include the disclaimer at `components/ai/legal-disclaimer.tsx`
per PRD §9.1 (변호사법 제23조). External content is gated by lawyer review
(`/admin/ai-queue`) before publication.
