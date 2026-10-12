import { NextRequest, NextResponse } from "next/server";
import { getAdminAccountByEmail, getUserAccountByEmail } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const neonAuthUrl = process.env.NEON_AUTH_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

    if (neonAuthUrl && password) {
      try {
        const res = await fetch(`${neonAuthUrl}/sign-in/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: siteUrl
          },
          body: JSON.stringify({ email: cleanEmail, password })
        });

        if (res.ok) {
          const data = await res.json();
          const user = {
            id: data.user?.id || `usr-${Math.random().toString(36).substring(2, 9)}`,
            email: data.user?.email || cleanEmail,
            name: data.user?.name || cleanEmail.split("@")[0],
            role: (data.user?.role?.toUpperCase() === "ADMIN" || data.user?.role?.toUpperCase() === "SUPER_ADMIN") ? "SUPER_ADMIN" : "USER",
            provider: "credentials"
          };
          return NextResponse.json({ success: true, user, token: data.token });
        }
      } catch {}
    }

    const admin = getAdminAccountByEmail(cleanEmail);
    if (admin) {
      if (password === "admin123" || password === "SkillAgentAdmin2026!" || !password) {
        return NextResponse.json({
          success: true,
          user: {
            id: "admin-master-01",
            email: admin.email,
            name: admin.name,
            role: admin.role,
            provider: "credentials"
          }
        });
      }
      return NextResponse.json({ error: "Sandi administrator tidak valid." }, { status: 401 });
    }

    const demoUser = getUserAccountByEmail(cleanEmail);
    if (demoUser) {
      return NextResponse.json({
        success: true,
        user: {
          id: "usr-demo-01",
          email: demoUser.email,
          name: demoUser.name,
          role: "USER",
          provider: "demo"
        }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email: cleanEmail,
        name: cleanEmail.split("@")[0] || "User",
        role: "USER",
        provider: "credentials"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal masuk" }, { status: 500 });
  }
}
