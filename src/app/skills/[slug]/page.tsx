import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ShieldCheck,
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
import { Button } from "@/components/ui/button";
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dresar.github.io";
  const previewImg = `/previews/${skill.slug}.svg`;

  return {
    title: skill.name,
    description: skill.summary,
    alternates: {
      canonical: `/skills/${slug}/`
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

  const related = await getPublishedSkills({ limit: 3 });
  const otherSkills = related.filter((s) => s.slug !== skill.slug).slice(0, 3);

  const skillJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: skill.name,
    description: skill.summary,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    author: {
      "@type": "Person",
      name: skill.authorDisplay
    }
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(skillJsonLd) }}
      />
      <div>
        <Link
          href="/skills"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Skills
        </Link>

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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Showcase & Previews
        </h2>
        <ShowcaseViewer showcases={skill.showcases} skillName={skill.name} />
      </section>

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
              <SkillCard key={s.id} skill={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
