import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UploadCloud,
  FileCode,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { getAuditHistory } from "@/server/services/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminStudioPage() {
  const [skillsList, categories, auditLogs] = await Promise.all([
    getPublishedSkills({ limit: 100 }),
    getAllCategories(),
    getAuditHistory(10)
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Curator Studio</h1>
          <p className="text-xs text-text-muted mt-1">
            Registry governance and operational audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/imports">
            <Button variant="primary" size="sm">
              <UploadCloud className="w-3.5 h-3.5" />
              Import Skill
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="outline" size="sm">
              Manage Skills
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-surface border border-border p-5 space-y-1">
          <p className="text-xs font-medium text-text-muted">Total Skills</p>
          <p className="text-2xl font-bold text-text-primary">{skillsList.length}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-5 space-y-1">
          <p className="text-xs font-medium text-text-muted">Categories</p>
          <p className="text-2xl font-bold text-text-primary">{categories.length}</p>
        </div>
        <div className="rounded-xl bg-surface border border-border p-5 space-y-1">
          <p className="text-xs font-medium text-text-muted">MCP Status</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
            <span className="text-sm font-semibold text-text-primary">Healthy</span>
          </div>
        </div>
        <div className="rounded-xl bg-surface border border-border p-5 space-y-1">
          <p className="text-xs font-medium text-text-muted">Neon Auth</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
            <span className="text-sm font-semibold text-text-primary">Connected</span>
          </div>
        </div>
      </div>

      <section className="space-y-4 rounded-xl bg-surface border border-border p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Audit Activity
          </h2>
          <span className="text-xs text-text-muted">{auditLogs.length} events</span>
        </div>

        {auditLogs.length > 0 ? (
          <div className="divide-y divide-border/60">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{log.action}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {log.targetType}
                    </Badge>
                  </div>
                  <p className="text-text-muted">
                    Actor: <span className="text-text-secondary">{log.actorSubject || "system"}</span>
                  </p>
                </div>
                <span className="text-text-muted shrink-0">
                  {formatDate(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted py-4 text-center">No recent audit logs.</p>
        )}
      </section>
    </div>
  );
}
