import { db } from "@/lib/db/client";
import {
  skills,
  categories,
  tags,
  skillCategories,
  skillTags,
  installRecipes,
  showcases,
  assets
} from "@/lib/db/schema";
import { eq, and, ilike, or, desc, sql } from "drizzle-orm";

export interface SkillFilters {
  query?: string;
  category?: string;
  tag?: string;
  skillType?: string;
  limit?: number;
  offset?: number;
  status?: string;
}

export async function getPublishedSkills(filters: SkillFilters = {}) {
  const limit = Math.min(filters.limit || 24, 100);
  const offset = filters.offset || 0;
  const statusFilter = filters.status || "published";

  const conditions = [eq(skills.status, statusFilter)];

  if (filters.query && filters.query.trim()) {
    const q = `%${filters.query.trim()}%`;
    conditions.push(
      or(
        ilike(skills.name, q),
        ilike(skills.summary, q),
        ilike(skills.slug, q),
        ilike(skills.description, q)
      )!
    );
  }

  if (filters.skillType) {
    conditions.push(eq(skills.skillType, filters.skillType));
  }

  const baseQuery = db
    .select({
      id: skills.id,
      slug: skills.slug,
      name: skills.name,
      summary: skills.summary,
      status: skills.status,
      skillType: skills.skillType,
      authorDisplay: skills.authorDisplay,
      licenseSpdx: skills.licenseSpdx,
      sourceKind: skills.sourceKind,
      sourceUrl: skills.sourceUrl,
      sourceOwner: skills.sourceOwner,
      sourceRepo: skills.sourceRepo,
      verificationStatus: skills.verificationStatus,
      featuredRank: skills.featuredRank,
      publishedAt: skills.publishedAt,
      updatedAt: skills.updatedAt
    })
    .from(skills)
    .where(and(...conditions))
    .orderBy(desc(skills.featuredRank), desc(skills.publishedAt))
    .limit(limit)
    .offset(offset);

  const results = await baseQuery;

  const items = await Promise.all(
    results.map(async (skill) => {
      const cats = await db
        .select({
          id: categories.id,
          slug: categories.slug,
          name: categories.name
        })
        .from(skillCategories)
        .innerJoin(categories, eq(skillCategories.categoryId, categories.id))
        .where(eq(skillCategories.skillId, skill.id));

      const tgs = await db
        .select({
          id: tags.id,
          slug: tags.slug,
          name: tags.name
        })
        .from(skillTags)
        .innerJoin(tags, eq(skillTags.tagId, tags.id))
        .where(eq(skillTags.skillId, skill.id));

      const primaryRecipe = await db
        .select()
        .from(installRecipes)
        .where(and(eq(installRecipes.skillId, skill.id), eq(installRecipes.isEnabled, true)))
        .limit(1);

      return {
        ...skill,
        categories: cats,
        tags: tgs,
        primaryRecipe: primaryRecipe[0] || null
      };
    })
  );

  return items;
}

export async function getSkillDetailBySlug(slug: string) {
  const result = await db.select().from(skills).where(eq(skills.slug, slug)).limit(1);
  if (result.length === 0) return null;

  const skill = result[0];

  const cats = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name
    })
    .from(skillCategories)
    .innerJoin(categories, eq(skillCategories.categoryId, categories.id))
    .where(eq(skillCategories.skillId, skill.id));

  const tgs = await db
    .select({
      id: tags.id,
      slug: tags.slug,
      name: tags.name
    })
    .from(skillTags)
    .innerJoin(tags, eq(skillTags.tagId, tags.id))
    .where(eq(skillTags.skillId, skill.id));

  const recipes = await db
    .select()
    .from(installRecipes)
    .where(and(eq(installRecipes.skillId, skill.id), eq(installRecipes.isEnabled, true)));

  const showcaseList = await db
    .select()
    .from(showcases)
    .where(eq(showcases.skillId, skill.id))
    .orderBy(showcases.sortOrder);

  const assetList = await db
    .select()
    .from(assets)
    .where(eq(assets.skillId, skill.id));

  return {
    ...skill,
    categories: cats,
    tags: tgs,
    recipes,
    showcases: showcaseList,
    assets: assetList
  };
}

export async function getAllCategories() {
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      sortOrder: categories.sortOrder
    })
    .from(categories)
    .orderBy(categories.sortOrder);
}

export async function getAllTags() {
  return db.select().from(tags).orderBy(tags.name);
}
