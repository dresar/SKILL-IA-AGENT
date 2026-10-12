import { NextRequest, NextResponse } from "next/server";
import { getPublishedSkills } from "@/server/services/skills";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getPublishedSkills({ limit: 50 });
    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch skills";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
