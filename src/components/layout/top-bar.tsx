"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

const navLinks = [
  { href: "/", label: "Skills" },
  { href: "/dokumentasi/", label: "Dokumentasi" },
  { href: "/ai/", label: "AI Assistant" },
  { href: "/submit/", label: "Submit Skill" }
];

export function TopBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo size="md" />

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary transition-colors py-1 flex items-center gap-1.5"
                >
                  {link.label === "AI Assistant" && (
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  )}
                  <span>{link.label}</span>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/"
                  className="text-text-secondary hover:text-text-primary transition-colors py-1 font-semibold text-accent"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/submit/"
              className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-semibold tracking-wider uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 active:scale-[0.98]"
            >
              Submit a Skill
            </Link>

            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[120px] truncate text-xs font-mono text-text-secondary lg:inline">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Logout"
                  className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-border text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login/"
                className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-[4px] border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-border text-text-secondary hover:bg-surface-raised hover:text-text-primary lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden space-y-2">
          <nav className="flex flex-col gap-1 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-text-secondary hover:bg-surface-raised hover:text-text-primary transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                {link.label === "AI Assistant" && (
                  <Sparkles className="h-4 w-4 text-accent" />
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/"
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-accent font-semibold hover:bg-surface-raised transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/submit/"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs uppercase tracking-wider"
            >
              Submit a Skill
            </Link>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="mt-1 rounded px-3 py-2 text-left text-status-danger hover:bg-surface-raised"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login/"
                onClick={() => setMobileOpen(false)}
                className="mt-1 rounded px-3 py-2 text-text-primary hover:bg-surface-raised"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
