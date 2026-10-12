"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-6 text-center">
        <h1 className="text-lg font-semibold text-text-primary">Akses Admin Ditolak</h1>
        <p className="mt-2 text-sm text-text-secondary">Halaman import memerlukan role Super Admin atau Curator.</p>
        <Link href="/admin/login" className="mt-4 inline-flex">
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
          message: "Skill imported successfully.",
          slug: data.skill?.slug
        });
        setUrl("");
      } else {
        setResult({
          ok: false,
          message: data.error || "Failed to import skill."
        });
      }
    } catch {
      setResult({
        ok: false,
        message: "Network or server error during import."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Curator Studio
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Import Skill
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Provide an upstream GitHub repository URL to ingest metadata and recipes.
        </p>
      </div>

      <div className="rounded-xl bg-surface border border-border p-6 space-y-5">
        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              GitHub URL
            </label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo or /tree/main/skills/name"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="md" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Import
              </>
            )}
          </Button>
        </form>

        {result && (
          <div
            className={`p-4 rounded-lg border text-xs flex items-start gap-3 ${
              result.ok
                ? "bg-status-success/10 border-status-success/20 text-status-success"
                : "bg-status-danger/10 border-status-danger/20 text-status-danger"
            }`}
          >
            {result.ok ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">{result.message}</p>
              {result.slug && (
                <Link
                  href={`/skills/${result.slug}`}
                  className="underline font-medium hover:opacity-80 block"
                >
                  View Imported Skill: {result.slug}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
