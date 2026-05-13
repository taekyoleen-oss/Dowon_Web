import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagVariant = "default" | "accent" | "filled";

const variantClass: Record<TagVariant, string> = {
  default: "border border-paper-3 text-ink-soft bg-transparent",
  accent:  "border border-gold text-gold bg-transparent",
  filled:  "bg-ink text-paper border border-ink",
};

export function Tag({
  variant = "default",
  removable,
  onRemove,
  className,
  children,
  as: Component = "span",
}: {
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        "font-mono text-[11px] uppercase tracking-label",
        "rounded-sm",
        variantClass[variant],
        className
      )}
    >
      {children}
      {removable && (
        <button
          type="button"
          aria-label="태그 제거"
          className="inline-flex items-center justify-center -mr-1"
          onClick={onRemove}
        >
          <X size={11} />
        </button>
      )}
    </Component>
  );
}
