"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Sparkles,
  ArrowRight,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Rekomendasikan skill terbaik untuk desain UI/UX minimalis",
  "Bagaimana cara menginstalasi skill nokomen di Google Antigravity?",
  "Jelaskan cara menghubungkan MCP server ke Claude Code CLI",
  "Tulis draf SKILL.md untuk aturan refactoring kode ketat"
];

function FormattedContent({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const rawHref = match[2];
    const href = rawHref.endsWith("/") || rawHref.includes("?") || rawHref.includes("#") ? rawHref : `${rawHref}/`;
    parts.push(
      <Link
        key={match.index}
        href={href}
        className="text-accent font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        {label}
      </Link>
    );
    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}

function AiAssistantContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");

  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Halo! Saya adalah SkillAgent Assistant. Tanyakan rekomendasi skill dari katalog, aturan SKILL.md, instruksi coding agent, atau integrasi MCP server."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialSentRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSend = async (contentToSend?: string) => {
    const text = (contentToSend || input).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": user?.email || ""
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.content }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `Kendala: ${data.error || "Gagal mendapatkan tanggapan dari model."}`
          }
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Terjadi kesalahan jaringan saat menghubungi server AI."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryParam && !initialSentRef.current) {
      initialSentRef.current = true;
      handleSend(queryParam);
    }
  }, [queryParam]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-2 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Katalog Skill
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              AI Agent Assistant
            </h1>
            <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold">
              Aktif
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          {isAuthenticated && user ? (
            <span className="text-text-primary font-semibold truncate max-w-[140px]">{user.name}</span>
          ) : (
            <Link href="/login/?redirect=/ai/" className="text-accent hover:underline flex items-center gap-1">
              <span>Masuk Akun</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
          <span className="text-border">|</span>
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span>Registry Connected</span>
        </div>
      </div>

      <div className="rounded-xl bg-surface border border-border flex flex-col h-[650px] overflow-hidden shadow-sm">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] sm:max-w-[75%] rounded-lg p-3.5 sm:p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-medium"
                      : "bg-surface-raised border border-border text-text-primary whitespace-pre-wrap font-sans"
                  }`}
                >
                  <div>
                    {isUser ? m.content : <FormattedContent text={m.content} />}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopy(idx, m.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 p-1 rounded text-text-muted hover:text-text-primary bg-surface/80 border border-border"
                      title="Salin teks"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-text-primary shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-border text-xs text-text-muted flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" />
                <span>Membaca database & mencocokkan skill...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-4 sm:px-6 py-2 border-t border-border bg-surface-raised/30 flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-neutral-400 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div className="p-3 sm:p-4 border-t border-border bg-surface-raised/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan rekomendasi skill atau panduan MCP..."
              disabled={loading}
              className="flex-1 h-11 rounded-lg border border-border bg-background px-4 text-xs sm:text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-neutral-900 dark:focus:border-neutral-100 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-11 px-5 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-40 flex items-center justify-center"
              aria-label="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AiAssistantPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-12 text-center text-xs text-text-muted font-mono">Memuat AI Assistant...</div>}>
      <AiAssistantContent />
    </Suspense>
  );
}
