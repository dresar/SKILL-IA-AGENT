"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Copy, Check, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SkillCardProps {
  skill: {
    id: string;
    slug: string;
    name: string;
    summary: string;
    skillType: string;
    authorDisplay: string;
    licenseSpdx?: string | null;
    sourceUrl: string;
    verificationStatus: string;
    categories: Array<{ id: string; slug: string; name: string }>;
    primaryRecipe?: { command: string; target: string } | null;
  };
}

export function SkillCard({ skill }: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (skill.primaryRecipe?.command) {
      navigator.clipboard.writeText(skill.primaryRecipe.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-surface border border-border p-5 hover:border-accent/40 hover:bg-surface-raised/40 transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <Link href={`/skills/${skill.slug}`} className="hover:underline">
              <h3 className="font-semibold text-base text-text-primary group-hover:text-white transition-colors">
                {skill.name}
              </h3>
            </Link>
            <p className="text-xs text-text-muted">
              by <span className="text-text-secondary">{skill.authorDisplay}</span>
            </p>
          </div>

          <Badge
            variant={
              skill.verificationStatus === "verified"
                ? "success"
                : skill.verificationStatus === "source_checked"
                ? "accent"
                : "default"
            }
          >
            {skill.verificationStatus === "verified"
              ? "Verified"
              : skill.verificationStatus === "source_checked"
              ? "Checked"
              : "Unverified"}
          </Badge>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
          {skill.summary}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {skill.categories.map((c) => (
            <Badge key={c.id} variant="outline" className="text-[11px] py-0 px-2">
              {c.name}
            </Badge>
          ))}
          {skill.licenseSpdx && (
            <span className="text-[11px] text-text-muted self-center ml-1">
              {skill.licenseSpdx}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
        {skill.primaryRecipe?.command ? (
          <div className="flex-1 flex items-center justify-between bg-background rounded-lg border border-border px-2.5 py-1.5 overflow-hidden">
            <span className="font-mono text-xs text-text-muted truncate mr-2">
              {skill.primaryRecipe.command}
            </span>
            <button
              onClick={handleCopy}
              className="text-text-muted hover:text-text-primary p-1 rounded transition-colors shrink-0"
              aria-label="Copy command"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <span className="text-xs text-text-muted">No install command</span>
        )}

        <Link
          href={`/skills/${skill.slug}`}
          className="text-xs font-medium text-accent hover:text-accent-strong shrink-0 px-2 py-1 rounded hover:bg-surface-raised transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
