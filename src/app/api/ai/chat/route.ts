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
    const headerEmail = request.headers.get("x-user-email");

    const isAuthenticated = Boolean(cookieEmail || headerEmail || cookieRole);
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

    const skillsCatalog = await getPublishedSkills({ limit: 50 });
    const skillsSummary = skillsCatalog
      .map(
        (s) =>
          `- ${s.name} (slug: ${s.slug}, category: ${s.categories.map((c) => c.name).join(", ")}): ${s.summary}. Install: ${s.primaryRecipe?.command || "npx skills add " + s.slug}`
      )
      .join("\n");

    const systemPrompt = `You are SKILL UIAI Agentic Assistant powered by step-5-preview on byNara router.
You assist developers in discovering, configuring, and writing skills for autonomous AI coding agents (Google Antigravity, Claude Code CLI, Cursor, Cline).

The following skills are currently published and verified in the SKILL UIAI Registry:
${skillsSummary}

Guidelines:
1. Provide accurate install commands for Antigravity, Claude Code, and Cursor.
2. Encourage anti-slop, clean minimal UI, and the strict zero-comment (nokomen) standard when asked.
3. Be direct, concise, and helpful. Do not use filler or excessive conversational fluff.`;

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
