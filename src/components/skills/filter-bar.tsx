"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            defaultValue={currentQuery}
            placeholder="Filter skills..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilters("q", e.currentTarget.value);
              }
            }}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currentType}
            onChange={(e) => updateFilters("type", e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface border border-border text-xs text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">All Types</option>
            <option value="frontend">Frontend</option>
            <option value="coding">Coding</option>
            <option value="database">Database</option>
            <option value="writing">Writing</option>
            <option value="workflows">Workflows</option>
          </select>

          {hasFilters && (
            <Button onClick={clearAll} variant="ghost" size="sm" className="text-xs">
              <X className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => updateFilters("category", "")}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
            !currentCategory
              ? "bg-accent/15 text-accent border-accent/30 font-semibold"
              : "bg-surface text-text-muted border-border hover:text-text-secondary hover:border-text-muted"
          )}
        >
          All Skills ({totalCount})
        </button>

        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => updateFilters("category", c.slug === currentCategory ? "" : c.slug)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border",
              currentCategory === c.slug
                ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                : "bg-surface text-text-muted border-border hover:text-text-secondary hover:border-text-muted"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
