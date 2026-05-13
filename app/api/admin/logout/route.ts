import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin/auth";

export async function POST(req: Request) {
  clearAdminCookie();
  const url = new URL(req.url);
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}
