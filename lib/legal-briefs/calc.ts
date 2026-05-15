/**
 * Korean civil procedure cost calculators.
 *
 * 인지대 (filing fee) — 민사소송등인지법 §2
 * 송달료 (service fee) — 송달료규칙 (5,200원/회, 통상 15회)
 * 지연손해금 (delay damages) — 소송촉진 등에 관한 특례법 §3 (현행 연 12%)
 */

/**
 * 민사소송등인지법 §2 인지대 산정.
 * 산정식:
 *   - 소가  1,000만원 이하:        소가 × 0.005
 *   - 1,000만원 초과 ~ 1억원 이하: 소가 × 0.0045 + 5,000원
 *   - 1억원 초과 ~ 10억원 이하:    소가 × 0.004 + 55,000원
 *   - 10억원 초과:                 소가 × 0.0035 + 555,000원
 * 1,000원 미만은 절사 (수입인지 단위).
 */
export function calcFilingFee(amount: number): { fee: number; formula: string } {
  let raw: number;
  let formula: string;
  if (amount <= 10_000_000) {
    raw = amount * 0.005;
    formula = `${formatMoney(amount)} × 0.005 = ${formatMoney(raw)}`;
  } else if (amount <= 100_000_000) {
    raw = amount * 0.0045 + 5_000;
    formula = `${formatMoney(amount)} × 0.0045 + 5,000 = ${formatMoney(raw)}`;
  } else if (amount <= 1_000_000_000) {
    raw = amount * 0.004 + 55_000;
    formula = `${formatMoney(amount)} × 0.004 + 55,000 = ${formatMoney(raw)}`;
  } else {
    raw = amount * 0.0035 + 555_000;
    formula = `${formatMoney(amount)} × 0.0035 + 555,000 = ${formatMoney(raw)}`;
  }
  const fee = Math.floor(raw / 1000) * 1000;
  return { fee, formula };
}

/**
 * 송달료 = 당사자수 × 5,200원 × 회수 (통상 1심 15회)
 */
export function calcServiceFee(partyCount: number, rounds = 15): { fee: number; formula: string } {
  const fee = partyCount * 5_200 * rounds;
  return {
    fee,
    formula: `${partyCount}명 × 5,200원 × ${rounds}회 = ${formatMoney(fee)}`,
  };
}

/**
 * 단리 이자 계산 (실제 일수 / 365).
 */
export function calcSimpleInterest(
  principal: number,
  annualRatePct: number,
  fromDate: string,
  toDate: string
): { interest: number; days: number; formula: string } {
  const days = daysBetween(fromDate, toDate);
  const rate = annualRatePct / 100;
  const raw = (principal * rate * days) / 365;
  const interest = Math.floor(raw);
  return {
    interest,
    days,
    formula: `${formatMoney(principal)} × ${annualRatePct}% × ${days}/365 = ${formatMoney(interest)}`,
  };
}

function daysBetween(from: string, to: string): number {
  const a = new Date(from + "T00:00:00Z").getTime();
  const b = new Date(to + "T00:00:00Z").getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function formatMoney(n: number): string {
  return n.toLocaleString("ko-KR") + "원";
}

/**
 * Civil-complaint quick-calc bundle used by the form preview pane.
 */
export type CivilComplaintCalc = {
  remainingPrincipal: number;
  agreedInterest: number;
  estimatedSoga: number;
  filingFee: { fee: number; formula: string };
  serviceFee: { fee: number; formula: string };
  notes: string[];
};

export function computeCivilComplaint(input: {
  principal: number;
  partialRepayment?: number;
  loanDate?: string;
  dueDate?: string;
  interestRatePct?: number;
}): CivilComplaintCalc {
  const principal = Number(input.principal) || 0;
  const partial = Number(input.partialRepayment) || 0;
  const remainingPrincipal = Math.max(0, principal - partial);

  let agreedInterest = 0;
  let interestFormula = "약정 기간 또는 이율 정보 부족 — 자동계산 생략";
  if (input.loanDate && input.dueDate && input.interestRatePct) {
    const r = calcSimpleInterest(
      principal,
      Number(input.interestRatePct),
      input.loanDate,
      input.dueDate
    );
    agreedInterest = r.interest;
    interestFormula = r.formula;
  }

  const estimatedSoga = remainingPrincipal + agreedInterest;
  const filingFee = calcFilingFee(estimatedSoga);
  const serviceFee = calcServiceFee(2, 15);

  return {
    remainingPrincipal,
    agreedInterest,
    estimatedSoga,
    filingFee,
    serviceFee,
    notes: [
      `잔존 원금: ${formatMoney(principal)} − ${formatMoney(partial)} = ${formatMoney(remainingPrincipal)}`,
      `약정이자 계산: ${interestFormula}`,
      `인지대 산정: ${filingFee.formula} → 1,000원 단위 절사 = ${formatMoney(filingFee.fee)}`,
      `송달료: ${serviceFee.formula}`,
    ],
  };
}
