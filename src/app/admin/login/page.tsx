"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("eka.ckp16799@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const adminUser = loginAdmin(email.trim());
    if (!adminUser) {
      setLoading(false);
      setError("Email ini tidak punya role admin.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center">
      <div className="w-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-primary">
            <ArrowLeft className="h-4 w-4" />
            Publik
          </Link>
          <Logo size="sm" />
        </div>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Login Admin</h1>
          <p className="text-sm leading-relaxed text-text-secondary">
            Hanya akun dengan role Super Admin atau Curator yang dapat membuka panel admin.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-status-danger/30 bg-status-danger/10 px-3 py-2 text-sm text-status-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">Email admin</label>
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

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan sandi"
                className="h-11 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="w-full justify-center">
            Masuk Admin
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
