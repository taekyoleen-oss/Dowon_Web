/**
 * 사건 유형(MatterType)별 권장 보유 자료 체크리스트.
 *
 * 클라이언트는 IntakeState.evidence.items 와 매칭하여 ✓ 표시.
 * 한국어 라벨이 곧 매칭 키 — Claude 가 evidence.items 에 채울 라벨
 * 후보로도 시스템 프롬프트에서 활용.
 */

import type { MatterType } from "@/lib/ai/intake-slots";

export type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
  hint?: string;
};

export const checklistByMatter: Record<MatterType, ChecklistItem[]> = {
  auto: [
    { id: "police_report", label: "교통사고사실확인원", required: true },
    { id: "medical_record", label: "진단서·치료기록", required: true, hint: "치료가 이어지는 경우 가장 최근 자료까지" },
    { id: "vehicle_photos", label: "차량 파손 사진", required: false },
    { id: "scene_photos", label: "현장 사진·블랙박스", required: false },
    { id: "insurance_doc", label: "보험사 통지서·합의서 사본", required: false },
    { id: "wage_proof", label: "휴업손해 증빙(급여명세 등)", required: false },
  ],
  medical: [
    { id: "med_record", label: "의무기록 사본 (전체)", required: true, hint: "처방·수술·간호기록 포함" },
    { id: "diagnosis", label: "진단서·소견서", required: true },
    { id: "imaging", label: "영상자료(CT·MRI·X-ray)", required: false },
    { id: "consent_form", label: "수술·시술 동의서", required: false },
    { id: "receipts", label: "진료비 영수증·상세내역서", required: false },
  ],
  insurance: [
    { id: "policy", label: "보험증권·약관", required: true },
    { id: "claim_form", label: "보험금 청구서·지급결정서", required: true },
    { id: "denial_letter", label: "지급 거절·삭감 통지서", required: false },
    { id: "underwriting", label: "고지·청약서 사본", required: false },
    { id: "medical_evidence", label: "의무기록·진단서", required: false },
  ],
  contract: [
    { id: "contract_doc", label: "계약서 원본·사본", required: true },
    { id: "comms", label: "이메일·카톡 등 협의 기록", required: true },
    { id: "performance_proof", label: "이행·미이행 증빙", required: false },
    { id: "tax_invoice", label: "세금계산서·거래내역", required: false },
    { id: "notice", label: "최고서·해지통지서", required: false },
  ],
  employment: [
    { id: "labor_contract", label: "근로계약서", required: true },
    { id: "wage_record", label: "급여명세·계좌이체 내역", required: true },
    { id: "work_record", label: "근태기록·연장근로 증빙", required: false },
    { id: "injury_evidence", label: "산재 — 의무기록·사고 경위서", required: false },
    { id: "termination", label: "해고통지서·내부 문서", required: false },
  ],
  consumer: [
    { id: "purchase_proof", label: "구매 영수증·계약서", required: true },
    { id: "defect_evidence", label: "하자 사진·동영상", required: true },
    { id: "comms", label: "판매자·플랫폼과 주고받은 기록", required: false },
    { id: "expert_opinion", label: "전문가 감정서(있다면)", required: false },
  ],
  criminal: [
    { id: "incident_report", label: "사건 경위서(본인 작성)", required: true },
    { id: "evidence_files", label: "사진·녹취·CCTV 등 증거", required: true },
    { id: "witness_list", label: "목격자 연락처·진술서", required: false },
    { id: "medical_report", label: "상해 시 — 진단서", required: false },
    { id: "police_doc", label: "경찰 출석요구서·고소장 사본", required: false },
  ],
  real_estate: [
    { id: "lease_contract", label: "임대차계약서·매매계약서", required: true },
    { id: "registry", label: "등기부등본", required: true },
    { id: "rent_record", label: "월세·관리비 납부 기록", required: false },
    { id: "comms", label: "임대인·중개인과 협의 기록", required: false },
    { id: "deposit_proof", label: "보증금 송금 내역", required: false },
  ],
  other: [
    { id: "narrative", label: "사건 경위서(시간 순서대로)", required: true },
    { id: "comms", label: "이메일·메신저 등 관련 기록", required: false },
    { id: "evidence", label: "사진·문서 등 보유 증거", required: false },
  ],
};

/**
 * Match user-provided evidence items (free-form Korean phrases) against the
 * checklist. Uses substring matching with normalized labels — coarse but
 * sufficient for the UI hint use case.
 */
export function matchChecklist(
  matter: MatterType | null,
  evidenceItems: string[]
): { item: ChecklistItem; matched: boolean }[] {
  if (!matter) return [];
  const items = checklistByMatter[matter] ?? [];
  const normalizedEvidence = evidenceItems.map((e) => e.replace(/\s+/g, "").toLowerCase());
  return items.map((item) => {
    const key = item.label.replace(/[ ·]/g, "").toLowerCase();
    const matched = normalizedEvidence.some((e) => e.includes(key) || key.includes(e));
    return { item, matched };
  });
}
