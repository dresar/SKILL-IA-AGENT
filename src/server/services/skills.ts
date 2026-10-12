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
import { eq, and, ilike, or, desc } from "drizzle-orm";

export interface SkillFilters {
  query?: string;
  category?: string;
  tag?: string;
  skillType?: string;
  limit?: number;
  offset?: number;
  status?: string;
}

const FALLBACK_CATEGORIES = [
  { id: "cat-1", slug: "frontend", name: "Frontend", description: "UI components, layout patterns, and modern client engineering.", sortOrder: 1 },
  { id: "cat-2", slug: "design-systems", name: "Design Systems", description: "Minimalist aesthetics, microcopy standards, and token architectures.", sortOrder: 2 },
  { id: "cat-3", slug: "code-quality", name: "Code Quality", description: "Zero comments, strict typing, linting, and refactoring standards.", sortOrder: 3 },
  { id: "cat-4", slug: "database", name: "Database", description: "Neon PostgreSQL, serverless migrations, and query toolkits.", sortOrder: 4 },
  { id: "cat-5", slug: "workflows", name: "Workflows", description: "Multi-agent coordination, subagents, and orchestration pipelines.", sortOrder: 5 }
];

const FALLBACK_SKILLS = [
  {
    id: "sk-1",
    slug: "frontend-design",
    name: "Frontend Design",
    summary: "High-end agency grade UI components, responsive layout systems, and tactile dark aesthetics.",
    description: "Comprehensive frontend design skill teaching coding agents to create bespoke, production-ready web interfaces with restrained palettes, fluid typography, and zero generic AI slop.",
    status: "published",
    skillType: "frontend",
    authorDisplay: "Anthropic & Community",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    sourceOwner: "anthropics",
    sourceRepo: "skills",
    sourcePath: "skills/frontend-design",
    verificationStatus: "source_checked",
    featuredRank: 1,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-1", slug: "frontend", name: "Frontend" }],
    tags: [{ id: "tag-1", slug: "ui", name: "UI" }],
    primaryRecipe: {
      id: "rec-1",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add github.com/anthropics/skills/tree/main/skills/frontend-design --skill frontend-design",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-1",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add github.com/anthropics/skills/tree/main/skills/frontend-design --skill frontend-design",
        sourceUrl: "https://github.com/anthropics/skills",
        verificationStatus: "verified"
      },
      {
        id: "rec-1b",
        target: "claude-code",
        displayLabel: "Claude Code",
        command: "claude skill add anthropics/skills/skills/frontend-design",
        sourceUrl: "https://github.com/anthropics/skills",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-1",
        showcaseType: "live_demo",
        title: "Component Canvas",
        description: "Responsive dark canvas preview demonstrating subtle borders and accessible typography.",
        status: "ready",
        externalUrl: "https://example.com/demo/frontend-design",
        sortOrder: 1
      }
    ],
    assets: []
  },
  {
    id: "sk-2",
    slug: "ui-ux-text",
    name: "UI/UX Text",
    summary: "Ultra-minimalist microcopy standard with strictly zero generic fluff or wordy subtitles.",
    description: "Strict microcopy engineering protocol limiting page titles to 1-3 words, button labels to 1-2 words, form labels to 1-3 words, and descriptions to at most 1 concise sentence.",
    status: "published",
    skillType: "writing",
    authorDisplay: "Antislop Core Team",
    licenseSpdx: "Apache-2.0",
    licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    sourceKind: "github",
    sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
    sourceOwner: "dresar",
    sourceRepo: "SKILL-IA-AGENT",
    sourcePath: "skills/ui-ux-text",
    verificationStatus: "verified",
    featuredRank: 2,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-2", slug: "design-systems", name: "Design Systems" }],
    tags: [{ id: "tag-2", slug: "microcopy", name: "Microcopy" }],
    primaryRecipe: {
      id: "rec-2",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/ui-ux-text",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-2",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/ui-ux-text",
        sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-2",
        showcaseType: "sample_output",
        title: "Microcopy Benchmark Rules",
        description: "Page Title: 1-3 words. Button: 1-2 words. Description: Max 1 sentence. Zero fluff.",
        status: "ready",
        sortOrder: 1
      }
    ],
    assets: []
  },
  {
    id: "sk-3",
    slug: "nokomen",
    name: "Nokomen",
    summary: "Strict zero-comment & clean code standard enforcing self-documenting architectures.",
    description: "Production code protocol prohibiting all comments, docstrings, JSDoc, section banners, TODOs, and AI markers across every programming language. Emphasizes clean function names and modular responsibility.",
    status: "published",
    skillType: "coding",
    authorDisplay: "Clean Code Standards",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
    sourceOwner: "dresar",
    sourceRepo: "SKILL-IA-AGENT",
    sourcePath: "skills/nokomen",
    verificationStatus: "verified",
    featuredRank: 3,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    tags: [{ id: "tag-3", slug: "zero-comments", name: "Zero Comments" }],
    primaryRecipe: {
      id: "rec-3",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/nokomen",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-3",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/nokomen",
        sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-3",
        showcaseType: "documentation",
        title: "Code Cleanliness Checklist",
        description: "Zero single-line comments. Zero block comments. Zero docstrings. Clean naming.",
        status: "ready",
        sortOrder: 1
      }
    ],
    assets: []
  },
  {
    id: "sk-4",
    slug: "neon-postgres",
    name: "Neon Postgres",
    summary: "Serverless PostgreSQL schema migrations, connection pooling, and branch-aware database ops.",
    description: "Official Neon database engineering skill for AI coding agents. Enables automated schema generation with Drizzle, connection pooling over WebSocket/TCP, and secure credentials management.",
    status: "published",
    skillType: "database",
    authorDisplay: "Neon Database",
    licenseSpdx: "Apache-2.0",
    licenseUrl: "https://neon.com",
    sourceKind: "github",
    sourceUrl: "https://github.com/neondatabase/agent-skills",
    sourceOwner: "neondatabase",
    sourceRepo: "agent-skills",
    sourcePath: "skills/neon-postgres",
    verificationStatus: "verified",
    featuredRank: 4,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-4", slug: "database", name: "Database" }],
    tags: [{ id: "tag-4", slug: "neon", name: "Neon" }],
    primaryRecipe: {
      id: "rec-4",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add neondatabase/agent-skills -s neon-postgres",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-4",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add neondatabase/agent-skills -s neon-postgres",
        sourceUrl: "https://neon.com/docs/ai/ai-rules-neon-toolkit",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-4",
        showcaseType: "sample_output",
        title: "Drizzle + Neon Connection Recipe",
        description: "High-performance serverless connection pooling code pattern.",
        status: "ready",
        sortOrder: 1
      }
    ],
    assets: []
  },
  {
    id: "sk-5",
    slug: "antigravity-guide",
    name: "Antigravity Guide",
    summary: "Comprehensive guide for Google Antigravity CLI, subagent delegation, and slash commands.",
    description: "Authoritative architectural documentation and reference manual for Google Antigravity, including orchestration workflows, subagent configuration, MCP sidecars, and terminal management.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Google DeepMind Antigravity Team",
    licenseSpdx: "Apache-2.0",
    licenseUrl: "https://antigravity.google",
    sourceKind: "github",
    sourceUrl: "https://github.com/google/antigravity",
    sourceOwner: "google",
    sourceRepo: "antigravity",
    verificationStatus: "verified",
    featuredRank: 5,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-5", slug: "antigravity", name: "Antigravity" }],
    primaryRecipe: {
      id: "rec-5",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/antigravity-guide",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-5",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/antigravity-guide",
        sourceUrl: "https://antigravity.google/docs/slash-commands",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-5",
        showcaseType: "workflow",
        title: "Multi-Agent Delegation Flowchart",
        description: "Orchestration lifecycle from Solo routine to DeepCoder subagent dispatch.",
        status: "ready",
        sortOrder: 1
      }
    ],
    assets: []
  },
  {
    id: "sk-6",
    slug: "minimalist-ui",
    name: "Minimalist UI",
    summary: "Editorial style web layouts, warm monochrome palettes, and gapless bento grid architectures.",
    description: "Clean aesthetic framework prioritizing typographic contrast, flat surfaces, and muted pastels without overused gradients or heavy drop shadows.",
    status: "published",
    skillType: "frontend",
    authorDisplay: "Agency Minimalist",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
    sourceOwner: "dresar",
    sourceRepo: "SKILL-IA-AGENT",
    verificationStatus: "metadata_checked",
    featuredRank: 6,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-1", slug: "frontend", name: "Frontend" }],
    tags: [{ id: "tag-1", slug: "ui", name: "UI" }],
    primaryRecipe: {
      id: "rec-6",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add dresar/SKILL-IA-AGENT -s minimalist-ui",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-6",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add dresar/SKILL-IA-AGENT -s minimalist-ui",
        sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
        verificationStatus: "verified"
      }
    ],
    showcases: [
      {
        id: "sc-6",
        showcaseType: "sample_output",
        title: "Warm Monochrome Grid",
        description: "Bento layout structure with crisp borders and muted surfaces.",
        status: "ready",
        sortOrder: 1
      }
    ],
    assets: []
  }
];

