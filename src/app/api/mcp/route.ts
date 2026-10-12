import { NextRequest, NextResponse } from "next/server";
import {
  getPublishedSkills,
  getSkillDetailBySlug,
  getAllCategories
} from "@/server/services/skills";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    name: "skill-uiai-mcp",
    version: "1.0.0",
    status: "active",
    tools: [
      "search_skills",
      "get_skill",
      "get_skill_content",
      "get_install_command",
      "list_categories",
      "get_skill_preview"
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, arguments: args } = body;
    const typedArgs = args || {};

    if (tool === "search_skills") {
      const items = await getPublishedSkills({
        query: typedArgs.query,
        category: typedArgs.category,
        skillType: typedArgs.skill_type,
        limit: typedArgs.limit
      });
      return NextResponse.json({ ok: true, result: items });
    }

    if (tool === "get_skill") {
      if (!typedArgs.slug) {
        return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json({ ok: false, error: "Skill not found" }, { status: 404 });
      }
      return NextResponse.json({ ok: true, result: skill });
    }

    if (tool === "get_install_command") {
      if (!typedArgs.slug) {
        return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json({ ok: false, error: "Skill not found" }, { status: 404 });
      }
      const target = typedArgs.target || "antigravity";
      const matched =
        skill.recipes.find((r) => r.target.toLowerCase() === target.toLowerCase()) ||
        skill.recipes[0];
      return NextResponse.json({ ok: true, result: matched });
    }

    if (tool === "list_categories") {
      const cats = await getAllCategories();
      return NextResponse.json({ ok: true, result: cats });
    }

    if (tool === "get_skill_preview") {
      if (!typedArgs.slug) {
        return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json({ ok: false, error: "Skill not found" }, { status: 404 });
      }
      return NextResponse.json({
        ok: true,
        result: { showcases: skill.showcases, assets: skill.assets }
      });
    }

    return NextResponse.json({ ok: false, error: `Unknown tool: ${tool}` }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
