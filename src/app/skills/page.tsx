import React from "react";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { SkillCard } from "@/components/skills/skill-card";
import { FilterBar } from "@/components/skills/filter-bar";

interface SkillsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    type?: string;
  }>;
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;
  const [categories, skillsList] = await Promise.all([
    getAllCategories(),
    getPublishedSkills({
      query: params.q,
      category: params.category,
      skillType: params.type,
      limit: 30
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Skills</h1>
        <p className="text-xs text-text-muted mt-1">
          Explore and install verified agent skills.
        </p>
      </div>

      <FilterBar categories={categories} totalCount={skillsList.length} />

      {skillsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillsList.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-surface border border-border p-12 text-center space-y-2">
          <p className="font-semibold text-sm text-text-primary">No skills found.</p>
          <p className="text-xs text-text-muted">
            Try adjusting your query or category filters.
          </p>
        </div>
      )}
    </div>
  );
}
