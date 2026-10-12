"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Github,
  Loader2,
  Sparkles,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AGENT_PLATFORMS = [
  { id: "antigravity", label: "Google Antigravity" },
  { id: "claude", label: "Claude Code CLI" },
  { id: "cursor", label: "Cursor Rules" },
  { id: "opencode", label: "OpenCode" },
  { id: "aider", label: "Aider AI" }
];

interface UploadedImageItem {
  id: string;
  url: string;
  name: string;
}

export default function SubmitSkillPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("frontend");
  const [summary, setSummary] = useState("");
  const [skillMdContent, setSkillMdContent] = useState("");

  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState("");

  const [selectedTargets, setSelectedTargets] = useState<string[]>([
    "antigravity",
    "claude"
  ]);

  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; jobId?: string } | null>(null);

  const toggleTarget = (targetId: string) => {
    setSelectedTargets((prev) =>
      prev.includes(targetId)
        ? prev.filter((t) => t !== targetId)
        : [...prev, targetId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      setSkillMdContent(content);

      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (frontmatterMatch) {
        const fm = frontmatterMatch[1];
        const nameMatch = fm.match(/name:\s*["']?([^"'\n\r]+)["']?/i);
        const authorMatch = fm.match(/author:\s*["']?([^"'\n\r]+)["']?/i);
        const descMatch = fm.match(/description:\s*["']?([^"'\n\r]+)["']?/i);

        if (nameMatch && !name) setName(nameMatch[1].trim());
        if (authorMatch && !author) setAuthor(authorMatch[1].trim());
        if (descMatch && !summary) setSummary(descMatch[1].trim());
      } else {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && !name) {
          setName(titleMatch[1].trim());
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - uploadedImages.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target?.result as string;
        if (base64Url) {
          setUploadedImages((prev) => {
            if (prev.length >= 5) return prev;
            return [
              ...prev,
              {
                id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                url: base64Url,
                name: file.name
              }
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleAddManualImageUrl = () => {
    if (!manualImageUrl.trim()) return;
    if (uploadedImages.length >= 5) return;

    setUploadedImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        url: manualImageUrl.trim(),
        name: "URL Image"
      }
    ]);
    setManualImageUrl("");
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleApplyTemplate = () => {
    setUrl("https://github.com/dresar/SKILL-IA-AGENT/tree/main/skills/tailwind-precision");
    setName("Tailwind Precision Standard");
    setAuthor("Antislop Design System");
    setCategory("frontend");
    setSummary("Aturan micro-design Tailwind: tombol non-pill compact 34px, border subtil 1px, typography tajam tanpa generic AI slop.");
    setUploadedImages([
      {
        id: "img-tpl-1",
        url: "/previews/frontend-design.svg",
        name: "frontend-design.svg"
      }
    ]);
    setSelectedTargets(["antigravity", "claude", "cursor", "opencode", "aider"]);
    setSkillMdContent(`---
name: "Tailwind Precision Standard"
author: "Antislop Design System"
category: "frontend"
description: "Aturan micro-design Tailwind presisi tinggi."
---

# Tailwind Precision Standard

## Aturan Utama
1. Dilarang bentuk kapsul/pill penuh pada tombol interaktif (gunakan rounded-[5px] atau rounded-lg 6px).
2. Tinggi elemen input dan tombol kompak: 32px s/d 38px.
3. Tipografi tajam: text-xs (11-13px) dengan font antialiased.
4. Nol komentar di dalam kode file implementasi.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const primaryPreview = uploadedImages[0]?.url || "";
      const allPreviews = uploadedImages.map((i) => i.url);

      const res = await fetch("/api/skills/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          name: name.trim(),
          author: author.trim(),
          category,
          description: summary.trim(),
          skillMdContent: skillMdContent.trim(),
          previewImageUrl: primaryPreview,
          previewImages: allPreviews,
          targets: selectedTargets
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({
          ok: true,
          message: data.message || "Skill berhasil dikirim dan menunggu ACC kurator di Admin Panel.",
          jobId: data.jobId
        });
        setUrl("");
        setName("");
        setAuthor("");
        setSummary("");
        setSkillMdContent("");
        setUploadedImages([]);
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
    <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Katalog
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Submit a New Skill
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Daftarkan skill agen open-source Anda. Pengajuan akan ditinjau dan di-ACC oleh kurator di Admin Panel sebelum tayang.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleApplyTemplate}
            className="shrink-0 text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Gunakan Template Contoh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4 text-xs text-text-secondary space-y-2">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center justify-between w-full font-medium text-text-primary text-xs"
        >
          <span className="flex items-center gap-1.5 text-accent">
            <HelpCircle className="w-4 h-4" />
            Panduan & Tutorial Format SKILL.md
          </span>
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGuide && (
          <div className="pt-2 border-t border-border/80 space-y-2 text-text-muted leading-relaxed font-mono text-[11px]">
            <p className="text-text-secondary">
              File <code className="text-accent">SKILL.md</code> mendefinisikan instruksi sistem untuk AI coding agent:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>YAML Frontmatter</strong>: Wajib menyertakan <code className="text-accent">name</code>, <code className="text-accent">author</code>, dan <code className="text-accent">description</code> di bagian paling atas diapit tanda <code>---</code>.</li>
              <li><strong>Instruksi Operasional</strong>: Jelaskan aturan kode, larangan (misal zero comments / anti-slop), dan batasan arsitektur.</li>
              <li><strong>Target Platform</strong>: Pilih kompatibilitas agent yang didukung (Google Antigravity, Claude Code, Cursor, OpenCode, Aider).</li>
              <li><strong>Pratinjau Visual 1:1</strong>: Unggah hingga 5 gambar tampilan atau arsitektur rasio 1:1 untuk showcase detail skill.</li>
              <li><strong>Review Status</strong>: Setelah disubmit, skill akan otomatis masuk status <code className="text-amber-400">pending</code> untuk kurasi dan verifikasi syntax oleh tim kurator.</li>
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-surface border border-border p-6 sm:p-8 shadow-sm">
        {result && result.ok ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-text-primary">
                Pengajuan Berhasil Dikirim
              </h2>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                {result.message}
              </p>
            </div>

            {result.jobId && (
              <div className="p-3 rounded-lg bg-surface-raised border border-border inline-block text-xs font-mono text-text-secondary">
                Job Tracking ID: <span className="text-accent font-semibold">{result.jobId}</span>
              </div>
            )}

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="h-9 px-4 rounded-md border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Kirim Skill Lain
              </button>
              <Link
                href="/"
                className="h-9 px-4 rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold flex items-center justify-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {result && !result.ok && (
              <div className="p-3.5 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{result.message}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                Unggah Berkas SKILL.md Lokal (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Pilih Berkas SKILL.md
                </Button>
                <span className="text-[11px] text-text-muted">
                  Otomatis memuat nama, deskripsi, dan isi berkas ke formulir di bawah.
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="repo-url" className="block text-xs font-semibold text-text-secondary">
                URL Repository GitHub / Link SKILL.md <span className="text-status-danger">*</span>
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
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="skill-name" className="block text-xs font-semibold text-text-secondary">
                  Nama Skill
                </label>
                <input
                  id="skill-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Frontend Design"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="skill-author" className="block text-xs font-semibold text-text-secondary">
                  Penulis / Organisasi
                </label>
                <input
                  id="skill-author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: Anthropic"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-category" className="block text-xs font-semibold text-text-secondary">
                Kategori Utama
              </label>
              <select
                id="skill-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-primary outline-none focus:border-accent"
              >
                <option value="frontend">Design & UI/UX</option>
                <option value="code-quality">Code Quality & Zero Comments</option>
                <option value="database">Database & Serverless</option>
                <option value="workflows">Workflows & Multi-Agent</option>
                <option value="security">Security & Audit</option>
              </select>
            </div>

            <div className="space-y-3 pt-2 border-t border-border/80">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary">
                    Unggah Gambar Preview 1:1 (Maksimal 5)
                  </label>
                  <p className="text-[11px] text-text-muted">
                    Format rasio 1:1 kotak (.png, .jpg, .svg, .webp). Gambar pertama akan menjadi thumbnail utama.
                  </p>
                </div>
                <span className="text-xs font-mono text-accent">
                  {uploadedImages.length} / 5
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  multiple
                  onChange={handleImageFileSelect}
                  className="hidden"
                />

                {uploadedImages.length < 5 && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="aspect-square w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-accent bg-background hover:bg-surface-raised flex flex-col items-center justify-center gap-1.5 text-text-muted hover:text-text-primary transition-all p-2"
                  >
                    <Plus className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-medium text-center leading-tight">Pilih Gambar</span>
                  </button>
                )}

                {uploadedImages.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative aspect-square w-24 h-24 rounded-xl overflow-hidden border border-border bg-neutral-950 p-1 group shadow-sm"
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-950/80 text-white font-semibold">
                        {idx === 0 ? "Utama" : `#${idx + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition shadow"
                      title="Hapus gambar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {uploadedImages.length < 5 && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                    <input
                      type="text"
                      value={manualImageUrl}
                      onChange={(e) => setManualImageUrl(e.target.value)}
                      placeholder="Atau masukkan URL gambar langsung (https://...)"
                      className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddManualImageUrl}
                    className="h-9 text-xs shrink-0"
                  >
                    Tambah URL
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                Dukungan Platform Agent Coding
              </label>
              <div className="flex flex-wrap gap-2">
                {AGENT_PLATFORMS.map((platform) => {
                  const isChecked = selectedTargets.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => toggleTarget(platform.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isChecked
                          ? "border-accent bg-accent/15 text-accent"
                          : "border-border bg-background text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-summary" className="block text-xs font-semibold text-text-secondary">
                Ringkasan Singkat (1-2 Kalimat)
              </label>
              <input
                id="skill-summary"
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Ringkasan singkat tentang tujuan dan fungsi skill ini..."
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text-primary placeholder:text-text-muted outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="skill-body" className="block text-xs font-semibold text-text-secondary flex items-center justify-between">
                <span>Konten Lengkap SKILL.md</span>
                <span className="text-[11px] font-mono text-text-muted">Markdown</span>
              </label>
              <textarea
                id="skill-body"
                rows={8}
                value={skillMdContent}
                onChange={(e) => setSkillMdContent(e.target.value)}
                placeholder="Tempelkan seluruh konten markdown SKILL.md di sini..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-y leading-relaxed"
              />
            </div>

            <div className="rounded-lg bg-surface-raised border border-border/80 p-3 text-[11px] text-text-muted flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Kurasi Otomatis: Skill Anda akan diverifikasi sintaksnya dan disetujui (ACC) oleh kurator di Admin Panel sebelum masuk ke katalog publik.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
              <Link
                href="/"
                className="h-10 px-4 rounded-md border border-border text-xs font-medium text-text-secondary hover:text-text-primary flex items-center transition-colors"
              >
                Batal
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="min-h-10 px-6 text-xs uppercase tracking-wider font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <span>Ajukan Skill ke Kurator</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
