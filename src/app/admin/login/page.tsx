"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginAdmin(email.trim(), password);
    if (!res.success) {
      setLoading(false);
      setError(res.error || "Email atau kata sandi admin tidak valid.");
      return;
    }

    setLoading(false);
    router.push("/admin/");
  };

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-md items-center justify-center py-8">
      <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft className="h-3.5 w-3.5" />
            Beranda
          </Link>
          <Logo size="sm" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-accent/15 text-accent">
            <Shield className="w-3 h-3" />
            Curator & System Admin
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            Login Administrator
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Akses khusus kurator untuk sinkronisasi repositori GitHub, manajemen skill, dan audit log.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-status-error/30 bg-status-error/10 text-status-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">Email Administrator</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@domain.com"
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
            {loading ? "Memverifikasi..." : "Masuk ke Panel Admin"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <Link href="/login/" className="text-accent hover:underline">
            &larr; Masuk sebagai Pengguna Biasa
          </Link>
          <span className="text-[11px] text-text-muted">
            SkillAgent Registry
          </span>
        </div>
      </div>
    </div>
  );
}
