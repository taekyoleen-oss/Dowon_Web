/**
 * Distributed rate limiting for AI endpoints — Upstash Redis (sliding window).
 *
 * Falls back to a no-op when UPSTASH_REDIS_REST_URL / TOKEN are missing so
 * local dev keeps working without infra. In production, set both env vars
 * and the helper will throttle by IP (and optionally a user identifier).
 *
 * Tiers (per IP):
 *   chat        : 20 req / 60s   (Triage, Intake — interactive turns)
 *   intake-long : 30 req / 60s   (Intake gets a bit more headroom)
 *   submit      :  5 req / 60s   (form-style final submissions)
 *   search      : 30 req / 60s   (Library semantic search, lawyer match)
 *   advice      : 10 req / 60s   (Subrogation check — cost & abuse risk)
 *   heavy       :  5 req / 60min (Policy/Medical PDF analysis — expensive)
 *   document    :  5 req / 60min (Public document translator — Claude PDF, no auth)
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

export function hasRateLimitConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

export type RateLimitTier =
  | "chat"
  | "intake-long"
  | "submit"
  | "search"
  | "advice"
  | "heavy"
  | "document";

const limiters = new Map<RateLimitTier, Ratelimit>();

function getLimiter(tier: RateLimitTier): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (limiters.has(tier)) return limiters.get(tier)!;

  const cfg: Record<RateLimitTier, { tokens: number; window: `${number} ${"s"|"m"|"h"|"d"}` }> = {
    chat:          { tokens: 20, window: "60 s" },
    "intake-long": { tokens: 30, window: "60 s" },
    submit:        { tokens: 5,  window: "60 s" },
    search:        { tokens: 30, window: "60 s" },
    advice:        { tokens: 10, window: "60 s" },
    heavy:         { tokens: 5,  window: "60 m" },
    document:      { tokens: 5,  window: "60 m" },
  };
  const { tokens, window } = cfg[tier];

  const r = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `rl:${tier}`,
    analytics: true,
  });
  limiters.set(tier, r);
  return r;
}

function getClientIp(req: Request): string {
  // Vercel proxy injects x-forwarded-for. Take the leftmost (original client).
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * Check the limit. Returns null on success (caller proceeds), or a 429 Response.
 *
 *   const limited = await checkRateLimit(req, "chat");
 *   if (limited) return limited;
 */
export async function checkRateLimit(
  req: Request,
  tier: RateLimitTier,
  extraKey?: string
): Promise<Response | null> {
  const limiter = getLimiter(tier);
  if (!limiter) {
    // Dev / unconfigured — allow request but log occasionally.
    if (Math.random() < 0.01) {
      console.warn("[rate-limit] Upstash not configured — requests allowed unchecked.");
    }
    return null;
  }

  const ip = getClientIp(req);
  const key = extraKey ? `${ip}:${extraKey}` : ip;

  const { success, limit, remaining, reset } = await limiter.limit(key);
  if (success) return null;

  const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: "Too many requests",
      message:
        "잠시 후 다시 시도해 주세요. 짧은 시간에 너무 많은 요청이 감지되었습니다.",
      retry_after: retryAfterSec,
    },
    {
      status: 429,
      headers: {
        "retry-after": String(retryAfterSec),
        "x-ratelimit-limit": String(limit),
        "x-ratelimit-remaining": String(remaining),
        "x-ratelimit-reset": String(reset),
      },
    }
  );
}
