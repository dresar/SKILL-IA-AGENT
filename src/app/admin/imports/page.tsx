"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminImportsPage() {
  const { user, isAdmin } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; slug?: string } | null>(null);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-100">Akses Admin Ditolak</h1>
        <p className="mt-2 text-sm text-slate-400">Halaman import memerlukan role Super Admin atau Curator.</p>
        <Link href="/admin/login/" className="mt-4 inline-flex">
          <Button variant="primary" size="sm">Login Admin</Button>
        </Link>
      </div>
    );
  }

  const adminHeaders = {
    "Content-Type": "application/json",
    "x-skill-uiai-role": user?.role || "",
    "x-skill-uiai-email": user?.email || ""
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/import/", {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({
          ok: true,
          message: "Skill berhasil diimpor ke sistem.",
          slug: data.skill?.slug
        });
        setUrl("");
      } else {
        setResult({
          ok: false,
          message: data.error || "Gagal mengimpor skill."
        });
      }
    } catch {
      setResult({
        ok: false,
        message: "Kesalahan jaringan saat mengimpor skill."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Curator Studio
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">
          Import Ingestion
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Masukkan URL repositori GitHub untuk mengunduh metadata dan instruksi runtime secara otomatis.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">
              GitHub URL Repositori / SKILL.md
            </label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo atau /tree/main/skills/name"
              required
              className="bg-slate-950 border-slate-800 text-slate-100"
            />
          </div>

          <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Mulai Ingestion
              </>
            )}
          </Button>
        </form>

        {result && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              result.ok
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-red-500/10 border-red-500/25 text-red-400"
            }`}
          >
            {result.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{result.message}</p>
              {result.slug && (
                <Link
                  href={`/skills/${result.slug}`}
                  className="underline font-medium hover:opacity-80 block text-indigo-400 font-mono"
                >
                  Lihat Skill: {result.slug}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
