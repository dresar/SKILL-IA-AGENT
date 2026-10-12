"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Layers,
  UploadCloud,
  FileCode,
  Sparkles,
  ArrowLeft,
  LogOut
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

const adminNav = [
  { label: "Dashboard", href: "/admin/", icon: Activity },
  { label: "Registry Skills", href: "/admin/skills/", icon: Layers },
  { label: "Import GitHub", href: "/admin/imports/", icon: UploadCloud },
  { label: "Dokumentasi MCP", href: "/dokumentasi/", icon: FileCode },
  { label: "AI Assistant", href: "/ai/", icon: Sparkles }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isItemActive = (href: string) => {
    const normPath = (pathname || "").replace(/\/$/, "");
    const normHref = href.replace(/\/$/, "");
    return normPath === normHref;
  };

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border bg-surface/70 flex flex-col justify-between p-4 min-h-auto md:min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-2 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-text-primary">Curator Panel</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent font-semibold">
              {user?.role || "ADMIN"}
            </span>
          </div>
          <p className="text-[11px] text-text-muted">
            Registry & automated ingestion
          </p>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  active
                    ? "bg-surface-raised text-accent font-bold border border-border"
                    : "text-text-secondary hover:bg-surface-raised/60 hover:text-text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-text-muted")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-border mt-4 md:mt-0">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-secondary hover:bg-surface-raised/60 hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-text-muted" />
          <span>Kembali ke Publik</span>
        </Link>

        {user && (
          <div className="rounded-lg bg-background border border-border p-3 space-y-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-text-primary">{user.name}</p>
              <p className="truncate text-[11px] text-text-muted font-mono">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-status-danger hover:bg-surface transition-colors"
            >
              <span>Keluar</span>
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
