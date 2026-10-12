import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth/types";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login/";
    url.searchParams.set("redirect", "/admin/");
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    const role = request.cookies.get("skill_uiai_role")?.value;
    if (!isAdminRole(role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login/";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
