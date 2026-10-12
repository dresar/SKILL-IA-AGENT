"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Activity,
  Layers,
  UploadCloud,
  FileCode,
  Sparkles,
  ArrowLeft,
  CheckSquare,
  ShieldCheck,
  Cpu,
  Wand2,
  FolderGit2,
  Clock
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tabKey?: string;
  badge?: number | null;
}

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const currentTab = searchParams.get("tab") || "dashboard";

  const isItemActive = (href: string) => {
    const normPath = (pathname || "").replace(/\/$/, "");
    const normHref = href.replace(/\/$/, "");
    if (normHref === "/admin") {
      return normPath === "/admin";
    }
    return normPath.startsWith(normHref);
  };

  const navGroups: Array<{ group: string; items: NavItem[] }> = [
    {
      group: "CORE OPERATIONS",
      items: [
        { label: "Registry Skills (Grid)", href: "/admin/", icon: Layers },
        {
          label: "Persetujuan Skill (ACC)",
          href: "/admin/approvals/",
          icon: CheckSquare,
          badge: pendingCount > 0 ? pendingCount : null
        }
      ]
    },
    {
      group: "AI & REPOSITORY",
      items: [
        { label: "AI Skill Analyzer", href: "/admin/analyzer/", icon: Sparkles },
        { label: "Import GitHub Ingestion", href: "/admin/imports/", icon: UploadCloud },
        { label: "Sinkronisasi GitHub", href: "/admin/sync/", icon: FolderGit2 }
      ]
    },
    {
      group: "SYSTEM & AUDIT",
      items: [
        { label: "Log Audit Operasional", href: "/admin/audit/", icon: Clock },
        { label: "Dokumentasi & MCP", href: "/dokumentasi/", icon: FileCode }
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between p-4 h-full overflow-y-auto select-none">
      <div className="space-y-6">
        <div className="px-2 pt-1 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
            Admin Menu
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            v2.4
          </span>
        </div>

        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1.5">
            <div className="px-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {group.group}
              </span>
            </div>

            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      active
                        ? "bg-slate-900 text-white font-semibold border border-slate-700/80 shadow-inner"
                        : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-400" : "text-slate-500")} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800/80 mt-6 md:mt-0">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          <span>Kembali ke Katalog Publik</span>
        </Link>

        {user && (
          <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-semibold text-slate-200">{user.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user.role}
              </span>
            </div>
            <p className="truncate text-[11px] text-slate-500 font-mono">{user.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
