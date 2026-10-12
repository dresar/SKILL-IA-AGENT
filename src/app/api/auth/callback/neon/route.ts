import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { db } from "@/lib/db/client";
import { eq } from "drizzle-orm";
import { getAdminAccountByEmail, isAdminRole, UserRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";
  const origin = host ? `${proto}://${host}` : req.nextUrl.origin || defaultSiteUrl;

  const rawRedirect = req.nextUrl.searchParams.get("redirect") || "/";
  const safeRedirect = rawRedirect.startsWith("/") ? rawRedirect : "/";
  const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "").trim();

  try {
    const query = `
      SELECT 
        s.id as session_id,
        s.token as session_token,
        s."userId" as user_id,
        s."expiresAt" as expires_at,
        s."ipAddress" as ip_address,
        u.id as u_id,
        u.name,
        u.email,
        u.image,
        u.role as user_role
      FROM neon_auth.session s
      JOIN neon_auth.user u ON s."userId" = u.id
      WHERE s."expiresAt" > NOW()
      ORDER BY 
        (CASE WHEN $1 <> '' AND s."ipAddress" = $1 THEN 0 ELSE 1 END),
        s."createdAt" DESC
      LIMIT 1;
    `;

    const result = await pool.query(query, [clientIp]);

    if (result.rows.length === 0) {
      return NextResponse.redirect(new URL("/login/?error=neon_session_not_found", origin));
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

    let destination = safeRedirect;
    if (destination.startsWith("/login") || destination.startsWith("/admin/login")) {
      destination = isAdminRole(role) ? "/admin/" : "/";
    }

    const targetUrl = new URL(destination, origin);
    targetUrl.searchParams.set("auth_success", "true");

    const response = NextResponse.redirect(targetUrl);
    const maxAge = 60 * 60 * 24 * 7;
    const isSecure = proto === "https" || process.env.NODE_ENV === "production";

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
    return NextResponse.redirect(new URL("/login/?error=neon_callback_exception", origin));
  }
}
