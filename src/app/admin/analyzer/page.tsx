"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiSkillAnalyzer, SkillAnalysisResult } from "@/components/admin/ai-skill-analyzer";
import { useRouter } from "next/navigation";

export default function AdminAnalyzerPage() {
  const router = useRouter();
  const [applied, setApplied] = useState<string | null>(null);

  const handleApply = (result: SkillAnalysisResult) => {
    setApplied(result.name);
    setTimeout(() => {
      router.push(`/admin/?action=create&name=${encodeURIComponent(result.name)}&slug=${encodeURIComponent(result.slug)}&cat=${encodeURIComponent(result.category)}&cmd=${encodeURIComponent(result.installCommand)}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-800 pb-4">
        <Link
          href="/admin/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Registry Grid
        </Link>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            AI Skill Analyzer
          </h1>
          <Badge variant="accent" className="text-[10px]">
            Deep Parsing
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Analisis berkas SKILL.md dari repositori GitHub untuk menghasilkan metadata, perintah CLI, dan ringkasan otomatis.
        </p>
      </div>

      {applied && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Analisis untuk &ldquo;{applied}&rdquo; berhasil! Mengalihkan ke formulir penambahan skill...</span>
        </div>
      )}

      <AiSkillAnalyzer onApply={handleApply} />
    </div>
  );
}
