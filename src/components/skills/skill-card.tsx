"use client";

import React, { useState } from "react";
import { Check, CheckCircle2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkillCardData {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description?: string | null;
  skillType: string;
  authorDisplay: string;
  licenseSpdx?: string | null;
  sourceUrl: string;
  verificationStatus: string;
  featuredRank?: number | null;
  categories: Array<{ id: string; slug: string; name: string }>;
  tags?: Array<{ id: string; slug: string; name: string }>;
  primaryRecipe?: { command: string; target: string; displayLabel?: string | null } | null;
  recipes?: Array<{ id: string; command: string; target: string; displayLabel?: string | null }>;
  previewImageUrl?: string | null;
  rank?: string | null;
  platforms?: string[] | null;
}

interface SkillCardProps {
  skill: SkillCardData;
  onSelect?: (skill: SkillCardData) => void;
  onDemo?: (skill: SkillCardData) => void;
}

export function SkillCard({ skill, onSelect, onDemo }: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const commandToCopy = skill.primaryRecipe?.command || `npx skills add ${skill.slug}`;
    navigator.clipboard.writeText(commandToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rank = skill.rank || (skill.featuredRank && skill.featuredRank <= 3 ? "S-RANK" : "A-RANK");
  const isSRank = rank === "S-RANK";

  const platforms = skill.platforms && skill.platforms.length > 0
    ? skill.platforms
    : skill.recipes && skill.recipes.length > 0
    ? Array.from(new Set(skill.recipes.map((r) => r.target.replace("-code", "").toUpperCase())))
    : ["CLAUDE", "ANTIGRAVITY"];

  const primaryCategoryName = skill.categories[0]?.name?.toUpperCase() || "DESIGN & UI/UX";
  const licenseTag = (skill.licenseSpdx || "OPEN SOURCE").toUpperCase();

  return (
    <article
      onClick={() => onSelect?.(skill)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(skill);
        }
      }}
      tabIndex={0}
      role="button"
      className="group relative flex flex-col justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-5 sm:p-6 transition-all hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 text-left select-none"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-semibold text-base sm:text-[17px] tracking-tight text-neutral-900 dark:text-neutral-100 truncate group-hover:text-neutral-950 dark:group-hover:text-white">
              {skill.name}
            </h3>
            <span
              className="inline-flex items-center justify-center shrink-0 text-neutral-800 dark:text-neutral-200"
              title="Verified Skill"
            >
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>

          <span
            className={cn(
              "shrink-0 font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-[3px]",
              isSRank
                ? "bg-neutral-950 text-white dark:bg-neutral-100 dark:text-neutral-950"
                : "border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-transparent"
            )}
          >
            {rank}
          </span>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          by {skill.authorDisplay.replace("Anthropic & Community", "Anthropic")}
        </p>

        <p className="text-xs sm:text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300 mt-3 mb-5 line-clamp-3">
          {skill.summary || skill.description}
        </p>
      </div>

      <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-[3px] border border-neutral-200/70 dark:border-neutral-700/70 font-medium">
            {primaryCategoryName}
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-[3px] border border-neutral-200/70 dark:border-neutral-700/70 font-medium">
            {licenseTag}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {platforms.slice(0, 3).map((platform, idx) => (
              <span
                key={`${platform}-${idx}`}
                className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 rounded-[3px]"
              >
                {platform}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="h-7 px-2 flex items-center gap-1 rounded-[3px] border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            title="Copy install command"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span>copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
