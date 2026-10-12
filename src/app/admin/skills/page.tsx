import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
import { getPublishedSkills } from "@/server/services/skills";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminSkillsPage() {
  const skillsList = await getPublishedSkills({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Curator Studio
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Registry Records
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar seluruh skill tervalidasi yang aktif di katalog publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/?tab=approvals">
            <Button variant="outline" size="sm" className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800">
              Antrean ACC
            </Button>
          </Link>
          <Link href="/admin/imports/">
            <Button variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Import Skill
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="px-4 py-3">Nama Skill</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Penulis</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verifikasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {skillsList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/80 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-slate-200">
                    {s.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    {s.slug}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    {s.authorDisplay}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={s.status === "published" ? "success" : "default"} className="text-[10px]">
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={s.verificationStatus === "verified" ? "accent" : "outline"} className="text-[10px]">
                      {s.verificationStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <Link
                      href={`/skills/${s.slug}/`}
                      className="text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono text-xs"
                    >
                      Buka
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
