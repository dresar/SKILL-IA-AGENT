import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Cpu,
  Terminal,
  ShieldCheck,
  Sparkles,
  Users,
  KeyRound,
  ExternalLink
} from "lucide-react";
import { McpPlayground } from "@/components/mcp/mcp-playground";

export const metadata: Metadata = {
  title: "Dokumentasi MCP & Arsitektur Agent — SkillAgent",
  description: "Dokumentasi teknis Model Context Protocol (MCP), integrasi Claude Code & Antigravity, manajemen akun pengguna, dan referensi SDK.",
  alternates: {
    canonical: "/dokumentasi/"
  }
};

const TOOLS_SPEC = [
  {
    name: "search_skills",
    description: "Mencari katalog skill agen AI berdasarkan kata kunci, tag, atau kategori.",
    params: "{ query: string, category?: string, limit?: number }",
    example: '{"query": "frontend", "limit": 5}'
  },
  {
    name: "get_skill",
    description: "Mengambil metadata lengkap skill, resep instalasi, dan lisensi berdasarkan slug unik.",
    params: "{ slug: string }",
    example: '{"slug": "frontend-design"}'
  },
  {
    name: "get_skill_content",
    description: "Mengambil instruksi mentah SKILL.md untuk disematkan langsung ke system prompt agent.",
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
    <div className="space-y-12 max-w-5xl mx-auto pb-12">
      <div className="space-y-4 border-b border-border pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Direktori
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-accent/15 text-accent tracking-wider uppercase">
            Dokumentasi Resmi SkillAgent
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary">
            Model Context Protocol, SDK & Akun
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
            Panduan menyeluruh arsitektur MCP, autentikasi akun Google & Neon, integrasi runtime agen (Antigravity, Claude Code, Cursor), serta alur kerja kurasi skill.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <a
            href="#arsitektur"
            className="px-3 py-1 rounded-[4px] border border-border bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary transition"
          >
            Arsitektur MCP
          </a>
          <a
            href="#akun"
            className="px-3 py-1 rounded-[4px] border border-border bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary transition"
          >
            Panduan Akun & Akses
          </a>
          <a
            href="#koneksi"
            className="px-3 py-1 rounded-[4px] border border-border bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary transition"
          >
            Koneksi Agen
          </a>
          <a
            href="#tools"
            className="px-3 py-1 rounded-[4px] border border-border bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary transition"
          >
            Spesifikasi Tools
          </a>
          <a
            href="#playground"
            className="px-3 py-1 rounded-[4px] border border-border bg-surface hover:bg-surface-raised text-text-secondary hover:text-text-primary transition"
          >
            Uji Interaktif
          </a>
        </div>
      </div>

      <section id="arsitektur" className="space-y-5 scroll-mt-20">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            1. Ikhtisar Arsitektur Protokol
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">01. Standard Protocol</span>
            <h3 className="font-semibold text-sm text-text-primary">JSON-RPC 2.0</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Kompatibel penuh dengan spesifikasi resmi Model Context Protocol melalui transportasi HTTP POST (`/api/mcp`) dan Stdio CLI.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">02. Neon Database</span>
            <h3 className="font-semibold text-text-primary text-sm">Serverless PostgreSQL</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Seluruh metadata skill, resep runtime, dan catatan kurasi tersimpan di Neon Serverless DB dengan Drizzle ORM pooled connection.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
            <span className="font-mono text-[11px] text-accent font-semibold uppercase">03. Edge Deployment</span>
            <h3 className="font-semibold text-text-primary text-sm">Vercel Global Edge</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Endpoint serverless terdistribusi global dengan waktu respons rendah untuk agen coding di seluruh dunia.
            </p>
          </div>
        </div>
      </section>

      <section id="akun" className="space-y-5 scroll-mt-20">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            2. Panduan Akun & Manajemen Akses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-accent" />
                <span>Akun Pengguna & Pengembang</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised text-text-secondary border border-border">
                Role: USER
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Disediakan untuk pengembang yang ingin mengeksplorasi katalog, menyalin resep instalasi, dan berinteraksi dengan AI Assistant.
            </p>
            <ul className="text-xs text-text-muted space-y-1.5 list-disc pl-4">
              <li>Masuk menggunakan <strong>Google OAuth (Neon Auth)</strong> dengan satu klik.</li>
              <li>Pendaftaran email & kata sandi mandiri via halaman masuk.</li>
              <li>Tersedia tombol <strong>Akses Cepat Mode Tamu</strong> tanpa perlu akun.</li>
            </ul>
            <div className="pt-2">
              <Link
                href="/login/"
                className="inline-flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
              >
                Menuju Halaman Masuk Pengguna &rarr;
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-status-success" />
                <span>Akun Kurator & Administrator</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/20">
                Role: SUPER_ADMIN
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Dikhususkan untuk tim pengelola platform untuk memverifikasi skill yang masuk, menyetujui ("ACC"), atau menolak submission.
            </p>
            <ul className="text-xs text-text-muted space-y-1.5 list-disc pl-4">
              <li>Akses panel kurasi terisolasi di <code>/admin/</code>.</li>
              <li>Otomatisasi persetujuan status <code>pending</code> ke <code>published</code>.</li>
              <li>Sinkronisasi repositori GitHub dan audit log sistem.</li>
            </ul>
            <div className="pt-2">
              <Link
                href="/admin/login/"
                className="inline-flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
              >
                Menuju Panel Administrator &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="koneksi" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            3. Panduan Menghubungkan Agen Coding
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
              Tambahkan definisi server berikut ke berkas konfigurasi MCP Google Antigravity Anda:
            </p>
            <pre className="p-4 rounded-lg bg-[#08090C] border border-border/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "skillagent": {
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
              Jalankan perintah berikut di direktori proyek Claude Code CLI Anda:
            </p>
            <pre className="p-4 rounded-lg bg-[#08090C] border border-border/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`claude mcp add skillagent npx -y tsx scripts/mcp-stdio.ts`}
            </pre>
          </div>

          <div className="rounded-xl bg-surface border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span>HTTP Remote Endpoint (JSON-RPC 2.0)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent">POST /api/mcp</span>
              </h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Kirimkan HTTP POST request dengan standar JSON-RPC 2.0 ke endpoint live produksi:
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
      "arguments": { "query": "frontend" }
    }
  }'`}
            </pre>
          </div>
        </div>
      </section>

      <section id="tools" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            4. Spesifikasi Tools MCP
          </h2>
        </div>

        <div className="rounded-xl bg-surface border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-surface-raised border-b border-border text-text-muted uppercase text-[11px] font-mono">
                <tr>
                  <th className="py-3 px-4">Nama Tool</th>
                  <th className="py-3 px-4">Deskripsi</th>
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

      <section id="playground" className="space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-bold tracking-tight text-text-primary">
            5. Uji Interaktif MCP Tools
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Gunakan konsol interaktif di bawah untuk menguji endpoint MCP server secara real-time langsung dari peramban Anda.
        </p>
        <McpPlayground />
      </section>
    </div>
  );
}
