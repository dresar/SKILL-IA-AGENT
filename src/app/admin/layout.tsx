"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/login/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col md:flex-row rounded-2xl border border-border bg-surface/50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 p-5 sm:p-7 lg:p-9 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
