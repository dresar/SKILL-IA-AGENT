import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  Calendar,
  User,
  FileText,
  Github,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { getSkillDetailBySlug, getPublishedSkills } from "@/server/services/skills";
import { InstallBox } from "@/components/skills/install-box";
import { ShowcaseViewer } from "@/components/skills/showcase-viewer";
import { SkillSpecViewer } from "@/components/skills/skill-spec-viewer";
import { SkillCard } from "@/components/skills/skill-card";
import { LlmActionDropdown } from "@/components/common/llm-action-dropdown";
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
    title: `${skill.name} — SkillAgent`,
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
      title: `${skill.name} — SkillAgent`,
      description: skill.summary,
      url: `${siteUrl}/skills/${slug}/`,
      images: [
        {
          url: previewImg,
          width: 600,
          height: 600,
          alt: skill.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${skill.name} — SkillAgent`,
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

  const related = await getPublishedSkills({ limit: 5 });
  const otherSkills = related.filter((s) => s.slug !== skill.slug).slice(0, 4);
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
            "item": `${siteUrl}/`
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
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillJsonLd) }}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Skills Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-4 flex justify-center">
          <div className="aspect-square w-full max-w-[280px] sm:max-w-[320px] rounded-xl overflow-hidden border border-border/80 bg-neutral-950 p-2 shadow-sm">
            <img
              src={previewImg}
              alt={`${skill.name} Preview`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary font-mono">
                {skill.name}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
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

            <p className="text-xs text-text-muted font-serif italic">
              by {skill.authorDisplay}
            </p>

            <p className="text-sm text-text-secondary leading-relaxed pt-1">
              {skill.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-text-muted border-t border-border/60">
            {skill.licenseSpdx && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>License: {skill.licenseSpdx}</span>
              </div>
            )}

            {skill.publishedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(skill.publishedAt)}</span>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              <LlmActionDropdown
                title={skill.name}
                markdownContent={skill.description}
                sourceUrl={skill.sourceUrl}
              />
              {skill.sourceUrl && (
                <a
                  href={skill.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline text-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {skill.categories.map((c) => (
              <Badge key={c.id} variant="outline" className="text-[11px]">
                {c.name}
              </Badge>
            ))}
            {skill.tags.map((t) => (
              <Badge key={t.id} variant="default" className="text-[10px] text-text-muted">
                #{t.name}
              </Badge>
            ))}
          </div>

          <div className="pt-2">
            <InstallBox slug={skill.slug} recipes={skill.recipes} />
          </div>
        </div>
      </div>

      <section className="space-y-3 pt-4 border-t border-border/60">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Showcase & Previews
        </h2>
        <ShowcaseViewer
          showcases={skill.showcases || []}
          skillName={skill.name}
          defaultPreviewUrl={previewImg}
        />
      </section>

      <section className="space-y-3">
        <SkillSpecViewer
          name={skill.name}
          slug={skill.slug}
          description={skill.description}
          summary={skill.summary}
          author={skill.authorDisplay}
        />
      </section>

      {otherSkills.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-border">
          <h2 className="text-base font-semibold text-text-primary">Related Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherSkills.map((s) => (
              <SkillCard key={s.id} skill={s as any} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
