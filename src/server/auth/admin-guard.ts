import { NextRequest, NextResponse } from "next/server";
import { isAdminRole } from "@/lib/auth/types";

export function requireAdminRequest(req: NextRequest) {
  const role = req.cookies.get("skill_uiai_role")?.value || req.headers.get("x-skill-uiai-role");

  if (!isAdminRole(role)) {
    return NextResponse.json(
      { ok: false, success: false, error: "Admin role required." },
      { status: 403 }
    );
  }

  return null;
}
