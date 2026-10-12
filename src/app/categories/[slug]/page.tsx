import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllCategories, getPublishedSkills } from "@/server/services/skills";
import { SkillCard } from "@/components/skills/skill-card";

export async function generateStaticParams() {
  const cats = await getAllCategories();
  return cats.map((cat) => ({
    slug: cat.slug
  }));
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    return {
      title: "Category Not Found"
    };
  }

  return {
    title: `${currentCategory.name} Skills`,
    description: currentCategory.description || `Verified agent skills in ${currentCategory.name}.`,
    alternates: {
      canonical: `/categories/${slug}/`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  const skillsList = await getPublishedSkills({
    category: slug,
    limit: 24
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/skills"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Skills
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {currentCategory.name}
        </h1>
        {currentCategory.description && (
          <p className="text-sm text-text-secondary mt-1">
            {currentCategory.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pb-2 border-b border-border">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              c.slug === slug
                ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                : "bg-surface text-text-muted border-border hover:text-text-secondary"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {skillsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillsList.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border p-12 text-center text-xs text-text-muted">
          No skills registered in this category.
        </div>
      )}
    </div>
  );
}
