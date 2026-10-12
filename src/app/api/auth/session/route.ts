import { NextRequest, NextResponse } from "next/server";
import { isUserRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get("skill_uiai_auth")?.value;
    if (authCookie) {
      try {
        const decoded = decodeURIComponent(authCookie);
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed.email === "string" && isUserRole(parsed.role)) {
          return NextResponse.json({
            ok: true,
            isAuthenticated: true,
            user: parsed
          });
        }
      } catch {}
    }

    const emailCookie = req.cookies.get("skill_uiai_email")?.value;
    const roleCookie = req.cookies.get("skill_uiai_role")?.value;

    if (emailCookie) {
      const email = decodeURIComponent(emailCookie);
      const role = (roleCookie ? decodeURIComponent(roleCookie) : "USER") as any;
      const user = {
        id: `usr-${email.replace(/[^a-z0-9]/gi, "")}`,
        email,
        name: email.split("@")[0],
        role: isUserRole(role) ? role : "USER",
        provider: "credentials"
      };
      return NextResponse.json({
        ok: true,
        isAuthenticated: true,
        user
      });
    }

    return NextResponse.json({
      ok: true,
      isAuthenticated: false,
      user: null
    });
  } catch {
    return NextResponse.json({
      ok: false,
      isAuthenticated: false,
      user: null
    }, { status: 500 });
  }
}
