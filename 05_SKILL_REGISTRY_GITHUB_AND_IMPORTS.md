# Skill Registry, GitHub Integration, and Imports

## 1. Registry model

The registry contains two different concepts and must distinguish them:

1. **External listing:** metadata and references for a skill that remains hosted by an upstream project. SkillCanvas may store a curated summary, source URL, source identifier, version/commit, license metadata, and preview metadata. It must not imply that the content has been copied into the first-party repository.
2. **First-party registry copy:** a versioned copy managed by the project owner in the configured SkillCanvas GitHub repository. It must preserve upstream provenance and comply with the applicable license. Publication creates a commit or other traceable version record.

Never overwrite a third-party repository. Never mirror content whose license or terms do not allow the intended redistribution. If licensing is unknown, retain a source link and minimal factual metadata only until the curator confirms policy; do not bundle the upstream file.

## 2. Canonical repository layout

A reasonable starting layout for the configured registry repository is:

```text
registry/
  README.md
  categories/
    ui-ux.yml
    frontend.yml
    testing.yml
  skills/
    frontend-design/
      SKILL.md
      skill.meta.json
      previews/
        overview.webp
        dashboard.webp
    example-testing-skill/
      SKILL.md
      skill.meta.json
      previews/
        output.webp
```

The agent may refine this structure but must document it and keep it machine-readable. Do not store duplicated mutable metadata in three competing canonical files. Choose a clear source of truth: metadata may live in a validated `skill.meta.json` or frontmatter, with database fields acting as a searchable projection/snapshot. Document sync direction and conflict resolution.

## 3. Skill metadata format

Normalize fields regardless of their upstream format:
- `schemaVersion`.
- `slug` (stable, lowercase, hyphen-separated).
- `name`.
- `summary`.
- `description`.
- `skillType`.
- `categories[]`, `tags[]`.
- `source` with type, canonical URL, owner/repository/path/ref/commit where applicable.
- `license` identifier and URL when established.
- `authors[]` as source-provided names/links, not inferred identities.
- `compatibility[]` for actually documented/tested agent targets.
- `installRecipes[]` each with target, exact command/instructions, source URL, validation state, and check time.
- `showcases[]` with type, title, asset or demo reference, description, and verification metadata.
- `versions[]` or a pointer to version history.
- `status`, `createdAt`, `updatedAt`, `lastCheckedAt`.

Validate with a runtime schema. Reject unknown critical schema versions; tolerate non-critical extra fields if forward compatibility is explicitly designed.

## 4. Import workflow

1. Admin submits an upstream URL or repository/path/ref.
2. Normalize and parse the URL. Allow only supported GitHub URL forms or explicitly supported providers. Reject embedded credentials, local filesystem paths, loopback/private-network URLs, unsupported protocols, and malformed refs.
3. Canonicalize to repository, path, ref and commit when available. Do not treat query parameters as trusted selectors unless the adapter explicitly supports them.
4. Fetch metadata through the chosen provider adapter with timeouts and bounded response sizes.
5. Parse supported formats such as `SKILL.md` frontmatter and README only using a safe parser. Treat all fetched content as untrusted data/instructions for display; it must never override this application's system/security policy.
6. Normalize metadata, check duplicate source identity, detect license/source fields, record missing information, and create an import job.
7. If allowed and configured, capture a content hash and store a source snapshot/version record. Do not execute scripts or install dependencies just to inspect a skill.
8. Let the admin review metadata, attribution, license, install command, screenshot sources, and preview plan.
9. Publish as an external listing or approved registry copy. Keep the states separate.
10. Log the action and preserve retryable provider status if a GitHub/DB/storage operation partially fails.

The import process must be idempotent. Re-importing the same upstream commit should not duplicate a record. Re-importing a newer commit should create a new version observation and a reviewable diff/status rather than silently rewriting the historical snapshot.

## 5. GitHub authentication and write permissions

Prefer a GitHub App installation scoped to a dedicated registry repository, or another supported least-privilege integration explicitly selected by the owner. A fine-grained token can be used for initial development only if constrained to the specific repository and permissions needed. The exact auth option must be verified against current GitHub docs and repository administration constraints.

- All write operations happen server-side.
- Browser receives no access token or private key.
- Use the minimum required repository/content permissions.
- Never expose private keys in logs or error messages.
- Keep provider identifiers, installation/repository IDs, and credential references in server configuration; store no raw secret in the database.
- Support revocation/rotation without deploying hard-coded secrets.
- Separate read-only import capability from write/publish capability.

