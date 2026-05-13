import { cn } from "@/lib/utils";

/**
 * Section Header — PRD Section 4.7.4
 *   — 01
 *   PRACTICE AREAS         (mono eyebrow)
 *   업무분야               (Cormorant italic)
 *   손해보험·생명보험에서…  (Korean serif)
 *                          (lead paragraph)
 */
export function SectionHeader({
  index,
  eyebrow,
  display,
  heading,
  lead,
  align = "left",
  tone = "ink",
  className,
}: {
  index?: string | number;
  eyebrow: string;
  display?: string;
  heading: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
}) {
  const isDark = tone === "paper";
  return (
    <header
      className={cn(
        align === "center" && "text-center mx-auto",
        align === "center" ? "max-w-2xl" : "max-w-3xl",
        className
      )}
    >
      <p className={cn("label-mono", isDark ? "text-gold-bright" : "text-gold")}>
        {index !== undefined && `— ${typeof index === "number" ? String(index).padStart(2, "0") : index}  /  `}
        {eyebrow}
      </p>
      {display && (
        <h2
          className={cn(
            "mt-4 font-display italic leading-tight",
            "text-[clamp(36px,6vw,72px)]",
            isDark ? "text-paper" : "text-ink"
          )}
        >
          {display}
        </h2>
      )}
      <p
        className={cn(
          "mt-3 font-serif-ko font-semibold leading-tight",
          "text-h2",
          isDark ? "text-paper" : "text-ink"
        )}
      >
        {heading}
      </p>
      {lead && (
        <p
          className={cn(
            "mt-6 font-serif-ko text-body-lg leading-base max-w-[32em]",
            align === "center" && "mx-auto",
            isDark ? "text-paper-3" : "text-ink-soft"
          )}
        >
          {lead}
        </p>
      )}
    </header>
  );
}
