"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Layers,
  Bookmark,
  ShieldCheck,
  Terminal,
  ExternalLink,
  Github,
  LogOut,
  UserCheck,
  Lock
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const mainNav: NavItem[] = [
    { label: "Katalog", href: "/", icon: Compass },
    { label: "MCP Tools", href: "/#mcp-tools", icon: Terminal }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface/50 h-screen sticky top-0 px-4 py-6 justify-between select-none">
      <div className="space-y-6">
        <div className="px-2">
          <Logo size="md" />
        </div>

        <nav className="space-y-1">
          <p className="px-2.5 mb-2 text-[10px] font-semibold tracking-wider text-text-muted uppercase font-mono">
            Platform
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-surface-raised text-accent font-semibold border border-border"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-raised/60"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-text-muted")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="space-y-1 pt-2 border-t border-border/60">
          <p className="px-2.5 mb-2 text-[10px] font-semibold tracking-wider text-text-muted uppercase font-mono">
            Curator Studio
          </p>
          <Link
            href="/admin"
            className={cn(
              "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors",
              pathname.startsWith("/admin")
                ? "bg-surface-raised text-accent font-semibold border border-border"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-raised/60"
            )}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className={cn("w-4 h-4", pathname.startsWith("/admin") ? "text-accent" : "text-text-muted")} />
              <span>Admin Panel</span>
            </div>
            {isAdmin ? (
              <Badge variant="accent" className="text-[9px]">Akses</Badge>
            ) : (
              <Lock className="w-3 h-3 text-text-muted" />
            )}
          </Link>
        </nav>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        {isAuthenticated && user ? (
          <div className="p-2.5 rounded-xl bg-surface-raised border border-border space-y-2">
            <div className="flex items-center gap-2.5">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                alt={user.name}
                className="w-7 h-7 rounded-full shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-border/60">
              <Badge variant={isAdmin ? "accent" : "outline"} className="text-[9px]">
                {user.role}
              </Badge>
              <button
                onClick={logout}
                className="text-[10px] text-text-muted hover:text-status-danger transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-between p-2.5 rounded-xl bg-surface hover:bg-surface-raised border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-accent" />
              <span className="font-medium">Masuk Kurator</span>
            </div>
            <ExternalLink className="w-3 h-3 text-text-muted" />
          </Link>
        )}

        <div className="px-3 py-2 rounded-lg bg-surface border border-border">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-secondary">MCP Server</span>
            <span className="inline-block w-2 h-2 rounded-full bg-status-success animate-pulse" />
          </div>
          <p className="text-[10px] text-text-muted mt-0.5 truncate font-mono">/api/mcp</p>
        </div>

        <a
          href="https://github.com/dresar/SKILL-IA-AGENT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised transition-colors"
        >
          <span className="flex items-center gap-2">
            <Github className="w-3.5 h-3.5" />
            GitHub Repo
          </span>
          <ExternalLink className="w-3 h-3 text-text-muted" />
        </a>
      </div>
    </aside>
  );
}
