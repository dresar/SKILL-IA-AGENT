import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Cpu, Terminal, FileCode, ShieldCheck, Sparkles } from "lucide-react";
import { McpPlayground } from "@/components/mcp/mcp-playground";

export const metadata: Metadata = {
  title: "Dokumentasi MCP & Arsitektur Agent — SKILL UIAI",
  description: "Dokumentasi teknis Model Context Protocol (MCP), integrasi Claude Code & Antigravity, spesifikasi endpoints, dan panduan SDK.",
  alternates: {
    canonical: "/dokumentasi/"
  }
};

const TOOLS_SPEC = [
  {
    name: "search_skills",
    description: "Mencari katalog skill agen AI berdasarkan kata kunci, tag, atau deskripsi.",
    params: "{ query: string, category?: string }",
    example: '{"query": "design"}'
  },
  {
    name: "get_skill",
    description: "Mengambil metadata lengkap skill, resep instalasi, dan lisensi berdasarkan slug.",
    params: "{ slug: string }",
    example: '{"slug": "frontend-design"}'
  },
  {
    name: "get_skill_content",
    description: "Mengambil konten mentah SKILL.md untuk disematkan langsung ke system prompt agent.",
    params: "{ slug: string }",
    example: '{"slug": "ui-ux-text"}'
  },
  {
    name: "get_install_command",
    description: "Mengambil perintah instalasi resmi untuk runtime target (antigravity, claude, cursor).",
    params: "{ slug: string, target?: string }",
    example: '{"slug": "nokomen", "target": "antigravity"}'
  },
  {
    name: "list_categories",
    description: "Menampilkan seluruh taksonomi kategori skill yang terdaftar di registry.",
    params: "{}",
    example: "{}"
  },
  {
    name: "get_skill_preview",
    description: "Mengambil spesifikasi visual SVG dan metadata pratinjau aset grafis.",
    params: "{ slug: string }",
    example: '{"slug": "minimalist-ui"}'
  }
];

export default function DokumentasiPage() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="space-y-4 border-b border-border pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Katalog
        </Link>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest text-accent uppercase font-semibold">
            DOKUMENTASI RESMI
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            Model Context Protocol & SDK
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Spesifikasi protokol MCP, panduan integrasi runtime untuk Google Antigravity dan Claude Code, serta referensi API serverless.
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Ikhtisar Arsitektur MCP
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">01. Standard Protocol</span>
            <h3 className="font-semibold text-sm text-text-primary">JSON-RPC 2.0</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Kompatibel penuh dengan spesifikasi resmi Anthropic Model Context Protocol melalui transportasi HTTP dan Stdio.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">02. Live Database</span>
            <h3 className="font-semibold text-text-primary text-sm">Neon PostgreSQL</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Data skill, resep instalasi, dan taksonomi kategori ditarik langsung dari database serverless pooled berlatensi rendah.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">03. Zero Latency</span>
            <h3 className="font-semibold text-text-primary text-sm">Edge Serverless</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Dapat dieksekusi secara instan via endpoint Next.js API route (/api/mcp) atau runner lokal (scripts/mcp-stdio.ts).
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Panduan Menghubungkan Agent
          </h2>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>Google Antigravity</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent">mcp_config.json</span>
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tambahkan konfigurasi berikut ke berkas konfigurasi MCP Antigravity Anda:
            </p>
            <pre className="p-4 rounded-lg bg-[#08090C] border border-border/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "skill-uiai": {
      "command": "npx",
      "args": ["-y", "tsx", "scripts/mcp-stdio.ts"]
    }
  }
}`}
            </pre>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>Claude Code CLI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent">Terminal Command</span>
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Jalankan perintah berikut pada terminal proyek Anda:
            </p>
            <pre className="p-4 rounded-lg bg-[#08090C] border border-border/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`claude mcp add skill-uiai npx -y tsx scripts/mcp-stdio.ts`}
            </pre>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>HTTP Remote Endpoint</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent">POST /api/mcp</span>
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Untuk sistem remote atau bot Telegram/Discord, kirimkan permintaan POST dengan payload JSON-RPC 2.0:
            </p>
            <pre className="p-4 rounded-lg bg-[#08090C] border border-border/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://skills-smoky.vercel.app/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "search_skills",
      "arguments": { "query": "design" }
    }
  }'`}
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Daftar Spesifikasi Tools MCP
          </h2>
        </div>

        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-surface-raised border-b border-border text-text-muted uppercase text-[11px] font-mono">
                <tr>
                  <th className="py-3 px-4">Nama Tool</th>
                  <th className="py-3 px-4">Deskripsi Fungsi</th>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Contoh Input</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {TOOLS_SPEC.map((tool) => (
                  <tr key={tool.name} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {tool.name}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary">
                      {tool.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted">
                      {tool.params}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted">
                      {tool.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            Uji Interaktif MCP Tools
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Gunakan panel interaktif di bawah untuk menguji endpoint MCP server secara real-time langsung dari peramban Anda tanpa modal.
        </p>
        <McpPlayground />
      </section>
    </div>
  );
}
