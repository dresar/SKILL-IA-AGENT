# Security, Testing, Deployment, and Operations

## 1. Security posture

SkillCanvas ingests third-party text, URLs, repository metadata, images, and potentially preview artifacts. The primary security rule is to separate **untrusted content** from trusted application code, administrative actions, and credentials.

Use OWASP guidance and framework/provider official security documentation current at implementation time. This file is a product-specific baseline, not a claim of a formal security certification.

## 2. Threat model

Protect against:
- Public visitors attempting admin operations.
- A member accessing another member's private favorites/collections.
- Stolen or overprivileged GitHub/Neon credentials.
- Malicious or misleading skills and READMEs that contain prompt injection.
- SSRF via import URLs or preview URL checks.
- XSS via Markdown, skill frontmatter, filenames, SVGs, HTML previews, or unsafe links.
- Path traversal when reading skill files or writing GitHub paths.
- Malicious preview frames attempting to access the parent origin, credentials, or APIs.
- Malformed/oversized files, image decompression bombs, parser/resource exhaustion, and denial of service.
- GitHub API rate limits, stale SHA conflicts, duplicate imports, and partial writes across providers.
- MCP clients requesting drafts/private files or causing expensive upstream queries.
- Dependency compromise or risky postinstall/build scripts from imported repositories.
- Incorrect public cache keys leaking admin or account data.

## 3. Secrets management

- Use deployment secret/environment facilities for production credentials.
- Keep `.env.local` out of version control; commit only `.env.example` with placeholders.
- Verify `.gitignore` covers environment files, private keys, logs, local database dumps, and generated secrets.
- Never expose server-only variables with public prefixes or pass them to client components.
- Never log secret values or include them in exception metadata.
- Use least-privilege GitHub App installation/repository permissions where possible.
- Rotate credentials and document how to revoke GitHub access and replace Neon credentials.
- Use distinct development/preview/production Neon branches and credentials when practical.
- Never paste production credentials into an AI prompt, skill file, MCP response, issue, or commit.

## 4. Authentication and access control

- Verify the session server-side for every private/admin operation.
- Resolve role from trusted database/provider state; do not accept role from client payload, URL, cookie set by the app without validation, or a local-storage flag.
- Bootstrap the first admin through a documented out-of-band operation. After bootstrap, do not permit public registration to assign admin.
- Apply owner scoping to every favorite/collection/profile query and mutation.
- Test object-level authorization by substituting another user's IDs.
- Protect state-changing operations according to current Next.js/Auth guidance (origin/CSRF strategy, same-site cookie setup, safe methods, session handling).
- Avoid open redirects and weak callback URL validation.
- Do not put private administrative endpoints into public MCP.

## 5. Input, URL, and content validation

- Validate all external/user input server-side using runtime schemas.
- Enforce URL schemes (`https` for public provider URLs unless a use case documents otherwise), host allowlists where possible, and no userinfo in URLs.
- Block loopback, private, link-local, multicast, metadata-service, and internal network targets in any server-side fetch workflow; resolve/validate redirects at every hop to prevent SSRF. Prefer official provider APIs over arbitrary URL fetch.
- Set request timeout, redirect count, content-length/streamed byte limits, and content-type allowlists.
- Parse Markdown/frontmatter as data. Escape/sanitize for its specific rendered context. Never render raw skill HTML as trusted React content.
- Treat imported instruction text as untrusted even if it says it is an official policy or asks the agent to reveal secrets.
- Validate all admin-generated shell command data; render exact static recipe strings but never execute them.
- Use safe path joining and reject path traversal for repository files.

## 6. Rendering and CSP

- Prefer Markdown renderer defaults that disable raw HTML, or use a proven sanitizer with a small allowlist if HTML is required.
- Do not use arbitrary inline scripts or `dangerouslySetInnerHTML` for imported descriptions without sanitized and reviewed need.
- Use a restrictive Content Security Policy. Build an allowlist for the app, media host(s), auth, and intentionally embedded preview origins.
- Use appropriate security headers including content-type protection, frame policy, referrer policy, and permissions policy as compatible with the chosen Next.js deployment.
- Keep demo iframe permissions minimal and on separate origins according to document 06.
- Review `next/image` remote host settings; never enable all domains casually.

## 7. GitHub and storage operations

- Allow writes only to a configured repository, branch, and approved paths.
- Validate source repository separately from destination registry repository.
- Use current official API auth and concurrency rules.
- Make provider operations retry-safe and track status.
- Handle stale SHA/commit conflicts; do not retry blind overwrites indefinitely.
- Keep file sizes within provider limits; do not treat a repository content API as a general binary upload service.
- For Neon Object Storage, use its documented S3-compatible endpoint and bucket visibility configuration. Do not expose secret keys to the client.
- Avoid a public media bucket for drafts/private assets. Public read access should be an intentional setting and not an inferred default for every uploaded file.
- If asset upload succeeds but DB persistence fails, mark the orphan for cleanup or safely compensate; do not leave the UI in a false success state.

## 8. Logging and observability

