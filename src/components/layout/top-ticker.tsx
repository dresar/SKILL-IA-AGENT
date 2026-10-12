"use client";

import React from "react";

interface TopTickerProps {
  onSearchTrigger?: () => void;
}

export function TopTicker({ onSearchTrigger }: TopTickerProps) {
  const handleKeyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSearchTrigger) {
      onSearchTrigger();
      return;
    }
    const searchInput = document.querySelector<HTMLInputElement>("input[data-search-input='true']");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] text-neutral-400 border-b border-neutral-900 select-none text-[11px] font-mono tracking-wider overflow-x-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-200">INDEX LIVE</span>
          <span className="text-neutral-600">·</span>
          <span>V1.7.0</span>
          <span className="text-neutral-600">·</span>
          <span>OCT 12 2026</span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-neutral-400">
          <div>
            <span className="font-bold text-neutral-200">193+</span> SKILLS INDEXED
          </div>
          <div>
            <span className="font-bold text-neutral-200">196</span> MCP SERVERS
          </div>
          <div>
            <span className="font-bold text-neutral-200">9</span> PLATFORMS TRACKED
          </div>
        </div>

        <button
          type="button"
          onClick={handleKeyClick}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:text-white"
          aria-label="Open global search"
        >
          <span className="text-neutral-500">[</span>
          <kbd className="text-neutral-300">⌘K</kbd>
          <span className="text-neutral-500">]</span>
          <span>search</span>
        </button>
      </div>
    </div>
  );
}
