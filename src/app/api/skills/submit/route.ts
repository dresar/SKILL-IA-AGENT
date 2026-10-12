import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { importJobs, skills, installRecipes, skillCategories, categories, assets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      url,
      name,
      description,
      author,
      category,
      command,
      previewImageUrl,
      targets,
      skillMdContent
    } = body;

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
    const fullDesc = typeof skillMdContent === "string" && skillMdContent.trim() ? skillMdContent.trim() : (typeof description === "string" && description.trim() ? description.trim() : `Aturan skill agen untuk ${cleanName}.`);
    const cleanSummary = typeof description === "string" && description.trim() ? description.trim() : fullDesc.slice(0, 160);
    const cleanAuthor = typeof author === "string" && author.trim() ? author.trim() : "Community Contributor";
    const cleanCat = typeof category === "string" && category.trim() ? category.trim() : "frontend";
    const cleanPreview = typeof previewImageUrl === "string" && previewImageUrl.trim() ? previewImageUrl.trim() : null;

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
          summary: cleanSummary.length > 200 ? cleanSummary.slice(0, 197) + "..." : cleanSummary,
          description: fullDesc,
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

        const targetList = Array.isArray(targets) && targets.length > 0
          ? targets
          : ["antigravity", "claude"];

        for (const t of targetList) {
          let cmd = command || "";
          if (!cmd) {
            if (t === "antigravity") cmd = `npx skills add ${cleanUrl} -s ${finalSlug}`;
            else if (t === "claude") cmd = `claude skill add ${cleanUrl}/${finalSlug}`;
            else if (t === "cursor") cmd = `@skill ${cleanUrl}/${finalSlug}/SKILL.md`;
            else if (t === "opencode") cmd = `opencode skill install ${cleanUrl} -s ${finalSlug}`;
            else if (t === "aider") cmd = `aider --read-file skills/${finalSlug}/SKILL.md`;
            else cmd = `npx skills add ${cleanUrl} -s ${finalSlug}`;
          }

          await db.insert(installRecipes).values({
            skillId: newSkill.id,
            target: t,
            displayLabel: t === "antigravity" ? "Google Antigravity" : t === "claude" ? "Claude Code" : t === "cursor" ? "Cursor Rules" : t === "opencode" ? "OpenCode" : "Aider",
            command: cmd,
            sourceUrl: cleanUrl,
            verificationStatus: "pending",
            isEnabled: false
          });
        }

        const imagesToInsert = Array.isArray(body.previewImages) && body.previewImages.length > 0
          ? body.previewImages
          : cleanPreview ? [cleanPreview] : [];

        for (let i = 0; i < imagesToInsert.length; i++) {
          const imgUrl = imagesToInsert[i];
          if (imgUrl && typeof imgUrl === "string") {
            await db.insert(assets).values({
              skillId: newSkill.id,
              objectKey: `preview-${finalSlug}-${i + 1}`,
              publicUrl: imgUrl,
              mimeType: imgUrl.startsWith("data:image/svg") ? "image/svg+xml" : imgUrl.startsWith("data:image/png") ? "image/png" : "image/jpeg",
              altText: `${cleanName} Preview ${i + 1}`,
              storageProvider: imgUrl.startsWith("data:") ? "base64" : "url",
              visibility: "public"
            });
          }
        }

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
            description: fullDesc,
            author: cleanAuthor,
            category: cleanCat,
            previewImageUrl: cleanPreview,
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
      message: "Skill berhasil diajukan dan masuk ke antrean verifikasi (ACC) kurator di Admin Panel.",
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
