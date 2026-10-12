"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  actorSubject: string;
  createdAt: string;
}

export default function AdminAuditPage() {
  const [logs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      action: "sync_github_repository",
      targetType: "system",
      actorSubject: "eka.ckp16799@gmail.com",
      createdAt: new Date().toISOString()
    },
    {
      id: "aud-2",
      action: "verify_neon_connection",
      targetType: "database",
      actorSubject: "system",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "aud-3",
      action: "publish_skill",
      targetType: "skill:superpowers-tdd",
      actorSubject: "admin@agent.io",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "aud-4",
      action: "update_skill_recipe",
      targetType: "skill:frontend-design",
      actorSubject: "eka.ckp16799@gmail.com",
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            Log Audit Operasional
          </h1>
          <Badge variant="outline" className="text-[10px] font-mono border-slate-700">
            Immutable Audit Trail
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Rekaman seluruh aktivitas administratif, kurasi persetujuan, dan perubahan status skill.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
        <div className="divide-y divide-slate-800">
          {logs.map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-bold text-slate-200 font-mono">{log.action}</span>
                  <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                    {log.targetType}
                  </Badge>
                </div>
                <p className="text-slate-500 text-[11px] font-mono">
                  Aktor: <span className="text-slate-400">{log.actorSubject}</span>
                </p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
