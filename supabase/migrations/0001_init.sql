-- =========================================================================
-- Dowon Law — Initial schema (PRD Section 7.2)
-- Date: 2026-05-13
-- =========================================================================

-- Extensions ---------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ---------------------------------------------------------------------------
-- lawyers
-- ---------------------------------------------------------------------------
create table if not exists public.lawyers (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique not null,
  name_ko                text not null,
  name_en                text,
  role                   text,
  photo_url              text,
  bio_short              text,
  bio_long               text,
  email                  text,
  practice_areas         text[]  default '{}',
  special_qualifications text[]  default '{}',
  education              jsonb   default '[]'::jsonb,
  career                 jsonb   default '[]'::jsonb,
  is_active              boolean default true,
  display_order          int     default 0,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create index if not exists lawyers_practice_areas_idx on public.lawyers using gin (practice_areas);
create index if not exists lawyers_special_qual_idx   on public.lawyers using gin (special_qualifications);
create index if not exists lawyers_display_order_idx  on public.lawyers (display_order);

-- ---------------------------------------------------------------------------
-- practice_areas
-- ---------------------------------------------------------------------------
create table if not exists public.practice_areas (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  category    text,
  name_ko     text not null,
  name_en     text,
  description text,
  content_md  text,
  hero_image  text,
  parent_id   uuid references public.practice_areas(id) on delete set null,
  created_at  timestamptz default now()
);

create index if not exists practice_areas_category_idx on public.practice_areas (category);
create index if not exists practice_areas_parent_idx   on public.practice_areas (parent_id);

-- ---------------------------------------------------------------------------
-- cases (판례)
-- ---------------------------------------------------------------------------
create table if not exists public.cases (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  case_number    text,
  title          text not null,
  practice_areas text[] default '{}',
  issue          text,
  conclusion     text,
  insight        text,
  content_md     text,
  lawyer_ids     uuid[] default '{}',
  published_at   date,
  is_published   boolean default false,
  ai_generated   boolean default false,
  reviewer_id    uuid references public.lawyers(id) on delete set null,
  embedding      vector(1536),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists cases_practice_areas_idx on public.cases using gin (practice_areas);
create index if not exists cases_lawyer_ids_idx     on public.cases using gin (lawyer_ids);
create index if not exists cases_published_at_idx   on public.cases (published_at desc);
create index if not exists cases_is_published_idx   on public.cases (is_published);
-- HNSW vector index for semantic search (cosine)
create index if not exists cases_embedding_idx on public.cases
  using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- columns (칼럼)
-- ---------------------------------------------------------------------------
create table if not exists public.columns (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  practice_areas text[] default '{}',
  excerpt        text,
  content_md     text,
  author_id      uuid references public.lawyers(id) on delete set null,
  published_at   date,
  is_published   boolean default false,
  embedding      vector(1536),
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists columns_practice_areas_idx on public.columns using gin (practice_areas);
create index if not exists columns_author_idx         on public.columns (author_id);
create index if not exists columns_published_at_idx   on public.columns (published_at desc);
create index if not exists columns_is_published_idx   on public.columns (is_published);
create index if not exists columns_embedding_idx      on public.columns
  using hnsw (embedding vector_cosine_ops);

-- ---------------------------------------------------------------------------
-- consultation_requests (상담 신청)
-- ---------------------------------------------------------------------------
create table if not exists public.consultation_requests (
  id                 uuid primary key default gen_random_uuid(),
  persona            text not null check (persona in ('insurer','enterprise','medical','personal')),
  contact_info       jsonb not null,
  case_summary       text,
  attachments        jsonb default '[]'::jsonb,
  ai_triage_id       uuid,
  status             text default 'new' check (status in ('new','assigned','in_progress','closed','archived')),
  assigned_lawyer_id uuid references public.lawyers(id) on delete set null,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

create index if not exists consultation_persona_idx on public.consultation_requests (persona);
create index if not exists consultation_status_idx  on public.consultation_requests (status);
create index if not exists consultation_created_idx on public.consultation_requests (created_at desc);

-- ---------------------------------------------------------------------------
-- ai_conversations (챗봇 대화)
-- ---------------------------------------------------------------------------
create table if not exists public.ai_conversations (
  id             uuid primary key default gen_random_uuid(),
  session_id     text,
  persona        text,
  messages       jsonb default '[]'::jsonb,
  classification jsonb,
  converted      boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index if not exists ai_conversations_session_idx on public.ai_conversations (session_id);
create index if not exists ai_conversations_persona_idx on public.ai_conversations (persona);

-- ---------------------------------------------------------------------------
-- newsletter_subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  name            text,
  company         text,
  segment         text check (segment in ('insurer','enterprise','general')),
  topics          text[] default '{}',
  is_verified     boolean default false,
  unsubscribed_at timestamptz,
  created_at      timestamptz default now()
);

create index if not exists newsletter_segment_idx on public.newsletter_subscribers (segment);

-- ---------------------------------------------------------------------------
-- ai_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.ai_audit_logs (
  id           uuid primary key default gen_random_uuid(),
  tool_name    text not null,
  user_id      uuid,
  input        jsonb,
  output       jsonb,
  tokens_used  int,
  duration_ms  int,
  created_at   timestamptz default now()
);

create index if not exists ai_audit_tool_idx    on public.ai_audit_logs (tool_name);
create index if not exists ai_audit_created_idx on public.ai_audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'lawyers','cases','columns','consultation_requests','ai_conversations'
    ])
  loop
    execute format(
      'drop trigger if exists trg_%I_updated_at on public.%I;
       create trigger trg_%I_updated_at before update on public.%I
         for each row execute function public.set_updated_at();',
      t, t, t, t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- RLS scaffolding
--   Public reads for published content; writes restricted to service role.
--   Admin/lawyer-only tables stay closed until auth roles are wired up.
-- ---------------------------------------------------------------------------
alter table public.lawyers              enable row level security;
alter table public.practice_areas       enable row level security;
alter table public.cases                enable row level security;
alter table public.columns              enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.ai_conversations     enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.ai_audit_logs        enable row level security;

-- Public can read active lawyers
drop policy if exists "Public reads active lawyers" on public.lawyers;
create policy "Public reads active lawyers"
  on public.lawyers for select
  using (is_active = true);

-- Public can read practice areas
drop policy if exists "Public reads practice areas" on public.practice_areas;
create policy "Public reads practice areas"
  on public.practice_areas for select
  using (true);

-- Public can read published cases & columns
drop policy if exists "Public reads published cases" on public.cases;
create policy "Public reads published cases"
  on public.cases for select
  using (is_published = true);

drop policy if exists "Public reads published columns" on public.columns;
create policy "Public reads published columns"
  on public.columns for select
  using (is_published = true);

-- Consultation: anonymous can insert (form submission); no public read
drop policy if exists "Anyone can submit consultation" on public.consultation_requests;
create policy "Anyone can submit consultation"
  on public.consultation_requests for insert
  with check (true);
