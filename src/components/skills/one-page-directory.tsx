"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Check
} from "lucide-react";
import { SkillCard, SkillCardData } from "./skill-card";

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

interface OnePageDirectoryProps {
  initialSkills: SkillCardData[];
  initialCategories: CategoryItem[];
}

type SortOption = "popular" | "rank" | "name" | "newest";

const AI_SAMPLE_TAGS = [
  "Desain UI/UX Minimalis",
  "Zero Comments (Nokomen)",
  "Neon Postgres Database",
  "Superpowers TDD",
  "Audit Keamanan AST",
  "Kompresi Token"
];

export function OnePageDirectory({
  initialSkills,
  initialCategories
}: OnePageDirectoryProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [aiPromptInput, setAiPromptInput] = useState("");

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === "all") {
      return {
        slug: "all",
        name: "Semua Kategori",
        description: "Skill agen tervalidasi, standar microcopy, dan ekstensi MCP."
      };
    }
    return (
      initialCategories.find((c) => c.slug === selectedCategory) || {
        slug: selectedCategory,
        name: selectedCategory.toUpperCase(),
        description: "Skill kurasi khusus agen pengkodean otonom."
      }
    );
  }, [selectedCategory, initialCategories]);

  const filteredSkills = useMemo(() => {
    const list = initialSkills.filter((s) => {
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === "" ||
        s.name.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.slug.toLowerCase().includes(query) ||
        s.authorDisplay.toLowerCase().includes(query);

      const matchCat =
        selectedCategory === "all" ||
        s.categories.some((c) => c.slug === selectedCategory);

      return matchSearch && matchCat;
    });

    return list.sort((a, b) => {
      if (sortBy === "popular") {
        return (a.featuredRank || 99) - (b.featuredRank || 99);
      }
      if (sortBy === "rank") {
        const rankA = a.featuredRank || 99;
        const rankB = b.featuredRank || 99;
        return rankA - rankB;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [initialSkills, searchQuery, selectedCategory, sortBy]);

  const handleAskAi = (customQuery?: string) => {
    const target = (customQuery || aiPromptInput || searchQuery).trim();
    if (target) {
      router.push(`/ai/?q=${encodeURIComponent(target)}`);
    } else {
      router.push("/ai/");
    }
  };

  return (
    <div className="space-y-12">
      <section className="space-y-8 pt-2 pb-6 border-b border-border">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] border border-border bg-surface text-[11px] font-mono text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>OPEN AGENT SKILL REGISTRY // MCP 1.6 READY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
            Katalog Resmi Skill & Protokol AI Agent
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Pusat instruksi runtime dan ekstensi tervalidasi untuk Google Antigravity, Claude Code, OpenCode, dan Aider. Pasang langsung via satu baris perintah CLI atau gunakan asisten AI untuk rekomendasi skill yang cocok untuk proyek Anda.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3.5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAskAi();
                  }
                }}
                placeholder="Tanyakan kebutuhan skill ke AI (contoh: desain ui minimalis, database neon, tdd)..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-xs sm:text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="button"
              onClick={() => handleAskAi()}
              className="h-11 px-5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Tanya AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-text-muted mr-1">Rekomendasi Cepat:</span>
            {AI_SAMPLE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setAiPromptInput(tag);
                  setSearchQuery(tag.split(" ")[0]);
                }}
                className="text-[11px] px-2.5 py-1 rounded-[4px] border border-border bg-background hover:bg-surface-raised hover:text-text-primary text-text-secondary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-1">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>12+ Terverifikasi</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Zero-bloat, standar nokomen, dan lolos uji coba runtime.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-1">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <Cpu className="w-4 h-4 text-accent" />
              <span>Cross-Agent</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Antigravity, Claude Code CLI, OpenCode, dan Aider.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-1">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <Layers className="w-4 h-4 text-cyan-500" />
              <span>MCP Protocol</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Kompatibel Model Context Protocol v1.6 via stdio & SSE.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-1">
            <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
              <Terminal className="w-4 h-4 text-amber-500" />
              <span>One-Command</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Salin perintah instalasi langsung ke terminal kerja.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              {activeCategoryObj.slug === "all" ? "Direktori Skill Tervalidasi" : activeCategoryObj.name}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              {activeCategoryObj.slug === "all"
                ? "Pilih kategori untuk memfilter instruksi dan resep instalasi agen."
                : (activeCategoryObj.description || "Skill agen tervalidasi.")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="font-bold text-text-primary">{filteredSkills.length}</span>
            <span>skill ditampilkan</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`h-8 px-3 rounded-[4px] text-xs font-mono tracking-wider transition-colors uppercase ${
              selectedCategory === "all"
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
                : "border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised"
            }`}
          >
            SEMUA KATEGORI
          </button>

          {initialCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`h-8 px-3 rounded-[4px] text-xs font-mono tracking-wider transition-colors uppercase ${
                  isSelected
                    ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
                    : "border border-border text-text-secondary hover:text-text-primary hover:bg-surface-raised"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari skill ${activeCategoryObj.name.toLowerCase()}...`}
              className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-10 text-xs sm:text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-primary"
                aria-label="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="h-11 px-4 flex items-center gap-2 rounded-lg border border-border bg-surface text-xs font-mono tracking-wider uppercase text-text-primary hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <span>
                {sortBy === "popular" && "POPULER"}
                {sortBy === "rank" && "PERINGKAT UTAMA"}
                {sortBy === "name" && "NAMA A-Z"}
                {sortBy === "newest" && "TERBARU"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-12 z-20 w-44 rounded-lg border border-border bg-surface p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("popular");
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-text-primary hover:bg-surface-raised rounded"
                >
                  POPULER
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("rank");
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-text-primary hover:bg-surface-raised rounded"
                >
                  PERINGKAT UTAMA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("name");
                    setSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-text-primary hover:bg-surface-raised rounded"
                >
                  NAMA A-Z
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-surface p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-text-primary">
              Tidak ada skill yang cocok
            </p>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              Coba sesuaikan kata kunci pencarian atau tanyakan rekomendasi langsung ke AI Assistant.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="h-9 px-4 rounded-[4px] border border-border text-xs font-mono uppercase tracking-wider text-text-secondary hover:text-text-primary hover:bg-surface-raised"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={() => handleAskAi(searchQuery)}
                className="h-9 px-4 rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tanya AI</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
