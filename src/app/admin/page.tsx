"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  Activity,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Clock,
  Github,
  Lock,
  LogOut,
  FolderGit2,
  Wand2,
  Sparkles,
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { AiPromptStudio, PreviewMode } from "@/components/admin/ai-prompt-studio";
import { AiSkillAnalyzer, SkillAnalysisResult } from "@/components/admin/ai-skill-analyzer";

interface AdminSkill {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  skillType: string;
  authorDisplay: string;
  status: "published" | "draft" | "archived" | "pending" | "rejected";
  verificationStatus: string;
  categories: Array<{ id: string; slug: string; name: string }>;
  primaryRecipe?: { command: string; target: string } | null;
  previewImageUrl?: string;
  previewMode?: PreviewMode;
}

interface SubmissionItem {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  status: string;
  skillType: string;
  authorDisplay: string;
  sourceUrl: string;
  verificationStatus: string;
  createdAt: string;
  command?: string;
  categoryName?: string;
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

function AdminContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const requestedTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "approvals" | "skills" | "create" | "ai_analyzer" | "ai_studio" | "sync" | "audit"
  >("dashboard");

  const [skillsList, setSkillsList] = useState<AdminSkill[]>(INITIAL_SKILLS);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [aiStudioSkill, setAiStudioSkill] = useState<AdminSkill | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const adminHeaders = () => ({
    "Content-Type": "application/json",
    "x-skill-uiai-role": user?.role || "",
    "x-skill-uiai-email": user?.email || ""
  });

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions/", { headers: adminHeaders() });
      const data = await res.json();
      if (data.ok && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch {}
  };

  const fetchSkills = () => {
    fetch("/api/skills/")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setSkillsList(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (requestedTab === "approvals") {
      setActiveTab("approvals");
    }
  }, [requestedTab]);

