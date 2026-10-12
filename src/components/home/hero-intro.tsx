"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Sparkles,
  Terminal,
  Check,
  Copy,
  ShieldCheck,
  Search,
  Code2,
  Cpu,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  ChevronDown,
  Layers,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LlmActionDropdown } from "@/components/common/llm-action-dropdown";

const FAQS = [
  {
    question: "Apa itu AI Agent Skill?",
    answer: "AI Agent Skill adalah paket instruksi sistem terstandardisasi (berkas SKILL.md dan spesifikasi runtime) yang mengajarkan aturan teknis, standar kode, dan batasan arsitektur spesifik kepada coding agent seperti Google Antigravity, Claude Code, Cursor, OpenCode, dan Aider."
  },
  {
    question: "Bagaimana cara memasang skill ke dalam Claude Code atau Antigravity?",
    answer: "Cukup salin satu baris perintah CLI yang tersedia pada setiap skill. Untuk Google Antigravity jalankan 'npx skills add <repo> -s <slug>' dan untuk Claude Code jalankan 'claude skill add <repo>/<slug>'."
  },
  {
    question: "Mengapa registry ini menerapkan standar Zero Comments (Nokomen)?",
    answer: "Komentar kode yang berlebihan dan penjelasan klise menghabiskan token konteks LLM dan menimbulkan risiko halusinasi. Standar Nokomen memastikan kode bersih, self-documenting, dan efisien untuk agen otonom."
  },
  {
    question: "Apakah registry ini mendukung Model Context Protocol (MCP)?",
    answer: "Ya, seluruh katalog skill dan metadata tool dapat diakses secara native oleh agen manapun melalui MCP endpoint di /api/mcp via HTTP SSE maupun stdio."
  }
];

export function HeroIntro() {
  const [copiedCli, setCopiedCli] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const mainCliCommand = "npx skills add dresar/SKILL-IA-AGENT";

  const handleCopyCli = () => {
    navigator.clipboard.writeText(mainCliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="space-y-10 pt-2 pb-10 border-b border-border">
      <div className="space-y-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex flex-wrap items-center gap-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider bg-accent/15 text-accent border border-accent/25">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            MCP 1.6 PROTOCOL ACTIVE
          </div>
          <span className="text-xs text-text-muted">
            • Google Antigravity &amp; Claude Code Ready
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            • 100% SEO Verified
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.12]">
            The Open AI Agent <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400">
              Skill Registry
            </span>{" "}
            &amp; MCP Server
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl font-normal">
            Pusat kurasi instruksi sistem produksi dan skill terverifikasi untuk Google Antigravity, Claude Code CLI, Cursor, OpenCode, dan Aider. Dilengkapi kepatuhan teknis SEO, zero comments, dan instalasi instan 1-klik terminal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-raised font-mono text-xs text-text-primary">
            <Terminal className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="select-all">{mainCliCommand}</span>
            <button
              type="button"
              onClick={handleCopyCli}
              className="ml-1 p-1 hover:text-accent transition-colors"
              title="Salin perintah CLI"
            >
              {copiedCli ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-text-muted" />
              )}
            </button>
          </div>

          <LlmActionDropdown title="SkillAgent AI Registry" />

          <Link href="/dokumentasi/">
            <Button variant="secondary" size="sm" className="text-xs h-9">
              Dokumentasi MCP &amp; CLI
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>

          <Link href="/submit/">
            <Button variant="primary" size="sm" className="text-xs h-9 uppercase tracking-wider font-semibold">
              Submit a Skill
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
      >
        <div className="rounded-xl border border-border bg-surface/80 p-5 space-y-2.5 transition hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Technical SEO &amp; Auditing
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Corey Haines &amp; Claude SEO</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Terintegrasi dengan keahlian SEO Audit Pro dan Claude SEO untuk mengoptimalkan Core Web Vitals, JSON-LD Schema, hierarki H1-H4, dan ranking Google.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface/80 p-5 space-y-2.5 transition hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Standar Nol Komentar (Nokomen)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Zero AI Commentary Bloat</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Menegakkan arsitektur self-documenting yang bersih dari komentar template AI. Memangkas biaya token LLM hingga 65% dengan presisi runtime tinggi.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface/80 p-5 space-y-2.5 transition hover:border-neutral-400 dark:hover:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                Cross-Agent Interoperability
              </h3>
              <span className="text-[10px] font-mono text-violet-400">5 Ecosystem Runtimes</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Satu skill dapat dipasang langsung pada Google Antigravity, Claude Code CLI, Cursor Rules, OpenCode, dan Aider tanpa perubahan berkas manual.
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl border border-border bg-surface/50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Frequently Asked Questions (FAQ) &amp; Schema SEO
            </h3>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            Google Rich Results Ready
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {FAQS.map((faq, idx) => {
            const isExpanded = openFaq === idx;
            return (
              <div
                key={faq.question}
                className="rounded-lg border border-border/80 bg-background overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-3 text-left text-xs font-medium text-text-primary hover:text-accent transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 shrink-0 ${
                      isExpanded ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 pt-0 text-xs text-text-secondary leading-relaxed border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
