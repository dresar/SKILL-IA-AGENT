"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, Copy } from "lucide-react";

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
}

export function SkillCard({ skill }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const commandToCopy = skill.primaryRecipe?.command || `npx skills add ${skill.slug}`;
    navigator.clipboard.writeText(commandToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFeatured = Boolean(skill.featuredRank && skill.featuredRank <= 3);

  const platforms = skill.platforms && skill.platforms.length > 0
    ? skill.platforms
    : skill.recipes && skill.recipes.length > 0
    ? Array.from(new Set(skill.recipes.map((r) => r.target.replace("-code", "").toUpperCase())))
    : ["CLAUDE", "ANTIGRAVITY"];

  const primaryCategoryName = skill.categories[0]?.name?.toUpperCase() || "SKILLS";
  const licenseTag = (skill.licenseSpdx || "MIT").toUpperCase();
  const previewSrc = skill.previewImageUrl || `/previews/${skill.slug}.svg`;

  return (
    <article className="group relative flex flex-col justify-between rounded-xl border border-neutral-200 dark:border-[#222736] bg-white dark:bg-[#0c0d12] overflow-hidden transition-all hover:border-neutral-400 dark:hover:border-[#3e465f] shadow-sm select-none">
      <Link
        href={`/skills/${skill.slug}`}
        className="block relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-[#08090d] border-b border-neutral-200 dark:border-[#202534]"
      >
        {!imgError ? (
          <img
            src={previewSrc}
            alt={`${skill.name} Preview`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#12141c] to-[#08090d] text-white">
            <span className="font-mono text-[10px] tracking-widest uppercase text-neutral-500">
              {skill.slug}
            </span>
            <span className="font-bold text-sm text-neutral-100 mt-1">
              {skill.name}
            </span>
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-2.5 right-2.5 flex items-center">
            <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-[3px] shadow-sm backdrop-blur-sm bg-neutral-950/80 text-white dark:bg-white/90 dark:text-neutral-950 uppercase">
              Featured
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/skills/${skill.slug}`}
            className="inline-flex items-center gap-1.5 group-hover:opacity-90 transition-opacity"
          >
            <h3 className="font-bold text-[15px] sm:text-[16px] tracking-tight text-neutral-900 dark:text-neutral-100 underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-4 line-clamp-1">
              {skill.name}
            </h3>
            <span className="shrink-0 text-neutral-600 dark:text-neutral-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </Link>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-serif italic mt-1 line-clamp-1">
            by {skill.authorDisplay}
          </p>

          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 mt-2.5 mb-4 line-clamp-2">
            {skill.summary || skill.description}
          </p>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-neutral-100 dark:border-[#1d2230]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100 dark:bg-[#151822] text-neutral-700 dark:text-neutral-300 rounded-[3px] border border-neutral-200 dark:border-[#282f44] font-medium">
              {primaryCategoryName}
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-100 dark:bg-[#151822] text-neutral-700 dark:text-neutral-300 rounded-[3px] border border-neutral-200 dark:border-[#282f44] font-medium">
              {licenseTag}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {platforms.slice(0, 2).map((platform, idx) => (
                <span
                  key={`${platform}-${idx}`}
                  className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-neutral-50 dark:bg-[#121520] text-neutral-500 dark:text-neutral-400 rounded-[3px] border border-neutral-200/50 dark:border-[#1e2333]"
                >
                  {platform}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="h-7 px-2.5 flex items-center gap-1.5 rounded-[4px] border border-neutral-200 dark:border-[#262c3e] bg-neutral-50 dark:bg-[#141724] text-[11px] font-mono text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:border-neutral-400 dark:hover:border-[#3c4460] transition-colors shadow-2xs"
              title="Copy install command"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
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
      </div>
    </article>
  );
}
