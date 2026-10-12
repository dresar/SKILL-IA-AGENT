import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { skills, installRecipes, auditEvents, skillCategories, categories } from "@/lib/db/schema";
import { eq, or, desc, inArray } from "drizzle-orm";
import { isAdminRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-skill-uiai-role") || req.cookies.get("skill_uiai_role")?.value;
    const decodedRole = roleHeader ? decodeURIComponent(roleHeader) : "";

    if (!isAdminRole(decodedRole)) {
      return NextResponse.json({ ok: false, error: "Akses admin ditolak." }, { status: 403 });
    }

    const submissionRows = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        summary: skills.summary,
        description: skills.description,
        status: skills.status,
        skillType: skills.skillType,
        authorDisplay: skills.authorDisplay,
        sourceUrl: skills.sourceUrl,
        verificationStatus: skills.verificationStatus,
        createdAt: skills.createdAt
      })
      .from(skills)
      .where(or(eq(skills.status, "pending"), eq(skills.status, "rejected"), eq(skills.status, "draft"))!)
      .orderBy(desc(skills.createdAt));

    const populated = await Promise.all(
      submissionRows.map(async (item) => {
        const recipeList = await db
          .select({
            command: installRecipes.command,
            target: installRecipes.target
          })
          .from(installRecipes)
          .where(eq(installRecipes.skillId, item.id))
          .limit(1);

        const catList = await db
          .select({
            name: categories.name,
            slug: categories.slug
          })
          .from(skillCategories)
          .innerJoin(categories, eq(skillCategories.categoryId, categories.id))
          .where(eq(skillCategories.skillId, item.id));

        return {
          ...item,
          command: recipeList[0]?.command || "",
          categoryName: catList[0]?.name || item.skillType
        };
      })
    );

    const pendingCount = populated.filter((s) => s.status === "pending").length;

    return NextResponse.json({
      ok: true,
      pendingCount,
      submissions: populated
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal memuat antrean persetujuan." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-skill-uiai-role") || req.cookies.get("skill_uiai_role")?.value;
    const emailHeader = req.headers.get("x-skill-uiai-email") || req.cookies.get("skill_uiai_email")?.value;
    const decodedRole = roleHeader ? decodeURIComponent(roleHeader) : "";
    const decodedEmail = emailHeader ? decodeURIComponent(emailHeader) : "admin";

    if (!isAdminRole(decodedRole)) {
      return NextResponse.json({ ok: false, error: "Akses admin ditolak." }, { status: 403 });
    }

    const body = await req.json();
    const { skillId, action } = body;

    if (!skillId || typeof skillId !== "string") {
      return NextResponse.json({ ok: false, error: "ID skill wajib diisi." }, { status: 400 });
    }

    if (action === "approve") {
      await db
        .update(skills)
        .set({
          status: "published",
          verificationStatus: "verified",
          publishedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(skills.id, skillId));

      await db
        .update(installRecipes)
        .set({
          isEnabled: true,
          verificationStatus: "verified"
        })
        .where(eq(installRecipes.skillId, skillId));

      try {
        await db.insert(auditEvents).values({
          action: "approve_submission",
          targetType: "skill",
          targetId: skillId,
          actorSubject: decodedEmail,
          metadata: { action: "acc", timestamp: new Date().toISOString() }
        });
      } catch {}

      return NextResponse.json({
        ok: true,
        message: "Skill berhasil disetujui (ACC) dan diterbitkan ke direktori publik."
      });
    }

    if (action === "reject") {
      await db
        .update(skills)
        .set({
          status: "rejected",
          verificationStatus: "rejected",
          updatedAt: new Date()
        })
        .where(eq(skills.id, skillId));

      try {
        await db.insert(auditEvents).values({
          action: "reject_submission",
          targetType: "skill",
          targetId: skillId,
          actorSubject: decodedEmail,
          metadata: { action: "reject", timestamp: new Date().toISOString() }
        });
      } catch {}

      return NextResponse.json({
        ok: true,
        message: "Pengajuan skill telah ditolak."
      });
    }

    if (action === "delete") {
      await db.delete(skills).where(eq(skills.id, skillId));

      return NextResponse.json({
        ok: true,
        message: "Skill berhasil dihapus dari database."
      });
    }

    return NextResponse.json({ ok: false, error: "Aksi tidak dikenali." }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Gagal memproses aksi persetujuan." }, { status: 500 });
  }
}
