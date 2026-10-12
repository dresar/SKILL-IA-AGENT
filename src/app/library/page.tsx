import React from "react";
import Link from "next/link";
import { Bookmark, FolderPlus, ArrowRight } from "lucide-react";
import { getPublishedSkills } from "@/server/services/skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Button } from "@/components/ui/button";

export default async function LibraryPage() {
  const savedSkills = await getPublishedSkills({ limit: 3 });

  return (
    <div className="space-y-8">
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
            <SkillCard key={skill.id} skill={skill} />
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
