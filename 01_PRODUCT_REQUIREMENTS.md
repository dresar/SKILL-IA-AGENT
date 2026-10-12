# Product Requirements Document — SkillCanvas

**Status:** Product baseline for implementation  
**Working title:** SkillCanvas; owner may rename it  
**Primary outcome:** A trustworthy open-source discovery platform where people can find AI-agent skills, inspect credible examples, and install or retrieve them through a website and MCP.

## 1. Problem statement

Many AI skill directories focus on metadata, documentation, or isolated UI components. Visitors often cannot tell what a skill actually produces, whether a demo is real, which agent can use it, what license applies, or which installation command is correct. Maintainers also need a practical way to collect skills and assets without editing application code for every entry.

SkillCanvas solves this by combining:

- A browsable, filterable skill directory.
- Skill-specific full-page or interaction-based showcases.
- Reliable source, author, version, license, and compatibility metadata.
- Accurate installation instructions and one-click copy.
- A GitHub-backed registry and admin content studio.
- Neon-powered authentication/data and optional first-party object storage.
- A read-oriented MCP interface that AI agents can use to search, inspect, and retrieve skills.

## 2. Product principles

1. **Preview before install:** show evidence of a skill's output whenever a credible example exists.
2. **Honest provenance:** preserve source URL, upstream identity, commit/version when known, license, and import date.
3. **Useful for every skill type:** UI skills get visual demos; testing, writing, research, automation, and other skills get relevant artifacts or input/output walkthroughs.
4. **Correct commands over convenient guesses:** installation command data must be traceable to an authoritative source or explicitly configured and validated.
5. **Secure by default:** imported content is data, not executable code. Preview isolation is mandatory.
6. **Open-source friendly:** document setup, contribution, provenance, deployment, and self-hosting.
7. **Minimal, high-quality UX:** visual restraint, excellent typography, clear hierarchy, functional interactions, fast search, and accessible motion.
8. **Admin efficiency:** maintainers can create, update, review, and publish entries without a code change for ordinary metadata edits.

## 3. User roles

### Anonymous visitor
- Browse and search public skills.
- Filter and sort results.
- View skill detail, source, license, verification status, screenshots, demos, and install instructions.
- Copy install commands and open external sources.
- Use public MCP endpoints only if enabled and configured for anonymous read access.

### Signed-in user
- All anonymous capabilities.
- Save favorites and create private or public collections, if enabled.
- Manage profile preferences.
- Optionally submit suggested skills for moderation; public submissions are a post-MVP feature.

### Administrator / curator
- Create, edit, archive, and publish skill records.
- Import a skill from a Git repository or URL after validation.
- Manage categories, tags, aliases, compatibility metadata, installation recipes, assets, and showcase configuration.
- Upload/publish approved images through the configured storage provider.
- Preview drafts before publishing.
- See sync/import errors and audit history.
- Manage admin roles using server-validated authorization.

### Maintainer / owner
- All admin abilities.
- Configure provider integrations, registry repository, GitHub App/token settings, default media provider, MCP deployment, retention settings, and feature flags through deployment secrets/settings.
- Rotate/revoke credentials outside the client UI.

## 4. Information architecture

### Public routes
- `/` — featured skills and the product's value proposition.
- `/skills` — directory with query string representing search, filters, sorting, and pagination/cursor.
- `/skills/[slug]` — authoritative public detail page.
- `/categories/[slug]` — category landing page.
- `/collections/[slug]` — public collections if enabled.
- `/about` — project goals, contribution and attribution principles.
- `/contribute` — submission workflow and metadata requirements.
- `/privacy` and `/terms` — policy pages appropriate to actual behavior and jurisdiction.
- `/login`, `/signup`, `/forgot-password` or equivalent routes supported by the chosen Neon Auth flow.

### Signed-in routes
- `/account` — profile/preferences.
- `/library` — favorites and personal collections.
- `/library/collections/[id]` — collection editor/detail.

### Admin routes
- `/admin` — operational overview.
- `/admin/skills` and `/admin/skills/new`, `/admin/skills/[id]` — registry CRUD.
- `/admin/imports` — import jobs and validation results.
- `/admin/media` — media library and upload state.
- `/admin/categories` — taxonomy.
- `/admin/sources` — source registry and provider status.
- `/admin/audit` — admin activity.
- `/admin/settings` — non-secret configuration state and setup guidance.

### Technical endpoints
- Application API routes or server actions for admin operations, auth-aware user actions, health checks, and integration callbacks.
- MCP endpoint or standalone MCP server with the tools specified in document 07.
- Provider callback routes only where required by the chosen auth/GitHub integration.

Route names may be refined to fit the actual repository; preserve the capabilities and access boundaries.

## 5. MVP functional requirements

### FR-001 — Skill directory
Each public skill record must include a human-readable name, stable slug, concise description, category, source URL, publication status, and at least one way to understand the skill: a preview asset, live demo, sample output, or clearly labeled “preview unavailable” state. Unknown fields are not fabricated.

### FR-002 — Search and filtering
Search across name, short/long description, tags, category, agent compatibility, framework/tool metadata, and searchable source identifiers. Support combined filters, clear-all, empty-result state, and stable shareable URL state. The database search implementation may begin with Postgres full-text/trigram features after the agent validates suitable extensions, indexes, and query plans. Do not add an external search vendor without approval.

### FR-003 — Sorting
Offer meaningful sorts such as recently updated, recently added, name, and curated featured order. Only offer “popular” when a reliable, non-manipulable metric has been implemented; do not seed fake counts.

