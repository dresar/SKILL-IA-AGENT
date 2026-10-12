# Antigravity Master Implementation Prompt

> Use this as the main prompt in Google Antigravity after placing the complete ten-file documentation pack in the repository. The prompt is intentionally strict: inspect, research, plan, build in phases, and verify. It does not authorize guessing or secret exposure.

## Primary instruction

You are the lead engineer responsible for implementing **SkillCanvas**, an open-source AI-agent skill discovery platform. The repository's ten Markdown specification files are the project contract. Read every file before making broad changes, especially the product requirements, architecture, design system, database/auth, GitHub registry, preview isolation, MCP, and security/testing documents.

Your job is to implement a real, coherent, maintainable application—not a static mockup. The public website must let users discover skills, see truthful previews, inspect provenance/licensing, copy source-backed install instructions, and access a read-oriented MCP interface. Administrators must be able to manage registry content and media securely. Neon is the chosen backend platform, including Postgres, current Neon Auth/Managed Better Auth, and optional Object Storage as specified. GitHub is the preferred canonical repository for skill files and approved small versioned public preview images. Preserve adapter boundaries so the media provider can also use Neon Object Storage when configured.

## Step 0 — invoke Antigravity capabilities appropriately

Before editing:
1. If `/plan` is available in the current command picker, invoke it. If not, produce the same reviewable plan manually.
2. Inspect the installed Agent Skills in Antigravity's Customizations UI and `.agents/skills/`. Read relevant installed skills rather than guessing their contents.
3. Check whether the official Neon agent skill is installed. If not, inspect the current official Neon agent-skills instructions and verify the exact install command before installing. A currently documented pattern has been `npx skills add neondatabase/agent-skills -s neon-postgres`; confirm current repository, CLI syntax, skill name, and result first.
4. Use `/browser` if available for research of current official documentation and for browser-based validation. Use official sources for framework/provider APIs.
5. Use `/grill-me` if available only for unresolved high-impact decisions. The documents already resolve most product/design choices; do not ask redundant questions.
6. Use `/boost` if available and appropriate for difficult, cross-cutting reasoning such as the security review, MCP authorization design, or complex provider consistency bug. It may be plan-restricted. Do not claim it ran if unavailable.
7. Use `/teamwork-preview` only if present in the actual command picker and useful for independent sub-agent investigation. If unavailable, continue normally.
8. Check command availability through Antigravity's current `/` completion UI before invoking any other slash command. Do not invent commands or blindly invoke every command. Use tools that are relevant and actually installed.

Antigravity official references:
- https://www.antigravity.google/docs/skills?tab=ide
- https://www.antigravity.google/docs/slash-commands
- https://antigravity.google/docs/boost/
- https://www.antigravity.google/docs/migration/workflows-to-skills/

## Step 1 — inspect and research

- Inspect the existing repository, package manager, code conventions, current tests, route structure, and uncommitted user changes. Do not overwrite sound work or discard user changes.
- Confirm current stable compatible Next.js App Router, React, TypeScript, Tailwind, shadcn/ui, Drizzle, Neon, auth, storage, GitHub API, MCP SDK, and test package APIs via official documentation. Do not assume package names/imports from memory.
- Verify Neon’s current GA status and exact setup for Postgres, Managed Better Auth, Object Storage, Functions, and `neon.ts`. Only enable services that are required and available in the owner's target account/region. AI Gateway is not part of the MVP unless a feature needs it and the owner approves.
- Verify the current Neon Auth/Managed Better Auth integration and avoid mixing new Neon Auth with legacy Stack Auth examples.
- Verify GitHub API behavior, token/App permissions, file size limits, update SHA semantics, and rate-limit responses.
- Verify official MCP SDK version, supported transports, authentication/security requirements, and schema conventions.
- Record a short decision log of facts checked, assumptions, and still-blocking choices.

Do not paste credentials into any AI prompt or log. If credentials are missing, use mocks for tests and provide setup steps; never report a real integration as tested if it has not been.

## Step 2 — deliver a reviewable plan

Produce a phase-based plan with:
- repository findings,
- proposed route and module structure,
- data entities and migration plan,
- chosen authentication/session/authorization pattern,
- GitHub registry write strategy,
- image/media provider strategy,
- preview isolation strategy,
- MCP transport and access policy,
- dependencies to install and why,
- test strategy,
- owner-required environment/provider actions,
- acceptance criteria for each gate.

Call out any conflict with the spec. Do not silently relax security requirements to save time. Ask the owner only when a decision is blocking or materially changes cost/security; otherwise use the defaults in the docs.

## Step 3 — implement in this order

### Phase A: foundation and visual shell
- Create or adapt a Next.js App Router + TypeScript application using the repository's package manager.
- Establish lint, format, type-check, test, environment validation, and production-build commands.
- Implement theme tokens/components according to `03_DESIGN_SYSTEM_AND_UX.md` and the supplied screenshot direction: near-black background, charcoal surfaces, muted secondary text, thin borders, restrained lavender accent, generous spacing, editorial but compact typography.
- Build responsive app shell/sidebar/top bar and route placeholders with correct semantics.
- Make visible actions functional; remove decorative controls that do nothing.
- Avoid excessive gradients, gratuitous neon glow, random animation, fabricated counters, and generic AI-looking card layouts.

