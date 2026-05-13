"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

/**
 * Next.js global-error boundary — handles errors thrown in the root layout
 * (which the per-route error.tsx can't catch). Reports to Sentry then renders
 * the framework default error UI so we don't need a custom design for the
 * rare global-failure case.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}
