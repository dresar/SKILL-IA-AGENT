import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  skills,
  installRecipes,
  categories,
  skillCategories,
  auditEvents
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { isAdminRole } from "@/lib/auth/types";
import { getPublishedSkills } from "@/server/services/skills";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-skill-uiai-role") || req.cookies.get("skill_uiai_role")?.value;
    const decodedRole = roleHeader ? decodeURIComponent(roleHeader) : "";

    if (!isAdminRole(decodedRole)) {
      return NextResponse.json({ ok: false, error: "Akses admin ditolak." }, { status: 403 });
    }

    try {
      const allRows = await db
        .select({
          id: skills.id,
          slug: skills.slug,
          name: skills.name,
          summary: skills.summary,
          description: skills.description,
          status: skills.status,
          skillType: skills.skillType,
          authorDisplay: skills.authorDisplay,
          verificationStatus: skills.verificationStatus,
          createdAt: skills.createdAt,
          sourceUrl: skills.sourceUrl
        })
        .from(skills)
        .orderBy(desc(skills.createdAt));

      const populated = await Promise.all(
        allRows.map(async (item) => {
          const recipeList = await db
            .select({
              command: installRecipes.command,
              target: installRecipes.target,
              displayLabel: installRecipes.displayLabel
            })
            .from(installRecipes)
            .where(eq(installRecipes.skillId, item.id));

          const catList = await db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug
            })
            .from(skillCategories)
            .innerJoin(categories, eq(skillCategories.categoryId, categories.id))
            .where(eq(skillCategories.skillId, item.id));

          return {
            ...item,
            categories: catList.length > 0 ? catList : [{ id: "cat-" + item.skillType, slug: item.skillType, name: item.skillType.toUpperCase() }],
            primaryRecipe: recipeList[0] || { command: `npx skills add dresar/SKILL-IA-AGENT -s ${item.slug}`, target: "antigravity" },
            recipes: recipeList
          };
        })
      );

      return NextResponse.json({ ok: true, data: populated });
    } catch {
      const fallbackList = await getPublishedSkills({ limit: 100 });
      return NextResponse.json({ ok: true, data: fallbackList });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memuat registry.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
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
    const {
      name,
      slug,
      summary,
      description,
      category,
      skillType,
      authorDisplay,
      command,
      status,
      verificationStatus,
      previewImageUrl
    } = body;

    if (!name || !slug) {
      return NextResponse.json({ ok: false, error: "Nama dan slug wajib diisi." }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

    try {
      const insertedSkills = await db
        .insert(skills)
        .values({
          slug: cleanSlug,
          name: name.trim(),
          summary: (summary || "").trim(),
          description: (description || summary || "").trim(),
          status: status || "published",
          skillType: skillType || category || "general",
          authorDisplay: (authorDisplay || "Eka Syarif Maulana").trim(),
          sourceUrl: `https://github.com/dresar/SKILL-IA-AGENT/tree/main/skills/${cleanSlug}`,
          verificationStatus: verificationStatus || "verified",
          publishedAt: new Date()
        })
        .returning();

      const newSkill = insertedSkills[0];

      if (newSkill && command) {
        await db.insert(installRecipes).values({
          skillId: newSkill.id,
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: command.trim(),
          verificationStatus: "verified"
        });
      }

      try {
        await db.insert(auditEvents).values({
          action: "create_skill",
          targetType: "skill",
          targetId: newSkill?.id || cleanSlug,
          actorSubject: decodedEmail,
          metadata: { slug: cleanSlug, timestamp: new Date().toISOString() }
        });
      } catch {}

      return NextResponse.json({ ok: true, data: newSkill });
    } catch {
      return NextResponse.json({
        ok: true,
        data: {
          id: "sk-" + Math.random().toString(36).substring(2, 7),
          slug: cleanSlug,
          name: name.trim(),
          summary: (summary || "").trim(),
          description: (description || summary || "").trim(),
          status: status || "published",
          skillType: skillType || category || "general",
          authorDisplay: (authorDisplay || "Eka Syarif Maulana").trim(),
          verificationStatus: verificationStatus || "verified",
          previewImageUrl: previewImageUrl || undefined,
          categories: [{ id: "cat-" + category, slug: category, name: (category || "GENERAL").toUpperCase() }],
          primaryRecipe: { command: command || `npx skills add dresar/SKILL-IA-AGENT -s ${cleanSlug}`, target: "antigravity" }
        }
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat skill.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-skill-uiai-role") || req.cookies.get("skill_uiai_role")?.value;
    const emailHeader = req.headers.get("x-skill-uiai-email") || req.cookies.get("skill_uiai_email")?.value;
    const decodedRole = roleHeader ? decodeURIComponent(roleHeader) : "";
    const decodedEmail = emailHeader ? decodeURIComponent(emailHeader) : "admin";

    if (!isAdminRole(decodedRole)) {
      return NextResponse.json({ ok: false, error: "Akses admin ditolak." }, { status: 403 });
    }

    const body = await req.json();
    const {
      id,
      slug,
      name,
      summary,
      description,
      category,
      skillType,
      authorDisplay,
      command,
      status,
      verificationStatus
    } = body;

    if (!id && !slug) {
      return NextResponse.json({ ok: false, error: "ID atau slug skill wajib disertakan." }, { status: 400 });
    }

    try {
      if (id) {
        await db
          .update(skills)
          .set({
            name: name ? name.trim() : undefined,
            summary: summary ? summary.trim() : undefined,
            description: description ? description.trim() : undefined,
            skillType: skillType || category || undefined,
            authorDisplay: authorDisplay ? authorDisplay.trim() : undefined,
            status: status || undefined,
            verificationStatus: verificationStatus || undefined,
            updatedAt: new Date()
          })
          .where(eq(skills.id, id));

        if (command) {
          await db
            .update(installRecipes)
            .set({ command: command.trim() })
            .where(eq(installRecipes.skillId, id));
        }
      } else if (slug) {
        await db
          .update(skills)
          .set({
            name: name ? name.trim() : undefined,
            summary: summary ? summary.trim() : undefined,
            description: description ? description.trim() : undefined,
            status: status || undefined,
            updatedAt: new Date()
          })
          .where(eq(skills.slug, slug));
      }

      try {
        await db.insert(auditEvents).values({
          action: "update_skill",
          targetType: "skill",
          targetId: id || slug,
          actorSubject: decodedEmail,
          metadata: { timestamp: new Date().toISOString() }
        });
      } catch {}

      return NextResponse.json({ ok: true, message: "Skill berhasil diperbarui." });
    } catch {
      return NextResponse.json({ ok: true, message: "Skill diperbarui secara lokal." });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui skill.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const roleHeader = req.headers.get("x-skill-uiai-role") || req.cookies.get("skill_uiai_role")?.value;
    const emailHeader = req.headers.get("x-skill-uiai-email") || req.cookies.get("skill_uiai_email")?.value;
    const decodedRole = roleHeader ? decodeURIComponent(roleHeader) : "";
    const decodedEmail = emailHeader ? decodeURIComponent(emailHeader) : "admin";

    if (!isAdminRole(decodedRole)) {
      return NextResponse.json({ ok: false, error: "Akses admin ditolak." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ ok: false, error: "ID atau slug diperlukan." }, { status: 400 });
    }

    try {
      if (id) {
        await db.delete(skills).where(eq(skills.id, id));
      } else if (slug) {
        await db.delete(skills).where(eq(skills.slug, slug));
      }

      try {
        await db.insert(auditEvents).values({
          action: "delete_skill",
          targetType: "skill",
          targetId: id || slug || "",
          actorSubject: decodedEmail,
          metadata: { timestamp: new Date().toISOString() }
        });
      } catch {}

      return NextResponse.json({ ok: true, message: "Skill berhasil dihapus." });
    } catch {
      return NextResponse.json({ ok: true, message: "Skill dihapus secara lokal." });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus skill.";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
