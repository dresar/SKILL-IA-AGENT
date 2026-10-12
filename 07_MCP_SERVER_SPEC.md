# Model Context Protocol (MCP) Server Specification

## 1. Purpose

Expose the public SkillCanvas registry to AI coding agents through MCP so agents can find relevant skills, inspect metadata/content, see available previews, and obtain source-backed installation instructions. MCP is a machine-facing interface to the same domain services used by the website; it must not create a separate, inconsistent catalog.

Use the official MCP TypeScript SDK and follow its current protocol/version guidance. Exact package exports, transport setup, authentication hooks, and protocol fields must be verified against the current SDK and official documentation before implementation.

References:
- MCP documentation: https://modelcontextprotocol.io/docs
- MCP TypeScript SDK: https://github.com/modelcontextprotocol/typescript-sdk
- Antigravity MCP/settings documentation can be found from: https://www.antigravity.google/docs/agent/

## 2. Transport decision

Support the transport that matches the hosting/use case after verifying the current MCP SDK and target client requirements:
- `stdio` for local clients that run MCP as a local process, if packaging/configuration is maintained.
- Streamable HTTP for a hosted service where supported by the selected SDK and clients.

Do not implement a deprecated transport just because an old example uses it. If both transports are implemented, reuse the same tool handlers and authorization logic. Document client setup examples and keep them synchronized with the actual endpoint/command.

## 3. Access policy

Default posture: read-only public MCP. Public tools return published public records only. Drafts, unpublished source content, admin configuration, user private collections, auth data, secret references, and provider credentials are never accessible through the anonymous MCP interface.

If an authenticated MCP mode is added, use a documented supported auth mechanism, validate token audience/issuer/scope per current spec, apply rate limits, and use per-user authorization. Do not assume that a web session cookie alone is a suitable MCP auth scheme. Do not expose admin write tools in the MVP.

## 4. Tool inventory

Implement a stable minimum set. Naming can be adjusted to SDK/client conventions, but document any changes.

### `search_skills`
Purpose: search published public skills by keywords and optional facets.

Input:
- `query`: optional string, bounded length; empty query is allowed only when filters/category browsing are requested.
- `category`: optional slug.
- `tags`: optional string array with a strict maximum count.
- `skill_type`: optional known type.
- `agent`: optional compatibility identifier.
- `preview_type`: optional showcase type.
- `license`: optional license filter when metadata exists.
- `sort`: one of a bounded enum such as `relevance`, `recent`, `name`, `featured`.
- `limit`: integer bounded by a server maximum.
- `cursor`: optional opaque pagination cursor.

Output:
- `items[]` with `id`, `slug`, `name`, `summary`, public detail URL, categories, tags, skill type, supported agents when known, source URL, license/status provenance, preview availability, and last checked timestamp where known.
- `next_cursor` or null.
- `total` only if cheaply/reliably available; do not make inaccurate count claims.

Behavior: validate and normalize, cap cost/page size, stable order, never include unpublished records, and return an empty list—not an invented result—when nothing matches.

### `get_skill`
Purpose: retrieve a single published skill's normalized detail metadata.

Input:
- `slug` or stable public ID; accept one canonical identifier, not ambiguous arbitrary URL fragments.

Output:
- Full public metadata including source/provenance, license, compatibility claims, version state, preview references, validated install recipes, and canonical public URL.
- Omit unknown data or represent it explicitly as unknown; do not hallucinate fields.

### `get_skill_content`
Purpose: retrieve the public skill instruction document or selected safe file from a published registry copy, subject to licensing and configured length limits.

Input:
- `slug`.
- optional relative `path`, restricted to files published and explicitly readable by the registry.
- optional `max_chars`, bounded by server-side maximum.

Output:
- `content`, `content_type`, file path, version/commit/hash when available, source/provenance URL, truncation flag, and next-step guidance if truncated.

Rules: prevent path traversal, never read arbitrary filesystem paths, never retrieve private environment/config files, and never allow an external URL to become an unrestricted server-side fetch. External source fetches must go through the supported provider adapter and SSRF protections.

