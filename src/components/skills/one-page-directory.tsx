"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Terminal,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  X,
  PlusCircle,
  Database
} from "lucide-react";
import { SkillCard, SkillCardData } from "./skill-card";
import { SkillDetailDrawer } from "./skill-detail-drawer";
import { SkillDemoModal } from "./skill-demo-modal";
import { McpPlayground } from "@/components/mcp/mcp-playground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

interface OnePageDirectoryProps {
  initialSkills: SkillCardData[];
  initialCategories: Array<{ id: string; slug: string; name: string; description?: string | null }>;
}

export function OnePageDirectory({
  initialSkills,
  initialCategories
}: OnePageDirectoryProps) {
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillCardData | null>(null);
  const [demoSkill, setDemoSkill] = useState<SkillCardData | null>(null);

  const filteredSkills = useMemo(() => {
    return initialSkills.filter((s) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.authorDisplay.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat =
        selectedCategory === "all" ||
        s.categories.some((c) => c.slug === selectedCategory);

      return matchSearch && matchCat;
    });
  }, [initialSkills, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <section className="relative rounded-2xl sm:rounded-3xl bg-surface border border-border p-5 sm:p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Registry & MCP Live
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary">
            SKILL <span className="text-accent">UIAI</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
            Katalog skill open-source untuk agent coding dengan preview visual, sandbox interaktif, dan protokol MCP.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#katalog">
              <Button variant="primary" size="lg" className="text-xs h-10 px-5 gap-1.5 font-bold">
                <span>Jelajahi Skill</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            </a>

            {isAdmin ? (
              <Link href="/admin">
                <Button variant="outline" size="lg" className="text-xs h-10 px-5 border-accent/40 text-accent gap-1.5 font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Admin Studio</span>
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-xs h-10 px-5 gap-1.5 font-bold">
                  <span>Masuk Kurator</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-status-success" />
            <span>Neon DB Terhubung</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span>MCP Tool Siap</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Visual Preview SVG</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Simulasi Interaktif</span>
          </div>
        </div>
      </section>

      <section id="katalog" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Katalog Skill
            </h2>
            <p className="text-xs text-text-muted mt-1">
              Menampilkan {filteredSkills.length} dari {initialSkills.length} skill terverifikasi.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, slug, atau fungsi..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-accent text-accent-foreground font-bold shadow-sm"
                : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised"
            }`}
          >
            Semua
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-accent text-accent-foreground font-bold shadow-sm"
                  : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSelect={(s) => setSelectedSkill(s)}
                onDemo={(s) => setDemoSkill(s)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-text-primary">
              Tidak ada skill yang cocok dengan pencarian "{searchQuery}".
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </section>

      <McpPlayground />

      <SkillDetailDrawer
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onOpenDemo={(s) => {
          setSelectedSkill(null);
          setDemoSkill(s);
        }}
      />

      <SkillDemoModal
        skill={demoSkill}
        onClose={() => setDemoSkill(null)}
      />
    </div>
  );
}
