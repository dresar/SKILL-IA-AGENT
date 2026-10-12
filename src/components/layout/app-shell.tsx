import React from "react";
import { TopTicker } from "./top-ticker";
import { TopBar } from "./top-bar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col antialiased">
      <TopTicker />
      <TopBar />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
