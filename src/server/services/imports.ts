import { db } from "@/lib/db/client";
import { importJobs, skills, installRecipes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  path?: string;
  ref?: string;
}

export function parseGitHubUrl(rawUrl: string): ParsedGitHubUrl | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "github.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1];

    let ref: string | undefined = undefined;
    let path: string | undefined = undefined;

    if (parts.length >= 4 && (parts[2] === "tree" || parts[2] === "blob")) {
      ref = parts[3];
      if (parts.length > 4) {
        path = parts.slice(4).join("/");
      }
    }

    return { owner, repo, ref, path };
  } catch {
    return null;
  }
}

export async function processImportJob(url: string, actorSubject?: string) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error("Invalid GitHub URL format");
  }

  const [job] = await db
    .insert(importJobs)
    .values({
      sourceUrl: url,
      status: "processing"
    })
    .returning();

  try {
    const apiUrl = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;
    const token = process.env.GITHUB_TOKEN;
    const headers: Record<string, string> = {
      "User-Agent": "SkillCanvas-Importer",
      Accept: "application/vnd.github.v3+json"
    };
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const res = await fetch(apiUrl, { headers });
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.statusText}`);
    }

    const repoInfo = await res.json();
    const skillSlug = (parsed.path ? parsed.path.split("/").pop() || parsed.repo : parsed.repo)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const [newSkill] = await db
      .insert(skills)
      .values({
        slug: skillSlug,
        name: repoInfo.name,
        summary: repoInfo.description || "Imported open-source AI agent skill.",
        description: repoInfo.description || "Imported from upstream GitHub repository.",
        status: "draft",
        skillType: "general",
        authorDisplay: repoInfo.owner?.login || parsed.owner,
        licenseSpdx: repoInfo.license?.spdx_id || "Unknown",
        sourceKind: "github",
        sourceUrl: url,
        sourceOwner: parsed.owner,
        sourceRepo: parsed.repo,
        sourcePath: parsed.path,
        sourceRef: parsed.ref,
        verificationStatus: "unverified"
      })
      .onConflictDoUpdate({
        target: skills.slug,
        set: {
          summary: repoInfo.description || "Imported open-source AI agent skill.",
          updatedAt: new Date()
        }
      })
      .returning();

    await db.insert(installRecipes).values({
      skillId: newSkill.id,
      target: "antigravity",
      displayLabel: "Antigravity",
      command: `npx skills add github.com/${parsed.owner}/${parsed.repo}${parsed.path ? ` --skill ${parsed.path}` : ""}`,
      sourceUrl: url,
      verificationStatus: "maintainer_provided"
    });

    await db
      .update(importJobs)
      .set({
        status: "completed",
        resultSkillId: newSkill.id,
        completedAt: new Date(),
        detectedMetadata: repoInfo
      })
      .where(eq(importJobs.id, job.id));

    return newSkill;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Import failed";
    await db
      .update(importJobs)
      .set({
        status: "failed",
        completedAt: new Date(),
        validationFindings: { error: msg }
      })
      .where(eq(importJobs.id, job.id));
    throw error;
  }
}
