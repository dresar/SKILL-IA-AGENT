"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  FileText,
  ExternalLink,
  Bot,
  Sparkles,
  Search,
  Link as LinkIcon,
  Box,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LlmActionDropdownProps {
  title?: string;
  markdownContent?: string;
  sourceUrl?: string;
  className?: string;
}

export function LlmActionDropdown({
  title = "SkillAgent Registry",
  markdownContent,
  sourceUrl,
  className
}: LlmActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFullMarkdown = () => {
    if (markdownContent) {
      return markdownContent;
    }
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://skills-smoky.vercel.app";
    return `# ${title}\n\nSkill Registry for AI Coding Agents (Google Antigravity, Claude Code, Cursor, OpenCode, Aider).\nCanonical URL: ${siteUrl}\nMCP Server: ${siteUrl}/api/mcp\nDocumentation: ${siteUrl}/dokumentasi/\n`;
  };

  const handleCopyPage = () => {
    const md = getFullMarkdown();
    navigator.clipboard.writeText(md);
    setCopiedAction("copy_page");
    setTimeout(() => setCopiedAction(null), 2000);
    setIsOpen(false);
  };

  const handleViewMarkdown = () => {
    setIsOpen(false);
    window.open("/llms.txt", "_blank", "noopener,noreferrer");
  };

  const handleOpenChatGPT = () => {
    setIsOpen(false);
    const md = getFullMarkdown();
    const prompt = `Analyze this AI coding agent skill spec and provide implementation advice:\n\n${md.slice(0, 3000)}`;
    window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
  };

  const handleOpenClaude = () => {
    setIsOpen(false);
    const md = getFullMarkdown();
    const prompt = `Please review this agent skill specification and verify its system instructions:\n\n${md.slice(0, 3000)}`;
    window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, "_blank", "noopener,noreferrer");
  };

  const handleOpenPerplexity = () => {
    setIsOpen(false);
    const query = `What is ${title} AI agent skill and how to install it in Claude Code and Antigravity?`;
    window.open(`https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyMcp = () => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://skills-smoky.vercel.app";
    const mcpUrl = `${siteUrl}/api/mcp`;
    navigator.clipboard.writeText(mcpUrl);
    setCopiedAction("copy_mcp");
    setTimeout(() => setCopiedAction(null), 2000);
    setIsOpen(false);
  };

  const handleConnectCursor = () => {
    setIsOpen(false);
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://skills-smoky.vercel.app";
    const cursorConfig = JSON.stringify(
      {
        mcpServers: {
          skillagent: {
            url: `${siteUrl}/api/mcp`
          }
        }
      },
      null,
      2
    );
    navigator.clipboard.writeText(cursorConfig);
    setCopiedAction("copy_cursor");
    setTimeout(() => setCopiedAction(null), 2000);
  };

  const handleConnectVsCode = () => {
    setIsOpen(false);
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://skills-smoky.vercel.app";
    const vscodeConfig = JSON.stringify(
      {
        "mcp.servers": {
          skillagent: {
            type: "sse",
            url: `${siteUrl}/api/mcp`
          }
        }
      },
      null,
      2
    );
    navigator.clipboard.writeText(vscodeConfig);
    setCopiedAction("copy_vscode");
    setTimeout(() => setCopiedAction(null), 2000);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left select-none", className)}>
      <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-[#12151f] shadow-sm">
        <button
          type="button"
          onClick={handleCopyPage}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors"
        >
          {copiedAction === "copy_page" ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy page</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="border-l border-neutral-300 dark:border-neutral-800 px-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors rounded-r-lg"
          aria-label="Toggle LLM actions menu"
        >
          <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-neutral-200 dark:border-[#222738] bg-white dark:bg-[#0f1118] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={handleCopyPage}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Copy className="w-4 h-4 mt-0.5 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Copy page</span>
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Copy page as Markdown for LLMs
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleViewMarkdown}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <FileText className="w-4 h-4 mt-0.5 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>View as Markdown</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  View this page as plain text
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleOpenChatGPT}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Bot className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Open in ChatGPT</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Ask questions about this page
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleOpenClaude}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Sparkles className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Open in Claude</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Ask questions about this page
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleOpenPerplexity}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Search className="w-4 h-4 mt-0.5 text-cyan-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Open in Perplexity</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Ask questions about this page
                </p>
              </div>
            </button>

            <div className="my-1 border-t border-neutral-200 dark:border-[#222738]" />

            <button
              type="button"
              onClick={handleCopyMcp}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <LinkIcon className="w-4 h-4 mt-0.5 text-indigo-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Copy MCP Server</span>
                  {copiedAction === "copy_mcp" && <Check className="w-3 h-3 text-emerald-400" />}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Copy MCP Server URL to clipboard
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleConnectCursor}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Box className="w-4 h-4 mt-0.5 text-violet-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Connect to Cursor</span>
                  {copiedAction === "copy_cursor" ? <Check className="w-3 h-3 text-emerald-400" /> : <ExternalLink className="w-3 h-3 text-neutral-400" />}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Install MCP Server on Cursor
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleConnectVsCode}
              className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 dark:hover:bg-[#181c28] transition-colors group"
            >
              <Code2 className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
                  <span>Connect to VS Code</span>
                  {copiedAction === "copy_vscode" ? <Check className="w-3 h-3 text-emerald-400" /> : <ExternalLink className="w-3 h-3 text-neutral-400" />}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                  Install MCP Server on VS Code
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
