"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
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

export function OnePageDirectory({
  initialSkills,
  initialCategories
}: OnePageDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [sortOpen, setSortOpen] = useState(false);

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === "all") {
      return {
        slug: "all",
        name: "All Skills",
        description: "Verified agent skills, microcopy standards, and MCP tools."
      };
    }
    return (
      initialCategories.find((c) => c.slug === selectedCategory) || {
        slug: selectedCategory,
        name: selectedCategory.toUpperCase(),
        description: "Curated skills for autonomous agents."
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
        const rankA = a.rank === "S-RANK" ? 1 : 2;
        const rankB = b.rank === "S-RANK" ? 1 : 2;
        return rankA - rankB;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [initialSkills, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Home
          </button>
          <span>&gt;</span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Categories
          </button>
          <span>&gt;</span>
          <span className="text-neutral-900 dark:text-neutral-100 font-medium">
            {activeCategoryObj.name}
          </span>
        </nav>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase font-semibold">
            CATALOG
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {activeCategoryObj.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
            {activeCategoryObj.description || "Discover verified AI agent skills and production-ready tools."}
          </p>
          <p className="text-xs font-mono tracking-wider text-neutral-400 dark:text-neutral-500 uppercase pt-1">
            {filteredSkills.length} SKILLS AVAILABLE
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`h-8 px-3 rounded-[4px] text-xs font-mono tracking-wider transition-colors uppercase ${
            selectedCategory === "all"
              ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
              : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          ALL CATEGORIES
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
                  : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCategoryObj.name.toLowerCase()}...`}
            className="h-11 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 pl-10 pr-10 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="h-11 px-4 flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-xs font-mono tracking-wider uppercase text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <span>
              {sortBy === "popular" && "POPULAR"}
              {sortBy === "rank" && "S-RANK FIRST"}
              {sortBy === "name" && "NAME A-Z"}
              {sortBy === "newest" && "NEWEST"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-12 z-20 w-44 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setSortBy("popular");
                  setSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
              >
                POPULAR
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy("rank");
                  setSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
              >
                S-RANK FIRST
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortBy("name");
                  setSortOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
              >
                NAME A-Z
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
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            No skills found
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or switch categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="h-9 px-4 rounded-[4px] border border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