export async function getPublishedSkills(filters: SkillFilters = {}) {
  const limit = Math.min(filters.limit || 24, 100);
  const offset = filters.offset || 0;
  const statusFilter = filters.status || "published";

  try {
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

    if (results.length === 0 && !filters.query && !filters.category) {
      return FALLBACK_SKILLS.slice(offset, offset + limit);
    }

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
  } catch {
    return FALLBACK_SKILLS.filter((s) => {
      if (filters.category && !s.categories.some((c) => c.slug === filters.category)) return false;
      if (filters.skillType && s.skillType !== filters.skillType) return false;
      if (filters.query && !s.name.toLowerCase().includes(filters.query.toLowerCase())) return false;
      return true;
    }).slice(offset, offset + limit);
  }
}

export async function getSkillDetailBySlug(slug: string) {
  try {
    const result = await db.select().from(skills).where(eq(skills.slug, slug)).limit(1);
    if (result.length === 0) {
      return FALLBACK_SKILLS.find((s) => s.slug === slug) || null;
    }

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
  } catch {
    return FALLBACK_SKILLS.find((s) => s.slug === slug) || null;
  }
}

export async function getAllCategories() {
  try {
    const result = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        sortOrder: categories.sortOrder
      })
      .from(categories)
      .orderBy(categories.sortOrder);

    return result.length > 0 ? result : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getAllTags() {
  try {
    return await db.select().from(tags).orderBy(tags.name);
  } catch {
    return [];
  }
}
