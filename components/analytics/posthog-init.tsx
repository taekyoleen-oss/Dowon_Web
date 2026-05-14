"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

/**
 * PostHog bootstrap — client-only.
 *
 * No-op when NEXT_PUBLIC_POSTHOG_KEY is missing, so dev and the test
 * Resend setup keep working without an analytics key.
 *
 * Pageview tracking is wired manually to pathname changes (Next.js App
 * Router doesn't fire a full reload, so PostHog's autocapture would miss
 * client navigations).
 */
export function PostHogInit() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = React.useRef(false);

  React.useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key || initialized.current) return;
    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: false,
      capture_pageleave: true,
    });
    initialized.current = true;
  }, []);

  React.useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !initialized.current || !pathname) {
      return;
    }
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
