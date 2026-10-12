"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("developer@community.org");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginUser(email.trim());
    router.push(redirectTo);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center">
      <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" />
            Beranda
          </Link>
          <Logo size="sm" />
        </div>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Masuk Pengguna</h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Akun ini untuk menyimpan sesi eksplorasi katalog dan AI Assistant. Akses admin memakai halaman terpisah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
            Masuk
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-xs text-text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
