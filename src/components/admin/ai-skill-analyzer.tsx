"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Code,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SkillAnalysisResult {
  name: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  rules: string[];
  imagePrompt: string;
  installCommand: string;
  previewSvg: string;
}

interface AiSkillAnalyzerProps {
  onApply: (result: SkillAnalysisResult) => void;
}

const PRESETS = [
  {
    label: "Frontend UI",
    text: "Desain sistem antarmuka gelap taktil dengan kartu double-bezel, tipografi presisi, dan animasi kinetik tanpa template generik."
  },
  {
    label: "Clean Code",
    text: "Disiplin penulisan kode tanpa komentar atau docstring, tipe ketat TypeScript, dan arsitektur self-documenting."
  },
  {
    label: "DevOps Sandbox",
    text: "Eksekusi kode agent dalam kontainer Docker efemeral dengan batasan memori dan timeout otomatis."
  },
  {
    label: "Neon Postgres",
    text: "Migrasi skema database PostgreSQL serverless, pooling koneksi WebSocket, dan branching database instan."
  }
];

export function AiSkillAnalyzer({ onApply }: AiSkillAnalyzerProps) {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillAnalysisResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const runAnalysis = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const text = inputText.toLowerCase();
      let name = "Custom Agent Skill";
      let slug = "custom-agent-skill";
      let category = "workflows";
      let summary = "Protokol eksekusi agent otonom dengan standar terverifikasi.";
      let rules = [
        "Wajib validasi parameter sebelum eksekusi",
        "Batasi output maksimal 1 kalimat per tindakan",
        "Gunakan mode sandbox terisolasi tanpa akses root"
      ];

      if (text.includes("frontend") || text.includes("ui") || text.includes("desain")) {
        name = "Agency Frontend System";
        slug = "agency-frontend-system";
        category = "frontend";
        summary = "Komponen antarmuka modern dengan kedalaman haptik dan palet OLED.";
        rules = [
          "Larang penggunaan border abu-abu tebal dan bayangan kasar",
          "Terapkan kontras rasio minimal 4.5:1 untuk teks",
          "Wajib transisi mikro pada setiap interaksi kartu"
        ];
      } else if (text.includes("clean") || text.includes("komen") || text.includes("code")) {
        name = "Strict Clean Standard";
        slug = "strict-clean-standard";
        category = "code-quality";
        summary = "Standar kode bersih tanpa komentar dengan penamaan simbol eksplisit.";
        rules = [
          "Dilarang menulis komentar baris tunggal maupun blok",
          "Hapus semua docstring dan banner ASCII",
          "Nama fungsi dan variabel wajib merefleksikan tujuannya"
        ];
      } else if (text.includes("docker") || text.includes("devops") || text.includes("sandbox")) {
        name = "Isolated Sandbox Runner";
        slug = "isolated-sandbox-runner";
        category = "workflows";
        summary = "Kontainer efemeral aman untuk evaluasi kode agent secara independen.";
        rules = [
          "Eksekusi dalam lingkungan non-root terisolasi",
          "Batasi konsumsi memori maksimal 512MB per tugas",
          "Terapkan timeout otomatis 30 detik untuk setiap proses"
        ];
      } else if (text.includes("neon") || text.includes("postgres") || text.includes("database")) {
        name = "Serverless DB Operator";
        slug = "serverless-db-operator";
        category = "database";
        summary = "Operasi database PostgreSQL serverless dengan Drizzle ORM dan pooling cepat.";
        rules = [
          "Gunakan pooling WebSocket untuk lingkungan serverless",
          "Terapkan migrasi atomik pada setiap perubahan skema",
          "Jangan pernah menyimpan string koneksi di repositori publik"
        ];
      }

      const imagePrompt = `High-end agency preview card for "${name}". Minimalist dark developer interface, glowing subtle violet accents, 16:9 ratio, centered typography "${name.toUpperCase()}", clean vector iconography for ${category}. No clutter, no gradients, cinematic 8k render.`;

      const previewSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" rx="20" fill="#0B0D13"/><rect x="40" y="40" width="720" height="370" rx="16" fill="#131620" stroke="#252A3D" stroke-width="1.5"/><circle cx="80" cy="80" r="12" fill="#7C3AED" opacity="0.3"/><text x="110" y="86" fill="#A78BFA" font-size="14" font-weight="700" letter-spacing="2">VERIFIED AGENT SKILL</text><text x="80" y="220" fill="#FFFFFF" font-size="36" font-weight="800">${name}</text><text x="80" y="270" fill="#94A3B8" font-size="16" max-width="600">${summary}</text><rect x="80" y="320" width="300" height="42" rx="8" fill="#080A0F" stroke="#252A3D"/><text x="96" y="347" fill="#38BDF8" font-size="13" font-family="monospace">npx skills add dresar/SKILL-IA-AGENT -s ${slug}</text></svg>`;

      setAnalysis({
        name,
        slug,
        category,
        summary,
        description: `${summary} Dilengkapi aturan operasional ketat untuk integrasi model LLM.`,
        rules,
        imagePrompt,
        installCommand: `npx skills add dresar/SKILL-IA-AGENT -s ${slug}`,
        previewSvg
      });

      setIsAnalyzing(false);
    }, 600);
  };

  const handleCopyPrompt = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.imagePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-2xl bg-surface border border-border p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-text-primary">Analisis AI</h2>
        </div>
        <Badge variant="accent" className="text-[10px]">Otomatis</Badge>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-secondary">Input Skill</label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Tempel deskripsi, ide, atau aturan skill di sini..."
          className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface-raised text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
        />

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] text-text-muted">Preset:</span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setInputText(p.text)}
              className="px-2 py-0.5 rounded-lg text-[10px] bg-surface-raised border border-border hover:border-accent text-text-secondary hover:text-text-primary transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={runAnalysis}
          disabled={isAnalyzing || !inputText.trim()}
          className="text-xs h-8 px-4 gap-1.5"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? "Menganalisis..." : "Analisis"}</span>
        </Button>
      </div>

      {analysis && (
        <div className="pt-4 border-t border-border space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface-raised p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">{analysis.name}</span>
                <Badge variant="outline" className="text-[9px] font-mono">{analysis.category}</Badge>
              </div>
              <p className="text-xs text-text-muted">{analysis.summary}</p>
              <div className="p-1.5 rounded-lg bg-background border border-border font-mono text-[10px] text-accent truncate">
                {analysis.installCommand}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-raised p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
                <span className="text-xs font-bold text-text-primary">Aturan Skill</span>
              </div>
              <ul className="space-y-1 text-[11px] text-text-secondary">
                {analysis.rules.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface-raised p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-primary">Prompt Gambar</span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPrompt}
                  className="text-[10px] h-6 px-2 gap-1"
                >
                  {copiedPrompt ? <Check className="w-3 h-3 text-status-success" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? "Tersalin" : "Salin"}</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open("https://chatgpt.com", "_blank")}
                  className="text-[10px] h-6 px-2 gap-1 text-accent"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>ChatGPT</span>
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-text-muted font-mono leading-relaxed bg-background p-2 rounded-lg border border-border">
              {analysis.imagePrompt}
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onApply(analysis)}
              className="text-xs h-8 px-4 gap-1.5 font-bold"
            >
              <span>Terapkan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
