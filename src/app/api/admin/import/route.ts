import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/server/auth/admin-guard";
import { processImportJob } from "@/server/services/imports";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  return NextResponse.json({ status: "active" });
}

export async function POST(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ ok: false, error: "Valid URL required" }, { status: 400 });
    }

    const skill = await processImportJob(url);
    return NextResponse.json({ ok: true, skill });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to import";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
