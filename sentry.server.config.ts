/**
 * Sentry — Node.js server runtime. Loaded for /api/* and SSR.
 */
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    // Server-side traces shouldn't carry PII either — admin / consultation
    // payloads include names and phone numbers we don't want to ship.
    sendDefaultPii: false,
  });
}
