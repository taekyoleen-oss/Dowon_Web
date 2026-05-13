"use server";

import { redirect } from "next/navigation";
import { isAllowedEmail, setAdminCookie } from "@/lib/admin/auth";

export type AdminLoginResult = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function adminLogin(
  _prev: AdminLoginResult | null,
  formData: FormData
): Promise<AdminLoginResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { ok: false, error: "이메일을 입력해 주세요." };
  }
  if (!isAllowedEmail(email)) {
    // Intentionally generic message — do not leak whitelist state.
    return {
      ok: false,
      error: "허용되지 않은 계정입니다. 관리자에게 문의하세요.",
    };
  }
  setAdminCookie(email);
  redirect("/admin");
}
