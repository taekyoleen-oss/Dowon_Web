"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getServerSupabase, hasSupabaseConfig } from "@/lib/supabase/server";
import { notifyConsultation } from "@/lib/notifications";

const personaEnum = z.enum(["insurer", "enterprise", "medical", "personal"]);

const baseSchema = z.object({
  persona: personaEnum,
  agreement: z.literal("on", { message: "개인정보 수집·이용 동의가 필요합니다." }),
  caseSummary: z.string().min(10, "사건 개요를 10자 이상 입력해 주세요.").max(5000),
});

const insurerSchema = baseSchema.extend({
  company: z.string().min(1),
  department: z.string().optional(),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  requestType: z.enum(["자문계약", "개별 사건", "SIU 협업", "구상 위임"]),
});

const enterpriseSchema = baseSchema.extend({
  company: z.string().min(1),
  industry: z.string().optional(),
  contactName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

const medicalSchema = baseSchema.extend({
  patientName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().or(z.literal("")).optional(),
  hospital: z.string().optional(),
  visitDate: z.string().optional(),
  hasRecords: z.enum(["yes", "no", "unknown"]),
  preferredDate: z.string().optional(),
});

const personalSchema = baseSchema.extend({
  matterType: z.enum(["자동차", "생명보험금", "배상책임", "기타"]),
  applicantName: z.string().min(1),
  phone: z.string().min(1),
  preferredMethod: z.enum(["전화", "방문", "온라인"]).default("전화"),
});

const schemas = {
  insurer: insurerSchema,
  enterprise: enterpriseSchema,
  medical: medicalSchema,
  personal: personalSchema,
};

export type ConsultationResult = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitConsultation(
  _prev: ConsultationResult | null,
  formData: FormData
): Promise<ConsultationResult> {
  const raw: Record<string, FormDataEntryValue> = {};
  formData.forEach((v, k) => { raw[k] = v; });

  const personaParse = personaEnum.safeParse(raw.persona);
  if (!personaParse.success) {
    return { ok: false, message: "유효하지 않은 페르소나입니다." };
  }
  const persona = personaParse.data;
  const schema = schemas[persona];

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, message: "입력값을 확인해 주세요.", errors };
  }
  const data = parsed.data;

  // Build contact_info / case_summary for Supabase row
  const contactInfo = { ...data };
  delete (contactInfo as Record<string, unknown>).persona;
  delete (contactInfo as Record<string, unknown>).agreement;
  delete (contactInfo as Record<string, unknown>).caseSummary;

  try {
    if (hasSupabaseConfig()) {
      const supabase = getServerSupabase();
      const { error } = await supabase.from("consultation_requests").insert({
        persona: data.persona,
        contact_info: contactInfo,
        case_summary: data.caseSummary,
      });
      if (error) throw error;
    } else {
      console.log("[consultation:noop]", {
        persona: data.persona,
        contactInfo,
        caseSummary: data.caseSummary,
      });
    }

    const personaLabels: Record<typeof data.persona, string> = {
      insurer: "보험사·손해사정사",
      enterprise: "기업 자문",
      medical: "의료분쟁",
      personal: "개인 사건",
    };

    await notifyConsultation({
      title: `🔔 신규 상담 신청 — ${personaLabels[data.persona]}`,
      fields: [
        ...Object.entries(contactInfo).map(([k, v]) => ({
          name: k,
          value: String(v ?? ""),
        })),
        { name: "사건 개요", value: data.caseSummary },
      ],
    });

    revalidatePath(`/contact/${data.persona}`);

    return {
      ok: true,
      message:
        "상담 신청이 접수되었습니다. 영업일 기준 1~2일 내에 담당자가 연락드립니다.",
    };
  } catch (e) {
    console.error("[consultation:error]", e);
    return {
      ok: false,
      message:
        "전송 중 오류가 발생했습니다. 잠시 후 다시 시도하시거나, 직접 전화/이메일로 연락 주세요.",
    };
  }
}
