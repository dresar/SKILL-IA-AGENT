import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, FolderPlus, ArrowRight } from "lucide-react";
import { getPublishedSkills } from "@/server/services/skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Button } from "@/components/ui/button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";

export const metadata: Metadata = {
  title: "Library",
  description: "Personal favorites and curated collections.",
  alternates: {
    canonical: "/library/"
  },
  openGraph: {
    title: "Library — SkillAgent",
    description: "Personal favorites and curated collections.",
    url: `${siteUrl}/library/`,
    type: "website",
    images: ["/brand/logo.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Library — SkillAgent",
    description: "Personal favorites and curated collections.",
    images: ["/brand/logo.svg"]
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/library/#webpage`,
      "url": `${siteUrl}/library/`,
      "name": "Library",
      "description": "Personal favorites and curated collections."
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteUrl}/library/#breadcrumb`,
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
          "name": "Library",
          "item": `${siteUrl}/library/`
        }
      ]
    }
  ]
};

export default async function LibraryPage() {
  const savedSkills = await getPublishedSkills({ limit: 3 });

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Library</h1>
          <p className="text-xs text-text-muted mt-1">
            Personal favorites and curated collections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FolderPlus className="w-3.5 h-3.5" />
            New Collection
          </Button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-accent" />
            Favorites
          </h2>
          <span className="text-xs text-text-muted">{savedSkills.length} items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill as any} />
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-surface border border-border p-8 text-center space-y-3">
        <h3 className="font-semibold text-sm text-text-primary">Custom Collections</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">
          Create named collections to organize agent skills for specific projects or stacks.
        </p>
        <Link href="/skills">
          <Button variant="primary" size="sm">
            Discover Skills
          </Button>
        </Link>
      </section>
    </div>
  );
}