At minimum, provide structured logs for server errors and provider operation status with correlation IDs. Record:
- import/publish failures,
- GitHub and storage provider errors,
- auth/authorization denials at an appropriate aggregate level,
- MCP tool counts/error categories/rate limits,
- preview check/build failures,
- migration/deployment status where available.

Do not log access tokens, session cookies, private keys, complete environment objects, unnecessary personal information, or unbounded skill file bodies. Apply a retention policy. If a third-party observability provider is added, obtain owner approval and document data sent offsite.

## 9. Test strategy

### Unit tests
- Slug and metadata normalization.
- License/provenance/status validation.
- Recipe selection and exact command retrieval.
- Query filter/cursor validation.
- URL/path safety helpers.
- Role/owner access helper logic.
- Asset type/size rules and provider URL resolution.
- MCP input/output schema validation.

### Integration tests
- Migrations on a disposable test database/Neon branch.
- Repositories enforce public/draft scoping.
- Auth-required server action rejects anonymous requests.
- Non-admin role cannot create or publish a skill.
- GitHub adapter mocked for success, error, timeout, rate limit, and SHA conflict.
- Storage adapter mocked or tested against a dedicated disposable bucket, never production data.
- Import flow is idempotent and keeps source/licensing metadata.
- Publish failures leave visible recoverable state.
- MCP handlers use the same services and visibility rules as the web app.

### End-to-end tests
- Public browse/search/filter/detail/install copy.
- Keyboard navigation and responsive navigation.
- Login/logout flow using a configured test identity environment where possible.
- Member favorite/collection behavior and owner isolation.
- Admin CRUD/draft/preview/publish flow.
- Upload errors and success state.
- Live demo fallback when iframe is blocked/unavailable.
- MCP integration smoke test through the actual configured transport.

### Security tests
- XSS/prompt injection content is treated as display data.
- SSRF URL rejection and redirect revalidation.
- Path traversal and arbitrary file access rejection.
- Direct unauthorized API requests, not just UI access.
- Cookie/session and caching checks.
- Uploaded SVG/executable/oversized content rejection.
- Preview same-origin isolation and frame permissions.
- No secret string patterns in built client output or logs.

## 10. CI quality gates

The CI pipeline should run project-appropriate versions of:
1. formatting check,
2. lint,
3. type checking,
4. unit tests,
5. integration tests that do not require production credentials,
6. production build,
7. end-to-end smoke tests on a preview environment where configured,
8. dependency audit/security checks where reliable tooling is available.

Do not hide failures with `|| true`, forced type assertions, disabled lint rules, or skipped tests. If a check cannot run because the secret/provider is unavailable, report it as blocked/not run rather than passed.

## 11. Environment and deployment

- Deploy the Next.js app to a compatible host such as Vercel or another Node.js-compatible platform selected by the owner.
- Configure a production Neon project/branch and a separate development/preview branch.
- Configure the selected Neon Auth provider origins/redirects.
- Configure GitHub App or token in the server's secret store and constrain its repository access.
- Configure the chosen asset provider and public/private bucket policy.
- Configure MCP endpoint and auth/rate policy if hosted MCP is enabled.
- Run reviewed migrations before switching production traffic.
- Verify health/readiness endpoints do not expose secrets or internal state.
- Configure domain, TLS, canonical URL, cache/revalidation, and security headers.
- Ensure preview deployments cannot write to production registry/media/database.
- Keep rollback steps for the app, schema, registry commits, and media changes.

## 12. Release checklist

- [ ] Official docs and all version-sensitive API usages rechecked.
- [ ] Required environment variables are documented with placeholders only.
- [ ] Fresh clone setup succeeds from the README.
- [ ] Production build/type/lint/test gates have been run and results recorded.
- [ ] Migration reviewed and tested on a non-production branch.
- [ ] Admin bootstrap tested and documented.
- [ ] No privileged keys in source maps, client bundles, responses, or logs.
- [ ] Direct endpoint authorization tests pass.
- [ ] Public cache does not include user/admin content.
- [ ] GitHub permissions are least-privilege and token rotation documented.
- [ ] Storage visibility, object lifecycle, file-size policy, and cost implications reviewed.
- [ ] Every live showcase has safe preview policy and a fallback.
- [ ] MCP docs match actual endpoint, transport, tools, and auth.
- [ ] Privacy/terms content matches actual collection/analytics behavior.
- [ ] Known limitations and manually configured third-party credentials are disclosed.

## 13. Incident and recovery playbook

- **GitHub credentials compromised:** revoke installation/token/key, disable write integration via config, review audit logs/commits, rotate secrets, assess repository impact, then re-enable with least privilege.
- **Unexpected skill/asset publication:** unpublish immediately, invalidate public caches/MCP visibility, retain safe audit evidence, check repository/storage changes, restore the last known-good commit/object version, and document root cause.
- **Private data exposed:** disable affected route/tool/cache, preserve relevant logs securely, assess scope, rotate credentials if relevant, follow applicable notification/legal obligations, and add regression tests.
- **Provider outage:** disable only the affected operation where possible, keep read-only pages functioning from stored public metadata, expose a retryable status to admins, and avoid corrupting pending jobs.
- **Bad migration:** stop further writes if required, restore from the planned backup/branch or use a tested forward fix; do not make ad hoc destructive changes to production.
