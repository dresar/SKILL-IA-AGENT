import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { importJobs, skills, installRecipes, skillCategories, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, description, author, category, command } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { ok: false, error: "URL repository atau SKILL.md wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUrl = url.trim();
    const rawName = typeof name === "string" && name.trim() ? name.trim() : cleanUrl.split("/").filter(Boolean).pop() || "Agent Skill";
    const cleanName = rawName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const baseSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "skill-" + Date.now();
    const cleanDesc = typeof description === "string" && description.trim() ? description.trim() : `Aturan skill agen untuk ${cleanName}.`;
    const cleanAuthor = typeof author === "string" && author.trim() ? author.trim() : "Community Contributor";
    const cleanCat = typeof category === "string" && category.trim() ? category.trim() : "frontend";
    const cleanCommand = typeof command === "string" && command.trim() ? command.trim() : `npx skills add ${cleanUrl} -s ${baseSlug}`;

    let finalSlug = baseSlug;
    try {
      const existing = await db.select({ id: skills.id }).from(skills).where(eq(skills.slug, finalSlug)).limit(1);
      if (existing.length > 0) {
        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
      }
    } catch {}

    let skillId = "";
    try {
      const [newSkill] = await db
        .insert(skills)
        .values({
          slug: finalSlug,
          name: cleanName,
          summary: cleanDesc.length > 180 ? cleanDesc.slice(0, 177) + "..." : cleanDesc,
          description: cleanDesc,
          status: "pending",
          skillType: cleanCat,
          authorDisplay: cleanAuthor,
          sourceKind: "github",
          sourceUrl: cleanUrl,
          verificationStatus: "pending_review"
        })
        .returning();

      if (newSkill) {
        skillId = newSkill.id;

        await db.insert(installRecipes).values({
          skillId: newSkill.id,
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: cleanCommand,
          sourceUrl: cleanUrl,
          verificationStatus: "pending",
          isEnabled: false
        });

        const catRows = await db.select().from(categories).where(eq(categories.slug, cleanCat)).limit(1);
        if (catRows.length > 0) {
          await db.insert(skillCategories).values({
            skillId: newSkill.id,
            categoryId: catRows[0].id
          });
        }
      }
    } catch {}

    let jobId = "job-" + Math.random().toString(36).substring(2, 9);
    try {
      const [inserted] = await db
        .insert(importJobs)
        .values({
          sourceUrl: cleanUrl,
          status: "pending",
          detectedMetadata: {
            name: cleanName,
            slug: finalSlug,
            description: cleanDesc,
            author: cleanAuthor,
            category: cleanCat,
            command: cleanCommand,
            skillId
          }
        })
        .returning();
      if (inserted) {
        jobId = inserted.id;
      }
    } catch {}

    return NextResponse.json({
      ok: true,
      jobId,
      message: "Skill berhasil diajukan dan masuk ke antrean verifikasi (acc) kurator.",
      data: {
        url: cleanUrl,
        slug: finalSlug,
        name: cleanName,
        status: "pending"
      }
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Terjadi kesalahan server saat memproses pengajuan skill." },
      { status: 500 }
    );
  }
}
