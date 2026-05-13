import { cn } from "@/lib/utils";

type ContainerSize = "narrow" | "base" | "wide";

const sizeClass: Record<ContainerSize, string> = {
  narrow: "container-narrow",
  base:   "container-base",
  wide:   "container-wide",
};

export function Container({
  size = "base",
  as: Component = "div",
  className,
  children,
}: {
  size?: ContainerSize;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Component className={cn(sizeClass[size], className)}>{children}</Component>
  );
}
