-- =========================================================================
-- pgvector match RPCs — consumed by app/api/ai/library-search/route.ts
-- =========================================================================

-- Returns rows of published cases ordered by cosine similarity.
create or replace function public.match_cases(
  query_embedding vector(1536),
  match_count int default 20
)
returns table (
  slug text,
  title text,
  issue text,
  conclusion text,
  insight text,
  practice_areas text[],
  published_at date,
  similarity float
)
language sql
stable
as $$
  select
    c.slug,
    c.title,
    c.issue,
    c.conclusion,
    c.insight,
    c.practice_areas,
    c.published_at,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.cases c
  where c.is_published = true
    and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 50));
$$;

create or replace function public.match_columns(
  query_embedding vector(1536),
  match_count int default 20
)
returns table (
  slug text,
  title text,
  excerpt text,
  practice_areas text[],
  author_id uuid,
  published_at date,
  similarity float
)
language sql
stable
as $$
  select
    c.slug,
    c.title,
    c.excerpt,
    c.practice_areas,
    c.author_id,
    c.published_at,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.columns c
  where c.is_published = true
    and c.embedding is not null
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 50));
$$;

-- Grant execute to anon + authenticated; functions only see published rows.
grant execute on function public.match_cases(vector, int)   to anon, authenticated, service_role;
grant execute on function public.match_columns(vector, int) to anon, authenticated, service_role;
