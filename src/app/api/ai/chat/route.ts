import { NextRequest, NextResponse } from "next/server";
import { getPublishedSkills } from "@/server/services/skills";

const BYNARA_BASE_URL = process.env.BYNARA_BASE_URL || "https://router.bynara.id/v1";
const BYNARA_API_KEY = process.env.BYNARA_API_KEY || "sk-nry-0KAezWyaGVZKiUSPmcBpT44F84a7jocNlZCCY7bLn9g";
const BYNARA_MODEL = process.env.BYNARA_MODEL || "step-5-preview";

function generateCatalogFallbackRecommendation(query: string, skills: any[]): string {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = skills.map((s) => {
    let score = 0;
    const sName = s.name.toLowerCase();
    const sSlug = s.slug.toLowerCase();
    const sSummary = (s.summary || "").toLowerCase();
    const sDesc = (s.description || "").toLowerCase();
    const sCats = s.categories.map((c: any) => c.name.toLowerCase()).join(" ");

    for (const w of words) {
      if (sName.includes(w)) score += 10;
      if (sSlug.includes(w)) score += 8;
      if (sCats.includes(w)) score += 6;
      if (sSummary.includes(w)) score += 4;
      if (sDesc.includes(w)) score += 2;
    }
    return { skill: s, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const bestMatches = scored.filter((item) => item.score > 0).slice(0, 3);
  const picked = bestMatches.length > 0 ? bestMatches.map((m) => m.skill) : skills.slice(0, 3);

  const lines: string[] = [];
  lines.push(`Berdasarkan pembacaan katalog registry SkillAgent terhadap permintaan "${query.slice(0, 80)}", berikut rekomendasi skill yang paling cocok:\n`);

  picked.forEach((s, idx) => {
    const installCmd = s.primaryRecipe?.command || `npx skills add dresar/SKILL-IA-AGENT -s ${s.slug}`;
    const catName = s.categories[0]?.name || s.skillType || "General";
    lines.push(`${idx + 1}. **[${s.name}](/skills/${s.slug}/)** (Kategori: ${catName})`);
    lines.push(`   - Ringkasan: ${s.summary}`);
    lines.push(`   - Perintah Instalasi: \`${installCmd}\`\n`);
  });

  lines.push(`Pelajari dokumentasi lengkap di [Dokumentasi](/dokumentasi/) atau ajukan kontribusi skill baru di [Submit Skill](/submit/).`);
  return lines.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Daftar pesan (messages) wajib disertakan." },
        { status: 400 }
      );
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const skillsCatalog = await getPublishedSkills({ limit: 200 });

    const skillsSummary = skillsCatalog
      .map((s) => {
        const catNames = s.categories.map((c) => c.name).join(", ") || s.skillType;
        const installCmd = s.primaryRecipe?.command || `npx skills add dresar/SKILL-IA-AGENT -s ${s.slug}`;
        const briefDesc = ((s as any).description || s.summary || "").slice(0, 150).replace(/\n/g, " ");
        return `- [${s.name}](/skills/${s.slug}/) (slug: ${s.slug}, kategori: ${catNames}): ${s.summary}. Deskripsi: ${briefDesc}. Perintah: ${installCmd}`;
      })
      .join("\n");

    const systemPrompt = `Anda adalah SkillAgent Assistant cerdas bertenaga model step-5-preview pada router byNara.
Tugas utama Anda adalah merekomendasikan skill agen pengkodean otomatis (Google Antigravity, Claude Code CLI, Cursor, Cline, Aider) berdasarkan kebutuhan pengguna.

Berikut adalah daftar seluruh skill tervalidasi yang ada di dalam database SkillAgent Registry saat ini:
${skillsSummary}

Aturan Penanganan Permintaan:
1. BACA dan COCOKKAN seluruh judul skill, ringkasan, dan kategori di atas dengan kebutuhan yang ditanyakan pengguna.
2. Ketika merekomendasikan skill, WAJIB sebutkan nama skill dengan link Markdown: [Nama Skill](/skills/{slug}/).
3. Berikan penjelasan singkat 1-2 kalimat MENGAPA skill tersebut cocok untuk kebutuhan pengguna.
4. Sertakan perintah instalasi CLI satu baris yang sesuai.
5. Jika pengguna menanyakan skill yang belum ada di katalog, sarankan skill terdekat yang relevan dan beri tahu bahwa mereka dapat mengajukan skill baru melalui menu [Submit Skill](/submit/).
6. Terapkan gaya bahasa ringkas, profesional, anti-slop (tanpa basa-basi berlebih), dan dukung standar clean code zero-comment (nokomen).`;

    const conversation = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10)
    ];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`${BYNARA_BASE_URL}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Authorization": `Bearer ${BYNARA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: BYNARA_MODEL,
          messages: conversation
        })
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (!data.error && data.choices?.[0]?.message?.content) {
          return NextResponse.json({
            ok: true,
            content: data.choices[0].message.content,
            model: BYNARA_MODEL,
            usage: data.usage
          });
        }
      }
    } catch {}

    const fallbackResponse = generateCatalogFallbackRecommendation(lastUserMessage, skillsCatalog);
    return NextResponse.json({
      ok: true,
      content: fallbackResponse,
      model: "skill-catalog-matcher",
      isFallback: true
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memproses rekomendasi skill." },
      { status: 500 }
    );
  }
}
