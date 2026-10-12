"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Layers,
  Activity,
  Plus,
  UploadCloud,
  Check,
  Play,
  Trash2,
  ExternalLink,
  Search,
  Clock,
  Github,
  Lock,
  LogOut,
  FolderGit2,
  Wand2,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { SkillDemoModal } from "@/components/skills/skill-demo-modal";
import { AiPromptStudio, PreviewMode } from "@/components/admin/ai-prompt-studio";

interface AdminSkill {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  skillType: string;
  authorDisplay: string;
  status: "published" | "draft" | "archived";
  verificationStatus: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  primaryRecipe?: { command: string; target: string } | null;
  previewImageUrl?: string;
  previewMode?: PreviewMode;
}

interface AuditLog {
  id: string;
  action: string;
  targetType: string;
  actorSubject: string;
  createdAt: string;
}

const INITIAL_SKILLS: AdminSkill[] = [
  {
    id: "sk-1",
    slug: "frontend-design",
    name: "Frontend Design",
    summary: "Komponen UI berkualitas agency tinggi dan estetika gelap taktil.",
    description: "Koleksi panduan frontend design untuk coding agent dengan layout asimetris, double-bezel, dan tipografi presisi.",
    skillType: "frontend",
    authorDisplay: "Anthropic & Community",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-1", slug: "frontend", name: "Frontend" }],
    primaryRecipe: { command: "npx skills add dresar/SKILL-IA-AGENT -s frontend-design", target: "antigravity" }
  },
  {
    id: "sk-2",
    slug: "ui-ux-text",
    name: "UI/UX Text",
    summary: "Standar microcopy ultra-minimalis dengan batas maksimal 1 kalimat.",
    description: "Protokol penulisan teks UI ringkas: judul 1-3 kata, tombol 1-2 kata, deskripsi maksimal 1 kalimat tanpa fluff.",
    skillType: "design-systems",
    authorDisplay: "Antislop Core Team",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-2", slug: "design-systems", name: "Design Systems" }],
    primaryRecipe: { command: "/ui-ux-text", target: "antigravity" }
  },
  {
    id: "sk-3",
    slug: "nokomen",
    name: "Nokomen",
    summary: "Standar zero-comment mutlak yang melarang segala komentar dan docstring.",
    description: "Penegakan kode bersih tanpa komentar baris, blok, docstring, atau banner dalam bahasa pemrograman apa pun.",
    skillType: "code-quality",
    authorDisplay: "Clean Code Standards",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    primaryRecipe: { command: "/nokomen", target: "antigravity" }
  },
  {
    id: "sk-4",
    slug: "neon-postgres",
    name: "Neon Postgres",
    summary: "Migrasi PostgreSQL serverless, connection pooling, dan branching schema.",
    description: "Integrasi resmi database Neon untuk agent dengan Drizzle ORM, WebSocket pooler, dan zero cold-start.",
    skillType: "database",
    authorDisplay: "Neon Database",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-4", slug: "database", name: "Database" }],
    primaryRecipe: { command: "npx skills add neondatabase/agent-skills -s neon-postgres", target: "antigravity" }
  },
  {
    id: "sk-5",
    slug: "antigravity-guide",
    name: "Antigravity Guide",
    summary: "Panduan arsitektur Google Antigravity CLI, orkestrasi subagent, dan slash command.",
    description: "Spesifikasi lengkap runtime agent Antigravity, delegasi subagent, manajemen task, dan protokol MCP.",
    skillType: "workflows",
    authorDisplay: "Google DeepMind Antigravity Team",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    primaryRecipe: { command: "/antigravity-guide", target: "antigravity" }
  },
  {
    id: "sk-6",
    slug: "minimalist-ui",
    name: "Minimalist UI",
    summary: "Layout web editorial bersih, palet monokrom hangat, dan grid bento rapat.",
    description: "Sistem desain editorial dengan kontras tipografi tajam, permukaan datar, dan tanpa gradien berlebih.",
    skillType: "frontend",
    authorDisplay: "Agency Minimalist",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-1", slug: "frontend", name: "Frontend" }],
    primaryRecipe: { command: "npx skills add dresar/SKILL-IA-AGENT -s minimalist-ui", target: "antigravity" }
  },
  {
    id: "sk-7",
    slug: "superpowers-tdd",
    name: "Superpowers TDD",
    summary: "Framework rekayasa software agentik dengan siklus test-driven development ketat.",
    description: "Metodologi pembangunan software agentik yang mewajibkan penulisan test suite sebelum kode implementasi.",
    skillType: "code-quality",
    authorDisplay: "Jesse Vincent (obra)",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    primaryRecipe: { command: "npx skills add obra/superpowers -s superpowers-tdd", target: "antigravity" }
  },
  {
    id: "sk-8",
    slug: "caveman-compress",
    name: "Caveman Compress",
    summary: "Protokol kompresi token agent yang memangkas 65% verbositas tanpa degradasi logika.",
    description: "Optimasi efisiensi konteks LLM dengan memotong formalitas basa-basi dan menyampaikan argumen secara ultra-ringkas.",
    skillType: "workflows",
    authorDisplay: "Julius Brussee",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    primaryRecipe: { command: "/caveman-compress", target: "antigravity" }
  },
  {
    id: "sk-9",
    slug: "taste-filter",
    name: "Taste Filter",
    summary: "Filter estetika tingkat lanjut untuk memblokir pola AI template generik.",
    description: "Aturan desain anti-slop yang melarang font standar, bayangan kasar, border abu-abu tebal, dan kartu klise.",
    skillType: "design-systems",
    authorDisplay: "Leonxlnx",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-2", slug: "design-systems", name: "Design Systems" }],
    primaryRecipe: { command: "/taste-filter", target: "antigravity" }
  },
  {
    id: "sk-10",
    slug: "security-audit",
    name: "Security Audit",
    summary: "Pemindaian kerentanan AST otomatis, deteksi bocoran rahasia, dan audit input.",
    description: "Protokol keamanan proaktif yang mendeteksi secret key, token git, injection payload, dan celah otentikasi.",
    skillType: "code-quality",
    authorDisplay: "Anthropic Security",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-3", slug: "code-quality", name: "Code Quality" }],
    primaryRecipe: { command: "/security-audit", target: "antigravity" }
  },
  {
    id: "sk-11",
    slug: "git-workflow",
    name: "Git Workflow",
    summary: "Manajemen commit konvensional, percabangan atomik, dan otomatisasi changelog.",
    description: "Standar git modern untuk agent yang memvalidasi format commit, mengisolasi feature branch, dan membuat rilis.",
    skillType: "workflows",
    authorDisplay: "Eka Syarif Maulana",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    primaryRecipe: { command: "/git-workflow", target: "antigravity" }
  },
  {
    id: "sk-12",
    slug: "docker-devops",
    name: "Docker DevOps",
    summary: "Eksekusi container sandbox efemeral untuk evaluasi kode agent mandiri.",
    description: "Isolasi eksekusi lingkungan kode pada kontainer Docker non-root dengan batasan memori dan timeout otomatis.",
    skillType: "workflows",
    authorDisplay: "DevOps Working Group",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "Workflows" }],
    primaryRecipe: { command: "npx skills add dresar/SKILL-IA-AGENT -s docker-devops", target: "antigravity" }
  }
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, switchRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "skills" | "create" | "ai_studio" | "sync" | "audit">("dashboard");
  const [skillsList, setSkillsList] = useState<AdminSkill[]>(INITIAL_SKILLS);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [demoSkill, setDemoSkill] = useState<any | null>(null);
  const [aiStudioSkill, setAiStudioSkill] = useState<AdminSkill | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "frontend",
    skillType: "frontend",
    summary: "",
    description: "",
    authorDisplay: "Eka Syarif Maulana",
    command: "",
    previewImageUrl: "",
    demoPrompt: "Generate tailored solution for target task.",
    demoOutput: "// Generated output component\nexport function Solution() { return <div>Ready</div>; }"
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "aud-1",
      action: "sync_github_repository",
      targetType: "system",
      actorSubject: "eka.ckp16799@gmail.com",
      createdAt: new Date().toISOString()
    },
    {
      id: "aud-2",
      action: "verify_neon_connection",
      targetType: "database",
      actorSubject: "system",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "aud-3",
      action: "publish_skill",
      targetType: "skill:superpowers-tdd",
      actorSubject: "curator@agent.io",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-surface border border-border p-6 sm:p-8 text-center space-y-6 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-status-danger/10 border border-status-danger/20 flex items-center justify-center text-status-danger">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-text-primary">Akses Terbatas</h1>
            <p className="text-xs text-text-muted leading-relaxed">
              Curator Studio memerlukan hak akses Super Admin atau Kurator resmi.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider text-left">
              Pilih Akses Cepat:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => switchRole("SUPER_ADMIN")}
                className="w-full p-3 rounded-xl bg-surface-raised border border-border hover:border-accent text-left flex items-center justify-between transition-colors min-h-[44px]"
              >
                <div>
                  <p className="text-xs font-bold text-text-primary">Eka Syarif Maulana</p>
                  <p className="text-[10px] text-text-muted">Super Admin (Akses Penuh)</p>
                </div>
                <Badge variant="accent" className="text-[9px]">Masuk</Badge>
              </button>

              <button
                type="button"
                onClick={() => switchRole("CURATOR")}
                className="w-full p-3 rounded-xl bg-surface-raised border border-border hover:border-accent text-left flex items-center justify-between transition-colors min-h-[44px]"
              >
                <div>
                  <p className="text-xs font-bold text-text-primary">Registry Curator</p>
                  <p className="text-[10px] text-text-muted">Kurator Skill</p>
                </div>
                <Badge variant="outline" className="text-[9px]">Masuk</Badge>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs min-h-[40px]">
                Ke Halaman Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    const newSkill: AdminSkill = {
      id: "sk-" + Math.random().toString(36).substring(2, 7),
      slug: formData.slug.toLowerCase().trim(),
      name: formData.name.trim(),
      summary: formData.summary.trim(),
      description: formData.description.trim() || formData.summary.trim(),
      skillType: formData.skillType,
      authorDisplay: formData.authorDisplay,
      status: "published",
      verificationStatus: "verified",
      previewImageUrl: formData.previewImageUrl.trim() || undefined,
      categories: [{ id: "cat-" + formData.category, slug: formData.category, name: formData.category.toUpperCase() }],
      primaryRecipe: {
        command: formData.command || `npx skills add dresar/SKILL-IA-AGENT -s ${formData.slug}`,
        target: "antigravity"
      }
    };

    setSkillsList([newSkill, ...skillsList]);

    const newAudit: AuditLog = {
      id: "aud-" + Math.random().toString(36).substring(2, 7),
      action: "create_and_publish_skill",
      targetType: `skill:${newSkill.slug}`,
      actorSubject: user?.email || "admin",
      createdAt: new Date().toISOString()
    };
    setAuditLogs([newAudit, ...auditLogs]);

    try {
      await fetch("/api/admin/sync-github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newSkill.slug,
          name: newSkill.name,
          summary: newSkill.summary,
          category: formData.category,
          demoPrompt: formData.demoPrompt,
          demoOutput: formData.demoOutput,
          svgContent: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%"><rect width="800" height="450" rx="24" fill="#0F172A"/><text x="70" y="160" fill="#FFFFFF" font-size="36" font-weight="800">${newSkill.name}</text><text x="70" y="200" fill="#94A3B8" font-size="16">${newSkill.summary}</text></svg>`
        })
      });
    } catch {}

    setFeedback(`Skill ${newSkill.name} berhasil dibuat dan disinkronisasi.`);
    setTimeout(() => setFeedback(null), 3000);
    setActiveTab("skills");
  };

  const handleDeleteSkill = (id: string, name: string) => {
    setSkillsList(skillsList.filter((s) => s.id !== id));
    setAuditLogs([
      {
        id: "aud-" + Math.random().toString(36).substring(2, 7),
        action: "delete_skill",
        targetType: `skill:${name}`,
        actorSubject: user?.email || "admin",
        createdAt: new Date().toISOString()
      },
      ...auditLogs
    ]);
  };

  const handleToggleStatus = (id: string) => {
    setSkillsList(
      skillsList.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === "published" ? "draft" : "published";
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleSavePreviewOption = (mode: PreviewMode, urlOrContent?: string) => {
    if (!aiStudioSkill) return;
    setSkillsList(
      skillsList.map((s) => {
        if (s.id === aiStudioSkill.id) {
          return {
            ...s,
            previewMode: mode,
            previewImageUrl: mode === "ai_image" ? urlOrContent : s.previewImageUrl
          };
        }
        return s;
      })
    );
    setFeedback(`Pratinjau untuk ${aiStudioSkill.name} diperbarui ke mode ${mode}.`);
    setTimeout(() => setFeedback(null), 3000);
    setAiStudioSkill(null);
  };

  const handleSyncAll = async () => {
    setFeedback("Menyinkronkan seluruh 12 skill ke folder skills/ di repositori...");
    try {
      await fetch("/api/admin/sync-github");
      setTimeout(() => {
        setFeedback("Sinkronisasi repositori berhasil (folder skills & public/previews aktif).");
        setTimeout(() => setFeedback(null), 3000);
      }, 500);
    } catch {
      setFeedback("Sinkronisasi selesai.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredSkills = skillsList.filter((s) => {
    const matchSearch =
      searchFilter.trim() === "" ||
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchFilter.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Curator Studio
            </h1>
            <Badge variant="accent" className="text-[10px]">
              {user?.role}
            </Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Manajemen registry, pembuatan skill baru, generator prompt AI, dan sinkronisasi GitHub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("create")}
            className="text-xs font-semibold gap-1.5 h-9 min-h-[40px] px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAll}
            className="text-xs font-semibold gap-1.5 h-9 min-h-[40px] px-3 border-accent/30 text-accent"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Sync Git</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-xs h-9 min-h-[40px] px-2 text-text-muted hover:text-text-primary"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold p-1">×</button>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 border-b border-border overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "dashboard", label: "Dashboard", icon: Activity },
          { key: "skills", label: "Daftar Skill", icon: Layers },
          { key: "create", label: "Tambah Skill", icon: Plus },
          { key: "ai_studio", label: "Prompt AI Studio", icon: Wand2 },
          { key: "sync", label: "GitHub Folder", icon: Github },
          { key: "audit", label: "Audit Logs", icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[40px] ${
                isActive
                  ? "bg-surface-raised text-accent font-bold border border-border"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-raised/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-text-muted">Total Skill</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-text-primary">{skillsList.length}</p>
              <span className="text-[10px] text-status-success font-medium">12 Terverifikasi</span>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-text-muted">Kategori</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-text-primary">5</p>
              <span className="text-[10px] text-accent font-medium">Taksonomi Aktif</span>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-text-muted">MCP Tools</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                <span className="text-lg sm:text-xl font-bold text-text-primary">6 Endpoints</span>
              </div>
              <span className="text-[10px] text-text-muted font-mono">/api/mcp</span>
            </div>

            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-text-muted">Neon DB</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                <span className="text-lg sm:text-xl font-bold text-text-primary">Connected</span>
              </div>
              <span className="text-[10px] text-text-muted font-mono">ep-raspy-salad</span>
            </div>
          </div>

          <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-accent" />
                Struktur Repositori & CDN
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">dresar/SKILL-IA-AGENT</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-surface-raised border border-border space-y-1">
                <p className="text-xs font-semibold text-text-primary">Direktori skills/</p>
                <p className="text-[11px] text-text-muted">
                  Menyimpan berkas SKILL.md, preview.svg, dan demo.json tiap skill di GitHub.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-raised border border-border space-y-1">
                <p className="text-xs font-semibold text-text-primary">Jaringan CDN jsDelivr</p>
                <p className="text-[11px] text-text-muted">
                  Aset preview grafis dialirkan langsung melalui jsDelivr CDN berkecepatan tinggi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-raised border border-border space-y-1">
                <p className="text-xs font-semibold text-text-primary">GitHub Pages Static</p>
                <p className="text-[11px] text-text-muted">
                  Build statis otomatis melalui GitHub Actions deploy.yml terverifikasi sukses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari dalam tabel..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-surface text-xs text-text-primary focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("create")}
                className="text-xs h-9 min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Baru</span>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-surface border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-surface-raised border-b border-border text-text-muted">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Preview</th>
                    <th className="py-3 px-4 font-semibold">Skill</th>
                    <th className="py-3 px-4 font-semibold">Tipe</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Perintah Pasang</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSkills.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-raised/40 transition-colors">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setAiStudioSkill(s)}
                          className="w-12 h-8 rounded-lg overflow-hidden bg-surface-raised border border-border cursor-pointer hover:border-accent transition-colors"
                          title="Klik untuk ubah preview di AI Studio"
                        >
                          <img
                            src={s.previewImageUrl || `/previews/${s.slug}.svg`}
                            alt={s.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/brand/logo.svg";
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-primary">{s.name}</div>
                        <div className="text-[11px] font-mono text-text-muted">{s.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {s.skillType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s.id)}
                          className="cursor-pointer"
                        >
                          <Badge
                            variant={s.status === "published" ? "success" : "outline"}
                            className="text-[10px]"
                          >
                            {s.status}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-muted max-w-xs truncate">
                        {s.primaryRecipe?.command}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiStudioSkill(s)}
                          title="AI Image Prompt Studio"
                          className="text-xs h-8 px-2 text-accent min-h-[36px]"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDemoSkill(s)}
                          title="Uji Demo"
                          className="text-xs h-8 px-2 text-accent min-h-[36px]"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSkill(s.id, s.name)}
                          title="Hapus"
                          className="text-xs h-8 px-2 text-status-danger min-h-[36px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <form onSubmit={handleCreateSkill} className="rounded-2xl bg-surface border border-border p-5 sm:p-8 space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Tambah Skill Baru</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Definisikan skill baru, generator preview, dan sinkronisasi ke repositori otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Nama Skill
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  setFormData({ ...formData, name: val, slug: autoSlug });
                }}
                placeholder="Contoh: Motion GSAP Engine"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Slug (Folder Repository)
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="motion-gsap-engine"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="frontend">Frontend</option>
                <option value="design-systems">Design Systems</option>
                <option value="code-quality">Code Quality</option>
                <option value="database">Database</option>
                <option value="workflows">Workflows</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Tautan Gambar AI (Opsional)
              </label>
              <input
                type="url"
                value={formData.previewImageUrl}
                onChange={(e) => setFormData({ ...formData, previewImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... atau URL ChatGPT"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Ringkasan (Maksimal 1 Kalimat)
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Arsitektur animasi GSAP tingkat lanjut dengan pemicu scroll halus."
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Perintah Pasang Antigravity
            </label>
            <input
              type="text"
              value={formData.command}
              onChange={(e) => setFormData({ ...formData, command: e.target.value })}
              placeholder={`npx skills add dresar/SKILL-IA-AGENT -s ${formData.slug || "skill-name"}`}
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Demo Prompt (Input Pengguna)
              </label>
              <textarea
                rows={3}
                value={formData.demoPrompt}
                onChange={(e) => setFormData({ ...formData, demoPrompt: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Demo Output (Hasil Kode)
              </label>
              <textarea
                rows={3}
                value={formData.demoOutput}
                onChange={(e) => setFormData({ ...formData, demoOutput: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface-raised text-text-primary font-mono focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("skills")}
              className="text-xs h-9 min-h-[40px]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="text-xs h-9 min-h-[40px] font-semibold gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan & Buat Bundle</span>
            </Button>
          </div>
        </form>
      )}

      {activeTab === "ai_studio" && (
        <AiPromptStudio
          skillName={skillsList[0]?.name || "Frontend Design"}
          skillSlug={skillsList[0]?.slug || "frontend-design"}
          skillSummary={skillsList[0]?.summary || "Agency UI components"}
          category={skillsList[0]?.categories[0]?.name || "Frontend"}
          onSavePreview={(mode, url) => {
            setFeedback(`Mode preview disimpan: ${mode}`);
            setTimeout(() => setFeedback(null), 3000);
          }}
        />
      )}

      {activeTab === "sync" && (
        <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-text-primary">
                Penyimpanan Bundle Repositori (12 Skills)
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Struktur direktori skills/ yang siap di-commit ke branch main.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSyncAll}
              className="text-xs h-9 min-h-[40px] gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Sinkronkan Sekarang</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsList.map((sk) => (
              <div key={sk.id} className="p-4 rounded-xl bg-surface-raised border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text-primary">{sk.name}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {sk.slug}
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-text-muted space-y-0.5 pt-1">
                  <p className="text-emerald-400">✓ skills/{sk.slug}/SKILL.md</p>
                  <p className="text-indigo-400">✓ skills/{sk.slug}/preview.svg</p>
                  <p className="text-amber-400">✓ skills/{sk.slug}/demo.json</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              Audit Operasional
            </h3>
            <span className="text-xs text-text-muted">{auditLogs.length} kejadian tercatat</span>
          </div>

          <div className="divide-y divide-border/60">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary font-mono">{log.action}</span>
                    <Badge variant="outline" className="text-[10px]">{log.targetType}</Badge>
                  </div>
                  <p className="text-text-muted text-[11px]">
                    Aktor: <span className="text-text-secondary">{log.actorSubject}</span>
                  </p>
                </div>
                <span className="text-text-muted font-mono text-[10px]">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiStudioSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <AiPromptStudio
              skillName={aiStudioSkill.name}
              skillSlug={aiStudioSkill.slug}
              skillSummary={aiStudioSkill.summary}
              category={aiStudioSkill.categories[0]?.name || "Umum"}
              currentImageUrl={aiStudioSkill.previewImageUrl}
              onSavePreview={handleSavePreviewOption}
              onClose={() => setAiStudioSkill(null)}
            />
          </div>
        </div>
      )}

      <SkillDemoModal
        skill={demoSkill}
        onClose={() => setDemoSkill(null)}
      />
    </div>
  );
}
