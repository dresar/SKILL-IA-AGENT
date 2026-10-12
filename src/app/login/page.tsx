"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail, User, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, registerUser, loginWithGoogle, loginDemo } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signin") {
      const res = await loginUser(email.trim(), password);
      if (!res.success) {
        setLoading(false);
        setError(res.error || "Email atau kata sandi tidak cocok.");
        return;
      }
    } else {
      const res = await registerUser(email.trim(), password, name.trim());
      if (!res.success) {
        setLoading(false);
        setError(res.error || "Pendaftaran gagal. Pastikan kata sandi minimal 8 karakter.");
        return;
      }
    }

    setLoading(false);
    router.push(redirectTo);
  };

  const handleDemoLogin = () => {
    loginDemo("USER");
    router.push(redirectTo);
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
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">
            {mode === "signin" ? "Masuk ke SkillAgent" : "Daftar Akun SkillAgent"}
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Gunakan akun Anda untuk mengakses katalog skill, MCP server, dan AI Assistant.
          </p>
        </div>

        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-border bg-background hover:bg-surface-raised text-xs font-medium text-text-primary transition shadow-sm"
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
          Masuk dengan Google (Neon Auth)
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-surface px-3 text-[11px] text-text-muted">
            atau gunakan email
          </span>
        </div>

        <div className="flex rounded-lg border border-border p-1 bg-background text-xs">
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(null); }}
            className={`flex-1 py-1.5 font-medium rounded transition ${mode === "signin" ? "bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 py-1.5 font-medium rounded transition ${mode === "signup" ? "bg-surface text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"}`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-status-error/30 bg-status-error/10 text-status-error text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pengembang"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text-primary outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
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
            {loading ? "Memproses..." : mode === "signin" ? "Masuk" : "Daftar Akun"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </form>

        <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Akses Cepat Mode Tamu
          </button>
          <Link href="/admin/login/" className="text-text-muted hover:text-text-secondary">
            Panel Administrator &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs text-text-muted">Memuat antarmuka masuk...</div>}>
      <LoginForm />
    </Suspense>
  );
}
