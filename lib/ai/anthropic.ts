/**
 * Anthropic client wrapper.
 * - Prompt caching enabled by default on system prompts (cost reduction).
 * - All public-facing AI tools must include the legal disclaimer in the
 *   system prompt — see SYSTEM_FOOTER.
 */
import Anthropic from "@anthropic-ai/sdk";

let _cached: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (_cached) return _cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Configure in .env.local.");
  }
  _cached = new Anthropic({ apiKey });
  return _cached;
}

export function hasAnthropicConfig() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Latest Claude family — see PRD §7.1 (Claude API). */
export const CLAUDE_MODEL = "claude-sonnet-4-6";

/** PRD §9.1 — must appear in every external AI response. */
export const SYSTEM_FOOTER = `
[법적 안내]
본 도구가 제공하는 정보는 일반적인 안내이며, 구체적 사건에 대한 법률 자문이 아닙니다.
승소 가능성·결과를 단정하지 않습니다. 실제 사건은 변호사와의 상담을 통해 진행하시기
바랍니다. (변호사법 제23조 광고 규제 준수)
`.trim();
