/**
 * Admin auth — PRD §8 Week 9, §9.4.
 * Minimal email-allowlist gate. Real production should layer in Supabase Auth
 * + 2FA per §9.4. Here we provide the foundation so admin routes are gated.
 */
import { cookies } from "next/headers";

const COOKIE_NAME = "dowon_admin";

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_EMAIL_WHITELIST ?? "";
  return raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function isAllowedEmail(email: string) {
  const list = getAdminAllowlist();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}

export function getCurrentAdminEmail(): string | null {
  const c = cookies().get(COOKIE_NAME);
  if (!c?.value) return null;
  const email = c.value.toLowerCase();
  return isAllowedEmail(email) ? email : null;
}

export function setAdminCookie(email: string) {
  cookies().set(COOKIE_NAME, email.toLowerCase(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME);
}
