#!/usr/bin/env tsx
/**
 * Mirror lawyer photos from dowonlaw.com to public/lawyers/{slug}.png.
 *
 *   npm run photos
 *
 * Once photos are present locally, set photoUrl in lib/data/lawyers.ts to
 * `/lawyers/{slug}.png` (or remove photoUrl entirely — LawyerPhoto auto-
 * fallbacks to /lawyers/{slug}.jpg by convention).
 *
 * The Claude Code sandbox blocks direct outbound HTTPS so this script must
 * be run from a developer workstation, not from CI.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { lawyers } from "../lib/data/lawyers";

const REFERER = "https://www.dowonlaw.com/member/lawyer.asp";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

async function main() {
  const dir = resolve(process.cwd(), "public/lawyers");
  await mkdir(dir, { recursive: true });

  let ok = 0;
  let fail = 0;
  const skipped: string[] = [];

  for (const lawyer of lawyers) {
    if (!lawyer.photoUrl || !lawyer.photoUrl.startsWith("http")) {
      skipped.push(lawyer.slug);
      continue;
    }
    try {
      const res = await fetch(lawyer.photoUrl, {
        headers: { "user-agent": UA, referer: REFERER },
        redirect: "follow",
      });
      if (!res.ok) {
        process.stdout.write(`  fail ${lawyer.slug}: HTTP ${res.status}\n`);
        fail++;
        continue;
      }
      const ct = res.headers.get("content-type") ?? "";
      const ext = ct.includes("png") ? "png" : ct.includes("jpeg") ? "jpg" : "png";
      const buf = Buffer.from(await res.arrayBuffer());
      const path = resolve(dir, `${lawyer.slug}.${ext}`);
      await writeFile(path, buf);
      process.stdout.write(`  ok   ${lawyer.slug}.${ext} (${(buf.length / 1024).toFixed(1)} KB)\n`);
      ok++;
    } catch (e) {
      process.stdout.write(
        `  err  ${lawyer.slug}: ${e instanceof Error ? e.message : String(e)}\n`
      );
      fail++;
    }
  }

  console.log(`\nDone — ${ok} downloaded, ${fail} failed, ${skipped.length} skipped (no photoUrl).`);
  if (skipped.length > 0) {
    console.log(`Skipped: ${skipped.join(", ")}`);
  }
  if (ok > 0) {
    console.log(
      "\nNext step: edit lib/data/lawyers.ts and replace each remote photoUrl\n" +
      "with `photoUrl: \"/lawyers/<slug>.png\"` (or remove it — LawyerPhoto\n" +
      "falls back to that path by convention)."
    );
  }
}

main().catch((e) => {
  console.error("[photos] FAILED:", e);
  process.exit(1);
});
