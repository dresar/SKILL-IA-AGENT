# Database, Authentication, and Neon Platform Specification

## 1. Guiding decisions

Use Neon Postgres for application data. Use Neon Auth / Managed Better Auth for identity only after following the current official Neon + Next.js guide and confirming feature support in the target project. Do not recreate managed provider tables or assume undocumented table names. Treat provider-owned identity records as provider-owned.

Use Drizzle ORM or the ORM already established by the repository. Keep schema definitions and migrations committed. Query only through server-side repositories/use cases. A user ID from a client payload is never trusted as proof of identity.

Neon announced its expanded backend primitives as generally available in September 2026, including Object Storage, Functions, Managed Better Auth, and AI Gateway. Verify current docs, region/project availability, configuration, SDK imports, pricing, and account settings at implementation time.

## 2. Neon service configuration

The agent must research current official docs before generating `neon.ts`, CLI commands, bucket definitions, auth wiring, or object-store clients. Neon's configuration model and packages have evolved. Do not copy stale examples blindly.

Possible capabilities:
- Postgres for relational data.
- Managed Better Auth / Neon Auth for sign-in and session management.
- S3-compatible Neon Object Storage for uploaded assets or artifacts if the owner selects it.
- Neon Functions for appropriate background/long-running tasks if needed.
- Neon AI Gateway only if a separately approved feature requires model inference.

The MVP does not require AI Gateway or Neon Functions to render the catalog. Do not enable paid/usage-based services without a documented reason and owner approval. If using `neon.ts`, assess `neon config plan` before applying infrastructure changes; don't run destructive or production-changing commands without owner approval.

Official references:
- GA announcement: https://neon.com/blog/neon-backend-is-ga
- New Neon Auth background: https://neon.com/blog/neon-auth-branchable-identity-in-your-database
- Object Storage: https://neon.com/blog/building-neon-object-storage
- `neon.ts`: https://neon.com/blog/introducing-neon-ts
- Neon agent skills: https://neon.com/docs/ai/ai-rules-neon-toolkit
- Neon photo/storage example: https://neon.com/blog/building-a-private-searchable-photo-library-on-the-neon-backend

## 3. Recommended logical schema

Names may be adapted to local conventions, but preserve semantics. Use UUID or another stable key type consistently. Use database constraints for invariants that can be expressed in SQL. Slugs must be unique among records even when archived if old URLs must not be reassigned; alternatively keep a slug-alias table.

### `profiles`
- `id`: internal UUID primary key.
- `auth_subject`: text, unique, indexed; opaque ID returned by validated Neon Auth session.
- `display_name`: nullable text.
- `avatar_asset_id`: nullable FK to `assets` if applicable.
- `theme_preference`: enum/text constrained to supported values if preference is shipped.
- `created_at`, `updated_at`: timestamps.

Do not create a direct foreign key into undocumented Neon Auth internal tables. A stable opaque subject ID avoids coupling the application schema to provider-managed implementation details.

### `roles` and `profile_roles`
- `roles`: known roles such as `admin`, `curator` (and optionally a member role if needed).
- `profile_roles`: profile ID, role ID, assignment actor, timestamp; unique pair.

Only a trusted administrative workflow may assign privileged roles. Public profile edits cannot change roles.

### `skills`
Core current registry entry:
- `id`, `slug` unique, `name`, `summary`, `description` or a pointer to canonical full content.
- `status`: `draft`, `published`, `archived` (use a database enum or checked text based on migration policy).
- `skill_type`: UI design, frontend, coding, testing, writing, research, automation, documentation, or extensible custom type.
- `author_display`, `license_spdx` nullable, `license_url` nullable.
- `source_kind`, `source_url`, `source_owner`, `source_repo`, `source_path`, `source_ref`, `source_commit` nullable where unknown.
- `canonical_registry_path` nullable for skills managed in the configured first-party repository.
- `verification_status`: values such as `unverified`, `metadata_checked`, `source_checked`, `demo_checked`; do not compress these into a misleading universal “safe” badge.
- `last_source_checked_at`, `published_at`, `created_by_profile_id`, `updated_by_profile_id`, `created_at`, `updated_at`.
- Optional `featured_rank` nullable; no fabricated popularity counters.

