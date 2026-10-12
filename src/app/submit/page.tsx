"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Github, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function SubmitSkillPage() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("frontend");
  const [description, setDescription] = useState("");
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; jobId?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/skills/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim(),
          author: author.trim(),
          category,
          description: description.trim(),
          command: command.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({
          ok: true,
          message: data.message || "Skill berhasil dikirim untuk verifikasi kurator.",
          jobId: data.jobId
        });
        setUrl("");
        setName("");
        setAuthor("");
        setDescription("");
        setCommand("");
      } else {
        setResult({
          ok: false,
          message: data.error || "Gagal mengirimkan skill."
        });
      }
    } catch {
      setResult({
        ok: false,
        message: "Terjadi kesalahan jaringan saat mengirim data."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Katalog
        </Link>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest text-accent uppercase font-semibold">
            KONTRIBUSI KOMUNITAS
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Submit a New Skill
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Daftarkan skill agen open-source Anda ke indeks resmi SKILL UIAI. Kurator kami akan memverifikasi berkas SKILL.md dan resep runtime.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-surface border border-border p-6 sm:p-8 shadow-sm">
        {result && result.ok ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-text-primary">
                Pengajuan Berhasil Diterima
              </h2>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                {result.message}
              </p>
            </div>

            {result.jobId && (
              <div className="p-3 rounded-lg bg-surface-raised border border-border inline-block text-xs font-mono text-text-secondary">
                Job ID: <span className="text-accent">{result.jobId}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="h-9 px-4 rounded-[4px] border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Kirim Skill Lain
              </button>
              <Link
                href="/"
                className="h-9 px-4 rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-wider flex items-center justify-center"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {result && !result.ok && (
              <div className="p-3.5 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{result.message}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="repo-url" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                GitHub Repository / SKILL.md URL <span className="text-status-danger">*</span>
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  id="repo-url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/tree/main/skills/your-skill"
                  className="h-10 w-full rounded-[4px] border border-border bg-background pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="skill-name" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                  Nama Skill
                </label>
                <input
                  id="skill-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Frontend Design"
                  className="h-10 w-full rounded-[4px] border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="skill-author" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                  Penulis / Organisasi
                </label>
                <input
                  id="skill-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Anthropic"
                  className="h-10 w-full rounded-[4px] border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-category" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                Kategori Utama
              </label>
              <select
                id="skill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-[4px] border border-border bg-background px-3 text-xs text-text-primary outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
              >
                <option value="frontend">Frontend & Design UI/UX</option>
                <option value="code-quality">Code Quality & Zero Comments</option>
                <option value="database">Database & Serverless</option>
                <option value="workflows">Workflows & Multi-Agent</option>
                <option value="security">Security & Audit</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-desc" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                Ringkasan Instruksi Skill
              </label>
              <textarea
                id="skill-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan secara ringkas aturan yang diajarkan pada coding agent..."
                className="w-full rounded-[4px] border border-border bg-background p-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200 resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-command" className="block text-xs font-mono uppercase font-semibold text-text-secondary">
                Perintah Instalasi (Opsional)
              </label>
              <input
                id="skill-command"
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="npx skills add owner/repo -s skill-name"
                className="h-10 w-full rounded-[4px] border border-border bg-background px-3 text-xs font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
              <Link
                href="/"
                className="h-10 px-4 rounded-[4px] border border-border text-xs font-medium text-text-secondary hover:text-text-primary flex items-center transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="h-10 px-6 rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Ajukan Skill</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
