/**
 * Date helpers — D-day counter for intake deadlines.
 *
 * Returns whole days using local midnight as the boundary. A target on
 * today returns 0; tomorrow returns 1; yesterday returns -1.
 */

export function daysUntil(target: string | Date, now: Date = new Date()): number | null {
  const t = typeof target === "string" ? new Date(target) : target;
  if (Number.isNaN(t.getTime())) return null;
  const a = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((a - b) / 86_400_000);
}

export function formatDday(days: number | null): string {
  if (days === null) return "—";
  if (days === 0) return "D-DAY";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
}

export function isValidIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime());
}
