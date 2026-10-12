import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "SKILL UIAI — Open Source AI Agent Skill Directory",
  description: "Discover, inspect, and install verified AI agent skills with truthful previews and Model Context Protocol (MCP) server.",
  icons: {
    icon: "/brand/logo.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
