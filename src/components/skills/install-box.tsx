"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, ShieldCheck } from "lucide-react";
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
  recipes: Recipe[];
}

export function InstallBox({ recipes }: InstallBoxProps) {
  const uniqueRecipes = React.useMemo(() => {
    if (!recipes) return [];
    return Array.from(new Map(recipes.map((r) => [r.target.toLowerCase(), r])).values());
  }, [recipes]);

  const [activeTab, setActiveTab] = useState(uniqueRecipes[0]?.target || "antigravity");
  const [copied, setCopied] = useState(false);

  const currentRecipe =
    uniqueRecipes.find((r) => r.target.toLowerCase() === activeTab.toLowerCase()) || uniqueRecipes[0];

  const handleCopy = () => {
    if (currentRecipe?.command) {
      navigator.clipboard.writeText(currentRecipe.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!uniqueRecipes || uniqueRecipes.length === 0) {
    return (
      <div className="rounded-xl bg-surface border border-border p-4 text-sm text-text-muted">
        No installation recipe provided.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-raised/40">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {uniqueRecipes.map((r) => (
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
            {currentRecipe.verificationStatus === "verified" ? "Verified" : "Unverified"}
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
