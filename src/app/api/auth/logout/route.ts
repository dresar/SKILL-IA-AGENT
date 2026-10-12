import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("skill_uiai_session", "", { path: "/", maxAge: 0 });
  response.cookies.set("skill_uiai_email", "", { path: "/", maxAge: 0 });
  response.cookies.set("skill_uiai_role", "", { path: "/", maxAge: 0 });
  response.cookies.set("skill_uiai_auth", "", { path: "/", maxAge: 0 });
  return response;
}