### `skill_versions`
- `id`, `skill_id`, version string or source ref, source commit, canonical file path, source content hash, content location, created/observed timestamps, changelog text nullable, created actor nullable.
- Preserve imported snapshot identity and provenance. Do not overwrite old version metadata when importing a newer source.

### `skill_sources`
- `id`, `skill_id`, source type, URL, owner/repository/path/ref, source license, last checked state, check timestamps, and safe error code/message.
- Supports multiple upstream sources without storing credentials.

### `categories`, `skill_categories`, `tags`, `skill_tags`
- Categories have stable slug, name, description, optional parent category ID, sort order, and enabled status.
- Skill/category relationship allows multiple categories if product design requires it; otherwise constrain the primary category in `skills` and keep secondary tags normalized.
- Tag slugs are unique and normalized; avoid duplicates differing only by casing.

### `install_recipes`
- `id`, `skill_id`, target identifier, display label, exact command or structured recipe, source URL, `verification_status`, checked timestamp, maintainer note, platform/agent constraints, and enabled flag.
- Never generate shell arguments by concatenating untrusted input. Store validated templates or structured parameters and render safely.
- Keep source/verification separate from command text; a command can be configured but unverified.

### `showcases`
- `id`, `skill_id`, showcase type, title, description, status, safe external URL nullable, static artifact reference nullable, preview origin/allowlist metadata where required, viewport configuration JSON constrained by schema, sort order, `last_checked_at`, created/updated timestamps.
- JSON is for validated display configuration, not executable arbitrary JavaScript.

### `assets`
- `id`, owner/skill relation where applicable, storage provider, provider object key or repository path, public URL or URL resolver reference, MIME type determined from file bytes, byte size, width/height, alt text, checksum, visibility, processing status, created actor, timestamps.
- Store object keys/provider references as canonical; public URLs can be derived or cached but must be refreshable.

### User library
- `favorites`: unique `(profile_id, skill_id)`, created timestamp.
- `collections`: owner profile ID, slug or generated ID, name, description, visibility, timestamps.
- `collection_items`: collection ID, skill ID, position, added timestamp, unique pair.
- All queries for private data must filter by validated owner. Public collections expose only an explicit public flag and published referenced skills.

### Import and provider operations
- `import_jobs`: source URL, requested actor, status, detected metadata, safe validation findings, result skill ID, started/finished timestamps, correlation ID, retry count.
- `provider_operations`: provider, operation type, target, idempotency key, status, attempt count, safe error code, result metadata, timestamps. Avoid storing tokens or full payloads.
- `audit_events`: actor subject/profile nullable for system events, action, target type/ID, timestamp, correlation ID, safe JSON metadata. Restrict access to admins; no secrets or full imported content.

## 4. Database constraints and indexing

Minimum indexes/constraints:
- Unique normalized `skills.slug`.
- Index for `skills.status` + stable listing sort (`published_at`/`updated_at`, `id`).
- Index for source owner/repository/path/ref where used to deduplicate imports.
- Unique `(profile_id, skill_id)` favorite.
- Unique `(collection_id, skill_id)` collection item.
- Unique role names and unique `(profile_id, role_id)` role assignment.
- Foreign keys with deliberate delete behavior; avoid cascade deletion of audit records or published history without explicit retention policy.
- Search indexes matching actual Postgres full-text/trigram implementation.
- Index audit timestamps and actor/target fields used for admin investigation.

Use transactions for related Postgres updates. GitHub and object storage operations do not share a Postgres transaction; model them as status-driven, idempotent processes with retry/compensation behavior.

## 5. Authentication integration

