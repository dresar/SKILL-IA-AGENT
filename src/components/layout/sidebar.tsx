"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Folder, Github, Layers, LogOut, ShieldCheck, Terminal } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNav: NavItem[] = [
  { label: "Katalog", href: "/", icon: Compass },
  { label: "Skill", href: "/skills", icon: Layers },
  { label: "Library", href: "/library", icon: Folder },
  { label: "MCP", href: "/#mcp-tools", icon: Terminal }
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 select-none flex-col justify-between border-r border-border bg-surface/60 px-4 py-6 md:flex">
      <div className="space-y-7">
        <div className="px-2">
          <Logo size="md" />
        </div>

        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-surface-raised text-text-primary"
                    : "text-text-secondary hover:bg-surface-raised/70 hover:text-text-primary"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-text-muted")} />
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-surface-raised text-text-primary"
                  : "text-text-secondary hover:bg-surface-raised/70 hover:text-text-primary"
              )}
            >
              <ShieldCheck className={cn("h-4 w-4", pathname.startsWith("/admin") ? "text-accent" : "text-text-muted")} />
              Admin
            </Link>
          )}
        </nav>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        {isAuthenticated && user ? (
          <div className="space-y-3 rounded-xl border border-border bg-background p-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-primary">{user.name}</p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex min-h-10 w-full items-center justify-between rounded-lg px-2 text-sm text-text-secondary transition-colors hover:bg-surface hover:text-status-danger"
            >
              Keluar
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary"
          >
            Masuk
          </Link>
        )}

        <a
          href="https://github.com/dresar/SKILL-IA-AGENT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-text-primary"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
      </div>
    </aside>
  );
}
