"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Terminal,
  Play,
  Github,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
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

  const previewSrc = skill.previewImageUrl || `/previews/${skill.slug}.svg`;

  const installCommands = {
    antigravity: skill.primaryRecipe?.command || `/skill add ${skill.slug}`,
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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-raised/40 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="text-[10px]">
              {skill.skillType}
            </Badge>
            <span className="text-xs font-mono text-text-muted">
              {skill.slug}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-surface-raised border border-border shadow-md">
            <img
              src={previewSrc}
              alt={skill.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/brand/logo.svg";
                target.className = "w-full h-full object-contain p-8 opacity-30";
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  {skill.name}
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Dibuat oleh <span className="text-text-secondary font-medium">{skill.authorDisplay}</span>
                </p>
              </div>

              <Badge
                variant={
                  skill.verificationStatus === "verified"
                    ? "success"
                    : "accent"
                }
              >
                {skill.verificationStatus === "verified"
                  ? "Terverifikasi"
                  : "Dicek"}
              </Badge>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed pt-2">
              {skill.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenDemo(skill)}
              className="text-xs font-semibold gap-1.5 h-9 px-4"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Buka Demo Interaktif</span>
            </Button>

            <a
              href={skill.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border bg-surface-raised hover:bg-surface-hover text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Sumber GitHub</span>
              <ExternalLink className="w-3 h-3 text-text-muted ml-0.5" />
            </a>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-semibold text-text-primary">
                Perintah Pemasangan
              </span>
              <div className="flex items-center gap-1">
                {(["antigravity", "npx", "claude", "mcp"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveRecipeTab(tab)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
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

            <div className="flex items-center justify-between rounded-xl bg-surface-raised border border-border p-3 font-mono text-xs">
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
                    <span className="text-status-success">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              Spesifikasi Lengkap
            </h4>
            <div className="rounded-xl bg-surface-raised/40 border border-border/80 p-4 text-xs text-text-secondary leading-relaxed space-y-3">
              <p>
                {skill.description || skill.summary}
              </p>
              <div className="pt-2 border-t border-border/60 flex flex-wrap gap-4 text-[11px] text-text-muted">
                <div>
                  <span className="font-semibold text-text-secondary">Lisensi: </span>
                  {skill.licenseSpdx || "MIT"}
                </div>
                <div>
                  <span className="font-semibold text-text-secondary">Tipe: </span>
                  {skill.skillType}
                </div>
                <div>
                  <span className="font-semibold text-text-secondary">Kategori: </span>
                  {skill.categories.map((c) => c.name).join(", ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-surface-raised/40 flex items-center justify-between shrink-0 text-xs text-text-muted">
          <span>ID: {skill.id}</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
