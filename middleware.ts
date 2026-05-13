import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "dowon_admin";

function isAllowed(email: string | undefined) {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAIL_WHITELIST ?? "";
  const list = raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return list.includes(email.toLowerCase());
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const email = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!isAllowed(email)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
