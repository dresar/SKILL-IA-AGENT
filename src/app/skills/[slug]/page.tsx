import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Calendar,
  User,
  FileText,
  Github,
  ArrowLeft
} from "lucide-react";
import { getSkillDetailBySlug, getPublishedSkills } from "@/server/services/skills";
import { InstallBox } from "@/components/skills/install-box";
import { ShowcaseViewer } from "@/components/skills/showcase-viewer";
import { SkillCard } from "@/components/skills/skill-card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const items = await getPublishedSkills({ limit: 100 });
  return items.map((item) => ({
    slug: item.slug
  }));
}

interface SkillDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SkillDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = await getSkillDetailBySlug(slug);

  if (!skill) {
    return {
      title: "Skill Not Found"
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";
  const previewImg = (skill as any).previewImageUrl || `/previews/${skill.slug}.svg`;
  const installCommand = (skill.recipes && skill.recipes.length > 0 ? skill.recipes[0].command : "") || `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`;

  return {
    title: skill.name,
    description: skill.summary,
    keywords: [
      skill.name,
      skill.slug,
      "ai skill",
      "agent skill",
      "mcp tool",
      "antigravity",
      ...skill.tags.map((t) => t.name)
    ],
    alternates: {
      canonical: `/skills/${slug}/`
    },
    other: {
      "ai-install-command": installCommand,
      "ai-skill-slug": skill.slug,
      "ai-skill-name": skill.name,
      "ai-skill-type": skill.skillType
    },
    openGraph: {
      type: "article",
      title: `${skill.name} — SKILL UIAI`,
      description: skill.summary,
      url: `${siteUrl}/skills/${slug}/`,
      images: [
        {
          url: previewImg,
          width: 800,
          height: 450,
          alt: skill.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${skill.name} — SKILL UIAI`,
      description: skill.summary,
      images: [previewImg]
    }
  };
}

export default async function SkillDetailPage({ params }: SkillDetailPageProps) {
  const { slug } = await params;
  const skill = await getSkillDetailBySlug(slug);

  if (!skill) {
    notFound();
  }

  const related = await getPublishedSkills({ limit: 4 });
  const otherSkills = related.filter((s) => s.slug !== skill.slug).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills-smoky.vercel.app";
  const installCommand = (skill.recipes && skill.recipes.length > 0 ? skill.recipes[0].command : "") || `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`;
  const previewImg = (skill as any).previewImageUrl || `/previews/${skill.slug}.svg`;

  const skillJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/skills/${skill.slug}/#software`,
        url: `${siteUrl}/skills/${skill.slug}/`,
        name: skill.name,
        description: skill.summary,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "AI Agent Skill",
        operatingSystem: "Any",
        softwareRequirements: "Google Antigravity, Claude Code, Cursor, Node.js",
        image: `${siteUrl}${previewImg}`,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        potentialAction: {
          "@type": "ConsumeAction",
          actionStatus: "PotentialActionStatus",
          target: installCommand
        },
        author: {
          "@type": "Person",
          name: skill.authorDisplay
        },
        ...(skill.licenseUrl ? { license: skill.licenseUrl } : {})
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/skills/${skill.slug}/#breadcrumb`,
        itemListElement: [
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
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": skill.name,
            "item": `${siteUrl}/skills/${skill.slug}/`
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillJsonLd) }}
      />
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Skills Catalog
        </Link>

        <div className="rounded-xl overflow-hidden border border-border bg-neutral-950 mb-6 aspect-[21/9] max-h-72 w-full relative">
          <img
            src={previewImg}
            alt={`${skill.name} Preview`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                {skill.name}
              </h1>
              <Badge
                variant={
                  skill.verificationStatus === "verified"
                    ? "success"
                    : skill.verificationStatus === "source_checked"
                    ? "accent"
                    : "default"
                }
              >
                {skill.verificationStatus}
              </Badge>
            </div>

            <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
              {skill.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {skill.sourceUrl && (
              <a
                href={skill.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-text-primary bg-surface border border-border rounded-lg hover:bg-surface-raised transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                Source
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-text-muted border-t border-border/60 mt-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>by {skill.authorDisplay}</span>
          </div>

          {skill.licenseSpdx && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>License: {skill.licenseSpdx}</span>
            </div>
          )}

          {skill.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published: {formatDate(skill.publishedAt)}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {skill.categories.map((c) => (
              <Badge key={c.id} variant="outline" className="text-[11px]">
                {c.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Installation Command
        </h2>
        <InstallBox recipes={skill.recipes} />
      </section>

      {skill.showcases && skill.showcases.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Showcase & Previews
          </h2>
          <ShowcaseViewer showcases={skill.showcases} skillName={skill.name} />
        </section>
      )}

      <section className="space-y-3 rounded-xl bg-surface border border-border p-6">
        <h2 className="text-base font-semibold text-text-primary">Documentation</h2>
        <div className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
          {skill.description}
        </div>
      </section>

      {otherSkills.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-lg font-semibold text-text-primary">Related Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {otherSkills.map((s) => (
              <SkillCard key={s.id} skill={s as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
