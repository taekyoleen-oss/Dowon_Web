/**
 * Sentry — browser SDK. Loaded on every page after hydration.
 *
 * When SENTRY_DSN is not set, Sentry.init becomes a no-op and the bundle
 * size is essentially unchanged. Safe to ship without a key.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    // Capture 10% of normal sessions, 100% of sessions where an error occurs.
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 0.1,
    // Don't capture PII unless we know we need it.
    sendDefaultPii: false,
    // Mask anything that looks like a Korean ID/phone/case number
    // in replay text before it leaves the browser.
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Drop noisy known errors so the dashboard stays useful.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications.",
      /^Network request failed$/,
      /AbortError/,
    ],
  });
}
