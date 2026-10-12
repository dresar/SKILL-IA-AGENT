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
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUploadZone } from "./image-upload-zone";

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
  const [previewMode, setPreviewMode] = useState<PreviewMode>(currentImageUrl ? "ai_image" : "svg");
  const [customImageUrl, setCustomImageUrl] = useState(currentImageUrl || "");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const generatePrompt = () => {
    const styleObj = STYLES.find((s) => s.id === selectedStyle) || STYLES[0];
    return `Create a high-craft 1:1 square developer engineering card for an AI agent skill called "${skillName || "Developer Skill"}". Context: ${skillSummary || "AI coding agent tool"}. Style: ${styleObj.desc}. Composition: 1:1 aspect ratio square, clean dark matte graphite '#0B0F19', subtle hairline micro-grid, centered elegant typography "${skillName.toUpperCase()}", clean restrained iconography for ${category}. Absolutely no tacky glowing cyber gradients, no generic purple/blue AI slop, no sci-fi floating holograms. In the bottom-right corner, feature a clean, subtle watermark text: "BY: eka syarif maulana" in 9px clean monospaced uppercase letters.`;
  };

  const generateSquareSvg = () => {
    const title = (skillName || "DEVELOPER SKILL").toUpperCase();
    const cat = (category || "CORE").toUpperCase();
    const slug = skillSlug || "skill";
    const summary = skillSummary || "Verified autonomous agent skill.";
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B0F19" />
      <stop offset="100%" stop-color="#05070D" />
    </linearGradient>
    <pattern id="grid-${slug}" width="25" height="25" patternUnits="userSpaceOnUse">
      <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1E293B" stroke-width="0.5" stroke-opacity="0.4" />
    </pattern>
  </defs>
  <rect width="500" height="500" rx="20" fill="url(#bg-${slug})" />
  <rect width="500" height="500" fill="url(#grid-${slug})" rx="20" />
  <rect x="25" y="25" width="450" height="450" rx="14" fill="none" stroke="#1E293B" stroke-width="1" />
  <rect x="26" y="26" width="448" height="448" rx="13" fill="none" stroke="#334155" stroke-width="0.5" stroke-opacity="0.3" />
  
  <rect x="45" y="45" width="90" height="24" rx="4" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1" />
  <text x="90" y="61" fill="#94A3B8" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle" letter-spacing="1">${cat}</text>
  
  <circle cx="440" cy="57" r="4" fill="#10B981" />
  
  <text x="45" y="145" fill="#F8FAFC" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" letter-spacing="-0.5">${title}</text>
  <text x="45" y="175" fill="#94A3B8" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400">${summary.slice(0, 48)}${summary.length > 48 ? '...' : ''}</text>
  
  <rect x="45" y="215" width="410" height="150" rx="10" fill="#030712" fill-opacity="0.8" stroke="#1E293B" stroke-width="1" />
  <circle cx="65" cy="235" r="4" fill="#EF4444" opacity="0.8" />
  <circle cx="80" cy="235" r="4" fill="#EAB308" opacity="0.8" />
  <circle cx="95" cy="235" r="4" fill="#10B981" opacity="0.8" />
  <text x="115" y="239" fill="#475569" font-family="monospace" font-size="10">skills/${slug}.sh</text>
  
  <text x="65" y="280" fill="#CBD5E1" font-family="monospace" font-size="11">$ npx skills add dresar/SKILL-IA-AGENT -s ${slug}</text>
  <text x="65" y="315" fill="#60A5FA" font-family="monospace" font-size="10">[SKILL AGENT] verified &amp; ready</text>
  <text x="65" y="340" fill="#34D399" font-family="monospace" font-size="10">✓ status: published | zero-comment</text>
  
  <line x1="45" y1="410" x2="455" y2="410" stroke="#1E293B" stroke-width="1" />
  
  <text x="45" y="440" fill="#475569" font-family="monospace" font-size="9" letter-spacing="1">STANDAR NOKOMEN v2.4</text>
  <text x="455" y="440" fill="#64748B" opacity="0.65" font-family="monospace" font-size="9" text-anchor="end" letter-spacing="1.5">BY: EKA SYARIF MAULANA</text>
</svg>`;
  };

  const currentPrompt = generatePrompt();
  const squareSvgContent = generateSquareSvg();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(squareSvgContent);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2000);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([squareSvgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skillSlug || "skill"}-1x1.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleApply = () => {
    if (previewMode === "ai_image") {
      onSavePreview("ai_image", customImageUrl.trim());
    } else if (previewMode === "svg") {
      const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(squareSvgContent)}`;
      onSavePreview("svg", dataUri);
    } else {
      onSavePreview(previewMode);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Prompt Studio 1:1 & Watermark</span>
              <Badge variant="accent" className="text-[10px]">Anti-Slop</Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Generator visual rasio 1:1 presisi dengan watermark resmi &ldquo;BY: eka syarif maulana&rdquo;.
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
              Gaya Desain Grafis (Bebas Pola AI Slop)
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
              <span className="font-semibold">Prompt 1:1 DALL-E / Midjourney / Flux</span>
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

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">
              Format Tampilan Preview
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "svg", label: "Vektor 1:1 SVG", icon: Layers },
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
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all text-xs font-semibold ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>

            {previewMode === "ai_image" && (
              <div className="pt-2">
                <ImageUploadZone
                  value={customImageUrl}
                  onChange={(val) => setCustomImageUrl(val)}
                  label="Upload atau Tempel URL Gambar AI 1:1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Live 1:1 Canvas (500x500)
            </span>
            <span className="font-mono text-[10px] text-emerald-400">
              Watermark Tersemat
            </span>
          </div>

          <div className="w-full max-w-[340px] aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl relative group">
            {previewMode === "svg" && (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: squareSvgContent }}
              />
            )}

            {previewMode === "ai_image" && (
              customImageUrl ? (
                <img
                  src={customImageUrl}
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
                  <p className="text-xs">Tempel URL atau unggah gambar rasio 1:1</p>
                </div>
              )
            )}

            {previewMode === "code" && (
              <div className="p-4 w-full h-full font-mono text-xs text-emerald-300 overflow-auto bg-[#07090E] flex flex-col justify-between">
                <pre>{`export const ${skillSlug.replace(/-/g, "_")} = {\n  slug: "${skillSlug}",\n  ratio: "1:1",\n  watermark: "BY: eka syarif maulana",\n  status: "verified"\n};`}</pre>
                <div className="pt-2 text-right border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                  BY: EKA SYARIF MAULANA
                </div>
              </div>
            )}

            {previewMode === "terminal" && (
              <div className="p-4 w-full h-full font-mono text-xs text-slate-300 bg-[#07090E] flex flex-col justify-between">
                <div className="space-y-1.5">
                  <p className="text-indigo-400">$ npx skills add dresar/SKILL-IA-AGENT -s {skillSlug}</p>
                  <p className="text-emerald-400">✓ 1:1 runtime ready</p>
                  <p className="text-slate-500">✓ watermark: BY: eka syarif maulana</p>
                </div>
                <div className="text-right border-t border-slate-800 pt-2 text-[10px] text-slate-500 font-mono">
                  BY: EKA SYARIF MAULANA
                </div>
              </div>
            )}
          </div>

          <div className="w-full max-w-[340px] flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySvg}
              className="flex-1 text-xs h-8 border-slate-800 text-slate-300"
            >
              {copiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              <span>{copiedSvg ? "SVG Tersalin" : "Salin SVG"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadSvg}
              className="text-xs h-8 border-slate-800 text-slate-300 px-3"
              title="Unduh file SVG 1:1"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="flex-1 text-xs h-8 font-semibold bg-indigo-600 hover:bg-indigo-500"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              <span>Terapkan</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
