  -- =========================================================================
  -- Legal corpus — ingested from 국가법령정보 OPEN API (law.go.kr).
  --
  -- Two tables, both embedded with OpenAI text-embedding-3-small (1536-dim)
  -- so the existing library search infra can union them with cases/columns
  -- via a single match RPC per type.
  --
  -- Source attribution: 국가법령정보센터.
  -- Daily ingest is opt-in (see scripts/ingest-nlic.ts).
  -- =========================================================================

  -- ── 법령 조문 (legal_provisions) ────────────────────────────────────────
  -- One row per article (조문). Keyed by (law_id, article_number) so re-ingest
  -- of an amended statute upserts cleanly.

  create table if not exists public.legal_provisions (
    id                uuid primary key default gen_random_uuid(),
    law_id            text not null,                 -- 법령ID from NLIC
    law_name          text not null,                 -- 법령명한글
    article_number    text not null,                 -- 조문번호 (e.g. "12" or "12-2")
    article_title     text,                          -- 조문제목
    article_body      text not null,                 -- 조문내용 + 항/호 평탄화
    promulgation_date date,                          -- 공포일자
    enforcement_date  date,                          -- 시행일자
    embedding         vector(1536),
    source_url        text,                          -- /DRF/lawService.do?... for citation
    created_at        timestamptz default now(),
    updated_at        timestamptz default now(),
    unique (law_id, article_number)
  );

  create index if not exists legal_provisions_law_idx
    on public.legal_provisions (law_id);
  create index if not exists legal_provisions_embedding_idx
    on public.legal_provisions using ivfflat (embedding vector_cosine_ops);

  create trigger legal_provisions_updated_at
    before update on public.legal_provisions
    for each row execute function public.set_updated_at();

  alter table public.legal_provisions enable row level security;
  create policy legal_provisions_read_all on public.legal_provisions
    for select using (true);


  -- ── 판례 (legal_precedents) ────────────────────────────────────────────
  -- One row per judgement. Keyed by 판례일련번호.

  create table if not exists public.legal_precedents (
    id              uuid primary key default gen_random_uuid(),
    serial_no       text unique not null,            -- 판례일련번호
    case_name       text not null,                   -- 사건명
    case_number     text,                            -- 사건번호 (e.g. 2019다XXXXXX)
    court_name      text,                            -- 법원명
    case_type       text,                            -- 사건종류명
    judgment_type   text,                            -- 판결유형 (대법원·항소·1심 등)
    judgment_date   date,                            -- 선고일자
    summary         text,                            -- 판시사항·판결요지
    body            text,                            -- 본문 (있으면)
    practice_areas  text[],                          -- 도원 분류 — 적재 시 키워드 기반 태깅
    embedding       vector(1536),
    source_url      text,
    created_at      timestamptz default now(),
    updated_at      timestamptz default now()
  );

  create index if not exists legal_precedents_court_idx
    on public.legal_precedents (court_name);
  create index if not exists legal_precedents_date_idx
    on public.legal_precedents (judgment_date desc);
  create index if not exists legal_precedents_embedding_idx
    on public.legal_precedents using ivfflat (embedding vector_cosine_ops);

  create trigger legal_precedents_updated_at
    before update on public.legal_precedents
    for each row execute function public.set_updated_at();

  alter table public.legal_precedents enable row level security;
  create policy legal_precedents_read_all on public.legal_precedents
    for select using (true);


  -- ── Match RPCs — same shape as match_cases / match_columns ─────────────

  create or replace function public.match_legal_provisions(
    query_embedding vector(1536),
    match_count int default 20
  )
  returns table (
    id uuid,
    law_id text,
    law_name text,
    article_number text,
    article_title text,
    article_body text,
    enforcement_date date,
    source_url text,
    similarity float
  )
  language sql
  stable
  as $$
    select
      p.id,
      p.law_id,
      p.law_name,
      p.article_number,
      p.article_title,
      p.article_body,
      p.enforcement_date,
      p.source_url,
      1 - (p.embedding <=> query_embedding) as similarity
    from public.legal_provisions p
    where p.embedding is not null
    order by p.embedding <=> query_embedding
    limit greatest(1, least(match_count, 50));
  $$;

  create or replace function public.match_legal_precedents(
    query_embedding vector(1536),
    match_count int default 20
  )
  returns table (
    id uuid,
    serial_no text,
    case_name text,
    case_number text,
    court_name text,
    judgment_date date,
    summary text,
    practice_areas text[],
    source_url text,
    similarity float
  )
  language sql
  stable
  as $$
    select
      p.id,
      p.serial_no,
      p.case_name,
      p.case_number,
      p.court_name,
      p.judgment_date,
      p.summary,
      p.practice_areas,
      p.source_url,
      1 - (p.embedding <=> query_embedding) as similarity
    from public.legal_precedents p
    where p.embedding is not null
    order by p.embedding <=> query_embedding
    limit greatest(1, least(match_count, 50));
  $$;

  grant execute on function public.match_legal_provisions(vector, int)
    to anon, authenticated, service_role;
  grant execute on function public.match_legal_precedents(vector, int)
    to anon, authenticated, service_role;
