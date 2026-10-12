"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, User, ArrowLeft, ArrowRight, Mail, Lock, Check } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_ACCOUNTS, DemoAccount, UserRole } from "@/lib/auth/types";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("eka.ckp16799@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedRole, setSelectedRole] = useState<UserRole>("SUPER_ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectDemo = (acc: DemoAccount) => {
    setEmail(acc.email);
    setPassword("••••••••••••");
    setSelectedRole(acc.role);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      login(email, selectedRole);
      if (selectedRole === "SUPER_ADMIN" || selectedRole === "CURATOR") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      setError("Autentikasi gagal.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    loginWithGoogle();
    router.push("/admin");
  };

  const roleIcons = {
    SUPER_ADMIN: Shield,
    CURATOR: Sparkles,
    USER: User
  };

  return (
    <div className="py-4 sm:py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
            SKILL UIAI AUTH
          </span>
        </div>

        <div className="text-center my-6 space-y-2">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <p className="text-xs text-text-muted">
            Pusat autentikasi kurator dan pengembang skill agent.
          </p>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            <span>Pilih Akun:</span>
            <span className="text-[10px] text-text-muted lowercase">klik untuk mengisi</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = selectedRole === acc.role;
              const IconComp = roleIcons[acc.role] || User;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-surface-raised border-accent text-text-primary shadow-sm ring-1 ring-accent/30"
                      : "bg-surface border-border text-text-secondary hover:border-border/80 hover:bg-surface-raised/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-accent text-accent-foreground" : "bg-surface-raised text-text-muted"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate text-text-primary">
                          {acc.name}
                        </span>
                        <Badge variant={isSelected ? "accent" : "outline"} className="text-[9px]">
                          {acc.badge}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-text-muted truncate mt-0.5">
                        {acc.email}
                      </p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 h-10 border-border bg-surface-raised hover:bg-surface-hover text-xs font-semibold"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk Google</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-surface px-3 text-[10px] uppercase font-mono text-text-muted absolute">
              atau sandi
            </span>
          </div>

          {error && (
            <div className="p-3 bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@agent.io"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border bg-surface-raised text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-10 mt-2 text-xs font-semibold gap-2 justify-center"
            >
              <span>Masuk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
