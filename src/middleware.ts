import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin/login" || pathname === "/admin/login/";

  if (pathname.startsWith("/admin") && !isAdminLogin) {
    const role = request.cookies.get("skill_uiai_role")?.value;
    if (!isAdminRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
