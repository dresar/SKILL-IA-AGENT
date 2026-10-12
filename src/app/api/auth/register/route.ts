import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan sandi wajib diisi" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const neonAuthUrl = process.env.NEON_AUTH_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

    if (neonAuthUrl) {
      try {
        const res = await fetch(`${neonAuthUrl}/sign-up/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: siteUrl
          },
          body: JSON.stringify({
            email: cleanEmail,
            password,
            name: name?.trim() || cleanEmail.split("@")[0]
          })
        });

        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json(
            { error: data.message || "Pendaftaran gagal" },
            { status: res.status }
          );
        }

        const user = {
          id: data.user?.id || `usr-${Math.random().toString(36).substring(2, 9)}`,
          email: data.user?.email || cleanEmail,
          name: data.user?.name || cleanEmail.split("@")[0],
          role: "USER",
          provider: "credentials"
        };

        return NextResponse.json({ success: true, user, token: data.token });
      } catch (e: any) {
        return NextResponse.json({ error: e.message || "Gagal menghubungi auth server" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email: cleanEmail,
        name: name?.trim() || cleanEmail.split("@")[0],
        role: "USER",
        provider: "credentials"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal mendaftar" }, { status: 500 });
  }
}
