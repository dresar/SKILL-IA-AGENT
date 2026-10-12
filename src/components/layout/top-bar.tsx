"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Shield, LogOut, Github, Terminal } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";

export function TopBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Logo size="sm" />

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-xs">
              Katalog
            </Button>
          </Link>
          <a href="/#mcp">
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-text-secondary hover:text-text-primary">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>MCP Tools</span>
            </Button>
          </a>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-text-secondary hover:text-text-primary">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span>Admin Panel</span>
            </Button>
          </Link>
          <a
            href="https://github.com/dresar/SKILL-IA-AGENT"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary px-3 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-raised border border-border">
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
            <Button variant="primary" size="sm" className="text-xs gap-1.5 font-semibold">
              <User className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Button>
          </Link>
        )}

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 md:hidden text-text-secondary hover:text-text-primary rounded-lg border border-border min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-4 md:hidden space-y-3 shadow-xl">
          <nav className="flex flex-col gap-1 text-xs">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised font-medium"
            >
              Katalog
            </Link>
            <a
              href="/#mcp"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised font-medium flex items-center gap-2"
            >
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>MCP Tools</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-accent hover:text-accent-strong rounded-lg hover:bg-surface-raised flex items-center justify-between font-medium"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </span>
              <Badge variant="accent" className="text-[9px]">Admin</Badge>
            </Link>
            <a
              href="https://github.com/dresar/SKILL-IA-AGENT"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-raised flex items-center gap-2 font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-left px-3 py-2 text-status-danger rounded-lg hover:bg-surface-raised flex items-center gap-2 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
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
