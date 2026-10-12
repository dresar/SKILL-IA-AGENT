"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FilterBar } from "@/components/skills/filter-bar";
import { SkillCard } from "@/components/skills/skill-card";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Skill {
  id: string;
  slug: string;
  name: string;
  summary: string;
  skillType: string;
  authorDisplay: string;
  licenseSpdx?: string | null;
  sourceUrl: string;
  verificationStatus: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  primaryRecipe?: { command: string; target: string } | null;
}

interface SkillsDirectoryProps {
  initialSkills: Skill[];
  categories: Category[];
}

export function SkillsDirectory({ initialSkills, categories }: SkillsDirectoryProps) {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase().trim();
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";

  const filtered = useMemo(() => {
    return initialSkills.filter((skill) => {
      if (category && !skill.categories.some((c) => c.slug === category)) {
        return false;
      }
      if (type && skill.skillType !== type) {
        return false;
      }
      if (query) {
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesSummary = skill.summary.toLowerCase().includes(query);
        const matchesSlug = skill.slug.toLowerCase().includes(query);
        if (!matchesName && !matchesSummary && !matchesSlug) {
          return false;
        }
      }
      return true;
    });
  }, [initialSkills, query, category, type]);

  return (
    <div className="space-y-8">
      <FilterBar categories={categories} totalCount={filtered.length} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((skill) => (
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
