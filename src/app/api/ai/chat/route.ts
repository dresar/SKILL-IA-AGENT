import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPublishedSkills } from "@/server/services/skills";

const BYNARA_BASE_URL = process.env.BYNARA_BASE_URL || "https://router.bynara.id/v1";
const BYNARA_API_KEY = process.env.BYNARA_API_KEY || "sk-nry-0KAezWyaGVZKiUSPmcBpT44F84a7jocNlZCCY7bLn9g";
const BYNARA_MODEL = process.env.BYNARA_MODEL || "step-5-preview";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieEmail = cookieStore.get("skill_uiai_email")?.value;
    const cookieRole = cookieStore.get("skill_uiai_role")?.value;
    const authCookie = cookieStore.get("skill_uiai_auth")?.value;
    const headerEmail = request.headers.get("x-user-email");

    const isAuthenticated = Boolean(cookieEmail || headerEmail || cookieRole || authCookie);
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          error: "Login required. Silakan masuk (login) terlebih dahulu untuk menggunakan AI Assistant.",
          requiresAuth: true
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Daftar pesan (messages) wajib disertakan." },
        { status: 400 }
      );
    }

    const skillsCatalog = await getPublishedSkills({ limit: 200 });
    const skillsSummary = skillsCatalog
      .map((s) => {
        const catNames = s.categories.map((c) => c.name).join(", ") || s.skillType;
        const installCmd = s.primaryRecipe?.command || `npx skills add dresar/SKILL-IA-AGENT -s ${s.slug}`;
        const briefDesc = ((s as any).description || s.summary || "").slice(0, 150).replace(/\n/g, " ");
        return `- [${s.name}](/skills/${s.slug}) (slug: ${s.slug}, kategori: ${catNames}): ${s.summary}. Deskripsi: ${briefDesc}. Perintah: ${installCmd}`;
      })
      .join("\n");

    const systemPrompt = `Anda adalah SkillAgent Assistant cerdas bertenaga model step-5-preview pada router byNara.
Tugas utama Anda adalah merekomendasikan skill agen pengkodean otomatis (Google Antigravity, Claude Code CLI, Cursor, Cline, Aider) berdasarkan kebutuhan pengguna.

Berikut adalah daftar seluruh skill tervalidasi yang ada di dalam database SkillAgent Registry saat ini:
${skillsSummary}

Aturan Penanganan Permintaan:
1. BACA dan COCOKKAN seluruh judul skill, ringkasan, dan kategori di atas dengan kebutuhan yang ditanyakan pengguna.
2. Ketika merekomendasikan skill, WAJIB sebutkan nama skill dengan link Markdown: [Nama Skill](/skills/{slug}).
3. Berikan penjelasan singkat 1-2 kalimat MENGAPA skill tersebut cocok untuk kebutuhan pengguna.
4. Sertakan perintah instalasi CLI satu baris yang sesuai.
5. Jika pengguna menanyakan skill yang belum ada di katalog, sarankan skill terdekat yang relevan dan beri tahu bahwa mereka dapat mengajukan skill baru melalui menu [Submit Skill](/submit).
6. Terapkan gaya bahasa ringkas, profesional, anti-slop (tanpa basa-basi berlebih), dan dukung standar clean code zero-comment (nokomen).`;

    const conversation = [
      { role: "system", content: systemPrompt },
      ...messages.slice(-10)
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);

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

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        {
          error: "Gagal memproses permintaan dari upstream AI router.",
          details: errText
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (data.error) {
      const errMsg = typeof data.error === "string" ? data.error : data.error.message || "Model upstream error.";
      return NextResponse.json(
        {
          ok: false,
          error: errMsg,
          details: data.error
        },
        { status: 502 }
      );
    }

    const answer = data.choices?.[0]?.message?.content || "Tidak ada tanggapan dari model.";

    return NextResponse.json({
      ok: true,
      content: answer,
      model: BYNARA_MODEL,
      usage: data.usage
    });
  } catch (err: any) {
    const isTimeout = err?.name === "AbortError";
    return NextResponse.json(
      {
        error: isTimeout
          ? "Permintaan ke AI model melebihi batas waktu (timeout)."
          : "Terjadi kesalahan server saat menghubungi AI assistant."
      },
      { status: 500 }
    );
  }
}
