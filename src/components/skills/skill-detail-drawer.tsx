"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Play,
  Github,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillCardData } from "./skill-card";

interface SkillDetailDrawerProps {
  skill: SkillCardData | null;
  onClose: () => void;
  onOpenDemo: (skill: SkillCardData) => void;
}

export function SkillDetailDrawer({
  skill,
  onClose,
  onOpenDemo
}: SkillDetailDrawerProps) {
  if (!skill) return null;

  const [activeRecipeTab, setActiveRecipeTab] = useState<string>("antigravity");
  const [copied, setCopied] = useState<string | null>(null);

  const installCommands = {
    antigravity: skill.primaryRecipe?.command || `npx skills add ${skill.slug}`,
    npx: `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`,
    claude: `claude skill add dresar/SKILL-IA-AGENT/skills/${skill.slug}`,
    mcp: `{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "get_skill_content", "arguments": {"slug": "${skill.slug}"}}}`
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/70 backdrop-blur-sm select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-drawer-title"
        className="w-full sm:max-w-xl md:max-w-2xl bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="accent">
              {skill.rank || "S-RANK"}
            </Badge>
            <span className="text-xs font-mono text-neutral-500 truncate max-w-[140px] sm:max-w-xs">
              {skill.slug}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-[4px] text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
              <div>
                <h2 id="skill-drawer-title" className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {skill.name}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Author: <span className="text-neutral-700 dark:text-neutral-300 font-medium">{skill.authorDisplay}</span>
                </p>
              </div>

              <div className="self-start">
                <Badge variant={skill.verificationStatus === "verified" ? "success" : "default"}>
                  {skill.verificationStatus === "verified" ? "VERIFIED" : "AUDITED"}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2">
              {skill.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenDemo(skill)}
              className="text-xs font-semibold gap-1.5 h-10 px-4"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Interactive Demo</span>
            </Button>

            <a
              href={skill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 h-10 rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Source</span>
              <ExternalLink className="w-3 h-3 text-neutral-400 ml-0.5" />
            </a>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <span className="text-xs font-mono uppercase font-semibold text-neutral-800 dark:text-neutral-200">
                Installation Command
              </span>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(["antigravity", "npx", "claude", "mcp"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveRecipeTab(tab)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-[3px] transition-colors uppercase ${
                      activeRecipeTab === tab
                        ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 font-mono text-xs">
              <span className="text-neutral-800 dark:text-neutral-200 truncate mr-2">
                {installCommands[activeRecipeTab as keyof typeof installCommands]}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    activeRecipeTab,
                    installCommands[activeRecipeTab as keyof typeof installCommands]
                  )
                }
                className="h-8 px-2.5 flex items-center gap-1 rounded-[3px] border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors shrink-0"
              >
                {copied === activeRecipeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-mono uppercase font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Complete Specification
            </h3>
            <div className="rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-3">
              <p>
                {skill.description || skill.summary}
              </p>
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-4 text-[11px] font-mono text-neutral-500">
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">LICENSE: </span>
                  {skill.licenseSpdx || "MIT"}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">TYPE: </span>
                  {skill.skillType}
                </div>
                <div>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">CATEGORIES: </span>
                  {skill.categories.map((c) => c.name).join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between shrink-0 text-xs text-neutral-500 font-mono">
          <span>ID: {skill.id}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
