import React from "react";
import Link from "next/link";
import { Terminal, Shield, Sparkles, ArrowRight, Layers } from "lucide-react";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { SkillCard } from "@/components/skills/skill-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredSkills, categories] = await Promise.all([
    getPublishedSkills({ limit: 6 }),
    getAllCategories()
  ]);

  return (
    <div className="space-y-12">
      <section className="relative rounded-2xl bg-surface border border-border p-8 md:p-12 overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Registry & MCP Live
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
            SKILL <span className="text-accent">UIAI</span>
          </h1>

          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            Curated open-source skills for AI coding agents with verified previews and one-click commands.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/skills">
              <Button variant="primary" size="lg">
                Explore Skills
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="lg">
                Curator Studio
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center gap-6 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-status-success" />
            <span>Neon PostgreSQL & Auth</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span>Model Context Protocol (MCP)</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-text-secondary" />
            <span>Truthful Previews</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Categories</h2>
          <Link href="/skills" className="text-xs text-accent hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/skills?category=${cat.slug}`}
              className="p-4 rounded-xl bg-surface border border-border hover:border-accent/40 hover:bg-surface-raised transition-colors group"
            >
              <h3 className="font-medium text-sm text-text-primary group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-text-muted mt-1 line-clamp-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Featured Skills</h2>
          <Link href="/skills">
            <Button variant="ghost" size="sm" className="text-xs">
              All Skills ({featuredSkills.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </section>
    </div>
  );
}
