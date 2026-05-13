"use client";

import * as React from "react";
import Image from "next/image";
import type { Lawyer } from "@/lib/data/lawyers";
import { cn } from "@/lib/utils";

/**
 * Lawyer photo with automatic slug-based path mapping and graceful fallback.
 *
 * Resolution order:
 *   1. `lawyer.photoUrl` if explicitly set in lib/data/lawyers.ts
 *   2. `/lawyers/{slug}.jpg`  (drop a file into public/lawyers/ to enable)
 *   3. Italic initial placeholder
 *
 * Cards apply grayscale by default and reveal color on hover (PRD §4.7.2).
 */
export function LawyerPhoto({
  lawyer,
  sizes,
  priority,
  className,
  grayscaleOnHover = true,
}: {
  lawyer: Pick<Lawyer, "slug" | "nameKo" | "nameEn" | "role" | "photoUrl">;
  sizes?: string;
  priority?: boolean;
  className?: string;
  grayscaleOnHover?: boolean;
}) {
  const [failed, setFailed] = React.useState(false);
  const src = lawyer.photoUrl ?? `/lawyers/${lawyer.slug}.jpg`;

  if (failed) {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center bg-paper-3", className)}>
        <span className="font-display italic text-[clamp(48px,6vw,128px)] text-ink-mute">
          {lawyer.nameEn.split(",")[0]}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${lawyer.nameKo} ${lawyer.role}`}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn(
        "object-cover",
        grayscaleOnHover && "grayscale group-hover:grayscale-0 transition-all duration-slow",
        className
      )}
    />
  );
}