### Phase B: public directory and truthful showcase pages
- Implement home, directory, search/filter/sort, categories, and skill detail pages.
- Keep URL state shareable where appropriate.
- Build skill cards with actual structured metadata and specific preview assets.
- Implement showcase types and honest statuses: live demo, static showcase, screenshot, sample output, source preview, or unavailable.
- Implement accessible preview gallery/viewport controls only when they actually alter the display.
- Build command display/copy behavior with exact command text and clear source/verification status.
- Include loading, empty, error, responsive, and reduced-motion states.

### Phase C: database and authentication
- Implement schema/migrations and repository/service boundaries described in `04_DATABASE_AUTH_AND_NEON.md`.
- Follow current official Neon Auth/Managed Better Auth instructions. Do not invent APIs or duplicate provider-managed identity tables.
- Validate sessions on the server for every private/admin use case.
- Implement user favorites and collections with strict owner scoping, if within the current MVP phase.
- Implement out-of-band admin bootstrap and server-verified role checks.
- Add unit/integration tests for authorization and visibility.
- If Neon secrets are unavailable, keep application startup actionable and tests mocked; do not fake real authentication success.

### Phase D: GitHub registry and media management
- Implement typed GitHub source/read/write adapters and the skill registry/import lifecycle.
- Keep external listing versus first-party repository copy distinct.
- Preserve attribution, source refs/commits, license metadata, and verification state.
- Validate import URLs and files. Never execute the imported skills or install upstream dependencies simply to parse them.
- Build admin forms for skill CRUD, draft/review/publish, taxonomy, source and recipe metadata, and media upload.
- Use server-only least-privilege credentials. Handle update SHA conflicts, size limits, partial provider failures, retries, and audit events.
- Use the configured asset adapter. Prefer GitHub for small versioned public images if that is the configured owner choice; support Neon Object Storage where configured and appropriate. Do not promise raw GitHub is a full CDN.
- Ensure a failed provider call never produces a false “success” state.

### Phase E: MCP
- Implement the read-first MCP tools and schemas from `07_MCP_SERVER_SPEC.md` using the current official SDK.
- Reuse application services and published-data visibility rules.
- Add request/input/response limits, stable errors, rate policy, source/recipe provenance, and tool tests.
- Keep public MCP read-only by default. Do not expose admin mutation tools in the anonymous interface.
- Add an actual client configuration example only when the real endpoint/transport is known; use placeholders for local URLs rather than inventing deployment addresses.

### Phase F: hardening, polish, and release
- Run format/lint/type checks/unit/integration/e2e/build checks available in the repository.
- Test mobile and desktop layouts in a browser. Capture/inspect actual renders, fix overflow, spacing, typography, focus, contrast, and loading issues.
- Test reduced motion, keyboard navigation, command copy, filter combinations, and preview fallback.
- Test direct unauthorized requests, IDOR, untrusted import data, SSRF rejection, path traversal, media validation, and iframe isolation.
- Inspect build output/configuration for accidental secrets and unsafe public environment variables.
- Update setup docs, environment templates, migration steps, GitHub setup, Neon/Auth setup, MCP client setup, admin bootstrap, deployment, and recovery guidance.

## Step 4 — implementation constraints

- Use a focused set of dependencies. Do not install every animation library in the main bundle. Keep expensive demos lazy/isolated.
- Use current APIs verified from official docs. If docs are ambiguous, check package examples/source and state the ambiguity; do not invent a convenient API.
- Use runtime schemas at network boundaries, including admin forms, provider responses where practical, and MCP tool inputs/outputs.
- Keep provider SDKs in server-only modules. Client components must never import database/GitHub secret modules.
- No secrets in source code, test snapshots, `.env.example`, logs, generated client bundles, or skill content.
- Do not execute installation commands that mutate the owner's global environment or production infrastructure unless explicitly authorized. Prefer project-local, reversible setup and inspect package scripts before running them.
- Do not apply production database/schema/infrastructure changes without owner approval. Use Neon preview/development branches and reviewed plans where available.
- Preserve project behavior and existing code unless a change is required by the spec. Avoid large rewrites without need.
- Do not mark TODOs as completed. Use clear typed errors and meaningful user feedback rather than silent catches.
- When something is blocked by a missing token, account toggle, region, or provider capability, implement the safe adapter path and document the manual step.

## Step 5 — mandatory verification

Before each milestone report, run the checks relevant to that phase. At final completion, report truthfully:
- implemented routes/features,
- schema/migrations,
- provider integrations actually exercised,
- tests and exact commands run,
- checks passed/failed/not run/blocked,
- browser sizes and flows inspected,
- security cases covered,
- environment variables and console setup still required,
- known limitations and next steps.

Never say “all tests pass” if tests were skipped or did not run. Never say GitHub/Neon/MCP is live without exercising the configured integration.

## Step 6 — final completion criteria

The project is ready for owner review when:
- public users can browse/search/filter and view skill details;
- skill detail accurately shows showcase type, upstream source, known license/version/compatibility, and install source;
- preview UI is useful and honest even when no interactive demo exists;
- command copy returns exact stored text;
- Neon data/auth integration follows verified current docs and protects server routes;
- admin operations work through a protected server boundary;
- GitHub writes are limited to configured targets and handle conflicts/failures safely;
- assets use the selected provider and cannot leak drafts/private media;
- public MCP tools expose only intended published data;
- untrusted skills are never executed in the main app process;
- tests, documentation, responsive UI, keyboard use, and release setup are sufficiently complete for review.

Begin now with repository inspection and planning. Do not skip directly to coding before the plan and high-risk decisions are understood.