### FR-004 — Skill detail
Display description, use cases, requirements, supported agents, source/license/version, changelog or update time when known, install command, documentation preview, showcase gallery, related skills, and provenance/verification status. Keep sections compact with progressive disclosure for long technical details.

### FR-005 — Install center
A user can choose among supported agent/install targets and copy a validated command or exact source text. The system must display where the command came from and the time it was last checked when applicable. If a command cannot be validated, show it as “maintainer-provided; not verified” or do not show it. Copy feedback must be accessible. The website must not execute install commands in the browser or on the server.

### FR-006 — Showcases
A skill can define one or more showcase types: screenshots, curated media gallery, safe external live demo, sandboxed static demo, sample input/output, workflow artifact, or documentation examples. Preview availability and verification status must be explicit.

### FR-007 — Authentication
Use a verified current Neon Auth / Managed Better Auth integration unless the owner approves another identity provider. Authentication must support the flows actually enabled by the provider. The implementation must not invent OAuth providers, magic-link behavior, email delivery, or MFA support; verify and document configuration and provider capability.

### FR-008 — Account library
Signed-in users can favorite/unfavorite skills and manage collections. Every read/write is scoped to the authenticated user in server-side code and, where practical, reinforced with database authorization policies.

### FR-009 — Admin authorization
Admin routes and writes require a server-verified admin/curator role. Hiding links in the UI is not authorization. The first admin must be bootstrapped securely through a documented server-side command or environment-controlled allowlist that cannot be self-assigned from the public signup flow.

### FR-010 — GitHub registry integration
Admins can connect/configure a specific GitHub owner/repository and import skill metadata/content. Direct publication to the configured repository must be server-side, validated, auditable, and conflict-aware. Importing third-party content requires preserving its source and license; do not silently mirror incompatible or unlicensed content.

### FR-011 — Media management
Admins can upload approved thumbnails and screenshots, order them, set alt text, preview them, and publish them with the selected media provider. Enforce actual file signatures, type allowlists, size/dimension constraints, and image processing policy. Provider references must be stored independently from rendered HTML.

### FR-012 — MCP discovery
The MCP interface can search public skills, retrieve public skill metadata/content within configured limits, list categories, return preview references, and produce validated install instructions. No administrative write tools are exposed by default.

### FR-013 — Audit history
Record security-relevant administrative actions with actor, action, target, timestamp, and safe metadata. Never log secrets, full session tokens, sensitive request bodies, or file contents unnecessarily.

### FR-014 — Error and operational states
All integrations must offer loading, success, empty, and error states. Provider failures must be visible to maintainers and must not silently corrupt records. User-facing errors must be actionable but not leak internals.

## 6. Recommended second-release requirements

- Side-by-side skill comparison.
- Theme/config playground for demos specifically designed to support it.
- Public collections and shareable curated lists.
- User-submitted skill proposals with moderation.
- Automated upstream version polling and changelog generation after provenance-safe implementation.
- Usage analytics, search-with-no-results monitoring, and stale-demo reporting.
- Skill validation/scanning pipeline for content and demo build artifacts.
- Optional semantic search using embeddings only after cost, privacy, model, and relevance evaluations. Neon AI Gateway and Postgres vector capabilities may be assessed; AI generation is not required for the MVP.

## 7. Explicitly out of scope for MVP

- Executing arbitrary third-party skill scripts on the request path.
- A browser-based arbitrary code runner with unrestricted access to the host origin or secrets.
- Automatically publishing every repository discovered on GitHub.
- Claiming an external skill is safe simply because it exists on GitHub.
- Paid plans, billing, marketplace payouts, comments, social feeds, or a public reputation system.
- An in-browser agent that installs skills on a user's computer.
- An AI-generated preview that is presented as the real upstream skill output without a clear label.
- Admin write access through anonymous MCP.

## 8. Quality attributes and measurable targets

Targets below are acceptance goals, not claims about the unbuilt product. Revisit with real measurements.

- Responsive layout works at 360 px, 768 px, 1024 px, and wide desktop widths without horizontal page overflow.
- Directory pages use server-rendered or otherwise indexable content for primary metadata where practical.
- Main browsing interactions remain usable by keyboard and screen reader.
- Search gives a visible result or meaningful empty state without a full page reload where technically appropriate.
- Critical routes have explicit loading, error, and empty states.
- Aim for good Core Web Vitals on representative pages; measure rather than promise a score.
- Every privileged operation has automated authorization tests.
- The production build, type checks, linter, schema migrations, and test suites run reproducibly from documented commands.
- User-provided media and demos never become trusted executable code merely because they passed metadata validation.

## 9. MVP acceptance checklist

- [ ] Visitors can explore, search, filter, open detail pages, and copy install instructions.
- [ ] Detail pages clearly distinguish official/verified facts from curator-supplied or unverified values.
- [ ] Visual skills display relevant screenshots/live demos; other skills get relevant showcases or an honest unavailable state.
- [ ] Sign-in/out flow works using the configured Neon Auth integration in the target environment.
- [ ] Users cannot read or modify other users' favorites or collections by guessing IDs.
- [ ] A non-admin cannot access admin reads/writes by calling endpoints directly.
- [ ] Admin create/edit/publish flows persist data and handle failed provider operations.
- [ ] GitHub writes use server-side credentials and handle stale file SHA/conflicts.
- [ ] Image upload rejects disallowed file types, oversized files, and unsafe names.
- [ ] MCP tools return schema-valid results and never expose draft/private data to anonymous clients.
- [ ] No arbitrary imported JavaScript is executed in the main application origin.
- [ ] Documentation covers local setup, environment variables, migrations, GitHub configuration, Neon configuration, MCP clients, deployment, and recovery.
