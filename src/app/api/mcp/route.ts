import { NextRequest, NextResponse } from "next/server";
import {
  getPublishedSkills,
  getSkillDetailBySlug,
  getAllCategories
} from "@/server/services/skills";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    name: "skillagent-mcp",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    status: "active",
    tools: [
      {
        name: "search_skills",
        description: "Mencari katalog skill agen AI berdasarkan kata kunci, tag, atau deskripsi.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            category: { type: "string" },
            limit: { type: "number" }
          }
        }
      },
      {
        name: "get_skill",
        description: "Mengambil metadata lengkap skill, resep instalasi, dan lisensi berdasarkan slug.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string" }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_skill_content",
        description: "Mengambil konten mentah SKILL.md untuk disematkan langsung ke system prompt agent.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string" }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_install_command",
        description: "Mengambil perintah instalasi resmi untuk runtime target.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string" },
            target: { type: "string" }
          },
          required: ["slug"]
        }
      },
      {
        name: "list_categories",
        description: "Menampilkan seluruh taksonomi kategori skill yang terdaftar di registry.",
        inputSchema: {
          type: "object",
          properties: {}
        }
      },
      {
        name: "get_skill_preview",
        description: "Mengambil spesifikasi visual SVG dan metadata pratinjau aset grafis.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string" }
          },
          required: ["slug"]
        }
      }
    ]
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isJsonRpc = Boolean(body.jsonrpc);
    const id = body.id ?? 1;

    const toolName = body.tool || body.params?.name || body.name;
    const typedArgs = body.arguments || body.params?.arguments || body.args || {};

    if (!toolName) {
      if (body.method === "tools/list") {
        const getRes = await GET();
        const data = await getRes.json();
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: { tools: data.tools }
        });
      }
      return NextResponse.json(
        isJsonRpc
          ? { jsonrpc: "2.0", id, error: { code: -32600, message: "Missing tool name" } }
          : { ok: false, error: "Missing tool name" },
        { status: 400 }
      );
    }

    let payload: any = null;

    if (toolName === "search_skills") {
      const items = await getPublishedSkills({
        query: typedArgs.query,
        category: typedArgs.category,
        skillType: typedArgs.skill_type,
        limit: typedArgs.limit
      });
      payload = items;
    } else if (toolName === "get_skill") {
      if (!typedArgs.slug) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing slug parameter" } }
            : { ok: false, error: "Missing slug parameter" },
          { status: 400 }
        );
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32004, message: "Skill not found" } }
            : { ok: false, error: "Skill not found" },
          { status: 404 }
        );
      }
      payload = skill;
    } else if (toolName === "get_skill_content") {
      if (!typedArgs.slug) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing slug parameter" } }
            : { ok: false, error: "Missing slug parameter" },
          { status: 400 }
        );
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32004, message: "Skill not found" } }
            : { ok: false, error: "Skill not found" },
          { status: 404 }
        );
      }
      payload = {
        slug: skill.slug,
        name: skill.name,
        instructions: skill.description,
        summary: skill.summary
      };
    } else if (toolName === "get_install_command") {
      if (!typedArgs.slug) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing slug parameter" } }
            : { ok: false, error: "Missing slug parameter" },
          { status: 400 }
        );
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32004, message: "Skill not found" } }
            : { ok: false, error: "Skill not found" },
          { status: 404 }
        );
      }
      const target = typedArgs.target || "antigravity";
      const matched =
        skill.recipes.find((r) => r.target.toLowerCase() === target.toLowerCase()) ||
        skill.recipes[0];
      payload = matched;
    } else if (toolName === "list_categories") {
      payload = await getAllCategories();
    } else if (toolName === "get_skill_preview") {
      if (!typedArgs.slug) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing slug parameter" } }
            : { ok: false, error: "Missing slug parameter" },
          { status: 400 }
        );
      }
      const skill = await getSkillDetailBySlug(typedArgs.slug);
      if (!skill) {
        return NextResponse.json(
          isJsonRpc
            ? { jsonrpc: "2.0", id, error: { code: -32004, message: "Skill not found" } }
            : { ok: false, error: "Skill not found" },
          { status: 404 }
        );
      }
      payload = {
        slug: skill.slug,
        previewUrl: `/previews/${skill.slug}.svg`,
        showcases: skill.showcases,
        assets: skill.assets
      };
    } else {
      return NextResponse.json(
        isJsonRpc
          ? { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${toolName}` } }
          : { ok: false, error: `Unknown tool: ${toolName}` },
        { status: 404 }
      );
    }

    if (isJsonRpc) {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)
            }
          ]
        }
      });
    }

    return NextResponse.json({ ok: true, result: payload });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
