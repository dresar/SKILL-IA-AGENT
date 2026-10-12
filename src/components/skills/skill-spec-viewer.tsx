"use client";

import React, { useState } from "react";
import { FileText, Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SkillSpecViewerProps {
  name: string;
  slug: string;
  description: string;
  summary: string;
  author: string;
}

export function SkillSpecViewer({
  name,
  slug,
  description,
  summary,
  author
}: SkillSpecViewerProps) {
  const [activeTab, setActiveTab] = useState<"doc" | "raw">("doc");
  const [copied, setCopied] = useState(false);

  const rawSkillMd = `---
name: "${name}"
slug: "${slug}"
author: "${author}"
summary: "${summary.replace(/"/g, '\\"')}"
---

# ${name}

${description}
`;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawSkillMd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-surface border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface-raised/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("doc")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors",
              activeTab === "doc"
                ? "bg-accent/15 text-accent font-semibold"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <FileText className="w-3.5 h-3.5" />
            Specification & Guide
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors",
              activeTab === "raw"
                ? "bg-accent/15 text-accent font-semibold"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Code2 className="w-3.5 h-3.5" />
            Raw SKILL.md
          </button>
        </div>

        <Button
          onClick={handleCopyRaw}
          size="sm"
          variant="secondary"
          className="h-7 text-xs px-2.5"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-status-success" />
              Copied Prompt
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy SKILL.md
            </>
          )}
        </Button>
      </div>

      <div className="p-6">
        {activeTab === "doc" ? (
          <div className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
            {description}
          </div>
        ) : (
          <div className="relative">
            <pre className="font-mono text-xs text-text-primary bg-background border border-border/80 rounded-lg p-4 overflow-x-auto select-all leading-relaxed whitespace-pre">
              <code>{rawSkillMd}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
