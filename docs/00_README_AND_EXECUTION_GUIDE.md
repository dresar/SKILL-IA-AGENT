# SkillCanvas — Agent Documentation Pack

**Document pack version:** 1.0  
**Prepared:** 2026-10-12  
**Product codename:** SkillCanvas (working name; make the name configurable until the owner confirms it)  
**Primary implementation environment:** Google Antigravity  
**Audience:** An AI coding agent implementing the product in an existing or new repository

## 1. Purpose

This pack is the source of truth for implementing SkillCanvas: an open-source directory of AI-agent skills with useful, honest previews, installation instructions, searchable metadata, a GitHub-backed skill registry, administration tools, authentication, and an MCP interface.

The product must not degrade into a generic component gallery. Its defining experience is to let visitors understand what a skill does, inspect a realistic example, review its source and license, and obtain an accurate install command. Visual skills should have full-page or interactive application showcases where available. Non-visual skills should have a meaningful input/output, workflow, or artifact showcase rather than an irrelevant mock dashboard.

## 2. Read the pack in this order

1. `01_PRODUCT_REQUIREMENTS.md` — goals, users, flows, requirements, and acceptance criteria.
2. `02_SYSTEM_ARCHITECTURE.md` — boundaries, technology choices, routes, service interfaces, and deployment shape.
3. `03_DESIGN_SYSTEM_AND_UX.md` — visual direction, interaction patterns, responsive behavior, and accessibility.
4. `04_DATABASE_AUTH_AND_NEON.md` — data model, Neon setup, authentication, authorization, and migrations.
5. `05_SKILL_REGISTRY_GITHUB_AND_IMPORTS.md` — registry model, external sources, importing, publishing, and GitHub writes.
6. `06_SHOWCASES_MEDIA_AND_SANDBOXING.md` — previews, screenshots, media storage, iframe isolation, and untrusted code rules.
7. `07_MCP_SERVER_SPEC.md` — MCP tools, schemas, access controls, transport, and examples.
8. `08_SECURITY_TESTING_DEPLOYMENT_AND_OPERATIONS.md` — threat model, QA, release gates, deployment, and operations.
9. `09_ANTIGRAVITY_MASTER_IMPLEMENTATION_PROMPT.md` — the prompt that coordinates implementation using this pack.

## 3. Non-negotiable instructions for the agent

- Read all ten documents before making broad architecture decisions. Resolve inconsistencies by following this precedence: security requirements in document 08, data/auth rules in document 04, product requirements in document 01, then the remaining documents. If a genuine conflict remains, report it and ask the owner rather than silently inventing a resolution.
- Research current official documentation for Next.js, Neon, MCP, GitHub APIs, and any library whose API is about to be implemented. Do not rely on remembered API signatures, old tutorials, generated package names, or undocumented assumptions. Record relevant official links and the date checked in the project notes.
- Use the current stable release compatible with the repository and deployment runtime. Do not pin arbitrary versions from this document; verify them at implementation time and use the package manager's lockfile.
- Do not claim a feature works because its UI exists. Implement the real persistence, validation, loading states, error states, authorization, and tests.
- Do not invent skill sources, demo URLs, install commands, popularity counts, licenses, authors, compatibility claims, or verification badges. Unknown metadata must be marked unknown or omitted.
- Never place Neon connection strings, Neon management tokens, GitHub tokens, session secrets, or other private credentials in browser code, client bundles, logs, screenshots, prompts, or committed files.
- Never execute an imported skill repository or arbitrary contributor-provided demo inside the trusted main application process. Follow document 06.
- Preserve provenance and attribution. Importing a public URL does not automatically grant permission to rehost its content.
- Use accessible, responsive, production-quality design. Avoid neon-everywhere styling, overused gradients, distracting animation, generic placeholder content, fake live metrics, and gratuitous card grids.
- Use readable, descriptive names and modular code. Avoid unnecessary abstractions, dead code, unused dependencies, debug statements, and unexplained TODOs.
- If a requested environment credential or third-party permission is unavailable, implement a typed integration boundary and a clear configuration/error path. Do not fake a successful live integration.

## 4. Antigravity working protocol

Antigravity commands and installed skills can differ by product version, mode, account plan, and workspace. The agent must verify availability in the current environment before using a command. Do not assume that every suggested command is enabled.

