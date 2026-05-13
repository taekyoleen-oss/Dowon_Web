#!/usr/bin/env tsx
/**
 * Push local seed data (lib/data/*) to Supabase.
 *
 *   $ npm run seed
 *
 * Idempotent — uses upsert by slug. Safe to re-run.
 */
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
// Load .env.local first (Next.js convention), then .env as fallback.
loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

import { createClient } from "@supabase/supabase-js";
import { lawyers } from "../lib/data/lawyers";
import { practiceAreas } from "../lib/data/practice-areas";
import { libraryItems } from "../lib/data/library";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function seedLawyers() {
  const rows = lawyers.map((l) => ({
    slug: l.slug,
    name_ko: l.nameKo,
    name_en: l.nameEn,
    role: l.role,
    photo_url: l.photoUrl ?? null,
    bio_short: l.bioShort,
    bio_long: null,
    email: l.email ?? null,
    practice_areas: l.practiceAreas,
    special_qualifications: l.specialQualifications ?? [],
    education: l.education,
    career: l.career,
    is_active: true,
    display_order: l.displayOrder,
  }));
  const { data, error } = await supabase
    .from("lawyers")
    .upsert(rows, { onConflict: "slug" })
    .select("slug, id");
  if (error) throw new Error(`lawyers upsert: ${error.message}`);
  console.log(`[seed] lawyers upserted: ${data.length}`);
  return new Map(data.map((d) => [d.slug, d.id as string]));
}

async function seedPracticeAreas() {
  // Two passes: first insert all, then fix parent_id on subareas.
  const all = Object.values(practiceAreas);
  const rows = all.map((p) => ({
    slug: p.slug,
    category: p.parent ?? null,
    name_ko: p.nameKo,
    name_en: p.displayEn,
    description: p.lead,
    content_md: null,
  }));
  const { data, error } = await supabase
    .from("practice_areas")
    .upsert(rows, { onConflict: "slug" })
    .select("slug, id");
  if (error) throw new Error(`practice_areas upsert: ${error.message}`);
  const idBySlug = new Map(data.map((d) => [d.slug, d.id as string]));

  const childUpdates = all
    .filter((p) => p.parent)
    .map((p) => ({ slug: p.slug, parent_id: idBySlug.get(p.parent!) ?? null }));

  for (const u of childUpdates) {
    const { error } = await supabase
      .from("practice_areas")
      .update({ parent_id: u.parent_id })
      .eq("slug", u.slug);
    if (error) throw new Error(`parent link ${u.slug}: ${error.message}`);
  }
  console.log(`[seed] practice_areas upserted: ${data.length}`);
}

async function seedCasesAndColumns(lawyerIds: Map<string, string>) {
  const cases = libraryItems.filter((it) => it.type === "case");
  const columns = libraryItems.filter((it) => it.type === "column");

  // Cases
  const caseRows = cases.map((c) => ({
    slug: c.slug,
    case_number: c.caseNumber ?? null,
    title: c.title,
    practice_areas: c.practiceAreas,
    issue: c.issue ?? null,
    conclusion: c.conclusion ?? null,
    insight: c.insight ?? null,
    content_md: null,
    lawyer_ids: (c.lawyerSlugs ?? [])
      .map((s) => lawyerIds.get(s))
      .filter((x): x is string => !!x),
    published_at: c.publishedAt,
    is_published: true,
    ai_generated: false,
  }));
  if (caseRows.length > 0) {
    const { data, error } = await supabase
      .from("cases")
      .upsert(caseRows, { onConflict: "slug" })
      .select("slug");
    if (error) throw new Error(`cases upsert: ${error.message}`);
    console.log(`[seed] cases upserted: ${data.length}`);
  }

  // Columns
  const columnRows = columns.map((c) => ({
    slug: c.slug,
    title: c.title,
    practice_areas: c.practiceAreas,
    excerpt: c.excerpt,
    content_md: null,
    author_id: c.authorSlug ? lawyerIds.get(c.authorSlug) ?? null : null,
    published_at: c.publishedAt,
    is_published: true,
  }));
  if (columnRows.length > 0) {
    const { data, error } = await supabase
      .from("columns")
      .upsert(columnRows, { onConflict: "slug" })
      .select("slug");
    if (error) throw new Error(`columns upsert: ${error.message}`);
    console.log(`[seed] columns upserted: ${data.length}`);
  }
}

async function main() {
  console.log("[seed] target:", SUPABASE_URL);
  const lawyerIds = await seedLawyers();
  await seedPracticeAreas();
  await seedCasesAndColumns(lawyerIds);
  console.log("[seed] ✓ done");
}

main().catch((e) => {
  console.error("[seed] FAILED:", e);
  process.exit(1);
});
