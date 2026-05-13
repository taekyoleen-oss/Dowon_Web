/**
 * Server-side Supabase client.
 *
 * Uses the service role key on the server only. Never expose this client or
 * key to the browser. Used for: consultation form submissions, admin reads,
 * AI audit logs.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _cached: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error(
      "Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
  }
  if (_cached) return _cached;
  _cached = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _cached;
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
