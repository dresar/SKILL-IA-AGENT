"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, User, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/skills?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/skills");
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
            placeholder="Search skills..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/skills">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Explore
          </Button>
        </Link>
        <Link href="/admin">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            Studio
          </Button>
        </Link>
        <Link href="/library">
          <Button variant="primary" size="sm">
            <User className="w-3.5 h-3.5" />
            Account
          </Button>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 md:hidden text-text-secondary hover:text-text-primary rounded-lg border border-border"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-4 md:hidden space-y-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-background border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </form>

          <nav className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised"
            >
              Home
            </Link>
            <Link
              href="/skills"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised"
            >
              Skills
            </Link>
            <Link
              href="/categories/frontend"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised"
            >
              Categories
            </Link>
            <Link
              href="/library"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised"
            >
              Library
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-accent hover:text-accent-strong rounded-lg hover:bg-surface-raised"
            >
              Admin Studio
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
