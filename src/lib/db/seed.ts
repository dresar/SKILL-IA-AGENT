import { db, pool } from "./client";
import {
  categories,
  tags,
  skills,
  skillCategories,
  skillTags,
  installRecipes,
  showcases,
  roles,
  profiles,
  profileRoles
} from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const adminRole = await db
    .insert(roles)
    .values({
      name: "admin",
      description: "Platform administrator with full registry management privileges"
    })
    .onConflictDoNothing()
    .returning();

  await db
    .insert(roles)
    .values({
      name: "curator",
      description: "Content curator with draft and review privileges"
    })
    .onConflictDoNothing();

  const [adminProfile] = await db
    .insert(profiles)
    .values({
      authSubject: "admin-bootstrap-01",
      displayName: "Eka Syarif Maulana",
      themePreference: "dark"
    })
    .onConflictDoNothing()
    .returning();

  if (adminProfile && adminRole.length > 0) {
    await db
      .insert(profileRoles)
      .values({
        profileId: adminProfile.id,
        roleId: adminRole[0].id
      })
      .onConflictDoNothing();
  }

  const categoryData = [
    { slug: "frontend", name: "Frontend", description: "UI components, layout patterns, and modern client engineering.", sortOrder: 1 },
    { slug: "design-systems", name: "Design Systems", description: "Minimalist aesthetics, microcopy standards, and token architectures.", sortOrder: 2 },
    { slug: "code-quality", name: "Code Quality", description: "Zero comments, strict typing, linting, and refactoring standards.", sortOrder: 3 },
    { slug: "database", name: "Database", description: "Neon PostgreSQL, serverless migrations, and query toolkits.", sortOrder: 4 },
    { slug: "workflows", name: "Workflows", description: "Multi-agent coordination, subagents, and orchestration pipelines.", sortOrder: 5 }
  ];

  const insertedCategories: Record<string, string> = {};
  for (const cat of categoryData) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug));
    if (existing.length > 0) {
      insertedCategories[cat.slug] = existing[0].id;
    } else {
      const [inserted] = await db.insert(categories).values(cat).returning();
      insertedCategories[cat.slug] = inserted.id;
    }
  }

  const tagData = [
    { slug: "ui", name: "UI" },
    { slug: "design", name: "Design" },
    { slug: "tailwind", name: "Tailwind" },
    { slug: "microcopy", name: "Microcopy" },
    { slug: "minimalist", name: "Minimalist" },
    { slug: "clean-code", name: "Clean Code" },
    { slug: "zero-comments", name: "Zero Comments" },
    { slug: "neon", name: "Neon" },
    { slug: "postgres", name: "PostgreSQL" },
    { slug: "antigravity", name: "Antigravity" },
    { slug: "mcp", name: "MCP" }
  ];

  const insertedTags: Record<string, string> = {};
  for (const tag of tagData) {
    const existing = await db.select().from(tags).where(eq(tags.slug, tag.slug));
    if (existing.length > 0) {
      insertedTags[tag.slug] = existing[0].id;
    } else {
      const [inserted] = await db.insert(tags).values(tag).returning();
      insertedTags[tag.slug] = inserted.id;
    }
  }

  const skillSeedData = [
    {
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
      categorySlugs: ["frontend", "design-systems"],
      tagSlugs: ["ui", "design", "tailwind"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "npx skills add github.com/anthropics/skills/tree/main/skills/frontend-design --skill frontend-design",
          sourceUrl: "https://github.com/anthropics/skills",
          verificationStatus: "verified"
        },
        {
          target: "claude-code",
          displayLabel: "Claude Code",
          command: "claude skill add anthropics/skills/skills/frontend-design",
          sourceUrl: "https://github.com/anthropics/skills",
          verificationStatus: "verified"
        },
        {
          target: "cursor",
          displayLabel: "Cursor IDE",
          command: "curl -sSL https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md -o .cursor/rules/frontend.md",
          sourceUrl: "https://github.com/anthropics/skills",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "live_demo",
          title: "Interactive Component Canvas",
          description: "Responsive dark canvas preview demonstrating subtle borders, micro-interactions, and accessible typography.",
          status: "ready",
          externalUrl: "https://example.com/demo/frontend-design",
          viewportConfig: { defaultWidth: 1280, defaultHeight: 800, resizable: true },
          sortOrder: 1
        },
        {
          showcaseType: "sample_output",
          title: "Design Token Specification",
          description: "Exact CSS variable tokens for near-black surfaces and restrained lavender accent.",
          status: "ready",
          staticArtifactRef: "tokens-preview",
          sortOrder: 2
        }
      ]
    },
    {
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
      categorySlugs: ["design-systems"],
      tagSlugs: ["microcopy", "minimalist", "ui"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "/ui-ux-text",
          sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
          verificationStatus: "verified"
        },
        {
          target: "claude-code",
          displayLabel: "Claude Code",
          command: "npx skills add dresar/SKILL-IA-AGENT -s ui-ux-text",
          sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "sample_output",
          title: "Microcopy Benchmark Rules",
          description: "Clear limits for button labels, section headers, confirmation modals, and empty states.",
          status: "ready",
          staticArtifactRef: "microcopy-rules",
          sortOrder: 1
        }
      ]
    },
    {
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
      categorySlugs: ["code-quality"],
      tagSlugs: ["clean-code", "zero-comments"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "/nokomen",
          sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
          verificationStatus: "verified"
        },
        {
          target: "cursor",
          displayLabel: "Cursor IDE",
          command: "curl -sSL https://raw.githubusercontent.com/dresar/SKILL-IA-AGENT/main/skills/nokomen/SKILL.md -o .cursor/rules/nokomen.md",
          sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "documentation",
          title: "Code Cleanliness Checklist",
          description: "Automated checklist rules prohibiting comments and dead code.",
          status: "ready",
          sortOrder: 1
        }
      ]
    },
    {
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
      categorySlugs: ["database"],
      tagSlugs: ["neon", "postgres"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "npx skills add neondatabase/agent-skills -s neon-postgres",
          sourceUrl: "https://neon.com/docs/ai/ai-rules-neon-toolkit",
          verificationStatus: "verified"
        },
        {
          target: "claude-code",
          displayLabel: "Claude Code",
          command: "claude skill add neondatabase/agent-skills/skills/neon-postgres",
          sourceUrl: "https://neon.com/docs/ai/ai-rules-neon-toolkit",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "sample_output",
          title: "Drizzle + Neon Connection Recipe",
          description: "High-performance serverless connection pooling code pattern.",
          status: "ready",
          sortOrder: 1
        }
      ]
    },
    {
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
      categorySlugs: ["workflows"],
      tagSlugs: ["antigravity", "mcp"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "/antigravity-guide",
          sourceUrl: "https://antigravity.google/docs/slash-commands",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "workflow",
          title: "Multi-Agent Delegation Flowchart",
          description: "Orchestration lifecycle from Solo routine to DeepCoder subagent dispatch.",
          status: "ready",
          sortOrder: 1
        }
      ]
    },
    {
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
      categorySlugs: ["frontend", "design-systems"],
      tagSlugs: ["minimalist", "ui", "design"],
      recipes: [
        {
          target: "antigravity",
          displayLabel: "Google Antigravity",
          command: "npx skills add dresar/SKILL-IA-AGENT -s minimalist-ui",
          sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
          verificationStatus: "verified"
        }
      ],
      showcases: [
        {
          showcaseType: "sample_output",
          title: "Warm Monochrome Grid",
          description: "Bento layout structure with crisp borders and muted surfaces.",
          status: "ready",
          sortOrder: 1
        }
      ]
    }
  ];

  for (const s of skillSeedData) {
    const existing = await db.select().from(skills).where(eq(skills.slug, s.slug));
    let skillId = "";
    if (existing.length > 0) {
      skillId = existing[0].id;
    } else {
      const [inserted] = await db
        .insert(skills)
        .values({
          slug: s.slug,
          name: s.name,
          summary: s.summary,
          description: s.description,
          status: s.status,
          skillType: s.skillType,
          authorDisplay: s.authorDisplay,
          licenseSpdx: s.licenseSpdx,
          licenseUrl: s.licenseUrl,
          sourceKind: s.sourceKind,
          sourceUrl: s.sourceUrl,
          sourceOwner: s.sourceOwner,
          sourceRepo: s.sourceRepo,
          sourcePath: s.sourcePath,
          verificationStatus: s.verificationStatus,
          featuredRank: s.featuredRank,
          publishedAt: new Date()
        })
        .returning();
      skillId = inserted.id;
    }

    for (const catSlug of s.categorySlugs) {
      const categoryId = insertedCategories[catSlug];
      if (categoryId) {
        await db
          .insert(skillCategories)
          .values({ skillId, categoryId })
          .onConflictDoNothing();
      }
    }

    for (const tagSlug of s.tagSlugs) {
      const tagId = insertedTags[tagSlug];
      if (tagId) {
        await db
          .insert(skillTags)
          .values({ skillId, tagId })
          .onConflictDoNothing();
      }
    }

    for (const r of s.recipes) {
      await db
        .insert(installRecipes)
        .values({
          skillId,
          target: r.target,
          displayLabel: r.displayLabel,
          command: r.command,
          sourceUrl: r.sourceUrl,
          verificationStatus: r.verificationStatus,
          isEnabled: true
        })
        .onConflictDoNothing();
    }

    for (const rawSc of s.showcases) {
      const sc = rawSc as {
        showcaseType: string;
        title: string;
        description?: string;
        status: string;
        externalUrl?: string;
        staticArtifactRef?: string;
        viewportConfig?: unknown;
        sortOrder: number;
      };
      await db
        .insert(showcases)
        .values({
          skillId,
          showcaseType: sc.showcaseType,
          title: sc.title,
          description: sc.description,
          status: sc.status,
          externalUrl: sc.externalUrl,
          staticArtifactRef: sc.staticArtifactRef,
          viewportConfig: sc.viewportConfig,
          sortOrder: sc.sortOrder
        })
        .onConflictDoNothing();
    }
  }

  await pool.end();
}

seed().catch(async (error) => {
  await pool.end();
  process.exit(1);
});
