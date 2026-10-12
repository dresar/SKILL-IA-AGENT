import { NextRequest, NextResponse } from "next/server";
import { getPublishedSkills } from "@/server/services/skills";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 20;

    const items = await getPublishedSkills({
      query: q,
      category,
      skillType: type,
      limit
    });

    return NextResponse.json({ ok: true, data: items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch skills";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