The implementer must:
1. Read current official Neon Auth / Managed Better Auth documentation and the current Next.js quickstart.
2. Determine whether the project uses Neon Auth's current Better Auth-based flow or an older/legacy integration. Do not mix APIs or packages from different generations.
3. Install only documented packages; use official imports/middleware/server-session patterns from the verified docs.
4. Configure allowed origin/redirect URLs and the necessary email/OAuth providers in the Neon console or the documented configuration surface.
5. Test sign-up/sign-in/sign-out/session expiry and whatever password reset/OAuth features are actually enabled.
6. Ensure protected actions derive the user identity from a validated server-side session/JWT, not a client-provided subject.
7. Ensure auth redirects cannot be abused as open redirects; constrain post-login destination to same-origin paths or an explicit allowlist.
8. Keep provider-owned tables separate from the application schema. Do not manually modify internal identity/session tables.

If the provider integration requires external email delivery or OAuth configuration, document the owner action. Do not mock success in production.

## 6. Authorization model

- Anonymous: read published public skills, public categories, public assets, public collections if enabled.
- Member: anonymous permissions plus own profile preferences, own favorites, own collections, and own submissions if implemented.
- Curator: limited admin CRUD appropriate to the assigned role; publishing/destructive actions may require elevated permission if the product evolves.
- Admin: full registry management and integration configuration, but secrets should still be managed through deployment configuration rather than read back from UI.
- System worker: narrowly scoped access to one job/task, not a universal bypass without audit.

Centralize role checks and use a single trusted helper/service rather than reimplementing role logic in multiple routes. Test APIs and server actions directly. Where RLS is enabled, create explicit policies and test both allowed and denied cases; do not assume the existence of a session makes a database query automatically owner-scoped.

## 7. Row-level security strategy

Decide whether data access uses server-only database connections with explicit server authorization, Neon Data API + RLS, or a combination. Do not casually mix conflicting models. If the application uses a privileged connection that bypasses RLS, every service query must enforce authorization before reading/writing data. Document the choice and threat model.

Never make the Neon database URL or privileged connection available to the browser. If public read APIs are enabled, expose only deliberately published fields and enforce row visibility at the database/API boundary.

## 8. Migrations and seed data

- Commit numbered/versioned migration files.
- Run migrations through a documented command from a controlled environment.
- Use a separate Neon development/preview branch for schema iteration when available.
- Inspect migration SQL before applying to production.
- Avoid destructive migrations without backup/rollback or a documented recovery plan.
- Seed demo records must be clearly identified as fixtures and must not invent third-party licenses, stats, official endorsement, or verification claims.
- Make seed operations idempotent and safe to re-run.

## 9. Asset/storage integration

For assets, use the `AssetStorageProvider` abstraction defined in document 06. GitHub can store versioned public screenshots and metadata when the owner desires a Git history; Neon Object Storage can store uploads using its S3-compatible API and branch-aware storage semantics. Do not store image bytes as Base64 in Postgres.

Validate MIME from bytes/signature where possible, enforce size limits, create server-generated object keys, normalize image formats only with a verified image-processing library, and store a checksum. Do not trust user-provided file extensions or content type headers.

For private assets, use provider-supported private access and authorized server delivery or short-lived signed URLs only if the provider's current API supports the needed behavior. Do not guess a Neon public URL or signature format.

## 10. Environment variable rules

Names depend on the selected current integration; use the exact names from the official setup. The `.env.example` should list names/placeholders only, never real credentials. Expected categories may include:

- Database connection(s).
- Neon Auth base URL / public client configuration as documented.
- GitHub App ID/installation configuration/private key OR a narrowly scoped token.
- GitHub registry owner/repository/default branch.
- Optional Neon Object Storage endpoint/region/access key/secret key/bucket configuration as documented.
- Application base URL and public canonical URL.
- MCP authentication/rate-limit configuration if hosted MCP requires it.
- Observability keys only if an approved provider is adopted.

Do not assume `NEON_AUTH_*` variables or specific environment names exist without checking current Neon tooling output/docs. If using `neon.ts`/Neon CLI, review generated files and ensure secrets stay outside version control.
