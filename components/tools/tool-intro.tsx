import Link from "next/link";
import { ArrowLeft, BookOpen, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared intro block for /tools/* pages.
 *
 * - Breadcrumb back to /tools hub
 * - Eyebrow + title + Korean subtitle
 * - Lead paragraph
 * - 3 value cards
 * - 3-step "how to use"
 * - Optional use cases list
 *
 * Designed so a first-time visitor immediately understands:
 *   (1) who this tool is for,
 *   (2) what they'll get back,
 *   (3) how to use it in 3 steps.
 */

type ValueCard = {
  icon: LucideIcon;
  title: string;
  body: string;
};

type Step = { n: string; title: string; body: string };

export function ToolIntro({
  eyebrow,
  displayTitle,
  subtitle,
  lead,
  caveat,
  values,
  steps,
  examples,
}: {
  eyebrow: { index: number | string; label: string };
  displayTitle: string;
  subtitle: string;
  lead: React.ReactNode;
  caveat?: string;
  values: ValueCard[];
  steps: Step[];
  examples?: string[];
}) {
  return (
    <>
      <Link
        href="/tools"
        className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-label text-ink-mute hover:text-ink"
      >
        <ArrowLeft size={11} aria-hidden /> AI 도구 전체 보기
      </Link>

      <p
        className={cn(
          "mt-6 font-mono text-[11px] uppercase tracking-label text-gold"
        )}
      >
        — {typeof eyebrow.index === "number"
          ? String(eyebrow.index).padStart(2, "0")
          : eyebrow.index}
        {"  /  "}
        {eyebrow.label}
      </p>

      <h1 className="mt-4 font-display italic text-display text-ink leading-tight">
        {displayTitle}
      </h1>
      <p className="mt-3 font-serif-ko text-h2 text-ink">{subtitle}</p>

      <div className="mt-8 max-w-[40em] font-serif-ko text-body-lg text-ink-soft leading-base">
        {lead}
        {caveat && (
          <p className="mt-2 text-ink-mute">{caveat}</p>
        )}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3 max-w-5xl">
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <div key={i} className="rounded-md border border-paper-3 bg-paper p-5">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-sm bg-paper-2 text-gold-deep">
                <Icon size={18} aria-hidden />
              </div>
              <h3 className="mt-4 font-serif-ko text-[16px] font-semibold text-ink leading-snug">
                {v.title}
              </h3>
              <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
                {v.body}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-md border border-paper-3 bg-paper-2 p-6 lg:p-8 max-w-5xl">
        <p className="label-mono text-gold inline-flex items-center gap-1.5">
          <BookOpen size={12} aria-hidden /> 사용 방법
        </p>
        <h2 className="mt-3 font-serif-ko text-h2 font-semibold text-ink">
          세 단계로 시작하기
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <p className="font-mono text-[10.5px] uppercase tracking-label text-gold-deep">
                STEP {s.n}
              </p>
              <h3 className="mt-1 font-serif-ko text-[16px] font-semibold text-ink leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 font-serif-ko text-[13.5px] text-ink-soft leading-base">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {examples && examples.length > 0 && (
        <div className="mt-10 max-w-5xl">
          <p className="label-mono text-gold">활용 예시</p>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {examples.map((e, i) => (
              <li
                key={i}
                className="font-serif-ko text-[14px] text-ink-soft leading-base"
              >
                <span className="text-gold-deep mr-1.5">·</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
