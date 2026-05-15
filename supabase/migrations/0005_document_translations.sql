-- =========================================================================
-- Document Translations — public legal-document plain-Korean translator
-- (/tools/document-translator).
-- Stores only the masked analysis JSON; the uploaded PDF original is never
-- persisted (개인정보 최소화 원칙).
-- =========================================================================

create table if not exists public.document_translations (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null,
  file_name    text,
  file_size    int,
  doc_type     text,                   -- 소장 | 답변서 | 결정문 | 합의서 | 기타
  result       jsonb not null,          -- { summary_3lines, plain_terms, action_items, calendar_events }
  pii_hits     jsonb,                   -- which PII patterns were masked, count only
  duration_ms  int,
  tokens_used  int,
  created_at   timestamptz default now()
);

create index if not exists document_translations_session_idx
  on public.document_translations (session_id);
create index if not exists document_translations_created_idx
  on public.document_translations (created_at desc);

-- RLS — anonymous users may INSERT (write-only). Reads are blocked from
-- public roles; only service_role (admin tooling) can SELECT.
alter table public.document_translations enable row level security;

drop policy if exists "anon can insert document_translations" on public.document_translations;
create policy "anon can insert document_translations"
  on public.document_translations
  for insert
  to anon, authenticated
  with check (true);
