"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Search, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/providers/auth-provider";

const navLinks = [
  { href: "/", label: "Skills" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/ai", label: "AI Assistant" },
  { href: "/submit", label: "Submit Skill" }
];

export function TopBar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>("input[data-search-input='true']");
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
    setMobileOpen(false);
  };

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
                  href="/admin"
                  className="text-text-secondary hover:text-text-primary transition-colors py-1 font-semibold text-accent"
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden md:block w-60 lg:w-68">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                data-search-input="true"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills..."
                className="h-9 w-full rounded-[4px] border border-border bg-background pl-8 pr-9 text-xs text-text-primary placeholder:text-text-muted outline-none transition focus:border-neutral-900 dark:focus:border-neutral-200 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-200"
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                ⌘K
              </span>
            </form>

            <Link
              href="/submit"
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
                href="/login"
                className="hidden sm:inline-flex items-center justify-center h-9 px-3 rounded-[4px] border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
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
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="h-10 w-full rounded-[4px] border border-border bg-background pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
            />
          </form>

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
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded px-3 py-2 text-accent font-semibold hover:bg-surface-raised transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <Link
              href="/submit"
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
                href="/login"
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
