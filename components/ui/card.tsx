import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  accent = true,
  as: Component = "article",
  children,
  ...props
}: {
  className?: string;
  accent?: boolean;
  as?: React.ElementType;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn(
        "relative bg-paper-2 border border-paper-3 rounded-md p-6 lg:p-8",
        "transition-all duration-base ease-out-curve",
        className
      )}
      {...props}
    >
      {accent && (
        <span
          aria-hidden
          className="absolute left-6 lg:left-8 top-0 h-[2px] w-[30px] bg-gold"
        />
      )}
      {children}
    </Component>
  );
}

export function CardEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("label-mono text-gold", className)}>{children}</p>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("font-serif-ko text-h3 font-semibold text-ink", className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-serif-ko text-body text-ink-soft leading-base", className)}>
      {children}
    </p>
  );
}
