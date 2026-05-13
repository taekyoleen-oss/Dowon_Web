import Link from "next/link";
import { Container } from "@/components/layout/container";

/**
 * Stub page used during scaffolding. Lists eyebrow label, English display
 * title, Korean heading and a short lead — matching the Section Header
 * pattern in PRD Section 4.7.4 so the placeholder visually conveys hierarchy.
 */
export function PagePlaceholder({
  eyebrow,
  display,
  heading,
  lead,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  display: string;
  heading: string;
  lead?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <Container size="base" className="section-y">
      <p className="label-mono text-gold">— {eyebrow}</p>
      <h1 className="mt-4 font-display italic text-display text-ink">
        {display}
      </h1>
      <p className="mt-3 font-serif-ko text-h2 text-ink">{heading}</p>
      {lead && (
        <p className="mt-6 max-w-[32em] font-serif-ko text-body-lg text-ink-soft">
          {lead}
        </p>
      )}
      <div className="mt-10 inline-flex items-center gap-3">
        <span className="label-mono">Phase 0 · Scaffolding</span>
      </div>
      {backHref && (
        <div className="mt-12">
          <Link
            href={backHref}
            className="font-serif-ko text-ink-soft underline-offset-4 hover:underline"
          >
            ← {backLabel ?? "돌아가기"}
          </Link>
        </div>
      )}
    </Container>
  );
}
