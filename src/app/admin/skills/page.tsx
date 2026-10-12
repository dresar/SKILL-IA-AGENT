import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldCheck } from "lucide-react";
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
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Curator Studio
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Registry Records
          </h1>
        </div>

        <Link href="/admin/imports/">
          <Button variant="primary" size="sm">
            Import New Skill
          </Button>
        </Link>
      </div>

      <div className="rounded-xl bg-surface border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised/50 border-b border-border text-text-muted uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Skill Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Verification</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {skillsList.map((s) => (
                <tr key={s.id} className="hover:bg-surface-raised/30 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-text-primary">
                    {s.name}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-text-muted">
                    {s.slug}
                  </td>
                  <td className="px-4 py-3.5 text-text-secondary">
                    {s.authorDisplay}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={s.status === "published" ? "success" : "default"}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={s.verificationStatus === "verified" ? "accent" : "outline"}>
                      {s.verificationStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <Link
                      href={`/skills/${s.slug}/`}
                      className="text-accent hover:underline inline-flex items-center gap-1"
                    >
                      View
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
