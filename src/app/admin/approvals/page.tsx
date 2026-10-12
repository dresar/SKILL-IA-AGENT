"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  Github,
  ExternalLink,
  ArrowLeft,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

interface SubmissionItem {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: string;
  skillType: string;
  authorDisplay: string;
  sourceUrl: string;
  verificationStatus: string;
  createdAt: string;
  command?: string;
  categoryName?: string;
}

export default function AdminApprovalsPage() {
  const { user, isAdmin } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const adminHeaders = () => ({
    "Content-Type": "application/json",
    "x-skill-uiai-role": user?.role || "",
    "x-skill-uiai-email": user?.email || ""
  });

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions/", { headers: adminHeaders() });
      const data = await res.json();
      if (data.ok && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const handleApprove = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "approve" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Skill "${skillName}" disetujui (ACC) dan diterbitkan.`);
        fetchSubmissions();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {}
  };

  const handleReject = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "reject" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Pengajuan "${skillName}" ditolak.`);
        fetchSubmissions();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const handleDelete = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "delete" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Pengajuan "${skillName}" dihapus permanen.`);
        fetchSubmissions();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const pendingList = submissions.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
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
              Antrean Persetujuan Skill (ACC)
            </h1>
            <Badge variant="accent" className="text-[10px]">
              {pendingList.length} Menunggu
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review dan berikan persetujuan kurator sebelum skill tampil di katalog publik.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubmissions}
          disabled={loading}
          className="text-xs border-slate-800 bg-slate-900 text-slate-300 h-9"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          <span>Segarkan</span>
        </Button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold p-1">×</button>
        </div>
      )}

      {pendingList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-200">
            Tidak Ada Pengajuan Menunggu ACC
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Semua pengajuan skill komunitas telah diproses.
          </p>
          <div className="pt-2">
            <Link href="/admin/">
              <Button variant="outline" size="sm" className="text-xs border-slate-800 text-slate-300">
                Buka Registry Grid
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingList.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-slate-100 block truncate">{sub.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">{sub.slug}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-amber-500/40 bg-amber-500/10 text-amber-300 shrink-0">
                    PENDING ACC
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {sub.summary || sub.description}
                </p>

                <div className="text-[11px] text-slate-400 font-mono space-y-1">
                  <p>Penulis: <span className="text-slate-200">{sub.authorDisplay}</span></p>
                  <p>Kategori: <span className="text-slate-200 uppercase">{sub.skillType}</span></p>
                </div>

                {sub.command && (
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 truncate">
                    {sub.command}
                  </div>
                )}

                {sub.sourceUrl && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                    <Github className="w-3.5 h-3.5 text-slate-500" />
                    <a
                      href={sub.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-indigo-400 truncate inline-flex items-center gap-1"
                    >
                      {sub.sourceUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(sub.id, sub.name)}
                  className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 h-8"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACC &amp; Terbitkan</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReject(sub.id, sub.name)}
                  className="text-xs border-red-900/60 bg-red-950/20 text-red-300 hover:bg-red-900/40 h-8 px-2.5"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  <span>Tolak</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(sub.id, sub.name)}
                  className="text-xs text-slate-500 hover:text-red-400 h-8 px-2"
                  title="Hapus permanen"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
