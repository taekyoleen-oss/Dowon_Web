/**
 * PII masking for Korean legal-intake context.
 *
 * Applied client-side immediately before fetch and re-applied server-side
 * before forwarding to Claude / persisting to Supabase. Both layers are
 * intentional: client-side prevents the raw string from ever leaving the
 * browser; server-side is a safety net for callers that bypass the client.
 *
 * Patterns are intentionally conservative — they should produce few false
 * positives in normal Korean prose. Order matters: more specific patterns
 * run first so they don't get shadowed by looser ones (e.g., card before
 * generic phone).
 */

type MaskRule = {
  id: string;
  label: string;
  regex: RegExp;
  replacement: (match: string) => string;
};

const MASK_RULES: MaskRule[] = [
  {
    id: "rrn",
    label: "주민등록번호",
    // 6 digits + (optional dash) + 7 digits — front 6 visible, back fully masked
    regex: /\b(\d{6})-?(\d{7})\b/g,
    replacement: (m) => {
      const cleaned = m.replace(/-/g, "");
      return `${cleaned.slice(0, 6)}-*******`;
    },
  },
  {
    id: "card",
    label: "카드번호",
    regex: /\b(\d{4})[- ]?(\d{4})[- ]?(\d{4})[- ]?(\d{4})\b/g,
    replacement: () => "****-****-****-****",
  },
  {
    id: "case-no",
    label: "사건번호",
    // 4 digits + 1-3 Korean chars + digits (e.g., 2023고합1234, 2024다1234)
    regex: /\b\d{4}[가-힣]{1,3}\d{1,7}\b/g,
    replacement: () => "[사건번호]",
  },
  {
    id: "account",
    label: "계좌번호",
    // 3+ digit groups joined by dashes, where the overall thing looks like a Korean bank account
    // (10-14 digits total). Restrictive to avoid false positives on phone numbers.
    regex: /\b\d{2,6}-\d{2,6}-\d{2,8}(?:-\d{1,4})?\b/g,
    replacement: () => "[계좌번호]",
  },
  {
    id: "phone",
    label: "전화번호",
    // 02/0xx-xxxx-xxxx or 010-xxxx-xxxx with or without dashes
    regex: /\b0\d{1,2}[- ]?\d{3,4}[- ]?\d{4}\b/g,
    replacement: () => "[전화번호]",
  },
];

export type MaskResult = {
  masked: string;
  hits: Array<{ id: string; label: string; count: number }>;
};

export function maskPII(text: string): MaskResult {
  if (!text) return { masked: text ?? "", hits: [] };
  let out = text;
  const hits: MaskResult["hits"] = [];
  for (const rule of MASK_RULES) {
    let count = 0;
    out = out.replace(rule.regex, (m) => {
      count += 1;
      return rule.replacement(m);
    });
    if (count > 0) hits.push({ id: rule.id, label: rule.label, count });
  }
  return { masked: out, hits };
}

export function hasPII(text: string): boolean {
  return MASK_RULES.some((rule) => {
    rule.regex.lastIndex = 0;
    return rule.regex.test(text);
  });
}
