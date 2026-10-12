# Design System and UX Specification

## 1. Visual direction

Use the provided reference screenshots as the main design direction: premium, restrained dark UI with near-black backgrounds, charcoal surfaces, muted grey secondary text, white primary text, thin borders, and restrained lavender accents. The interface should feel like a thoughtful developer/design resource—not a neon gaming dashboard or a generic AI-generated template.

Visual keywords: **quiet, editorial, utilitarian, precise, spacious, tactile, accessible**.

Avoid: glow on every control, rainbow gradients, oversized empty hero cards, random abstract 3D objects, fake telemetry, excessive pill badges, tiny low-contrast labels, and needless animations.

## 2. Design tokens

Use CSS variables or Tailwind theme tokens as the single source of truth. The following are starting values; verify contrast with actual rendered colors.

```css
:root {
  color-scheme: dark;
  --background: #090A09;
  --surface: #141513;
  --surface-raised: #1B1C1A;
  --surface-hover: #222320;
  --border: #2A2B28;
  --text-primary: #F1F1EE;
  --text-secondary: #A5A79F;
  --text-muted: #777A72;
  --accent: #CFCBFF;
  --accent-strong: #B7B1FF;
  --accent-foreground: #181724;
  --success: #8DD8B1;
  --warning: #E8C17D;
  --danger: #F09A9A;
  --focus: #D5D1FF;
}
```

A light theme may be implemented as a second token set only after the dark design is complete and contrast is tested. Do not implement a meaningless theme toggle that only changes a few surfaces. Persist user theme preference only if account/local preference architecture supports it reliably.

## 3. Typography

- Use a highly legible UI sans-serif with a suitable system fallback. Load only the weights actually used.
- Headings use restrained scale and semibold/bold weights; large headings should not become cartoonishly oversized.
- Body copy should be readable around 15–17 px depending on viewport and component density.
- Metadata is secondary but must remain comfortably readable, commonly 12–14 px; do not shrink essential content to decorative microcopy.
- Commands and code use a monospace stack and preserve line wrapping/scroll behavior without breaking copy output.
- Use consistent line-height, sensible paragraph width, and visible hierarchy between labels, summaries, source metadata, and body content.

## 4. Layout and navigation

### Desktop
- Use a persistent left sidebar or a compact responsive equivalent, similar to the supplied reference.
- Sidebar should group navigation into clear categories: Learn/Discover, Build, Library, and Admin when authorized. Do not expose admin entries to unauthorized users as though they had access.
- Main content has a centered, wide maximum width and consistent page padding.
- Top bar can contain page title/subtitle, global search trigger, and account/newsletter controls if those functions exist. Do not include decorative controls that do nothing.
- Featured hero may use a split text/preview layout, but it should yield space to the catalog and should not dominate every route.

### Tablet and mobile
- Collapse or convert the sidebar to a mobile drawer/navigation menu.
- Search and filter controls must work without hover.
- Cards should move to a sensible single-column/two-column layout based on width, with no clipped text.
- Showcase controls should remain reachable; preview viewport controls may become a horizontal scroll row or compact menu.
- Use safe-area padding where needed and avoid sticky panels that cover content.

## 5. Core pages

### Home
- Concise proposition: discover, preview, install.
- Featured collection, recently verified/updated entries where data supports it, category shortcuts, and a strong search entry point.
- Use real catalog information. While the database is empty, show an intentional setup/empty-state or clearly marked seed examples.

### Explore / skills directory
- Page title and one-line contextual subtitle.
- Search field with visible keyboard shortcut affordance only when shortcut is implemented.
- Filter groups for category, tags, agent compatibility, frameworks/tools, preview type, license/status where appropriate.
- Sort selector and result count from actual results.
- Skill cards with consistent metadata hierarchy, specific thumbnail, concise description, and preview/source status.
- Active filters are visible and individually removable; a clear-all action appears when relevant.
- Pagination or cursor loading with stable ordering and no duplicate cards.

### Skill detail
Recommended hierarchy:
1. Breadcrumb/category.
2. Skill name, concise purpose, status/provenance labels only when warranted.
3. Main preview/gallery area or skill-type-specific sample artifact.
4. Primary action: Copy install command or view source, depending on supported availability.
5. Compact metadata strip: author/source, license, version/last checked, supported agents.
6. Tabs or sections: Overview, Preview, Instructions/Files, Source, Changelog, Related skills.
7. Related items based on real category/tags; no fake personalized recommendations.

