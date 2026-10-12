"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Github,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Layers,
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillCardData } from "./skill-card";

interface SkillDetailDrawerProps {
  skill: SkillCardData | null;
  onClose: () => void;
}

export function SkillDetailDrawer({ skill, onClose }: SkillDetailDrawerProps) {
  if (!skill) return null;

  const [activeRecipeTab, setActiveRecipeTab] = useState<string>("antigravity");
  const [copied, setCopied] = useState<string | null>(null);

  const installCommands = {
    antigravity: skill.primaryRecipe?.command || `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`,
    npx: `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`,
    claude: `claude skill add dresar/SKILL-IA-AGENT/skills/${skill.slug}`,
    mcp: `{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get_skill_content","arguments":{"slug":"${skill.slug}"}}}`
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-border bg-surface-raised/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary truncate">
                  {skill.name}
                </h2>
                <Badge
                  variant={skill.verificationStatus === "verified" ? "success" : "accent"}
                  className="text-[9px]"
                >
                  {skill.verificationStatus === "verified" ? "Verifikasi" : "Dicek"}
                </Badge>
              </div>
              <p className="text-[11px] text-text-muted font-mono">
                {skill.slug} • {skill.authorDisplay}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {skill.summary}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">
                Perintah Pasang
              </span>
              <div className="flex items-center gap-1">
                {(["antigravity", "npx", "claude", "mcp"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveRecipeTab(tab)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors ${
                      activeRecipeTab === tab
                        ? "bg-accent/20 text-accent font-semibold"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-surface-raised border border-border px-3 py-2 font-mono text-xs overflow-hidden">
              <span className="text-accent truncate mr-2">
                {installCommands[activeRecipeTab as keyof typeof installCommands]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    activeRecipeTab,
                    installCommands[activeRecipeTab as keyof typeof installCommands]
                  )
                }
                className="text-xs h-7 px-2 shrink-0 gap-1 text-text-muted hover:text-text-primary"
              >
                {copied === activeRecipeTab ? (
                  <>
                    <Check className="w-3 h-3 text-status-success" />
                    <span className="text-status-success text-[10px]">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span className="text-[10px]">Salin</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-text-primary">
              Deskripsi Skill
            </span>
            <div className="rounded-xl bg-surface-raised/40 border border-border p-3.5 text-xs text-text-secondary leading-relaxed space-y-2">
              <p>{skill.description || skill.summary}</p>
              <div className="pt-2 border-t border-border/60 flex flex-wrap gap-3 text-[10px] text-text-muted font-mono">
                <span>Lisensi: {skill.licenseSpdx || "MIT"}</span>
                <span>Tipe: {skill.skillType}</span>
                <span>Kategori: {skill.categories.map((c) => c.name).join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <a
              href={skill.sourceUrl || `https://github.com/dresar/SKILL-IA-AGENT/tree/main/skills/${skill.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 h-9 rounded-xl border border-border bg-surface-raised hover:bg-surface-hover text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Sumber GitHub</span>
              <ExternalLink className="w-3 h-3 text-text-muted ml-0.5" />
            </a>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 border-t border-border bg-surface-raised/40 flex items-center justify-between text-xs text-text-muted shrink-0">
          <span className="font-mono text-[10px]">ID: {skill.id}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-7 px-3">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
