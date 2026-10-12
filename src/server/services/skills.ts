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
import { eq, and, ilike, or, desc, asc, sql } from "drizzle-orm";

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
  { id: "cat-1", slug: "design-ui-ux", name: "Design & UI/UX", description: "UI design systems, accessibility, and user experience patterns.", sortOrder: 1 },
  { id: "cat-2", slug: "code-quality", name: "Code Quality", description: "Zero comments, strict typing, and test-driven development patterns.", sortOrder: 2 },
  { id: "cat-3", slug: "database", name: "Database", description: "Neon PostgreSQL, connection pooling, and schema management.", sortOrder: 3 },
  { id: "cat-4", slug: "workflows", name: "Workflows", description: "Multi-agent coordination, orchestration pipelines, and subagents.", sortOrder: 4 },
  { id: "cat-5", slug: "security", name: "Security & Audit", description: "Vulnerability analysis, secret protection, and access control.", sortOrder: 5 }
];

const FALLBACK_SKILLS = [
  {
    id: "sk-1",
    slug: "frontend-design",
    name: "Frontend Design",
    summary: "Instructs agents to avoid generic AI aesthetics and make bold, intentional design decisions with React & Tailwind.",
    description: "Comprehensive frontend design skill teaching coding agents to create bespoke, production-ready web interfaces with restrained palettes, fluid typography, and zero generic AI slop.",
    status: "published",
    skillType: "frontend",
    authorDisplay: "Anthropic",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/anthropics/skills/tree/main/skills/frontend-design",
    sourceOwner: "anthropics",
    sourceRepo: "skills",
    sourcePath: "skills/frontend-design",
    verificationStatus: "verified",
    featuredRank: 1,
    rank: "S-RANK",
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-1", slug: "design-ui-ux", name: "Design & UI/UX" }],
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
        target: "claude",
        displayLabel: "Claude Code",
        command: "claude skill add anthropics/skills/skills/frontend-design",
        sourceUrl: "https://github.com/anthropics/skills",
        verificationStatus: "verified"
      },
      {
        id: "rec-1b",
        target: "claude",
        displayLabel: "Claude",
        command: "claude skill add anthropics/skills/skills/frontend-design",
        sourceUrl: "https://github.com/anthropics/skills",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
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
    categories: [{ id: "cat-1", slug: "design-ui-ux", name: "Design & UI/UX" }],
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
  },
  {
    id: "sk-7",
    slug: "superpowers-tdd",
    name: "Superpowers TDD",
    summary: "Framework rekayasa software agentik dengan siklus test-driven development ketat.",
    description: "Metodologi pembangunan software agentik yang mewajibkan penulisan test suite sebelum kode implementasi untuk mencegah halusinasi kode.",
    status: "published",
    skillType: "coding",
    authorDisplay: "Jesse Vincent (obra)",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/obra/superpowers",
    sourceOwner: "obra",
    sourceRepo: "superpowers",
    sourcePath: "skills/superpowers-tdd",
    verificationStatus: "verified",
    featuredRank: 7,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    tags: [{ id: "tag-3", slug: "tdd", name: "TDD" }],
    primaryRecipe: {
      id: "rec-7",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add obra/superpowers -s superpowers-tdd",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-7",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add obra/superpowers -s superpowers-tdd",
        sourceUrl: "https://github.com/obra/superpowers",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-8",
    slug: "caveman-compress",
    name: "Caveman Compress",
    summary: "Protokol kompresi token agent yang memangkas 65% verbositas tanpa kehilangan presisi.",
    description: "Optimasi efisiensi konteks LLM dengan memotong formalitas basa-basi dan menyampaikan argumen logis secara ultra-ringkas.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Julius Brussee",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/JuliusBrussee/caveman",
    sourceOwner: "JuliusBrussee",
    sourceRepo: "caveman",
    sourcePath: "skills/caveman-compress",
    verificationStatus: "verified",
    featuredRank: 8,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-5", slug: "token-saver", name: "Token Saver" }],
    primaryRecipe: {
      id: "rec-8",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/caveman-compress",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-8",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/caveman-compress",
        sourceUrl: "https://github.com/JuliusBrussee/caveman",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-9",
    slug: "taste-filter",
    name: "Taste Filter",
    summary: "Filter estetika tingkat lanjut untuk memblokir pola AI template generik.",
    description: "Aturan desain anti-slop yang melarang font standar, bayangan kasar, border abu-abu tebal, dan kartu bootstrap klise.",
    status: "published",
    skillType: "frontend",
    authorDisplay: "Leonxlnx",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/Leonxlnx/taste-skill",
    sourceOwner: "Leonxlnx",
    sourceRepo: "taste-skill",
    sourcePath: "skills/taste-filter",
    verificationStatus: "verified",
    featuredRank: 9,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-1", slug: "design-ui-ux", name: "Design & UI/UX" }],
    tags: [{ id: "tag-2", slug: "anti-slop", name: "Anti-Slop" }],
    primaryRecipe: {
      id: "rec-9",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/taste-filter",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-9",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/taste-filter",
        sourceUrl: "https://github.com/Leonxlnx/taste-skill",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-10",
    slug: "security-audit",
    name: "Security Audit",
    summary: "Pemindaian kerentanan AST otomatis, deteksi bocoran rahasia, dan audit input sanitization.",
    description: "Protokol keamanan proaktif yang mendeteksi secret key, token git, injection payload, dan celah otentikasi sebelum commit.",
    status: "published",
    skillType: "code-quality",
    authorDisplay: "Anthropic Security",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/anthropics/skills",
    sourceOwner: "anthropics",
    sourceRepo: "skills",
    sourcePath: "skills/security-audit",
    verificationStatus: "verified",
    featuredRank: 10,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    tags: [{ id: "tag-3", slug: "security", name: "Security" }],
    primaryRecipe: {
      id: "rec-10",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/security-audit",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-10",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/security-audit",
        sourceUrl: "https://github.com/anthropics/skills",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-11",
    slug: "git-workflow",
    name: "Git Workflow",
    summary: "Manajemen commit konvensional, percabangan atomik, dan otomatisasi changelog.",
    description: "Standar git modern untuk agent yang memvalidasi commit message format, mengisolasi feature branch, dan membuat tag rilis.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Eka Syarif Maulana",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
    sourceOwner: "dresar",
    sourceRepo: "SKILL-IA-AGENT",
    sourcePath: "skills/git-workflow",
    verificationStatus: "verified",
    featuredRank: 11,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-5", slug: "git", name: "Git" }],
    primaryRecipe: {
      id: "rec-11",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "/git-workflow",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-11",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "/git-workflow",
        sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-12",
    slug: "docker-devops",
    name: "Docker DevOps",
    summary: "Eksekusi container sandbox efemeral untuk evaluasi kode agent mandiri.",
    description: "Isolasi eksekusi lingkungan kode pada kontainer Docker non-root dengan batasan memori dan timeout otomatis.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "DevOps Working Group",
    licenseSpdx: "Apache-2.0",
    licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    sourceKind: "github",
    sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
    sourceOwner: "dresar",
    sourceRepo: "SKILL-IA-AGENT",
    sourcePath: "skills/docker-devops",
    verificationStatus: "verified",
    featuredRank: 12,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-5", slug: "docker", name: "Docker" }],
    primaryRecipe: {
      id: "rec-12",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add dresar/SKILL-IA-AGENT -s docker-devops",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-12",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add dresar/SKILL-IA-AGENT -s docker-devops",
        sourceUrl: "https://github.com/dresar/SKILL-IA-AGENT",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-13",
    slug: "seo-audit",
    name: "SEO Audit Pro",
    summary: "Technical SEO audit engine: analyzes Core Web Vitals, JSON-LD schema, sitemap indexing, and ranking factor signals.",
    description: "Technical SEO auditing skill for autonomous AI coding agents covering Core Web Vitals, JSON-LD Schema.org, semantic H1-H4 cascades, and search crawler indexability.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Corey Haines",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/coreyhaines31/marketingskills",
    sourceOwner: "coreyhaines31",
    sourceRepo: "marketingskills",
    sourcePath: "skills/seo-audit",
    verificationStatus: "verified",
    featuredRank: 4,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-4", slug: "mcp", name: "MCP" }],
    primaryRecipe: {
      id: "rec-13",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add coreyhaines31/marketingskills@seo-audit -s seo-audit",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-13-ag",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add coreyhaines31/marketingskills@seo-audit -s seo-audit",
        sourceUrl: "https://github.com/coreyhaines31/marketingskills",
        verificationStatus: "verified"
      },
      {
        id: "rec-13-cl",
        target: "claude",
        displayLabel: "Claude Code",
        command: "claude skill add coreyhaines31/marketingskills/skills/seo-audit",
        sourceUrl: "https://github.com/coreyhaines31/marketingskills",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-14",
    slug: "claude-seo",
    name: "Claude SEO Master",
    summary: "Algorithmic search engine optimization, programmatic content clustering, and query intent matching for Claude Code.",
    description: "Deep algorithmic SEO optimization for Claude Code CLI and Anthropic agent workflows, with topical authority clustering, intent mapping, and keyword density calibration.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Daniel Agrici",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/AgriciDaniel/claude-seo",
    sourceOwner: "AgriciDaniel",
    sourceRepo: "claude-seo",
    sourcePath: "skills/claude-seo",
    verificationStatus: "verified",
    featuredRank: 5,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-4", slug: "mcp", name: "MCP" }],
    primaryRecipe: {
      id: "rec-14",
      target: "claude",
      displayLabel: "Claude Code",
      command: "claude skill add AgriciDaniel/claude-seo",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-14-cl",
        target: "claude",
        displayLabel: "Claude Code",
        command: "claude skill add AgriciDaniel/claude-seo",
        sourceUrl: "https://github.com/AgriciDaniel/claude-seo",
        verificationStatus: "verified"
      },
      {
        id: "rec-14-ag",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add AgriciDaniel/claude-seo -s claude-seo",
        sourceUrl: "https://github.com/AgriciDaniel/claude-seo",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-15",
    slug: "agent-browser",
    name: "Agent Browser",
    summary: "Headless Chromium automation layer, accessibility tree snapshotting, and authenticated action execution for agents.",
    description: "Vercel Labs official browser interaction primitive for modern AI coding agents, providing accessibility trees, deterministic click/type actions, and DOM screen diffing.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Vercel Labs",
    licenseSpdx: "Apache-2.0",
    licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    sourceKind: "github",
    sourceUrl: "https://github.com/vercel-labs/agent-browser",
    sourceOwner: "vercel-labs",
    sourceRepo: "agent-browser",
    sourcePath: "skills/agent-browser",
    verificationStatus: "verified",
    featuredRank: 6,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-1", slug: "ui", name: "UI" }],
    primaryRecipe: {
      id: "rec-15",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add vercel-labs/agent-browser -s agent-browser",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-15-ag",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add vercel-labs/agent-browser -s agent-browser",
        sourceUrl: "https://github.com/vercel-labs/agent-browser",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-16",
    slug: "linkly-social-buzz",
    name: "Linkly Social Buzz",
    summary: "Real-time viral AI skill telemetry, download rankings, and adoption scoring across ClawHub, Tencent SkillHub, and GitHub.",
    description: "Official Linkly AI agent skill telemetry integration based on Linkly daily Top 100 benchmark, tracking viral velocity and platform adoption.",
    status: "published",
    skillType: "workflows",
    authorDisplay: "Linkly AI",
    licenseSpdx: "CC-BY-4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceKind: "github",
    sourceUrl: "https://github.com/LinklyAI/linkly-ai-skills",
    sourceOwner: "LinklyAI",
    sourceRepo: "linkly-ai-skills",
    sourcePath: "skills/linkly-social-buzz",
    verificationStatus: "verified",
    featuredRank: 7,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    tags: [{ id: "tag-4", slug: "mcp", name: "MCP" }],
    primaryRecipe: {
      id: "rec-16",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add LinklyAI/linkly-ai-skills -s linkly-social-buzz",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-16-ag",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add LinklyAI/linkly-ai-skills -s linkly-social-buzz",
        sourceUrl: "https://github.com/LinklyAI/linkly-ai-skills",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
    assets: []
  },
  {
    id: "sk-17",
    slug: "agentskills-core",
    name: "AgentSkills Core",
    summary: "Official reference specification for deterministic multi-turn agent evaluation, state persistence, and rollback contracts.",
    description: "Formal runtime standard from the AgentSkills organization defining strict contracts for AI agent tools, step determinism, and error rollbacks.",
    status: "published",
    skillType: "code-quality",
    authorDisplay: "AgentSkills Core Team",
    licenseSpdx: "MIT",
    licenseUrl: "https://opensource.org/licenses/MIT",
    sourceKind: "github",
    sourceUrl: "https://github.com/agentskills/agentskills",
    sourceOwner: "agentskills",
    sourceRepo: "agentskills",
    sourcePath: "skills/agentskills-core",
    verificationStatus: "verified",
    featuredRank: 8,
    publishedAt: new Date("2026-10-12"),
    updatedAt: new Date("2026-10-12"),
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    tags: [{ id: "tag-3", slug: "clean-code", name: "Clean Code" }],
    primaryRecipe: {
      id: "rec-17",
      target: "antigravity",
      displayLabel: "Google Antigravity",
      command: "npx skills add agentskills/agentskills -s agentskills-core",
      verificationStatus: "verified"
    },
    recipes: [
      {
        id: "rec-17-ag",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: "npx skills add agentskills/agentskills -s agentskills-core",
        sourceUrl: "https://github.com/agentskills/agentskills",
        verificationStatus: "verified"
      }
    ],
    showcases: [],
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
      .orderBy(sql`${skills.featuredRank} ASC NULLS LAST`, desc(skills.publishedAt))
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
