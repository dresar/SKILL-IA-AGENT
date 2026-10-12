"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, Shield, LogOut, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

export function TopBar() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Logo size="sm" />
        </div>

        <form onSubmit={handleSearch} className="relative hidden sm:block w-72 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari skill agent..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
            Katalog
          </Button>
        </Link>

        {isAdmin && (
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs border-accent/40 text-accent gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Studio
            </Button>
          </Link>
        )}

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-raised border border-border">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                alt={user.name}
                className="w-4 h-4 rounded-full"
              />
              <span className="text-xs font-medium text-text-primary max-w-[120px] truncate">
                {user.name}
              </span>
              <Badge variant={isAdmin ? "accent" : "outline"} className="text-[9px]">
                {user.role}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              title="Keluar"
              className="text-text-muted hover:text-text-primary px-2"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button variant="primary" size="sm" className="text-xs gap-1.5">
              <User className="w-3.5 h-3.5" />
              Masuk
            </Button>
          </Link>
        )}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 md:hidden text-text-secondary hover:text-text-primary rounded-lg border border-border"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-4 md:hidden space-y-4 shadow-xl">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari skill agent..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </form>

          <nav className="flex flex-col gap-1 text-xs">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised"
            >
              Katalog
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-accent hover:text-accent-strong rounded-lg hover:bg-surface-raised flex items-center justify-between"
              >
                <span>Curator Studio</span>
                <Badge variant="accent" className="text-[9px]">Admin</Badge>
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-left px-3 py-2 text-status-danger rounded-lg hover:bg-surface-raised flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 text-accent font-semibold rounded-lg hover:bg-surface-raised"
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
