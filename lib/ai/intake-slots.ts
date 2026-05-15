/**
 * Intake slot schema — drives the multi-turn intake bot.
 *
 * Each turn, Claude returns `intake_state` matching IntakeState. The state is
 * cumulative: each turn merges the new state with prior turns. When
 * `completeness` ≥ 0.7 the UI offers a summary card; the user must explicitly
 * confirm before consultation_requests is created.
 */

export const matterTypes = [
  "auto",         // 교통사고·자동차보험
  "medical",      // 의료사고·의료분쟁
  "insurance",    // 보험금 분쟁 (장기·생명·화재·배상)
  "contract",     // 계약 분쟁
  "employment",   // 근로·산재
  "consumer",     // 소비자 분쟁
  "criminal",     // 형사 피해 (사기·폭행·성범죄 등)
  "real_estate", // 부동산·임대차
  "other",
] as const;
export type MatterType = (typeof matterTypes)[number];

export const matterTypeLabels: Record<MatterType, string> = {
  auto:        "교통사고·자동차",
  medical:     "의료분쟁",
  insurance:   "보험금 분쟁",
  contract:    "계약 분쟁",
  employment:  "근로·산재",
  consumer:    "소비자 분쟁",
  criminal:    "형사 피해",
  real_estate: "부동산",
  other:       "기타",
};

/**
 * 9 slots — covered in conversational order. Claude is told to fill them
 * organically, not interrogate. Empty fields stay null; they are not
 * required to ship the summary card.
 */
export type IntakeState = {
  // 01 사건 유형
  matter_type: MatterType | null;

  // 02 발생 시점
  when: {
    date?: string | null;       // 'YYYY-MM-DD' or natural language
    time_of_day?: string | null;
    ongoing?: boolean | null;   // true if still ongoing
    notes?: string | null;
  };

  // 03 발생 장소 (관할 판단용)
  where: {
    location?: string | null;   // "서울 강남구 …" or jurisdiction
    notes?: string | null;
  };

  // 04 당사자
  parties: {
    user_role?: "victim" | "perpetrator" | "witness" | "claimant" | "other" | null;
    other_parties?: Array<{ role: string; description: string }> | null;
    notes?: string | null;
  };

  // 05 사건 경위 (자유 서술)
  narrative: string | null;

  // 06 손해
  damages: {
    physical?: string | null;
    property?: string | null;
    financial?: string | null;     // 금액 or 추정
    psychological?: string | null;
    notes?: string | null;
  };

  // 07 보유 자료
  evidence: {
    items: string[];                // ["진단서", "CCTV 영상", ...]
    missing?: string[];             // 확보가 필요한 자료
    notes?: string | null;
  };

  // 08 원하는 결과
  desired_outcome: {
    options?: Array<"compensation" | "settlement" | "criminal" | "retraction" | "injunction" | "other"> | null;
    notes?: string | null;
  };

  // 09 사전 시도
  prior_actions: {
    police_report?: boolean | null;
    insurance_claim?: boolean | null;
    settlement_attempt?: boolean | null;
    other_lawyer?: boolean | null;
    notes?: string | null;
  };

  // 10 시급성 — 사용자가 명시한 날짜만 (시효는 추정 금지). Optional.
  deadlines?: Array<{
    label: string;      // 예: "출석요구일", "답변서 제출일"
    date: string;       // YYYY-MM-DD
    source?: string;    // 발화 원본 인용 (감사용)
  }> | null;

  // Meta — Claude returns; client uses to drive UI
  completeness: number;             // 0-1
  ready_for_summary: boolean;
};

export function emptyIntakeState(): IntakeState {
  return {
    matter_type: null,
    when: { date: null, time_of_day: null, ongoing: null, notes: null },
    where: { location: null, notes: null },
    parties: { user_role: null, other_parties: null, notes: null },
    narrative: null,
    damages: { physical: null, property: null, financial: null, psychological: null, notes: null },
    evidence: { items: [], missing: [], notes: null },
    desired_outcome: { options: null, notes: null },
    prior_actions: {
      police_report: null,
      insurance_claim: null,
      settlement_attempt: null,
      other_lawyer: null,
      notes: null,
    },
    deadlines: null,
    completeness: 0,
    ready_for_summary: false,
  };
}

/** Filled-vs-total ratio for the side panel progress bar. */
export function deriveCompleteness(state: IntakeState): number {
  const checks: boolean[] = [
    !!state.matter_type,
    !!(state.when.date || state.when.notes),
    !!(state.where.location || state.where.notes),
    !!state.parties.user_role,
    !!state.narrative && state.narrative.length > 20,
    !!(
      state.damages.physical ||
      state.damages.property ||
      state.damages.financial ||
      state.damages.psychological
    ),
    state.evidence.items.length > 0,
    !!(state.desired_outcome.options?.length || state.desired_outcome.notes),
    !!(
      state.prior_actions.police_report !== null ||
      state.prior_actions.insurance_claim !== null ||
      state.prior_actions.settlement_attempt !== null ||
      state.prior_actions.notes
    ),
  ];
  const filled = checks.filter(Boolean).length;
  return filled / checks.length;
}

