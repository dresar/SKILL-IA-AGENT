"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface SkillCardData {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description?: string;
  skillType: string;
  authorDisplay: string;
  licenseSpdx?: string | null;
  sourceUrl: string;
  verificationStatus: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  primaryRecipe?: { command: string; target: string; displayLabel?: string } | null;
  recipes?: Array<{ id: string; command: string; target: string; displayLabel?: string }>;
  previewImageUrl?: string;
}

interface SkillCardProps {
  skill: SkillCardData;
  onSelect?: (skill: SkillCardData) => void;
  onDemo?: (skill: SkillCardData) => void;
}

export function SkillCard({ skill, onSelect, onDemo }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const [imgErrorCount, setImgErrorCount] = useState(0);

  const getPreviewSource = () => {
    if (skill.previewImageUrl) return skill.previewImageUrl;
    if (imgErrorCount === 0) return `/previews/${skill.slug}.svg`;
    if (imgErrorCount === 1) {
      return `https://cdn.jsdelivr.net/gh/dresar/SKILL-IA-AGENT@main/public/previews/${skill.slug}.svg`;
    }
    return "/brand/logo.svg";
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (skill.primaryRecipe?.command) {
      navigator.clipboard.writeText(skill.primaryRecipe.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(skill);
    }
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDemo) {
      onDemo(skill);
    } else if (onSelect) {
      onSelect(skill);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between rounded-2xl p-1 bg-white/[0.02] ring-1 ring-white/10 hover:ring-accent/50 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-accent/5"
    >
      <div className="rounded-xl bg-surface p-3.5 sm:p-4 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-3">
          <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-surface-raised border border-border/80 group-hover:border-accent/30 transition-colors">
            <img
              src={getPreviewSource()}
              alt={skill.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                imgErrorCount >= 2 ? "p-8 opacity-30 object-contain" : ""
              }`}
              onError={() => setImgErrorCount((prev) => prev + 1)}
            />
            <div className="absolute top-2.5 right-2.5">
              <Badge
                variant={
                  skill.verificationStatus === "verified"
                    ? "success"
                    : skill.verificationStatus === "source_checked"
                    ? "accent"
                    : "outline"
                }
                className="text-[10px] backdrop-blur-md bg-background/80"
              >
                {skill.verificationStatus === "verified"
                  ? "Terverifikasi"
                  : skill.verificationStatus === "source_checked"
                  ? "Dicek"
                  : "Draft"}
              </Badge>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-text-primary group-hover:text-accent transition-colors flex items-center gap-1.5">
                <span>{skill.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
              </h3>
              {skill.licenseSpdx && (
                <span className="text-[10px] text-text-muted font-mono">
                  {skill.licenseSpdx}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              oleh <span className="text-text-secondary font-medium">{skill.authorDisplay}</span>
            </p>
          </div>

          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {skill.summary}
          </p>

          <div className="flex flex-wrap gap-1 pt-0.5">
            {skill.categories.map((c) => (
              <Badge key={c.id} variant="outline" className="text-[10px] py-0 px-2 font-mono">
                {c.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border/60 space-y-2">
          {skill.primaryRecipe?.command && (
            <div className="flex items-center justify-between bg-surface-raised rounded-lg border border-border px-2.5 py-1.5 overflow-hidden">
              <span className="font-mono text-[11px] text-text-muted truncate mr-2">
                {skill.primaryRecipe.command}
              </span>
              <button
                onClick={handleCopy}
                className="text-text-muted hover:text-text-primary p-1.5 rounded transition-colors shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label="Salin perintah"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoClick}
              className="flex-1 text-xs h-9 min-h-[38px] gap-1.5 font-medium border-accent/30 hover:border-accent hover:bg-accent/10 text-accent"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Demo</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCardClick}
              className="flex-1 text-xs h-9 min-h-[38px] text-text-secondary hover:text-text-primary"
            >
              <span>Detail</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
