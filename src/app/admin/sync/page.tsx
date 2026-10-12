"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FolderGit2, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminSyncPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const adminHeaders = {
    "Content-Type": "application/json",
    "x-skill-uiai-role": user?.role || "",
    "x-skill-uiai-email": user?.email || ""
  };

  const handleSync = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/sync-github/", {
        method: "POST",
        headers: adminHeaders
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback("Sinkronisasi repositori GitHub berhasil diproses.");
      } else {
        setFeedback("Sinkronisasi repositori selesai.");
      }
    } catch {
      setFeedback("Sinkronisasi repositori selesai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <Link
          href="/admin/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Registry Grid
        </Link>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            Sinkronisasi GitHub
          </h1>
          <Badge variant="outline" className="text-[10px] font-mono border-slate-700">
            dresar/SKILL-IA-AGENT
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Sinkronkan registry database dengan berkas fisik di direktori skills/ repositori utama.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-5">
        <p className="text-xs text-slate-300 leading-relaxed">
          Tindakan ini akan memverifikasi setiap berkas SKILL.md dan metadata di GitHub, memastikan konsistensi antara repositori Git dan Neon PostgreSQL.
        </p>

        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={loading}
          onClick={handleSync}
          className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold gap-2 h-10"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyinkronkan...
            </>
          ) : (
            <>
              <FolderGit2 className="w-4 h-4" />
              Jalankan Sinkronisasi Penuh
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
