import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { ADMIN_ROLES, getAdminAccountByEmail } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";
  const origin = host ? `${proto}://${host}` : req.nextUrl.origin || defaultSiteUrl;

  const redirectParam = req.nextUrl.searchParams.get("redirect") || "/";
  const safeRedirect = redirectParam.startsWith("/") ? redirectParam : "/";

  try {
    const query = `
      SELECT 
        s.id as session_id,
        s.token as session_token,
        s."userId" as user_id,
        s."expiresAt" as expires_at,
        u.id as u_id,
        u.name,
        u.email,
        u.image,
        u.role as user_role
      FROM neon_auth.session s
      JOIN neon_auth.user u ON s."userId" = u.id
      ORDER BY s."createdAt" DESC
      LIMIT 1;
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return NextResponse.redirect(new URL("/login?error=neon_session_not_found", origin));
    }

    const row = result.rows[0];
    const email = (row.email || "").toLowerCase().trim();
    const name = row.name || email.split("@")[0] || "User";
    const image = row.image || null;

    let role: "SUPER_ADMIN" | "CURATOR" | "USER" = "USER";
    if (email === "eka.ckp16799@gmail.com" || getAdminAccountByEmail(email)) {
      role = "SUPER_ADMIN";
    } else if (row.user_role?.toUpperCase() === "ADMIN" || row.user_role?.toUpperCase() === "SUPER_ADMIN") {
      role = "SUPER_ADMIN";
    }

    try {
      const existingProfile = await db.select().from(profiles).where(eq(profiles.authSubject, email)).limit(1);
      if (existingProfile.length === 0) {
        await db.insert(profiles).values({
          authSubject: email,
          displayName: name,
          themePreference: "dark"
        });
      }
    } catch {}

    const authUser = {
      id: row.u_id || row.user_id,
      email,
      name,
      role,
      avatar: image,
      provider: "google"
    };

    const targetUrl = new URL(safeRedirect, origin);
    targetUrl.searchParams.set("auth_success", "true");

    const response = NextResponse.redirect(targetUrl);
    const maxAge = 60 * 60 * 24 * 7;
    const isSecure = proto === "https";

    response.cookies.set("skill_uiai_session", row.session_token || "", {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: isSecure
    });

    response.cookies.set("skill_uiai_email", encodeURIComponent(email), {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: isSecure
    });

    response.cookies.set("skill_uiai_role", encodeURIComponent(role), {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: isSecure
    });

    response.cookies.set("skill_uiai_auth", encodeURIComponent(JSON.stringify(authUser)), {
      path: "/",
      maxAge,
      sameSite: "lax",
      secure: isSecure
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=neon_callback_exception", origin));
  }
}