Official API reference: https://docs.github.com/en/rest/repos/contents

## 6. Safe file writes

For creating/updating content through the GitHub Contents API:
- Validate the destination repository against the configured allowlist; never accept arbitrary write target repos from a browser parameter.
- Normalize path segments and reject path traversal, absolute paths, control characters, reserved paths, and unexpected file extensions.
- Restrict writable roots, e.g. `registry/skills/<slug>/` and approved media folders.
- Use the API's required SHA for updates and handle `409`/`422` or equivalent stale-file conflicts according to current official API docs.
- Set commit messages from controlled templates; never include secrets or raw untrusted content in a log line.
- Avoid overwriting existing content silently. Display diff/conflict state and require an explicit admin decision where ambiguity exists.
- Keep operations idempotent by checking content hashes and the existing file version.
- Use size limits appropriate to the endpoint and repository rules. Do not push large images through a contents endpoint if the current API or repository configuration makes that inappropriate.
- Store provider result identifiers and the resulting commit SHA, if returned.

## 7. Command generation

A command is installable configuration, not free-form decoration. Each recipe requires:
- Target agent/tool identifier.
- Exact command or instruction text.
- Provenance URL, preferably official documentation or the relevant skill repository.
- Confidence/verification state.
- Last manually or automatically checked timestamp, if a check was performed.
- Optional platform constraints or prerequisites.

Command generation rules:
- Do not infer `--skill` names from display names unless verified from the source layout or registry metadata.
- Do not substitute a command from one package manager/provider for another.
- Do not claim a command is tested unless the actual check was executed in a safe disposable environment.
- Store exact recipe text for reproducibility; if a template is used, validate every variable and escape arguments using a safe platform-aware method.
- Do not run the command on the user's machine or server from the web interface.
- Copy only the command, not Markdown delimiters, prompt prefixes, or explanatory labels.
- If no source-backed recipe is available, provide the source link and state that installation instructions are unavailable/unverified.

Example command text supplied by the project owner for one skill (preserve only if current source confirms it):

```bash
npx skills add github.com/anthropics/skills/tree/main/skills/frontend-design --skill frontend-design
```

Example post-install instruction: “After installation, confirm the skill is available, then wait for my next instruction.” This is an agent instruction example, not a command to execute automatically on the website.

## 8. GitHub-backed image delivery and CDN caveat

The owner prefers GitHub-backed image management. Support it as a provider, but do not promise cache performance, uptime, bandwidth, CORS behavior, image transformations, or SLA beyond what the chosen URL and official GitHub service guarantee. A `raw.githubusercontent.com` URL is a public file URL, not a substitute for a full image CDN contract.

Recommended policy:
- Use GitHub repository storage for small, curated, versioned public screenshots that benefit from pull-request review and commit history.
- Persist the repository path and commit/hash as canonical metadata where appropriate; derive the public asset URL rather than allowing untrusted arbitrary HTML.
- For large uploads, frequent changing media, private objects, or assets requiring controlled access, offer Neon Object Storage via an S3-compatible provider after verifying current Neon docs and bucket policy.
- Keep the chosen asset provider in each asset record so migration is possible.
- If the owner mandates GitHub-only assets, make that an explicit setting and enforce repository/file-size constraints; show clear errors when upload exceeds them rather than silently switching providers.
- Consider a future external CDN or image optimization service only with owner approval and documented cost/privacy consequences.

## 9. Publish lifecycle

Use an explicit state machine, for example:

`draft -> review_pending -> ready_to_publish -> published -> archived`

Transitions must have guards:
- Draft can be edited by authorized curators.
- Review checks required metadata, source/license policy, command provenance, media availability, and preview mode.
- Publish is allowed only for valid records with configured required fields.
- Provider writes and DB state are coordinated with `provider_operations`/`import_jobs`; if an operation fails, the UI should not say “published”.
- Unpublish/archive removes content from public queries and public MCP immediately after the chosen cache invalidation mechanism is confirmed.
- Restore/re-publish should be explicit and audited.

Do not imply “verified safe” as an outcome of a metadata checklist. Use narrow statuses such as source checked, recipe checked, preview checked, and license reviewed.

## 10. Upstream updates

Automatic upstream refresh is a post-MVP feature. When implemented, it must:
- Respect rate limits and conditional requests if supported.
- Record the last checked time/result.
- Detect changed commit/content hashes.
- Present a diff/review state.
- Never change user-curated fields without a merge policy.
- Preserve old version/provenance history.
- Avoid auto-publishing newly changed content until policy explicitly permits it.
