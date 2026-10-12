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
  Github
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const pathname = usePathname();

  const mainNav: NavItem[] = [
    { label: "Home", href: "/", icon: Compass },
    { label: "Skills", href: "/skills", icon: Terminal },
    { label: "Categories", href: "/categories/frontend", icon: Layers },
    { label: "Library", href: "/library", icon: Bookmark }
  ];

  const adminNav: NavItem[] = [
    { label: "Admin Studio", href: "/admin", icon: ShieldCheck }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface/50 h-screen sticky top-0 px-4 py-6 justify-between select-none">
      <div className="space-y-6">
        <div className="px-2">
          <Logo size="md" />
        </div>

        <nav className="space-y-1">
          <p className="px-2.5 mb-2 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
            Platform
          </p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
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
          <p className="px-2.5 mb-2 text-[11px] font-semibold tracking-wider text-text-muted uppercase">
            Curator
          </p>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
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
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <div className="px-3 py-2 rounded-lg bg-surface border border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">MCP Server</span>
            <span className="inline-block w-2 h-2 rounded-full bg-status-success animate-pulse" />
          </div>
          <p className="text-[11px] text-text-muted mt-0.5 truncate">/api/mcp</p>
        </div>

        <a
          href="https://github.com/dresar/SKILL-IA-AGENT"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 text-xs text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised transition-colors"
        >
          <span className="flex items-center gap-2">
            <Github className="w-3.5 h-3.5" />
            Repository
          </span>
          <ExternalLink className="w-3 h-3 text-text-muted" />
        </a>
      </div>
    </aside>
  );
}
