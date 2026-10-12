"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Recipe {
  id: string;
  target: string;
  displayLabel: string;
  command: string;
  sourceUrl?: string | null;
  verificationStatus: string;
}

interface InstallBoxProps {
  slug?: string;
  recipes?: Recipe[];
}

export function InstallBox({ slug, recipes = [] }: InstallBoxProps) {
  const mergedRecipes = React.useMemo(() => {
    const list: Recipe[] = [...recipes];
    const targetSlug = slug || "skill";
    const defaults = [
      {
        id: "antigravity",
        target: "antigravity",
        displayLabel: "Google Antigravity",
        command: `npx skills add dresar/SKILL-IA-AGENT -s ${targetSlug}`,
        verificationStatus: "verified"
      },
      {
        id: "claude",
        target: "claude",
        displayLabel: "Claude Code",
        command: `claude skill add dresar/SKILL-IA-AGENT/${targetSlug}`,
        verificationStatus: "verified"
      },
      {
        id: "cursor",
        target: "cursor",
        displayLabel: "Cursor Rules",
        command: `@skill dresar/SKILL-IA-AGENT/${targetSlug}/SKILL.md`,
        verificationStatus: "verified"
      },
      {
        id: "opencode",
        target: "opencode",
        displayLabel: "OpenCode",
        command: `opencode skill install dresar/SKILL-IA-AGENT -s ${targetSlug}`,
        verificationStatus: "verified"
      },
      {
        id: "aider",
        target: "aider",
        displayLabel: "Aider",
        command: `aider --read-file skills/${targetSlug}/SKILL.md`,
        verificationStatus: "verified"
      }
    ];

    for (const d of defaults) {
      if (!list.some((r) => r.target.toLowerCase() === d.target.toLowerCase())) {
        list.push(d);
      }
    }
    return Array.from(new Map(list.map((r) => [r.target.toLowerCase(), r])).values());
  }, [recipes, slug]);

  const [activeTab, setActiveTab] = useState(mergedRecipes[0]?.target || "antigravity");
  const [copied, setCopied] = useState(false);

  const currentRecipe =
    mergedRecipes.find((r) => r.target.toLowerCase() === activeTab.toLowerCase()) || mergedRecipes[0];

  const handleCopy = () => {
    if (currentRecipe?.command) {
      navigator.clipboard.writeText(currentRecipe.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-raised/40">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {mergedRecipes.map((r) => (
            <button
              key={r.target}
              onClick={() => setActiveTab(r.target)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                activeTab.toLowerCase() === r.target.toLowerCase()
                  ? "bg-accent/15 text-accent font-semibold"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {r.displayLabel}
            </button>
          ))}
        </div>

        {currentRecipe && (
          <Badge
            variant={
              currentRecipe.verificationStatus === "verified"
                ? "success"
                : "default"
            }
          >
            {currentRecipe.verificationStatus === "verified" ? "Verified" : "Community"}
          </Badge>
        )}
      </div>

      <div className="p-4 flex items-center justify-between gap-4 bg-background">
        <pre className="font-mono text-xs md:text-sm text-text-primary overflow-x-auto whitespace-pre select-all flex-1 py-1">
          <code>{currentRecipe?.command}</code>
        </pre>

        <Button
          onClick={handleCopy}
          size="sm"
          variant="secondary"
          className="shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-status-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