/** Merge a partial state delta into the running state (last writer wins). */
export function mergeIntakeState(
  prev: IntakeState,
  delta: Partial<IntakeState>
): IntakeState {
  const next: IntakeState = { ...prev };
  for (const key of Object.keys(delta) as Array<keyof IntakeState>) {
    const v = delta[key];
    if (v === undefined) continue;
    if (v === null) {
      // explicit null: skip — Claude wasn't sure
      continue;
    }
    if (key === "deadlines" && Array.isArray(v)) {
      // Union-merge by (label,date) so a turn that re-mentions a deadline
      // doesn't create duplicates. Filter out malformed dates.
      type Deadline = NonNullable<IntakeState["deadlines"]>[number];
      const incoming = v as unknown as Deadline[];
      const merged: Deadline[] = [
        ...(prev.deadlines ?? []),
        ...incoming,
      ].filter(
        (d): d is Deadline =>
          !!d && typeof d.label === "string" && typeof d.date === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(d.date)
      );
      const seen = new Set<string>();
      next.deadlines = merged.filter((d) => {
        const k = `${d.label}|${d.date}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      continue;
    }
    if (typeof v === "object" && !Array.isArray(v)) {
      // shallow object merge so partial updates accumulate
      // (e.g., turn 1 sets when.date, turn 3 sets when.time_of_day)
      (next as Record<string, unknown>)[key as string] = {
        ...((prev as Record<string, unknown>)[key as string] as object),
        ...(v as object),
      };
    } else {
      (next as Record<string, unknown>)[key as string] = v;
    }
  }
  next.completeness = deriveCompleteness(next);
  next.ready_for_summary = next.completeness >= 0.7;
  return next;
}

/** Stable, lawyer-facing summary derived from the state. */
export function summarizeForLawyer(state: IntakeState): {
  title: string;
  sections: Array<{ label: string; value: string }>;
} {
  const sections: Array<{ label: string; value: string }> = [];

  if (state.matter_type) {
    sections.push({ label: "사건 유형", value: matterTypeLabels[state.matter_type] });
  }
  if (state.when.date || state.when.notes) {
    const v = [state.when.date, state.when.time_of_day, state.when.notes]
      .filter(Boolean)
      .join(" · ");
    sections.push({ label: "발생 시점", value: v });
  }
  if (state.where.location || state.where.notes) {
    const v = [state.where.location, state.where.notes].filter(Boolean).join(" · ");
    sections.push({ label: "발생 장소", value: v });
  }
  if (state.parties.user_role || state.parties.other_parties?.length) {
    const role = state.parties.user_role ? `의뢰인 입장: ${state.parties.user_role}` : "";
    const others =
      state.parties.other_parties
        ?.map((p) => `${p.role} — ${p.description}`)
        .join(" / ") ?? "";
    sections.push({
      label: "당사자",
      value: [role, others, state.parties.notes].filter(Boolean).join(" · "),
    });
  }
  if (state.narrative) {
    sections.push({ label: "사건 경위", value: state.narrative });
  }
  const damages = [
    state.damages.physical && `인적 — ${state.damages.physical}`,
    state.damages.property && `재산 — ${state.damages.property}`,
    state.damages.financial && `금전 — ${state.damages.financial}`,
    state.damages.psychological && `정신적 — ${state.damages.psychological}`,
    state.damages.notes,
  ].filter(Boolean);
  if (damages.length > 0) {
    sections.push({ label: "손해", value: damages.join("\n") });
  }
  if (state.evidence.items.length > 0 || state.evidence.missing?.length) {
    sections.push({
      label: "보유 자료",
      value:
        `보유: ${state.evidence.items.join(", ") || "—"}` +
        (state.evidence.missing?.length
          ? `\n추가 확보 필요: ${state.evidence.missing.join(", ")}`
          : ""),
    });
  }
  if (state.desired_outcome.options?.length || state.desired_outcome.notes) {
    const labels = state.desired_outcome.options
      ?.map((o) =>
        o === "compensation" ? "금전 배상"
          : o === "settlement" ? "합의"
          : o === "criminal" ? "형사 처벌"
          : o === "retraction" ? "정정·사과"
          : o === "injunction" ? "금지·중단"
          : "기타"
      )
      .join(", ");
    sections.push({
      label: "원하는 결과",
      value: [labels, state.desired_outcome.notes].filter(Boolean).join(" · "),
    });
  }
  const prior = [
    state.prior_actions.police_report && "경찰 신고",
    state.prior_actions.insurance_claim && "보험금 청구",
    state.prior_actions.settlement_attempt && "합의 시도",
    state.prior_actions.other_lawyer && "다른 변호사 상담 이력",
    state.prior_actions.notes,
  ].filter(Boolean);
  if (prior.length > 0) {
    sections.push({ label: "사전 시도", value: prior.join(", ") });
  }
  if (state.deadlines && state.deadlines.length > 0) {
    const v = state.deadlines
      .map((d) => `${d.date} — ${d.label}`)
      .join("\n");
    sections.push({ label: "확인된 일정 (시효 적용 여부는 변호사 검토 필요)", value: v });
  }

  const title = state.matter_type
    ? `${matterTypeLabels[state.matter_type]} — 인테이크 ${new Date().toLocaleDateString("ko-KR")}`
    : `인테이크 ${new Date().toLocaleDateString("ko-KR")}`;
  return { title, sections };
}
