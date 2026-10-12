"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Wand2,
  UploadCloud,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUploadZone } from "./image-upload-zone";

export type PreviewMode = "image";

interface AiPromptStudioProps {
  skillName: string;
  skillSlug: string;
  skillSummary: string;
  category: string;
  currentImageUrl?: string;
  onSavePreview: (mode: PreviewMode, imageUrl: string) => void;
  onClose?: () => void;
}

const STYLES = [
  {
    id: "swiss",
    label: "Swiss Engineering",
    desc: "Matte dark graphite, hairline precision grid, sharp typography, anti-slop tactile card."
  },
  {
    id: "editorial",
    label: "Editorial Monochrome",
    desc: "Warm obsidian paper texture, Stark sans-serif layout, high micro-contrast, clean minimalist."
  },
  {
    id: "industrial",
    label: "Tactile Industrial",
    desc: "Anodized slate bezel, laser-sharp monospaced details, subtle physical depth, zero AI fluff."
  },
  {
    id: "architectural",
    label: "Architectural Blueprint",
    desc: "Subtle vector blueprint wireframe, restrained navy-slate, pristine geometry, pure craft."
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
  const [imageUrl, setImageUrl] = useState(
    currentImageUrl || `/previews/${skillSlug || "frontend-design"}.svg`
  );
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const generatePrompt = () => {
    const styleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[0];
    return `Create a high-craft 1:1 square developer engineering card for an AI agent skill called "${skillName || "Developer Skill"}". Context: ${skillSummary || "AI coding agent tool"}. Style: ${styleObj.desc}. Composition: 1:1 aspect ratio square, clean dark matte graphite '#0B0F19', subtle hairline micro-grid, centered elegant typography "${skillName.toUpperCase()}", clean restrained iconography for ${category}. Absolutely no tacky glowing cyber gradients, no generic purple/blue AI slop, no sci-fi floating holograms. In the bottom-right corner, feature a clean, subtle watermark text: "BY: eka syarif maulana" in 9px clean monospaced uppercase letters.`;
  };

  const currentPrompt = generatePrompt();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleApply = () => {
    if (!imageUrl.trim()) return;
    onSavePreview("image", imageUrl.trim());
  };

  return (
    <div className="space-y-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
              title="Kembali"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Prompt Studio 1:1 — {skillName}</span>
              <Badge variant="accent" className="text-[10px]">Images Only</Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              slug: {skillSlug} | Watermark resmi &ldquo;BY: eka syarif maulana&rdquo;
            </p>
          </div>
        </div>

        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
            Tutup
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Gaya Desain Gambar 1:1 (Anti-Slop AI)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStyle(st.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedStyle === st.id
                      ? "bg-slate-950 border-indigo-500 text-indigo-300 font-semibold shadow-sm ring-1 ring-indigo-500/30"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                  }`}
                >
                  <p className="text-xs font-bold text-slate-200">{st.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">{st.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Prompt Generator Khusus Skill Ini</span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? "Tersalin" : "Salin Prompt"}</span>
              </button>
            </div>

            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
              <p className="text-emerald-300">{currentPrompt}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("https://chatgpt.com", "_blank")}
                className="text-xs h-8 gap-1.5 border-slate-800 text-slate-300"
              >
                <span>Buka ChatGPT</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open("https://www.bing.com/images/create", "_blank")}
                className="text-xs h-8 gap-1.5 border-slate-800 text-slate-300"
              >
                <span>Image Creator</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Unggah Gambar / Masukkan URL Gambar (Rasio 1:1)</span>
              <span className="text-[10px] font-mono text-indigo-400">Hanya Format Gambar</span>
            </label>

            <ImageUploadZone
              value={imageUrl}
              onChange={(val) => setImageUrl(val)}
              label="Unggah Gambar 1:1 (PNG, JPG, WebP)"
            />

            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-mono">Atau Tempel URL Gambar:</span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... atau /previews/nama-skill.svg"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Pratinjau Gambar 1:1
            </span>
            <span className="font-mono text-[10px] text-emerald-400">
              Format: Image
            </span>
          </div>

          <div className="w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={skillName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `/previews/${skillSlug || "frontend-design"}.svg`;
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 text-center">
                <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">Tidak ada gambar yang dimuat.</p>
              </div>
            )}
          </div>

          <div className="w-full max-w-[340px] flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageUrl(`/previews/${skillSlug}.svg`)}
              className="flex-1 text-xs h-8 border-slate-800 text-slate-300"
              title="Gunakan gambar bawaan 1:1"
            >
              <span>Default 1:1</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="flex-1 text-xs h-8 font-semibold bg-indigo-600 hover:bg-indigo-500"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Terapkan ke Skill</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
