/**
 * Minimal RFC 5545 (iCalendar) builder for all-day events.
 *
 * Used by /tools/document-translator to export calendar_events as a .ics
 * file that imports into Google Calendar / Outlook / Apple Calendar.
 *
 * Keeps to all-day events because legal documents typically specify only
 * a date (제출 기한, 출석일 등), not a precise time.
 */

export type IcsEvent = {
  date: string;        // YYYY-MM-DD
  label: string;       // event title
  description?: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dtNow(): string {
  const d = new Date();
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function dateOnly(iso: string): string {
  return iso.replace(/-/g, "");
}

function escape(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Increment a YYYY-MM-DD string by one day (ICS DTEND is exclusive). */
function nextDay(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + 1);
  return (
    dt.getUTCFullYear().toString() +
    pad(dt.getUTCMonth() + 1) +
    pad(dt.getUTCDate())
  );
}

export function buildIcs(events: IcsEvent[], calName = "도원 — 문서 일정"): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dowon Law//Document Translator//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escape(calName)}`,
  ];
  const stamp = dtNow();
  for (const ev of events) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) continue;
    const uid = `${ev.date}-${Math.random().toString(36).slice(2, 10)}@dowonlaw`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${dateOnly(ev.date)}`,
      `DTEND;VALUE=DATE:${nextDay(ev.date)}`,
      `SUMMARY:${escape(ev.label)}`,
    );
    if (ev.description) lines.push(`DESCRIPTION:${escape(ev.description)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
