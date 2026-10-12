import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  primaryKey,
  uniqueIndex,
  index
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authSubject: text("auth_subject").notNull().unique(),
    displayName: text("display_name"),
    avatarAssetId: text("avatar_asset_id"),
    themePreference: text("theme_preference").default("dark"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("profiles_auth_subject_idx").on(table.authSubject)
  ]
);

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description")
});

export const profileRoles = pgTable(
  "profile_roles",
  {
    profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.roleId] })
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").default(0).notNull()
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug)
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull()
  },
  (table) => [
    uniqueIndex("tags_slug_idx").on(table.slug)
  ]
);

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull().default("draft"),
    skillType: text("skill_type").notNull().default("general"),
    authorDisplay: text("author_display").notNull(),
    licenseSpdx: text("license_spdx"),
    licenseUrl: text("license_url"),
    sourceKind: text("source_kind").notNull().default("github"),
    sourceUrl: text("source_url").notNull(),
    sourceOwner: text("source_owner"),
    sourceRepo: text("source_repo"),
    sourcePath: text("source_path"),
    sourceRef: text("source_ref"),
    canonicalRegistryPath: text("canonical_registry_path"),
    verificationStatus: text("verification_status").notNull().default("unverified"),
    lastSourceCheckedAt: timestamp("last_source_checked_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    featuredRank: integer("featured_rank"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("skills_slug_idx").on(table.slug),
    index("skills_status_idx").on(table.status),
    index("skills_featured_idx").on(table.featuredRank)
  ]
);

export const skillCategories = pgTable(
  "skill_categories",
  {
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" })
  },
  (table) => [
    primaryKey({ columns: [table.skillId, table.categoryId] })
  ]
);

export const skillTags = pgTable(
  "skill_tags",
  {
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" })
  },
  (table) => [
    primaryKey({ columns: [table.skillId, table.tagId] })
  ]
);

export const skillVersions = pgTable(
  "skill_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    versionString: text("version_string").notNull(),
    sourceCommit: text("source_commit"),
    canonicalFilePath: text("canonical_file_path"),
    contentHash: text("content_hash"),
    changelog: text("changelog"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("skill_versions_skill_idx").on(table.skillId)
  ]
);

export const skillSources = pgTable(
  "skill_sources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    sourceType: text("source_type").notNull().default("github"),
    url: text("url").notNull(),
    owner: text("owner"),
    repo: text("repo"),
    path: text("path"),
    ref: text("ref"),
    license: text("license"),
    status: text("status").default("active"),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true })
  },
  (table) => [
    index("skill_sources_skill_idx").on(table.skillId)
  ]
);

export const installRecipes = pgTable(
  "install_recipes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    target: text("target").notNull(),
    displayLabel: text("display_label").notNull(),
    command: text("command").notNull(),
    sourceUrl: text("source_url"),
    verificationStatus: text("verification_status").notNull().default("maintainer_provided"),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    notes: text("notes"),
    isEnabled: boolean("is_enabled").default(true).notNull()
  },
  (table) => [
    index("install_recipes_skill_idx").on(table.skillId)
  ]
);

export const showcases = pgTable(
  "showcases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    showcaseType: text("showcase_type").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("ready"),
    externalUrl: text("external_url"),
    staticArtifactRef: text("static_artifact_ref"),
    viewportConfig: jsonb("viewport_config"),
    sortOrder: integer("sort_order").default(0).notNull(),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("showcases_skill_idx").on(table.skillId)
  ]
);

export const assets = pgTable(
  "assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillId: uuid("skill_id").references(() => skills.id, { onDelete: "set null" }),
    storageProvider: text("storage_provider").notNull().default("github"),
    objectKey: text("object_key").notNull(),
    publicUrl: text("public_url").notNull(),
    mimeType: text("mime_type").notNull(),
    byteSize: integer("byte_size"),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    checksum: text("checksum"),
    visibility: text("visibility").notNull().default("public"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("assets_skill_idx").on(table.skillId)
  ]
);

export const favorites = pgTable(
  "favorites",
  {
    profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.skillId] })
  ]
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerProfileId: uuid("owner_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    visibility: text("visibility").notNull().default("private"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("collections_owner_idx").on(table.ownerProfileId)
  ]
);

export const collectionItems = pgTable(
  "collection_items",
  {
    collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    primaryKey({ columns: [table.collectionId, table.skillId] })
  ]
);

export const importJobs = pgTable(
  "import_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceUrl: text("source_url").notNull(),
    status: text("status").notNull().default("pending"),
    detectedMetadata: jsonb("detected_metadata"),
    validationFindings: jsonb("validation_findings"),
    resultSkillId: uuid("result_skill_id").references(() => skills.id, { onDelete: "set null" }),
    correlationId: text("correlation_id"),
    retryCount: integer("retry_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true })
  }
);

export const providerOperations = pgTable(
  "provider_operations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    operationType: text("operation_type").notNull(),
    target: text("target").notNull(),
    idempotencyKey: text("idempotency_key"),
    status: text("status").notNull().default("pending"),
    errorCode: text("error_code"),
    resultMetadata: jsonb("result_metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  }
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorSubject: text("actor_subject"),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    correlationId: text("correlation_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("audit_events_created_idx").on(table.createdAt)
  ]
);
