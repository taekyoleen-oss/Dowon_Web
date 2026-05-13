-- =========================================================================
-- Intake bot — extends ai_conversations and links to consultation_requests
-- =========================================================================

-- ai_conversations: add intake_state + confirmed_summary
alter table public.ai_conversations
  add column if not exists intake_state jsonb,
  add column if not exists confirmed_summary jsonb,
  add column if not exists confirmed_at timestamptz,
  add column if not exists consultation_request_id uuid references public.consultation_requests(id) on delete set null;

-- session_id needs to be unique so the intake route can upsert by it.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'ai_conversations_session_id_key'
  ) then
    alter table public.ai_conversations
      add constraint ai_conversations_session_id_key unique (session_id);
  end if;
end $$;

create index if not exists ai_conversations_consultation_idx
  on public.ai_conversations (consultation_request_id);

-- consultation_requests: add link back to its intake session
alter table public.consultation_requests
  add column if not exists intake_session_id text;

create index if not exists consultation_intake_session_idx
  on public.consultation_requests (intake_session_id);
