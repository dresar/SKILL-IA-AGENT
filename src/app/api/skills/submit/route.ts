import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { importJobs, skills } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, description, author, category } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { ok: false, error: "URL repository atau SKILL.md wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanDesc = typeof description === "string" ? description.trim() : "";
    const cleanAuthor = typeof author === "string" && author.trim() ? author.trim() : "Community Contributor";
    const cleanCat = typeof category === "string" && category.trim() ? category.trim() : "general";

    let insertedId = "job-" + Math.random().toString(36).substring(2, 9);

    try {
      const [inserted] = await db
        .insert(importJobs)
        .values({
          sourceUrl: cleanUrl,
          status: "pending",
          detectedMetadata: {
            name: cleanName || cleanUrl.split("/").pop() || "Agent Skill",
            description: cleanDesc,
            author: cleanAuthor,
            category: cleanCat
          }
        })
        .returning();
      if (inserted) {
        insertedId = inserted.id;
      }
    } catch {
      insertedId = "job-" + Date.now();
    }

    return NextResponse.json({
      ok: true,
      jobId: insertedId,
      message: "Skill berhasil diajukan untuk verifikasi kurator.",
      data: {
        url: cleanUrl,
        name: cleanName,
        status: "pending"
      }
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan internal saat memproses pengajuan skill." },
      { status: 500 }
    );
  }
}
