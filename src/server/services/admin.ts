import { db } from "@/lib/db/client";
import { skills, auditEvents, installRecipes, showcases } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export interface CreateSkillInput {
  name: string;
  slug: string;
  summary: string;
  description: string;
  skillType?: string;
  authorDisplay: string;
  licenseSpdx?: string;
  licenseUrl?: string;
  sourceUrl: string;
  sourceOwner?: string;
  sourceRepo?: string;
  verificationStatus?: string;
  recipeCommand?: string;
  recipeTarget?: string;
}

export async function createSkill(input: CreateSkillInput, actorSubject?: string) {
  const [newSkill] = await db
    .insert(skills)
    .values({
      slug: input.slug,
      name: input.name,
      summary: input.summary,
      description: input.description,
      status: "draft",
      skillType: input.skillType || "general",
      authorDisplay: input.authorDisplay,
      licenseSpdx: input.licenseSpdx,
      licenseUrl: input.licenseUrl,
      sourceUrl: input.sourceUrl,
      sourceOwner: input.sourceOwner,
      sourceRepo: input.sourceRepo,
      verificationStatus: input.verificationStatus || "unverified"
    })
    .returning();

  if (input.recipeCommand) {
    await db.insert(installRecipes).values({
      skillId: newSkill.id,
      target: input.recipeTarget || "antigravity",
      displayLabel: "Antigravity",
      command: input.recipeCommand,
      verificationStatus: "maintainer_provided"
    });
  }

  await db.insert(auditEvents).values({
    actorSubject: actorSubject || "admin",
    action: "create_draft",
    targetType: "skill",
    targetId: newSkill.id,
    metadata: { slug: newSkill.slug, name: newSkill.name }
  });

  return newSkill;
}

export async function setSkillStatus(id: string, status: "draft" | "published" | "archived", actorSubject?: string) {
  const [updated] = await db
    .update(skills)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : undefined,
      updatedAt: new Date()
    })
    .where(eq(skills.id, id))
    .returning();

  await db.insert(auditEvents).values({
    actorSubject: actorSubject || "admin",
    action: `set_status_${status}`,
    targetType: "skill",
    targetId: id,
    metadata: { status }
  });

  return updated;
}

export async function getAuditHistory(limit: number = 20) {
  return db
    .select()
    .from(auditEvents)
    .orderBy(desc(auditEvents.createdAt))
    .limit(limit);
}
