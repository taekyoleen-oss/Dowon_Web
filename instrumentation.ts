/**
 * Next.js instrumentation hook — registers Sentry init for each runtime.
 * Called once per server boot. No-op on the browser.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Re-export Sentry's request error handler so Next.js can wire it into route
// error boundaries automatically. When the SDK is unavailable (no DSN) this
// is undefined and Next.js handles errors normally.
export { captureRequestError } from "@sentry/nextjs";
