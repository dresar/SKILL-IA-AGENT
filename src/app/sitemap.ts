import type { MetadataRoute } from "next";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dresar.github.io";
  const [skillsList, categoriesList] = await Promise.all([
    getPublishedSkills({ limit: 100 }),
    getAllCategories()
  ]);

  const skillUrls = skillsList.map((skill) => ({
    url: `${siteUrl}/skills/${skill.slug}/`,
    lastModified: skill.updatedAt ? new Date(skill.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  const categoryUrls = categoriesList.map((category) => ({
    url: `${siteUrl}/categories/${category.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0
    },
    {
      url: `${siteUrl}/skills/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    },
    {
      url: `${siteUrl}/library/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    },
    {
      url: `${siteUrl}/llms-full.txt`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    ...categoryUrls,
    ...skillUrls
  ];
}