1. Start with `/plan` when available. Ask Antigravity to inspect the repository and these documents, research current official docs, produce a sequenced implementation plan, identify unknowns, and state the verification gates before editing files.
2. Use `/grill-me` when available if consequential product choices remain unresolved, especially public/private asset policy, admin bootstrap, hosted MCP authentication, or deployment target. Do not interrupt the owner for cosmetic decisions already specified here.
3. Use `/browser` when available for official documentation research and browser-based UI inspection. Verify the URL is official before treating it as normative.
4. Use `/boost` for genuinely difficult, cross-cutting work such as reviewing authorization boundaries, MCP security, GitHub write races, preview isolation, or a stubborn multi-file defect. It may require an eligible plan. Do not waste it on routine file generation.
5. Use `/teamwork-preview` only if it exists in the current command picker and is appropriate for independent parallel investigations. If unavailable, proceed with a single agent and staged reviews.
6. Type `/` and inspect the command picker whenever the plan mentions an Antigravity command not already verified. Never invent slash commands.
7. Inspect the Antigravity Customizations/Skills interface and `.agents/skills/` in the workspace. Use relevant skills already installed. Do not claim a skill was used unless it was actually available and read.
8. Neon publishes an official agent-skills repository. As of preparation, its docs show a skill installation pattern such as `npx skills add neondatabase/agent-skills -s neon-postgres`; verify the repository, skill name, CLI syntax, and installation result before executing. Do not install packages without checking current source and intended scope.
9. Prefer Agent Skills to legacy Antigravity Workflows for reusable project guidance. Antigravity documentation announced workflow migration/deprecation timing; check current docs instead of building the project around legacy workflow files.
10. Report progress at milestones: plan approved, foundation ready, public experience ready, data/auth ready, integrations ready, security/test pass, and release readiness.

Official Antigravity references:
- Agent Skills: https://www.antigravity.google/docs/skills?tab=ide
- Slash commands: https://www.antigravity.google/docs/slash-commands
- `/boost`: https://antigravity.google/docs/boost/
- Workflow-to-skills migration: https://www.antigravity.google/docs/migration/workflows-to-skills/

## 5. Verified technology context and links

The Neon backend is more than Postgres. Neon's September 17, 2026 general-availability announcement describes Lakebase/Postgres, Object Storage, Functions, Managed Better Auth, and AI Gateway as available product primitives. This document pack therefore allows those capabilities; the implementing agent must still verify current account availability, region support, SDK instructions, pricing, and exact APIs before use.

Official references:
- Neon backend GA: https://neon.com/blog/neon-backend-is-ga
- Neon Object Storage: https://neon.com/blog/building-neon-object-storage
- Neon Auth: https://neon.com/blog/neon-auth-branchable-identity-in-your-database
- Neon configuration / `neon.ts`: https://neon.com/blog/introducing-neon-ts
- Neon agent skills: https://neon.com/docs/ai/ai-rules-neon-toolkit
- Next.js App Router: https://nextjs.org/docs/app
- GitHub REST API — repository contents: https://docs.github.com/en/rest/repos/contents
- MCP documentation: https://modelcontextprotocol.io/docs
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Motion for React: https://motion.dev/docs/react
- Neon Object Storage photo example: https://neon.com/blog/building-a-private-searchable-photo-library-on-the-neon-backend

## 6. Phased delivery gates

### Gate 0 — Discovery and plan

Deliver a plan, decisions register, current-doc links, repository assessment, command/skill availability check, and list of owner-blocking questions. No bulk implementation before the architecture and security plan is reviewed.

### Gate 1 — Foundation

Create the application shell, theme tokens, route skeleton, lint/type/test commands, environment validation, database migration setup, and CI checks. The app must boot without private service credentials by showing a helpful setup state.

### Gate 2 — Public catalog

Deliver usable home/explore, search/filter, categories, skill detail, install command copy, source/licensing display, and preview fallbacks backed by seed fixtures clearly labeled as examples. No fake analytics.

### Gate 3 — Neon auth/data

Connect Neon Postgres, use the verified current Neon Auth integration where appropriate, add migrations, protect profile/favorites/collections and admin routes, and test authorization at server boundaries.

### Gate 4 — Registry and media

Add GitHub read/import/write adapter, media providers, draft/publish flow, license/provenance validation, conflict handling, and audit entries. If secrets are absent, tests use mocks; UI must disclose integration setup is required.

### Gate 5 — MCP

Implement and test MCP read tools, schema validation, predictable errors, pagination/limits, and hosted/stdio transport decisions. Public read access may be anonymous if explicitly configured; admin writes are out of scope for the public MCP server by default.

### Gate 6 — Security and release

Run unit, integration, and browser tests; inspect production build; run dependency/security checks where tooling exists; test keyboard/reduced-motion/mobile states; test provider failures; confirm no secrets are exposed; document deployment and recovery.

## 7. Definition of done

A feature is done only when its acceptance criteria are satisfied, it works in a real route/server operation, has tests appropriate to its risk, handles loading/empty/error states, respects authorization, is accessible, and is documented. Provide a concise final report including changed files, commands executed, test results, unresolved limitations, and any manual setup still required. Never state tests passed unless they were actually run and passed.
