"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface FilterBarProps {
  categories: Category[];
  totalCount: number;
}

export function FilterBar({ categories, totalCount }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "";
  const currentQuery = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/skills?${params.toString()}`);
  };

  const clearAll = () => {
    router.push("/skills");
  };

  const hasFilters = Boolean(currentCategory || currentQuery || currentType);

  return (
    <div className="space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 select-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            defaultValue={currentQuery}
            placeholder="Search skills by name, slug, or purpose..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters("q", e.currentTarget.value);
              }
            }}
            className="h-9 w-full rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 pl-8 pr-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none transition focus:border-neutral-900 dark:focus:border-neutral-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currentType}
            onChange={(e) => updateFilters("type", e.target.value)}
            className="h-9 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-3 text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 outline-none transition focus:border-neutral-900 dark:focus:border-neutral-100"
          >
            <option value="">ALL TYPES</option>
            <option value="frontend">FRONTEND</option>
            <option value="coding">CODING</option>
            <option value="database">DATABASE</option>
            <option value="writing">WRITING</option>
            <option value="workflows">WORKFLOWS</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="h-9 px-3 flex items-center gap-1 rounded-[4px] border border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => updateFilters("category", "")}
          className={cn(
            "h-7 px-2.5 rounded-[3px] text-[11px] font-mono uppercase tracking-wider transition-colors",
            !currentCategory
              ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
              : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          )}
        >
          ALL ({totalCount})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => updateFilters("category", c.slug === currentCategory ? "" : c.slug)}
            className={cn(
              "h-7 px-2.5 rounded-[3px] text-[11px] font-mono uppercase tracking-wider transition-colors",
              currentCategory === c.slug
                ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
                : "border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
