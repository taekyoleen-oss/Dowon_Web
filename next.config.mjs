import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ]
  }
};

const hasSentry =
  Boolean(process.env.SENTRY_AUTH_TOKEN) &&
  Boolean(process.env.SENTRY_ORG) &&
  Boolean(process.env.SENTRY_PROJECT);

// Wrap with Sentry only when auth/org/project are present — otherwise the
// build emits warnings about missing sourcemap upload credentials.
export default hasSentry
  ? withSentryConfig(nextConfig, {
      // For source maps upload (only used at build time on Vercel).
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Silence build logs in CI.
      silent: !process.env.CI,

      // Tunnel route to bypass ad-blockers on the browser SDK.
      tunnelRoute: "/monitoring",

      // Hide Sentry's framework source maps from the public bundle.
      hideSourceMaps: true,

      // Disable telemetry to the Sentry CLI.
      telemetry: false,
    })
  : nextConfig;