### `get_install_command`
Purpose: return a validated installation recipe for a target agent/tool.

Input:
- `slug`.
- `target`: supported agent/tool identifier.

Output:
- Exact command or instruction text (if available), target label, provenance URL, verification status, check timestamp, prerequisites/notes, and optional warning.

Rules: do not synthesize a command from a name unless a validated template/source authorizes it. Do not claim it was executed or tested unless that check exists in stored facts. This tool returns text only; it must not execute commands.

### `list_categories`
Purpose: list public categories and counts if counts are accurate.

Input: optional `parent_slug`, pagination/limit if taxonomy is large.

Output: category ID/slug/name/description, parent, and optionally computed published-skill count.

### `get_skill_preview`
Purpose: retrieve preview metadata.

Input: `slug` and optional `showcase_id`.

Output: showcase type, title, safe URL or asset reference, content description, viewport metadata, verification state, checked timestamp where known, and fallback availability.

Do not return unapproved embeds or draft preview URLs.

### Optional future tool: `compare_skills`
Purpose: compare a small bounded list of public skill slugs across metadata, compatibility, sources, license, showcase coverage, and recipes. This is post-MVP unless needed early.

## 5. Resources and prompts

Resources may expose curated public category indexes, project metadata, or a skill's published content if supported by the selected SDK/client. Prompts may provide reusable guidance such as “select an appropriate frontend skill”, but must not pretend to have invoked a local installer or modified the user's repo.

Avoid duplicating large catalogs as one unbounded resource. Use paging/search tools for discovery.

## 6. Shared domain logic

Every MCP tool should call an application service (e.g. `searchSkills` or `getPublishedSkill`) with a typed input/output. Do not duplicate SQL/business rules within each MCP tool. Validate output schemas before returning. The web and MCP must agree on publication, provenance, command, and visibility status.

## 7. Error model

Use stable, safe error categories such as:
- `INVALID_INPUT`
- `NOT_FOUND`
- `NOT_AVAILABLE`
- `FORBIDDEN`
- `RATE_LIMITED`
- `UPSTREAM_UNAVAILABLE`
- `INTERNAL_ERROR`

Do not leak SQL, stack traces, private paths, access tokens, GitHub raw responses containing secrets, or internal hostnames. Include a correlation/request ID when useful. Error messages should tell the client whether it can retry or should correct input.

## 8. Rate and resource limits

- Set bounded string lengths, array lengths, content size, result count, response size, and upstream fetch timeouts.
- Use request-scoped cancellation/abort signals where supported.
- Apply per-client/IP or authenticated-principal rate limits appropriate to hosting, with a plan for trusted local clients.
- Avoid loading/returning entire SKILL.md documents by default during search.
- Apply conditional caching to public metadata when safe.
- Protect against expensive wildcard queries and repeated upstream fetches.
- Prefer stored snapshots/metadata for MCP lookups; refresh upstream sources through a deliberate job rather than every tool call.

## 9. Hosted MCP security

For hosted streamable HTTP:
- Validate origin/host according to the SDK/spec's current security guidance.
- Use TLS at the public boundary.
- Define authentication expectations explicitly; public-read and authenticated modes must not be confused.
- Apply body/request timeouts and size limits.
- Enforce visibility/permission checks in the service layer, not only middleware.
- Avoid accepting arbitrary resource URLs that cause server-side requests.
- Add audit/metrics without logging full private content or credentials.

## 10. MCP acceptance tests

- Search finds a known seeded public skill and returns schema-valid metadata.
- Search never returns a draft/archived/private skill to anonymous callers.
- Invalid category, cursor, sort, target, and oversized text fail safely.
- Pagination is stable and has no duplicate/skip behavior under a static dataset.
- `get_skill_content` blocks `../`, absolute paths, hidden secret files, and unapproved files.
- Install command matches the stored verified recipe exactly and is never executed.
- Preview lookup returns only approved public showcase URLs/assets.
- Provider outage returns a predictable retriable error, not fabricated skill data.
- Unauthorized MCP calls cannot access admin/user data.
- The published MCP endpoint/client configuration in docs matches the real implementation.
