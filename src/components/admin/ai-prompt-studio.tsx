"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Code,
  Terminal,
  Layers,
  Wand2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type PreviewMode = "svg" | "ai_image" | "code" | "terminal";

interface AiPromptStudioProps {
  skillName: string;
  skillSlug: string;
  skillSummary: string;
  category: string;
  currentImageUrl?: string;
  onSavePreview: (mode: PreviewMode, urlOrContent?: string) => void;
  onClose?: () => void;
}

const STYLES = [
  {
    id: "obsidian",
    label: "Obsidian Neon",
    desc: "OLED dark mode, subtle violet glowing accents, and high-contrast vector micro-grid."
  },
  {
    id: "isometric",
    label: "Isometric 3D",
    desc: "Frosted glass acrylic card, claymorphic 3D icons, soft studio rim lighting."
  },
  {
    id: "terminal",
    label: "Retro Terminal",
    desc: "Phosphor amber/emerald CRT monitor glow, monospaced ASCII geometry."
  },
  {
    id: "editorial",
    label: "Editorial Bento",
    desc: "Warm monochrome paper texture, Swiss typography, and architectural wireframes."
  }
];

export function AiPromptStudio({
  skillName,
  skillSlug,
  skillSummary,
  category,
  currentImageUrl,
  onSavePreview,
  onClose
}: AiPromptStudioProps) {
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [previewMode, setPreviewMode] = useState<PreviewMode>(currentImageUrl ? "ai_image" : "svg");
  const [customImageUrl, setCustomImageUrl] = useState(currentImageUrl || "");
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const styleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[0];
    return `Create a high-end agency banner for a developer AI agent skill called "${skillName || "AI Agent Skill"}". Context: ${skillSummary || "Developer tool"}. Style: ${styleObj.desc} The composition must be ultra-clean, minimal, 16:9 aspect ratio, 8k resolution, centered typography with "${skillName.toUpperCase()}", clean vector iconography for ${category}. No generic clutter, no ugly gradients. Highly aesthetic, cinematic lighting.`;
  };

  const currentPrompt = generatePrompt();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChatGpt = () => {
    window.open("https://chatgpt.com", "_blank");
  };

  const handleOpenBing = () => {
    window.open("https://www.bing.com/images/create", "_blank");
  };

  const handleApply = () => {
    if (previewMode === "ai_image") {
      onSavePreview("ai_image", customImageUrl.trim());
    } else {
      onSavePreview(previewMode);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl bg-surface border border-border p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <span>Studio Prompt & Preview</span>
              <Badge variant="accent" className="text-[10px]">AI Studio</Badge>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Generator prompt ChatGPT/Midjourney dan opsi multi-preview untuk {skillName || "skill"}.
            </p>
          </div>
        </div>

        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Tutup
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-secondary">
            Pilih Gaya Prompt Gambar
          </label>
          <span className="text-[10px] text-text-muted font-mono">DALL-E 3 / Midjourney</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStyle(st.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedStyle === st.id
                  ? "bg-surface-raised border-accent text-accent font-semibold shadow-sm ring-1 ring-accent/30"
                  : "bg-surface border-border text-text-muted hover:text-text-primary hover:bg-surface-raised/40"
              }`}
            >
              <p className="text-xs font-bold text-text-primary">{st.label}</p>
              <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5">{st.desc}</p>
            </button>
          ))}
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Prompt Siap Salin</span>
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Tersalin" : "Salin Prompt"}</span>
            </button>
          </div>

          <div className="relative rounded-xl bg-[#08090C] border border-border p-3 font-mono text-xs text-text-secondary leading-relaxed">
            <p className="text-emerald-300">{currentPrompt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenChatGpt}
              className="text-xs h-8 gap-1.5"
            >
              <span>Buka ChatGPT</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenBing}
              className="text-xs h-8 gap-1.5"
            >
              <span>Buka Image Creator</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-text-secondary">
            Opsi Tampilan Preview (Pilih Salah Satu)
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "svg", label: "Vektor SVG / HTML", icon: Layers },
            { id: "ai_image", label: "Gambar AI (URL)", icon: ImageIcon },
            { id: "code", label: "Kode Sandbox", icon: Code },
            { id: "terminal", label: "Terminal CLI", icon: Terminal }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = previewMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setPreviewMode(mode.id as PreviewMode)}
                className={`p-3 rounded-xl border flex items-center gap-2 transition-all text-xs font-semibold ${
                  isSelected
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-surface border-border text-text-muted hover:text-text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {previewMode === "ai_image" && (
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-medium text-text-secondary">
              Tautan Gambar (Hasil ChatGPT / DALL-E / Imgur / CDN)
            </label>
            <input
              type="url"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... atau URL ChatGPT"
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary focus:outline-none focus:ring-1 focus:ring-accent font-mono"
            />
          </div>
        )}

        <div className="rounded-xl bg-surface-raised border border-border p-4 space-y-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Live Preview Kartu
          </span>

          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#0A0D14] border border-border flex items-center justify-center relative">
            {previewMode === "svg" && (
              <img
                src={`/previews/${skillSlug || "frontend-design"}.svg`}
                alt="SVG Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/brand/logo.svg";
                }}
              />
            )}

            {previewMode === "ai_image" && (
              customImageUrl ? (
                <img
                  src={customImageUrl}
                  alt="AI Generated Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/previews/${skillSlug || "frontend-design"}.svg`;
                  }}
                />
              ) : (
                <div className="text-center p-6 text-text-muted text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>Tempelkan URL gambar untuk melihat pratinjau.</p>
                </div>
              )
            )}

            {previewMode === "code" && (
              <div className="p-4 w-full h-full font-mono text-xs text-emerald-300 overflow-auto bg-[#07090E]">
                <pre>{`// Sandbox Preview: ${skillName}\nexport const ${skillSlug.replace(/-/g, "_")} = {\n  status: "verified",\n  target: "antigravity"\n};`}</pre>
              </div>
            )}

            {previewMode === "terminal" && (
              <div className="p-4 w-full h-full font-mono text-xs text-text-secondary bg-[#07090E] space-y-1">
                <p className="text-accent">$ npx skills add dresar/SKILL-IA-AGENT -s {skillSlug}</p>
                <p className="text-text-muted">[agent] loading runtime dependencies...</p>
                <p className="text-status-success">✓ skill {skillName} active</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApply}
            className="text-xs h-9 font-semibold gap-1.5 px-4"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Terapkan Opsi Preview</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
