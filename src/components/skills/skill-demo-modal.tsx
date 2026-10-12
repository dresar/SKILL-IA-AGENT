"use client";

import React, { useState } from "react";
import { X, Play, Copy, Check, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillCardData } from "./skill-card";

interface SkillDemoModalProps {
  skill: SkillCardData | null;
  onClose: () => void;
}

const DEFAULT_DEMOS: Record<string, { prompt: string; code: string; logs: string[] }> = {
  "frontend-design": {
    prompt: "Instruct agents to avoid generic AI aesthetics and make bold, intentional design decisions with React & Tailwind.",
    code: `export function AgencyHero() {\n  return (\n    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8">\n      <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 font-bold">\n        INDEX V1.7.0\n      </span>\n      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-3">\n        Bespoke Client Engineering\n      </h1>\n      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 max-w-md leading-relaxed">\n        Restrained surfaces, high-contrast type, zero glowing AI slop.\n      </p>\n    </div>\n  );\n}`,
    logs: [
      "[1/3] Parsing design constraints...",
      "[2/3] Enforcing WCAG AA contrast and precision borders...",
      "[3/3] Emitted React JSX component."
    ]
  },
  "canvas-design": {
    prompt: "Design visual art in PNG and PDF formats using sophisticated design philosophies.",
    code: `export function drawPoster(ctx: CanvasRenderingContext2D, width: number, height: number) {\n  ctx.fillStyle = "#0A0A0A";\n  ctx.fillRect(0, 0, width, height);\n  ctx.strokeStyle = "#FFFFFF";\n  ctx.lineWidth = 1.5;\n  ctx.strokeRect(40, 40, width - 80, height - 80);\n}`,
    logs: [
      "[1/3] Establishing coordinate grid...",
      "[2/3] Aligning typographic hierarchy...",
      "[3/3] Vector canvas generated."
    ]
  },
  "algorithmic-art": {
    prompt: "Create generative art using p5.js with seeded randomness, flow fields, and particles.",
    code: `function setup() {\n  createCanvas(800, 800);\n  randomSeed(1024);\n  noiseSeed(1024);\n}\nfunction draw() {\n  background(10);\n  stroke(240);\n  for (let x = 0; x < width; x += 20) {\n    let angle = noise(x * 0.005) * TWO_PI;\n    line(x, height/2, x + cos(angle) * 30, height/2 + sin(angle) * 30);\n  }\n}`,
    logs: [
      "[1/3] Initializing seeded pseudo-random engine...",
      "[2/3] Computing parametric flow field vector coordinates...",
      "[3/3] Rendered deterministic canvas simulation."
    ]
  },
  "ui-ux-text": {
    prompt: "Perbaiki teks modal konfirmasi penghapusan agar patuh aturan ultra-minimalis.",
    code: `<h2>Hapus Akun</h2>\n<p className="text-xs text-text-muted">\nTindakan ini menghapus data secara permanen.\n</p>\n<Button variant="danger">Hapus</Button>\n<Button variant="ghost">Batal</Button>`,
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
  },
  "superpowers-tdd": {
    prompt: "Jalankan siklus pengujian test-driven development sebelum menulis implementasi.",
    code: `describe("AuthService", () => {\n  it("rejects unauthorized token signature", async () => {\n    const res = await verifyAuthToken("invalid-token");\n    expect(res.isValid).toBe(false);\n  });\n});`,
    logs: [
      "[1/3] Synthesizing unit tests based on acceptance criteria...",
      "[2/3] Running test suite in ephemeral runner...",
      "[3/3] Tests executed: 4 passed, 0 failed."
    ]
  },
  "caveman-compress": {
    prompt: "Kompresi penjelasan agent agar memangkas 65% penggunaan token.",
    code: `Action: migrate db schema\nTarget: Neon PostgreSQL\nTables: 19 schema objects\nResult: 0 errors`,
    logs: [
      "[1/3] Activating token economy protocol...",
      "[2/3] Stripping conversational fluff and boilerplate...",
      "[3/3] Tokens reduced by 66.4%."
    ]
  },
  "taste-filter": {
    prompt: "Deteksi dan ganti komponen UI generik dengan estetika modern.",
    code: `<div className="p-1 rounded-2xl bg-white/[0.03] ring-1 ring-white/10">\n  <div className="p-4 rounded-xl bg-surface">\n    <span className="text-xs font-bold text-accent">Bespoke Design</span>\n  </div>\n</div>`,
    logs: [
      "[1/3] Scanning AST for generic gradients and drop shadows...",
      "[2/3] Banned 4 anti-patterns...",
      "[3/3] Injected tactile double-bezel styling."
    ]
  },
  "security-audit": {
    prompt: "Pindai codebase untuk deteksi kebocoran kredensial dan celah keamanan.",
    code: `export function sanitizeInput(input: string): string {\n  return input.replace(/[<>"'&]/g, (char) => \`&#\${char.charCodeAt(0)};\`);\n}`,
    logs: [
      "[1/3] Scanning AST for secret patterns and injection risks...",
      "[2/3] Verifying environment variable isolation...",
      "[3/3] Audit passed: 0 vulnerabilities found."
    ]
  },
  "git-workflow": {
    prompt: "Otomasi pembuatan commit konvensional dan branch terisolasi.",
    code: `git checkout -b feat/mcp-integration\ngit add src/mcp/\ngit commit -m "feat(mcp): implement native tools server"\ngit push origin feat/mcp-integration`,
    logs: [
      "[1/3] Validating conventional commit format...",
      "[2/3] Staging atomic changeset...",
      "[3/3] Remote branch created."
    ]
  },
  "docker-devops": {
    prompt: "Jalankan kontainer sandbox efemeral untuk evaluasi kode agent.",
    code: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nUSER node\nCMD ["npm", "start"]`,
    logs: [
      "[1/3] Building unprivileged Alpine sandbox container...",
      "[2/3] Allocating CPU/memory limits...",
      "[3/3] Container operational."
    ]
  }
};

export function SkillDemoModal({ skill, onClose }: SkillDemoModalProps) {
  if (!skill) return null;

  const demoData = DEFAULT_DEMOS[skill.slug] || {
    prompt: `Demonstrasi eksekusi skill ${skill.name}.`,
    code: `export const ${skill.slug.replace(/-/g, "_")} = { active: true };`,
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
    }, 500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(demoData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-surface-raised/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-text-primary truncate">
                  Demo: {skill.name}
                </h3>
                <Badge variant="accent" className="text-[10px]">
                  Interaktif
                </Badge>
              </div>
              <p className="text-[11px] sm:text-xs text-text-muted mt-0.5 truncate">
                Simulasi hasil instruksi skill pada coding agent.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
              <span>Instruksi Agent (Prompt)</span>
              <button
                type="button"
                onClick={() => setPrompt(demoData.prompt)}
                className="text-[11px] text-accent hover:underline flex items-center gap-1 min-h-[28px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
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
                className="text-xs gap-1.5 h-9 min-h-[38px] font-semibold px-4"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? "animate-spin" : ""}`} />
                <span>{isRunning ? "Menjalankan..." : "Jalankan Simulasi"}</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md min-h-[32px] transition-colors ${
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
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md min-h-[32px] transition-colors ${
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
                  className="text-xs h-8 min-h-[32px] gap-1 text-text-muted hover:text-text-primary px-2.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Tersalin" : "Salin"}</span>
                </Button>
              )}
            </div>

            {activeTab === "code" ? (
              <div className="relative rounded-xl bg-[#08090C] border border-border/80 p-3.5 sm:p-4 font-mono text-xs text-emerald-300 overflow-x-auto max-h-60 shadow-inner">
                <pre>{demoData.code}</pre>
              </div>
            ) : (
              <div className="rounded-xl bg-[#08090C] border border-border/80 p-3.5 sm:p-4 font-mono text-xs space-y-1.5 max-h-60 overflow-y-auto shadow-inner">
                {demoData.logs.map((log, idx) => (
                  <p key={idx} className="text-text-secondary">
                    <span className="text-accent">{">"}</span> {log}
                  </p>
                ))}
                <p className="text-status-success pt-1">
                  ✓ Eksekusi berhasil dalam 38ms.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 border-t border-border bg-surface-raised/30 flex items-center justify-between text-xs text-text-muted shrink-0">
          <span className="truncate mr-2">Target: Antigravity & Claude Code</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-9 min-h-[38px] px-3">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
