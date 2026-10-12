import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { SkillsDirectory } from "@/components/skills/skills-directory";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

export const metadata: Metadata = {
  title: "Skills",
  description: "Explore and install verified agent skills.",
  alternates: {
    canonical: "/skills/"
  },
  openGraph: {
    title: "Skills — SkillAgent",
    description: "Explore and install verified agent skills.",
    url: `${siteUrl}/skills/`,
    type: "website",
    images: ["/brand/logo.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills — SkillAgent",
    description: "Explore and install verified agent skills.",
    images: ["/brand/logo.svg"]
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/skills/#webpage`,
      "url": `${siteUrl}/skills/`,
      "name": "Skills",
      "description": "Explore and install verified agent skills."
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/skills/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `${siteUrl}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Skills",
          "item": `${siteUrl}/skills/`
        }
      ]
    }
  ]
};

export default async function SkillsPage() {
  const [categories, skillsList] = await Promise.all([
    getAllCategories(),
    getPublishedSkills({ limit: 100 })
  ]);

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Skills</h1>
        <p className="text-xs text-text-muted mt-1">
          Explore and install verified agent skills.
        </p>
      </div>

      <Suspense fallback={<div className="h-10 bg-surface rounded-xl animate-pulse" />}>
        <SkillsDirectory initialSkills={skillsList} categories={categories} />
      </Suspense>
    </div>
  );
}
