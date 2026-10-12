import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const neonAuthUrl = process.env.NEON_AUTH_URL;
    const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

    if (!neonAuthUrl) {
      return NextResponse.redirect(new URL("/login/?error=neon_auth_unconfigured", req.url));
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const origin = host ? `${proto}://${host}` : req.nextUrl.origin || defaultSiteUrl;

    const rawRedirect = req.nextUrl.searchParams.get("redirect") || "/";
    const cleanRedirect = (rawRedirect.startsWith("/login") || rawRedirect.startsWith("/admin/login")) ? "/" : rawRedirect;
    const callbackURL = `${origin}/api/auth/callback/neon/?redirect=${encodeURIComponent(cleanRedirect)}`;

    const res = await fetch(`${neonAuthUrl}/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: origin
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL
      })
    });

    const data = await res.json();

    if (data.url) {
      const response = NextResponse.redirect(data.url);
      response.cookies.set("skill_uiai_oauth_time", Date.now().toString(), {
        path: "/",
        maxAge: 600,
        sameSite: "lax",
        secure: proto === "https" || process.env.NODE_ENV === "production"
      });
      return response;
    }

    return NextResponse.redirect(new URL("/login/?error=oauth_init_failed", origin));
  } catch {
    return NextResponse.redirect(new URL("/login/?error=server_error", req.url));
  }
}