### Preview viewer
- Show a clear label such as “Live demo”, “Screenshot”, “Static showcase”, or “Sample output”.
- Device viewport controls are functional and should visibly affect the preview size or frame.
- Fullscreen opens an accessible overlay or the verified demo URL, not an inert icon.
- If the live demo fails, preserve a screenshot or explanation and offer retry/open-source actions.
- Never imply a screenshot is an interactive application.

### Install center
- Show target agent/provider, exact command or install instructions, source, verification state, and a copy action.
- Use a monospace block that wraps appropriately and has a distinct copied/error state.
- If the user chooses an agent with no validated recipe, explain that rather than silently substituting a command.
- The command must be copyable exactly without UI labels or line numbers.

### Admin studio
- Match the public visual system but optimize for dense work.
- Use table/list management for records, not a grid of oversized cards for everything.
- Editing a skill should separate identity/provenance, description/taxonomy, install recipes, previews/media, licensing/version, and publish controls.
- Show unsaved state, field validation, provider sync state, destructive confirmation, and draft preview.
- Bulk actions must show scope and impact. Never make “Delete”, “Publish”, or “Overwrite upstream” ambiguous.

## 6. Component behaviors

Implement reusable, accessible components for:
- `AppShell`, `Sidebar`, `MobileNav`, `TopBar`, `CommandSearch`, `FilterBar`, `ActiveFilter`, `SkillCard`, `SkillStatus`, `SourceAttribution`, `LicenseLabel`, `PreviewFrame`, `PreviewGallery`, `DeviceViewportSelector`, `InstallCommand`, `CopyButton`, `EmptyState`, `ErrorState`, `Skeleton`, `ConfirmDialog`, `AdminDataTable`, `MediaUploader`, `PublishStatus`, and `Toast/InlineNotice`.

Reuse existing shadcn/ui components where suitable. Do not duplicate base dialog/menu/input components unnecessarily. Every clickable visual must be a real semantic control or link and must perform its advertised action.

## 7. Motion rules

- Use Motion for subtle entrance/exit, layout transitions, drawer/dialog, selected filter, and copy feedback where it improves clarity.
- Keep transitions short and non-blocking. Avoid moving large sections on every small interaction.
- Do not animate entire card grids on every render or force scroll-jacking.
- Use GSAP only for a specific showcase or advanced timeline that benefits from it.
- Place heavy Three.js/React Three Fiber canvases inside individual demos; lazy-load and provide a static fallback.
- Support `prefers-reduced-motion: reduce` by disabling/degrading nonessential motion.
- Never make meaning, status, or navigation understandable only through animation or color.

## 8. Accessibility requirements

- Meet WCAG 2.2 AA as a target for core flows; verify actual contrast rather than relying on token names.
- All functionality is usable by keyboard; visible focus rings cannot be removed without replacement.
- Use semantic landmarks, headings in hierarchical order, form labels, descriptive link names, and accessible dialog/menu behavior.
- Do not rely on color alone for verification, warning, error, draft, or success states.
- Icons without visible text must have accessible names; decorative icons should be hidden from assistive technologies.
- Copy status and async operation feedback should be announced appropriately without excessively interrupting screen readers.
- Media must have suitable alt text. Decorative assets use empty alt; important showcase screenshots describe the relevant interface/function.
- Respect browser zoom and reduced motion. Avoid flashing, autoplay audio, and focus traps.

## 9. Content style

- Use concise, direct labels for an expert audience.
- Describe what a skill actually does, prerequisites, and known limitations.
- Avoid marketing superlatives unless supported by evidence.
- Avoid long introductory explanations for controls whose purpose is obvious.
- Empty-state copy should explain the next useful action.
- Error messages should tell the user what can be retried or what setup is missing, without exposing stack traces or secrets.

## 10. Responsive and visual QA checklist

- [ ] Inspect actual browser renders at mobile, tablet, desktop, and ultrawide sizes.
- [ ] Check navigation, filters, dialogs, dropdowns, command blocks, and gallery on touch and keyboard.
- [ ] Validate primary/secondary/muted text contrast against all relevant surfaces.
- [ ] Check long titles, long source names, large tags, multilingual content, and narrow screens.
- [ ] Ensure image loading does not cause excessive layout shift; specify dimensions/aspect ratios.
- [ ] Ensure the card preview doesn't claim live interaction when it is only an image.
- [ ] Test reduced motion and keyboard-only use.
- [ ] Use browser inspection/screenshots and fix visual defects before declaring UI complete.
