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
  CheckSquare
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const currentTab = searchParams.get("tab") || "dashboard";

  const isItemActive = (href: string, tabKey?: string) => {
    if (tabKey) {
      return pathname === "/admin" && currentTab === tabKey;
    }
    const normPath = (pathname || "").replace(/\/$/, "");
    const normHref = href.replace(/\/$/, "");
    if (normHref === "/admin") {
      return normPath === "/admin" && currentTab === "dashboard";
    }
    return normPath === normHref;
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/", icon: Activity, tabKey: "dashboard" },
    {
      label: "Persetujuan Skill",
      href: "/admin/?tab=approvals",
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : null,
      tabKey: "approvals"
    },
    { label: "Registry Skills", href: "/admin/skills/", icon: Layers },
    { label: "Import GitHub", href: "/admin/imports/", icon: UploadCloud },
    { label: "Dokumentasi MCP", href: "/dokumentasi/", icon: FileCode },
    { label: "AI Assistant", href: "/ai/", icon: Sparkles }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between p-4 min-h-auto md:min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-4">
        <div className="px-2">
          <span className="text-xs font-semibold text-slate-300">
            Menu
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href, item.tabKey);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-slate-900 text-white font-semibold border border-slate-800 shadow-sm"
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
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

      <div className="space-y-3 pt-4 border-t border-slate-800/80 mt-4 md:mt-0">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          <span>Portal Publik</span>
        </Link>

        {user && (
          <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-3 space-y-1">
            <p className="truncate text-xs font-medium text-slate-200">{user.name}</p>
            <p className="truncate text-[11px] text-slate-500 font-mono">{user.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
