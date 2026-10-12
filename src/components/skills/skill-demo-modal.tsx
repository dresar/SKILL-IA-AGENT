"use client";

import React, { useState } from "react";
import { X, Play, Copy, Check, Terminal, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillCardData } from "./skill-card";

interface SkillDemoModalProps {
  skill: SkillCardData | null;
  onClose: () => void;
}

const DEFAULT_DEMOS: Record<string, { prompt: string; code: string; logs: string[] }> = {
  "frontend-design": {
    prompt: "Buat hero section web agency dengan double-bezel cards dan aksen lavender.",
    code: `export function AgencyHero() {\n  return (\n    <div className="p-1 rounded-[2rem] bg-white/5 ring-1 ring-white/10">\n      <div className="p-8 rounded-[calc(2rem-0.25rem)] bg-[#0A0D14]">\n        <span className="px-3 py-1 rounded-full text-[10px] bg-accent/20 text-accent font-mono uppercase tracking-wider">\n          Obsidian V2\n        </span>\n        <h1 className="text-4xl font-extrabold tracking-tight text-white mt-4">\n          Agentic Visual Design\n        </h1>\n        <p className="text-xs text-neutral-400 mt-2 max-w-md">\n          Haptic micro-aesthetics and fluid spatial choreography.\n        </p>\n      </div>\n    </div>\n  );\n}`,
    logs: [
      "[1/3] Parsing design constraints...",
      "[2/3] Applying double-bezel architecture and dark palette...",
      "[3/3] Emitted React JSX component without comments."
    ]
  },
  "ui-ux-text": {
    prompt: "Perbaiki teks modal konfirmasi penghapusan agar patuh aturan ultra-minimalis.",
    code: `// Heading: 1-3 kata\n<h2>Hapus Akun</h2>\n\n// Deskripsi: Maksimal 1 kalimat\n<p className="text-xs text-text-muted">\nTindakan ini menghapus data secara permanen.\n</p>\n\n// Tombol: 1-2 kata\n<Button variant="danger">Hapus</Button>\n<Button variant="ghost">Batal</Button>`,
    logs: [
      "[1/3] Scanning modal for generic fluff...",
      "[2/3] Truncating verbose sentences to single declarative clause...",
      "[3/3] Enforced 1-word button labels."
    ]
  },
  "nokomen": {
    prompt: "Refactor modul otentikasi agar patuh standar zero-comment.",
    code: `export interface UserCredential {\n  readonly email: string;\n  readonly hash: string;\n}\n\nexport function isValidUserCredential(credential: UserCredential): boolean {\n  return Boolean(credential.email.includes("@") && credential.hash.length >= 64);\n}`,
    logs: [
      "[1/3] Scanning AST for single-line, block, and docstring comments...",
      "[2/3] Removed 14 redundant comments; promoted semantics to function signature...",
      "[3/3] Zero-comment compliance verified."
    ]
  },
  "neon-postgres": {
    prompt: "Setup koneksi pooler Neon PostgreSQL serverless dengan Drizzle ORM.",
    code: `import { neon } from "@neondatabase/serverless";\nimport { drizzle } from "drizzle-orm/neon-http";\nimport * as schema from "./schema";\n\nconst client = neon(process.env.DATABASE_URL!);\nexport const db = drizzle(client, { schema });`,
    logs: [
      "[1/3] Connecting to Neon pooler endpoint over HTTPS/WebSocket...",
      "[2/3] Testing branch-aware query schema...",
      "[3/3] Connection active (latency: 18ms)."
    ]
  },
  "antigravity-guide": {
    prompt: "Jalankan subagent concurrent untuk verifikasi integritas data.",
    code: `await invoke_subagent({\n  Subagents: [\n    {\n      TypeName: "research",\n      Role: "Audit Specialist",\n      Prompt: "Audit database schema integrity and verify foreign keys."\n    }\n  ]\n});`,
    logs: [
      "[1/3] Registering subagent context with parent runtime...",
      "[2/3] Dispatching task to isolated sandbox...",
      "[3/3] Subagent completed with status SUCCESS."
    ]
  },
  "minimalist-ui": {
    prompt: "Rancang bento grid 3 kolom dengan warna monokrom hangat.",
    code: `<div className="grid grid-cols-1 md:grid-cols-3 gap-3">\n  <div className="md:col-span-2 p-6 rounded-2xl bg-[#141412] border border-[#262622]">\n    <h3 className="text-sm font-bold text-neutral-200">Arsitektur</h3>\n    <p className="text-xs text-neutral-400 mt-1">Struktur editorial teratur.</p>\n  </div>\n  <div className="p-6 rounded-2xl bg-[#141412] border border-[#262622]">\n    <h3 className="text-sm font-bold text-neutral-200">Status</h3>\n    <p className="text-xs text-neutral-400 mt-1">Aktif</p>\n  </div>\n</div>`,
    logs: [
      "[1/3] Generating typographic contrast hierarchy...",
      "[2/3] Removing heavy drop shadows and gradient overlays...",
      "[3/3] Emitted flat bento layout."
    ]
  }
};

export function SkillDemoModal({ skill, onClose }: SkillDemoModalProps) {
  if (!skill) return null;

  const demoData = DEFAULT_DEMOS[skill.slug] || {
    prompt: `Demonstrasi eksekusi skill ${skill.name}.`,
    code: `// Eksekusi skill: ${skill.slug}\nconsole.log("${skill.name} siap digunakan.");`,
    logs: [
      "[1/2] Memuat runtime agent...",
      "[2/2] Skill berhasil diinisialisasi."
    ]
  };

  const [prompt, setPrompt] = useState(demoData.prompt);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "logs">("code");
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(demoData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-raised/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-text-primary">
                  Demo: {skill.name}
                </h3>
                <Badge variant="accent" className="text-[10px]">
                  Interaktif
                </Badge>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Simulasi hasil instruksi skill pada coding agent.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
              <span>Instruksi Agent (Prompt)</span>
              <button
                type="button"
                onClick={() => setPrompt(demoData.prompt)}
                className="text-[11px] text-accent hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-surface-raised border border-border text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent font-mono resize-none leading-relaxed"
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="text-xs gap-1.5 h-8 font-semibold"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Menjalankan..." : "Jalankan Simulasi"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                    activeTab === "code"
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Hasil Kode
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("logs")}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-colors ${
                    activeTab === "logs"
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Log Agent
                </button>
              </div>

              {activeTab === "code" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs h-7 gap-1 text-text-muted hover:text-text-primary px-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Tersalin" : "Salin"}</span>
                </Button>
              )}
            </div>

            {activeTab === "code" ? (
              <div className="relative rounded-xl bg-[#08090C] border border-border/80 p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-64 shadow-inner">
                <pre>{demoData.code}</pre>
              </div>
            ) : (
              <div className="rounded-xl bg-[#08090C] border border-border/80 p-4 font-mono text-xs space-y-1.5 max-h-64 overflow-y-auto shadow-inner">
                {demoData.logs.map((log, idx) => (
                  <p key={idx} className="text-text-secondary">
                    <span className="text-accent">{">"}</span> {log}
                  </p>
                ))}
                <p className="text-status-success pt-1">
                  ✓ Eksekusi berhasil dalam 42ms.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-surface-raised/30 flex items-center justify-between text-xs text-text-muted">
          <span>Target Runtime: Google Antigravity & Claude Code</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-8">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