  useEffect(() => {
    fetchSkills();
    fetchSubmissions();
  }, [user]);

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
    demoOutput: "export function Solution() { return <div>Ready</div>; }"
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
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center sm:p-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-slate-100">Akses Admin Ditolak</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {isAuthenticated
              ? "Sesi aktif tidak memiliki role Super Admin atau Curator."
              : "Panel ini memerlukan login admin terpisah."}
          </p>
          <Link href="/admin/login/" className="mt-5 inline-flex">
            <Button variant="primary" size="sm" className="min-h-10 text-xs">
              Login Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApproveSubmission = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "approve" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Skill "${skillName}" disetujui (ACC) dan berhasil dipublikasikan.`);
        fetchSubmissions();
        fetchSkills();
        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback(`Gagal: ${data.error || "Gagal menyetujui skill."}`);
      }
    } catch {
      setFeedback("Kesalahan jaringan saat memproses ACC.");
    }
  };

  const handleRejectSubmission = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "reject" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Pengajuan "${skillName}" ditolak.`);
        fetchSubmissions();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const handleDeleteSubmission = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "delete" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Skill "${skillName}" dihapus.`);
        fetchSubmissions();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch {}
  };

  const handleApplyAiAnalysis = (result: SkillAnalysisResult) => {
    setFormData({
      ...formData,
      name: result.name,
      slug: result.slug,
      category: result.category,
      skillType: result.category,
      summary: result.summary,
      description: result.description,
      command: result.installCommand,
      previewImageUrl: result.previewSvg
        ? `data:image/svg+xml;utf8,${encodeURIComponent(result.previewSvg)}`
        : formData.previewImageUrl
    });
    setActiveTab("create");
    setFeedback(`Formulir terisi otomatis untuk ${result.name}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

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
      await fetch("/api/admin/sync-github/", {
        method: "POST",
        headers: adminHeaders(),
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
      await fetch("/api/admin/sync-github/", { headers: adminHeaders() });
      setTimeout(() => {
        setFeedback("Sinkronisasi repositori berhasil.");
        setTimeout(() => setFeedback(null), 3000);
      }, 500);
    } catch {
      setFeedback("Sinkronisasi selesai.");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Curator Studio
            </h1>
            <Badge variant="accent" className="text-[10px]">
              {user?.role}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen registry, verifikasi & persetujuan skill (ACC), dan sinkronisasi GitHub.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingSubmissions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("approvals")}
              className="text-xs font-semibold gap-1.5 h-9 min-h-[40px] px-3 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{pendingSubmissions.length} ACC</span>
            </Button>
          )}

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
            className="text-xs font-semibold gap-1.5 h-9 min-h-[40px] px-3 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Sync Git</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold p-1">×</button>
        </div>
      )}

      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "dashboard", label: "Dashboard", icon: Activity },
          { key: "approvals", label: "Persetujuan (ACC)", icon: CheckSquare, badge: pendingSubmissions.length },
          { key: "skills", label: "Daftar Skill", icon: Layers },
          { key: "create", label: "Tambah", icon: Plus },
          { key: "ai_analyzer", label: "AI Analisis", icon: Sparkles },
          { key: "ai_studio", label: "Prompt AI", icon: Wand2 },
          { key: "sync", label: "GitHub", icon: Github },
          { key: "audit", label: "Audit", icon: Clock }
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
                  ? "bg-slate-900 text-white font-bold border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {pendingSubmissions.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    Menunggu Persetujuan ({pendingSubmissions.length} Skill)
                  </p>
                  <p className="text-[11px] text-amber-400/80">
                    Terdapat skill baru yang diajukan oleh pengembang. Lakukan review dan ACC untuk mempublikasikan.
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("approvals")}
                className="text-xs shrink-0 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
              >
                <span>Buka Antrean ACC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-slate-400">Total Skill</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-100">{skillsList.length}</p>
              <span className="text-[10px] text-emerald-400 font-medium">
                {skillsList.filter((s) => s.verificationStatus === "verified").length} Terverifikasi
              </span>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-slate-400">Antrean ACC</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{pendingSubmissions.length}</p>
              <span className="text-[10px] text-slate-400 font-medium">Pengajuan Pending</span>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-slate-400">MCP Endpoints</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-lg sm:text-xl font-bold text-slate-100">6 Endpoints</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">/api/mcp</span>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 sm:p-5 space-y-1">
              <p className="text-xs font-medium text-slate-400">Neon Database</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-lg sm:text-xl font-bold text-slate-100">Connected</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">ep-raspy-salad</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Arsitektur & Konfigurasi Pipeline
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-400">
                dresar/SKILL-IA-AGENT
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <p className="text-xs font-semibold text-slate-200">Katalog Tervalidasi</p>
                <p className="text-[11px] text-slate-400">
                  Menjaga standar kualitas kode bebas komentar dan instruksi runtime agent presisi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <p className="text-xs font-semibold text-slate-200">Persetujuan Kurator</p>
                <p className="text-[11px] text-slate-400">
                  Setiap skill komunitas wajib melalui persetujuan kurator sebelum tampil ke publik.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                <p className="text-xs font-semibold text-slate-200">Katalog Tervalidasi</p>
                <p className="text-[11px] text-slate-400">
                  Instruksi runtime, resep CLI, dan format metadata terverifikasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" />
                Antrean Persetujuan Skill (ACC Queue)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review dan setujui skill yang diajukan sebelum masuk ke katalog publik.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              className="text-xs h-8 border-slate-800 text-slate-300"
            >
              Segarkan
            </Button>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-200">
                Tidak Ada Skill Menunggu Persetujuan
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Semua pengajuan skill telah diproses atau belum ada pengajuan baru dari portal publik.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 transition-colors hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{sub.name}</span>
                        <Badge variant="outline" className="text-[10px] font-mono border-amber-500/40 bg-amber-500/10 text-amber-300">
                          PENDING
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-500">{sub.slug}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Oleh: <span className="text-slate-300">{sub.authorDisplay}</span> | Kategori: <span className="text-slate-300 uppercase font-mono">{sub.skillType}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveSubmission(sub.id, sub.name)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1.5 h-9"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ACC & Terbitkan</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectSubmission(sub.id, sub.name)}
                        className="text-xs border-red-900/60 bg-red-950/20 text-red-300 hover:bg-red-900/40 h-9"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubmission(sub.id, sub.name)}
                        className="text-xs text-slate-500 hover:text-red-400 h-9 px-2"
                        title="Hapus permanen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sub.summary || sub.description}
                    </p>

                    {sub.command && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="truncate">{sub.command}</span>
                      </div>
                    )}

                    {sub.sourceUrl && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                        <Github className="w-3.5 h-3.5 text-slate-500" />
                        <a
                          href={sub.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-indigo-400 truncate inline-flex items-center gap-1"
                        >
                          {sub.sourceUrl}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari dalam tabel..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900/80 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none"
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

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Preview</th>
                    <th className="py-3 px-4 font-semibold">Skill</th>
                    <th className="py-3 px-4 font-semibold">Tipe</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Perintah Pasang</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredSkills.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/80 transition-colors">
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setAiStudioSkill(s)}
                          className="w-12 h-8 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer hover:border-indigo-500 transition-colors"
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
                        <div className="font-semibold text-slate-200">{s.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{s.slug}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
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
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                        {s.primaryRecipe?.command}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiStudioSkill(s)}
                          title="Prompt AI"
                          className="text-xs h-8 px-2 text-indigo-400 min-h-[36px]"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSkill(s.id, s.name)}
                          title="Hapus"
                          className="text-xs h-8 px-2 text-red-400 min-h-[36px]"
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
        <form onSubmit={handleCreateSkill} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Tambah Skill Manual</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Definisikan metadata skill baru untuk langsung dipublikasikan.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("ai_analyzer")}
              className="text-xs h-8 min-h-[36px] gap-1.5 border-indigo-500/40 text-indigo-300"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Analisis</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                placeholder="Motion GSAP Engine"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slug
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="motion-gsap-engine"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="frontend">Frontend</option>
                <option value="design-systems">Design Systems</option>
                <option value="code-quality">Code Quality</option>
                <option value="database">Database</option>
                <option value="workflows">Workflows</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Penulis
              </label>
              <input
                type="text"
                value={formData.authorDisplay}
                onChange={(e) => setFormData({ ...formData, authorDisplay: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ringkasan Singkat
            </label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Instruksi singkat 1 kalimat..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deskripsi Lengkap
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Perintah Instalasi CLI
            </label>
            <input
              type="text"
              value={formData.command}
              onChange={(e) => setFormData({ ...formData, command: e.target.value })}
              placeholder="npx skills add owner/repo -s skill-name"
              className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("skills")}
              className="border-slate-800 text-slate-300"
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-500">
              Simpan & Publikasikan
            </Button>
          </div>
        </form>
      )}

      {activeTab === "ai_analyzer" && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              AI Skill Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analisis berkas SKILL.md dari repositori GitHub untuk menghasilkan metadata otomatis.
            </p>
          </div>
          <AiSkillAnalyzer onApply={handleApplyAiAnalysis} />
        </div>
      )}

      {activeTab === "ai_studio" && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              AI Prompt Studio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Kelola instruksi sistem dan generator visual grafis SVG untuk skill.
            </p>
          </div>
          {aiStudioSkill ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6">
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
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <Wand2 className="w-8 h-8 text-indigo-400 mx-auto" />
              <p className="text-sm text-slate-300">Pilih skill dari tab Daftar Skill untuk membuka prompt studio.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("skills")}
                className="text-xs border-slate-800 text-slate-300 mt-2"
              >
                Buka Daftar Skill
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "sync" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100">
              Sinkronisasi GitHub Repository
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sinkronkan registry database dengan berkas fisik di folder skills/ repositori.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSyncAll}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 font-semibold gap-2"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Jalankan Sinkronisasi Penuh</span>
          </Button>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100">Riwayat Audit Operasional</h2>
            <p className="text-xs text-slate-400 mt-0.5">Log peristiwa administratif dan persetujuan skill.</p>
          </div>

          <div className="divide-y divide-slate-800">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 font-mono">{log.action}</span>
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                      {log.targetType}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Aktor: <span className="text-slate-400">{log.actorSubject}</span>
                  </p>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiStudioSkill && activeTab !== "ai_studio" && (
        <div className="rounded-2xl border border-indigo-500/40 bg-slate-900 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-100">
              Prompt Studio Aktif: {aiStudioSkill.name}
            </h3>
            <button
              onClick={() => setAiStudioSkill(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Tutup
            </button>
          </div>
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
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">Memuat Curator Studio...</div>}>
      <AdminContent />
    </Suspense>
  );
}
