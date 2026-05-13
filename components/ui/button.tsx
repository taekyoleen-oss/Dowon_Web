import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-sans-ko font-medium tracking-wide",
    "rounded-sm",
    "transition-colors duration-fast ease-out-curve",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
  ],
  {
    variants: {
      variant: {
        primary:   "bg-gold-deep text-paper hover:bg-gold",
        secondary: "border border-ink text-ink hover:bg-paper-2",
        ghost:     "text-ink hover:underline underline-offset-4",
        "on-dark": "text-paper border-b border-gold-bright pb-1 rounded-none hover:text-gold-bright",
      },
      size: {
        sm: "px-4 py-2 text-[13px]",
        md: "px-6 py-3 text-[14.5px]",
        lg: "px-8 py-4 text-[15.5px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonBaseProps = VariantProps<typeof button> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonBaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;
type ButtonAsButton = ButtonBaseProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = ButtonAsLink | ButtonAsButton;

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    const { href, variant, size, className, children, ...rest } = props;
    return (
      <Link href={href} className={cn(button({ variant, size }), className)} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant, size, className, children, ...rest } = props as ButtonAsButton;
  return (
    <button className={cn(button({ variant, size }), className)} {...rest}>
      {children}
    </button>
  );
}
