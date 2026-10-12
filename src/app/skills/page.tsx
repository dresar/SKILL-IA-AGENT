import React, { Suspense } from "react";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { SkillsDirectory } from "@/components/skills/skills-directory";

export default async function SkillsPage() {
  const [categories, skillsList] = await Promise.all([
    getAllCategories(),
    getPublishedSkills({ limit: 100 })
  ]);

  return (
    <div className="space-y-8">
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
