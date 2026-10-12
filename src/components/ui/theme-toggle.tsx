"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Toggle theme (currently ${theme})`}
      className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-border text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-neutral-300" />
      ) : (
        <Moon className="h-4 w-4 text-neutral-700" />
      )}
    </button>
  );
}
