import React from "react";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      <TopBar />
      <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
