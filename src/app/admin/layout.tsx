"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAuth } from "@/components/providers/auth-provider";
import { Logo } from "@/components/brand/logo";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  useEffect(() => {
    if (isLoginPage) return;
    fetch("/api/admin/submissions/", {
      headers: {
        "x-skill-uiai-role": user?.role || "",
        "x-skill-uiai-email": user?.email || ""
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.pendingCount === "number") {
          setPendingCount(data.pendingCount);
        }
      })
      .catch(() => {});
  }, [isLoginPage, user]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">{children}</div>;
  }

  return (
    <div className="h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-hidden">
      <header className="h-14 shrink-0 border-b border-slate-800/80 bg-slate-950 px-4 sm:px-6 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="h-4 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-tight text-slate-200">
              Admin Console
            </span>
          </div>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/15 border border-amber-500/30 text-amber-400 font-medium">
              {pendingCount} Menunggu ACC
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-slate-300 truncate max-w-[130px]">{user.name}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                {user.role}
              </span>
            </div>
          )}

          <Link
            href="/"
            className="h-8 px-2.5 rounded border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Buka portal publik"
          >
            <span>Publik</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="h-8 px-2.5 rounded border border-red-950/60 bg-red-950/20 hover:bg-red-900/30 text-red-300 transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Keluar dari sesi admin"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        <Suspense fallback={<aside className="w-full md:w-64 shrink-0 bg-slate-950 border-r border-slate-800" />}>
          <AdminSidebar pendingCount={pendingCount} />
        </Suspense>
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 bg-[#070b14]">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">Memuat...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
