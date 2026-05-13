import { cn } from "@/lib/utils";

export function Eyebrow({
  index,
  children,
  tone = "ink",
  className,
}: {
  index?: string | number;
  children: React.ReactNode;
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-label",
        tone === "paper" ? "text-gold-bright" : "text-gold",
        className
      )}
    >
      {index !== undefined && `— ${typeof index === "number" ? String(index).padStart(2, "0") : index}  /  `}
      {children}
    </p>
  );
}
