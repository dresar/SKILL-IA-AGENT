import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdminRequest } from "@/server/auth/admin-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  const baseDir = path.join(process.cwd(), "skills");
  let list: string[] = [];
  try {
    if (fs.existsSync(baseDir)) {
      list = fs.readdirSync(baseDir);
    }
  } catch {}
  return NextResponse.json({
    success: true,
    skills: list,
    message: "Daftar skill dalam folder skills lokal."
  });
}

export async function POST(req: NextRequest) {
  const denied = requireAdminRequest(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { slug, name, summary, category, demoPrompt, demoOutput, svgContent } = body;

    if (!slug || !name) {
      return NextResponse.json({ success: false, error: "Slug dan nama wajib diisi." }, { status: 400 });
    }

    const baseSkillsDir = path.join(process.cwd(), "skills", slug);
    const publicPreviewsDir = path.join(process.cwd(), "public", "previews");

    if (!fs.existsSync(baseSkillsDir)) {
      fs.mkdirSync(baseSkillsDir, { recursive: true });
    }
    if (!fs.existsSync(publicPreviewsDir)) {
      fs.mkdirSync(publicPreviewsDir, { recursive: true });
    }

    const skillMd = `# ${name}\n\n> ${summary || ""}\n\n## Kategori\n${category || "Umum"}\n\n## Instalasi\n\`\`\`bash\nnpx skills add dresar/SKILL-IA-AGENT -s ${slug}\n\`\`\`\n\n## Demo Prompt\n\`\`\`text\n${demoPrompt || ""}\n\`\`\`\n\n## Demo Output\n\`\`\`typescript\n${demoOutput || ""}\n\`\`\`\n`;

    fs.writeFileSync(path.join(baseSkillsDir, "SKILL.md"), skillMd, "utf-8");

    if (svgContent) {
      fs.writeFileSync(path.join(baseSkillsDir, "preview.svg"), svgContent, "utf-8");
      fs.writeFileSync(path.join(publicPreviewsDir, `${slug}.svg`), svgContent, "utf-8");
    }

    const demoJson = JSON.stringify(
      {
        slug,
        name,
        prompt: demoPrompt || "",
        output: demoOutput || ""
      },
      null,
      2
    );
    fs.writeFileSync(path.join(baseSkillsDir, "demo.json"), demoJson, "utf-8");

    return NextResponse.json({
      success: true,
      message: `Skill ${slug} berhasil disinkronisasi ke folder skills.`
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal sinkronisasi ke folder GitHub.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
