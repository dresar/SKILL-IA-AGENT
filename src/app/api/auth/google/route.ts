import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const neonAuthUrl = process.env.NEON_AUTH_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

    if (!neonAuthUrl) {
      return NextResponse.redirect(new URL("/login?error=neon_auth_unconfigured", req.url));
    }

    const res = await fetch(`${neonAuthUrl}/sign-in/social`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: siteUrl
      },
      body: JSON.stringify({
        provider: "google",
        callbackURL: `${siteUrl}/`
      })
    });

    const data = await res.json();

    if (data.url) {
      return NextResponse.redirect(data.url);
    }

    return NextResponse.redirect(new URL("/login?error=oauth_init_failed", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}
