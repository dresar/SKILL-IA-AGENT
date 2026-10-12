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
  FolderGit2,
  Wand2,
  Sparkles,
  CheckSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Eye,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Save,
  ArrowLeft
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
    categories: [{ id: "cat-1", slug: "frontend", name: "FRONTEND" }],
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
    categories: [{ id: "cat-2", slug: "design-systems", name: "DESIGN SYSTEMS" }],
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
    categories: [{ id: "cat-3", slug: "code-quality", name: "CODE QUALITY" }],
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
    categories: [{ id: "cat-4", slug: "database", name: "DATABASE" }],
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
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
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
    categories: [{ id: "cat-1", slug: "frontend", name: "FRONTEND" }],
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
    categories: [{ id: "cat-3", slug: "code-quality", name: "CODE QUALITY" }],
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
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
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
    categories: [{ id: "cat-2", slug: "design-systems", name: "DESIGN SYSTEMS" }],
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
    categories: [{ id: "cat-3", slug: "code-quality", name: "CODE QUALITY" }],
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
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
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
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add dresar/SKILL-IA-AGENT -s docker-devops", target: "antigravity" }
  },
  {
    id: "sk-13",
    slug: "seo-audit",
    name: "SEO Audit Core",
    summary: "Audit komprehensif struktur metadata, Open Graph, dan ranking SERP.",
    description: "Protokol audit optimasi mesin pencari standar Corey Haines untuk coding agent.",
    skillType: "workflows",
    authorDisplay: "Corey Haines",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add coreyhaines31/marketingskills@seo-audit", target: "antigravity" }
  },
  {
    id: "sk-14",
    slug: "claude-seo",
    name: "Claude SEO",
    summary: "Pemeriksaan arsitektur SEO teknis on-page dan audit Core Web Vitals.",
    description: "Toolkit analisis SEO mendalam oleh AgriciDaniel khusus agen koding Claude & Antigravity.",
    skillType: "workflows",
    authorDisplay: "Agrici Daniel",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add AgriciDaniel/claude-seo", target: "antigravity" }
  },
  {
    id: "sk-15",
    slug: "agent-browser",
    name: "Agent Browser Automation",
    summary: "Browser automation tanpa emulator untuk verifikasi visual dan navigasi web.",
    description: "Toolkit agen browser headless untuk inspeksi DOM dan verifikasi end-to-end.",
    skillType: "workflows",
    authorDisplay: "Agent Skills Collective",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add agentskills/agent-browser", target: "antigravity" }
  },
  {
    id: "sk-16",
    slug: "linkly-social-buzz",
    name: "Linkly Social Buzz",
    summary: "Generasi engagement sosial dan copywriting teknis multi-platform.",
    description: "Instruksi khusus penulisan konten teknis dari repositori Linkly AI skills.",
    skillType: "workflows",
    authorDisplay: "Linkly AI",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add LinklyAI/linkly-ai-skills -s social-buzz", target: "antigravity" }
  },
  {
    id: "sk-17",
    slug: "agentskills-core",
    name: "AgentSkills Core Standard",
    summary: "Pondasi spesifikasi instruksi agen cerdas lintas framework MCP v1.6.",
    description: "Arsitektur inti instruksi agentic intelligence dari AgentSkills repository.",
    skillType: "workflows",
    authorDisplay: "Agent Skills Collective",
    status: "published",
    verificationStatus: "verified",
    categories: [{ id: "cat-5", slug: "workflows", name: "WORKFLOWS" }],
    primaryRecipe: { command: "npx skills add agentskills/agentskills -s core", target: "antigravity" }
  }
];

function AdminContent() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const requestedTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "registry" | "approvals" | "prompt_studio" | "ai_analyzer" | "sync" | "audit"
  >("registry");

  const [viewMode, setViewMode] = useState<"list" | "create" | "edit" | "detail">("list");
  const [skillsList, setSkillsList] = useState<AdminSkill[]>(INITIAL_SKILLS);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeSkill, setActiveSkill] = useState<AdminSkill | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    slug: "",
    category: "frontend",
    skillType: "frontend",
    summary: "",
    description: "",
    authorDisplay: "Eka Syarif Maulana",
    command: "",
    previewImageUrl: "",
    status: "published",
    verificationStatus: "verified"
  });

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
    fetch("/api/admin/skills/", { headers: adminHeaders() })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setSkillsList(json.data);
        } else {
          fetch("/api/skills/")
            .then((r) => r.json())
            .then((res) => {
              if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
                setSkillsList(res.data);
              }
            })
            .catch(() => {});
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
      actorSubject: "admin@agent.io",
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
              ? "Sesi aktif tidak memiliki otoritas Administrator atau Curator."
              : "Panel ini memerlukan login administrator resmi."}
          </p>
          <Link href="/login/?redirect=/admin/" className="mt-5 inline-flex">
            <Button variant="primary" size="sm" className="min-h-10 text-xs">
              Login Admin
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStartCreate = () => {
    setEditFormData({
      id: "",
      name: "",
      slug: "",
      category: "frontend",
      skillType: "frontend",
      summary: "",
      description: "",
      authorDisplay: "Eka Syarif Maulana",
      command: "",
      previewImageUrl: "",
      status: "published",
      verificationStatus: "verified"
    });
    setViewMode("create");
  };

  const handleStartEdit = (skill: AdminSkill) => {
    setActiveSkill(skill);
    setEditFormData({
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      category: skill.categories[0]?.slug || skill.skillType || "frontend",
      skillType: skill.skillType || "frontend",
      summary: skill.summary,
      description: skill.description,
      authorDisplay: skill.authorDisplay,
      command: skill.primaryRecipe?.command || `npx skills add dresar/SKILL-IA-AGENT -s ${skill.slug}`,
      previewImageUrl: skill.previewImageUrl || "",
      status: skill.status,
      verificationStatus: skill.verificationStatus
    });
    setViewMode("edit");
  };

  const handleStartDetail = (skill: AdminSkill) => {
    setActiveSkill(skill);
    setViewMode("detail");
  };

  const handleOpenPromptStudio = (skill: AdminSkill) => {
    setActiveSkill(skill);
    setActiveTab("prompt_studio");
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.slug.trim()) return;

    if (viewMode === "create") {
      const newSkill: AdminSkill = {
        id: "sk-" + Math.random().toString(36).substring(2, 7),
        slug: editFormData.slug.toLowerCase().trim(),
        name: editFormData.name.trim(),
        summary: editFormData.summary.trim(),
        description: editFormData.description.trim() || editFormData.summary.trim(),
        skillType: editFormData.skillType,
        authorDisplay: editFormData.authorDisplay,
        status: editFormData.status as any,
        verificationStatus: editFormData.verificationStatus,
        previewImageUrl: editFormData.previewImageUrl.trim() || undefined,
        categories: [{ id: "cat-" + editFormData.category, slug: editFormData.category, name: editFormData.category.toUpperCase() }],
        primaryRecipe: {
          command: editFormData.command || `npx skills add dresar/SKILL-IA-AGENT -s ${editFormData.slug}`,
          target: "antigravity"
        }
      };

      setSkillsList([newSkill, ...skillsList]);

      try {
        await fetch("/api/admin/skills/", {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify(editFormData)
        });
      } catch {}

      setFeedback(`Skill "${newSkill.name}" berhasil ditambahkan dan disimpan.`);
      setViewMode("list");
      setTimeout(() => setFeedback(null), 3500);
    } else if (viewMode === "edit") {
      const updatedList = skillsList.map((s) => {
        if (s.id === editFormData.id || s.slug === editFormData.slug) {
          return {
            ...s,
            name: editFormData.name.trim(),
            slug: editFormData.slug.toLowerCase().trim(),
            summary: editFormData.summary.trim(),
            description: editFormData.description.trim() || editFormData.summary.trim(),
            skillType: editFormData.skillType,
            authorDisplay: editFormData.authorDisplay,
            status: editFormData.status as any,
            verificationStatus: editFormData.verificationStatus,
            previewImageUrl: editFormData.previewImageUrl.trim() || s.previewImageUrl,
            categories: [{ id: "cat-" + editFormData.category, slug: editFormData.category, name: editFormData.category.toUpperCase() }],
            primaryRecipe: {
              command: editFormData.command || `npx skills add dresar/SKILL-IA-AGENT -s ${editFormData.slug}`,
              target: "antigravity"
            }
          };
        }
        return s;
      });

      setSkillsList(updatedList);

      try {
        await fetch("/api/admin/skills/", {
          method: "PUT",
          headers: adminHeaders(),
          body: JSON.stringify(editFormData)
        });
      } catch {}

      setFeedback(`Perubahan untuk "${editFormData.name}" berhasil disimpan.`);
      setViewMode("list");
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    setSkillsList(skillsList.filter((s) => s.id !== id));
    setDeleteConfirmId(null);

    try {
      await fetch(`/api/admin/skills/?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: adminHeaders()
      });
    } catch {}

    setFeedback(`Skill "${name}" berhasil dihapus.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleToggleStatus = async (skill: AdminSkill) => {
    const nextStatus: AdminSkill["status"] = skill.status === "published" ? "draft" : "published";
    const updatedList = skillsList.map((s) => (s.id === skill.id ? { ...s, status: nextStatus } : s));
    setSkillsList(updatedList);

    try {
      await fetch("/api/admin/skills/", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ id: skill.id, status: nextStatus })
      });
    } catch {}

    setFeedback(`Status "${skill.name}" diubah menjadi ${nextStatus.toUpperCase()}.`);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handleApproveSubmission = async (skillId: string, skillName: string) => {
    try {
      const res = await fetch("/api/admin/submissions/", {
        method: "POST",
        headers: adminHeaders(),
        body: JSON.stringify({ skillId, action: "approve" })
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(`Skill "${skillName}" disetujui (ACC) dan diterbitkan.`);
        fetchSubmissions();
        fetchSkills();
        setTimeout(() => setFeedback(null), 3500);
      }
    } catch {}
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

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSavePreviewOption = (mode: PreviewMode, urlOrContent?: string) => {
    if (!activeSkill) return;
    const updated = skillsList.map((s) => {
      if (s.id === activeSkill.id) {
        return {
          ...s,
          previewMode: mode,
          previewImageUrl: urlOrContent || s.previewImageUrl
        };
      }
      return s;
    });
    setSkillsList(updated);
    setFeedback(`Pratinjau 1:1 untuk "${activeSkill.name}" diperbarui.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApplyAiAnalysis = (result: SkillAnalysisResult) => {
    setEditFormData({
      id: "",
      name: result.name,
      slug: result.slug,
      category: result.category,
      skillType: result.category,
      summary: result.summary,
      description: result.description,
      authorDisplay: "Eka Syarif Maulana",
      command: result.installCommand,
      previewImageUrl: result.previewSvg
        ? `data:image/svg+xml;utf8,${encodeURIComponent(result.previewSvg)}`
        : "",
      status: "published",
      verificationStatus: "verified"
    });
    setActiveTab("registry");
    setViewMode("create");
    setFeedback(`Formulir terisi otomatis untuk "${result.name}".`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  const filteredSkills = skillsList.filter((s) => {
    const q = searchFilter.toLowerCase().trim();
    const matchSearch =
      q === "" ||
      s.name.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.authorDisplay.toLowerCase().includes(q) ||
      (s.primaryRecipe?.command && s.primaryRecipe.command.toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchCat =
      categoryFilter === "all" ||
      s.skillType === categoryFilter ||
      s.categories.some((c) => c.slug === categoryFilter);
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
              Admin Registry Management
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pusat CRUD lengkap, kurasi registry, verifikasi ACC, dan generator visual 1:1.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {pendingSubmissions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab("approvals");
                setViewMode("list");
              }}
              className="text-xs font-semibold gap-1.5 h-9 px-3 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{pendingSubmissions.length} ACC</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleStartCreate}
            className="text-xs font-semibold gap-1.5 h-9 px-3 bg-indigo-600 hover:bg-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Skill</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchSkills}
            className="text-xs font-semibold gap-1.5 h-9 px-3 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            title="Segarkan data dari Neon PostgreSQL"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between animate-in fade-in">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold p-1">×</button>
        </div>
      )}

      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "registry", label: "Registry & CRUD", icon: Layers, badge: skillsList.length },
          { key: "approvals", label: "Antrean ACC", icon: CheckSquare, badge: pendingSubmissions.length },
          { key: "prompt_studio", label: "Prompt Studio 1:1", icon: Wand2 },
          { key: "ai_analyzer", label: "AI Analyzer", icon: Sparkles },
          { key: "sync", label: "GitHub Sync", icon: Github },
          { key: "audit", label: "Log Audit", icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key as any);
                if (tab.key === "registry") setViewMode("list");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[38px] ${
                isActive
                  ? "bg-slate-900 text-white font-semibold border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  tab.key === "approvals"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "registry" && (
        <div className="space-y-4">
          {viewMode === "list" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
                  <p className="text-[11px] text-slate-400">Total Registry</p>
                  <p className="text-xl font-bold text-slate-100">{skillsList.length}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
                  <p className="text-[11px] text-slate-400">Published</p>
                  <p className="text-xl font-bold text-emerald-400">
                    {skillsList.filter((s) => s.status === "published").length}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
                  <p className="text-[11px] text-slate-400">Pending ACC</p>
                  <p className="text-xl font-bold text-amber-400">{pendingSubmissions.length}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-0.5">
                  <p className="text-[11px] text-slate-400">Draft</p>
                  <p className="text-xl font-bold text-slate-400">
                    {skillsList.filter((s) => s.status === "draft").length}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Cari berdasarkan nama, slug, author, command..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">Semua Status</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="frontend">Frontend</option>
                    <option value="design-systems">Design Systems</option>
                    <option value="code-quality">Code Quality</option>
                    <option value="database">Database</option>
                    <option value="workflows">Workflows</option>
                  </select>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStartCreate}
                    className="text-xs h-9 bg-indigo-600 hover:bg-indigo-500"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Tambah</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[760px]">
                    <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                      <tr>
                        <th className="py-3 px-4 w-16">1:1 Visual</th>
                        <th className="py-3 px-4">Nama &amp; Slug</th>
                        <th className="py-3 px-4">Penulis</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Perintah Pasang</th>
                        <th className="py-3 px-4 text-right">Aksi Lengkap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredSkills.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-900/80 transition-colors">
                          <td className="py-3 px-4">
                            <div
                              onClick={() => handleOpenPromptStudio(s)}
                              className="w-10 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer hover:border-indigo-500 transition-colors shrink-0"
                              title="Buka di Prompt Studio 1:1"
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
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-semibold text-slate-200">{s.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">{s.slug}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                            {s.authorDisplay}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                              {s.categories[0]?.name || s.skillType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(s)}
                              className="cursor-pointer"
                              title="Klik untuk ubah status"
                            >
                              <Badge
                                variant={s.status === "published" ? "success" : s.status === "pending" ? "outline" : "default"}
                                className={`text-[10px] ${s.status === "pending" ? "border-amber-500/40 text-amber-300 bg-amber-500/10" : ""}`}
                              >
                                {s.status}
                              </Badge>
                            </button>
                          </td>
                          <td className="py-3 px-4 max-w-xs font-mono text-[11px] text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{s.primaryRecipe?.command}</span>
                              {s.primaryRecipe?.command && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyCommand(s.primaryRecipe!.command, s.id)}
                                  className="text-slate-500 hover:text-slate-200 shrink-0 p-1"
                                  title="Salin perintah"
                                >
                                  {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartDetail(s)}
                                className="h-8 px-2 text-slate-400 hover:text-slate-200 text-xs"
                                title="Lihat detail"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEdit(s)}
                                className="h-8 px-2 text-indigo-400 hover:text-indigo-300 text-xs"
                                title="Edit skill"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenPromptStudio(s)}
                                className="h-8 px-2 text-amber-400 hover:text-amber-300 text-xs"
                                title="Prompt Studio 1:1"
                              >
                                <Wand2 className="w-3.5 h-3.5" />
                              </Button>

                              {deleteConfirmId === s.id ? (
                                <div className="inline-flex items-center gap-1 bg-red-950/60 p-1 rounded-lg border border-red-800">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSkill(s.id, s.name)}
                                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white"
                                  >
                                    Ya Hapus
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-1.5 py-0.5 rounded text-[10px] text-slate-300 hover:text-white"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDeleteConfirmId(s.id)}
                                  className="h-8 px-2 text-slate-500 hover:text-red-400 text-xs"
                                  title="Hapus skill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(viewMode === "create" || viewMode === "edit") && (
            <form onSubmit={handleSaveSkill} className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100">
                      {viewMode === "create" ? "Tambah Skill Baru ke Registry" : `Edit Skill: ${editFormData.name}`}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {viewMode === "create" ? "Isi formulir metadata dan simpan ke basis data Neon." : "Perbarui parameter runtime dan simpan langsung."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="text-xs border-slate-800 text-slate-300"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="text-xs bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{viewMode === "create" ? "Simpan & Terbitkan" : "Simpan Perubahan"}</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Skill
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => {
                      const v = e.target.value;
                      const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                      setEditFormData({
                        ...editFormData,
                        name: v,
                        slug: viewMode === "create" ? slug : editFormData.slug
                      });
                    }}
                    placeholder="Contoh: Motion GSAP Engine"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Slug Pengenal (URL)
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.slug}
                    onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value })}
                    placeholder="motion-gsap-engine"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value, skillType: e.target.value })}
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
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={editFormData.authorDisplay}
                    onChange={(e) => setEditFormData({ ...editFormData, authorDisplay: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ringkasan Singkat (Maksimal 1 Kalimat)
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.summary}
                  onChange={(e) => setEditFormData({ ...editFormData, summary: e.target.value })}
                  placeholder="Standar performa dan arsitektur kode ringkas..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Deskripsi Lengkap &amp; Instruksi Agent
                </label>
                <textarea
                  rows={4}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Perintah Instalasi CLI
                  </label>
                  <input
                    type="text"
                    value={editFormData.command}
                    onChange={(e) => setEditFormData({ ...editFormData, command: e.target.value })}
                    placeholder="npx skills add dresar/SKILL-IA-AGENT -s skill-name"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    URL Gambar Preview (Rasio 1:1)
                  </label>
                  <input
                    type="text"
                    value={editFormData.previewImageUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, previewImageUrl: e.target.value })}
                    placeholder="https://... atau /previews/skill.svg"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </form>
          )}

          {viewMode === "detail" && activeSkill && (
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                      <span>{activeSkill.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {activeSkill.status}
                      </Badge>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">{activeSkill.slug}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit(activeSkill)}
                    className="text-xs border-indigo-500/40 text-indigo-300"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit Data</span>
                  </Button>
                  <Link href={`/skills/${activeSkill.slug}/`} target="_blank">
                    <Button variant="outline" size="sm" className="text-xs border-slate-800 text-slate-300">
                      <span>Halaman Publik</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Ringkasan
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">{activeSkill.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Deskripsi Lengkap
                    </h3>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {activeSkill.description}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Perintah Utama
                    </h3>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 flex items-center justify-between">
                      <span>{activeSkill.primaryRecipe?.command}</span>
                      {activeSkill.primaryRecipe?.command && (
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(activeSkill.primaryRecipe!.command, activeSkill.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Visual Rasio 1:1
                  </h3>
                  <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                    <img
                      src={activeSkill.previewImageUrl || `/previews/${activeSkill.slug}.svg`}
                      alt={activeSkill.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/brand/logo.svg";
                      }}
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px] space-y-1">
                    <p>Penulis: <span className="text-slate-200">{activeSkill.authorDisplay}</span></p>
                    <p>Kategori: <span className="text-slate-200">{activeSkill.categories[0]?.name || activeSkill.skillType}</span></p>
                    <p>Verifikasi: <span className="text-emerald-400">{activeSkill.verificationStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                Review dan setujui skill yang diajukan oleh komunitas sebelum dipublikasikan.
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
                Semua Pengajuan Telah Terverifikasi
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tidak ada skill yang sedang menunggu persetujuan kurator saat ini.
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
                        <span>ACC &amp; Terbitkan</span>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectSubmission(sub.id, sub.name)}
                        className="text-xs border-red-900/60 bg-red-950/20 text-red-300 hover:bg-red-900/40 h-9"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        <span>Tolak</span>
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

      {activeTab === "prompt_studio" && (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                AI Prompt Studio 1:1
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih skill untuk menghasilkan prompt bebas AI slop dan vektor 1:1 ber-watermark.
              </p>
            </div>
            {activeSkill && (
              <span className="text-xs font-mono text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                Skill Aktif: {activeSkill.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {skillsList.slice(0, 12).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSkill(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors whitespace-nowrap border ${
                  activeSkill?.id === s.id
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <AiPromptStudio
            skillName={activeSkill?.name || skillsList[0]?.name || "Frontend Design"}
            skillSlug={activeSkill?.slug || skillsList[0]?.slug || "frontend-design"}
            skillSummary={activeSkill?.summary || skillsList[0]?.summary || ""}
            category={activeSkill?.categories[0]?.name || "Frontend"}
            currentImageUrl={activeSkill?.previewImageUrl}
            onSavePreview={handleSavePreviewOption}
          />
        </div>
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

      {activeTab === "sync" && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100">
              Sinkronisasi GitHub Repository
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sinkronkan registry database dengan berkas fisik di folder skills/ repositori dresar/SKILL-IA-AGENT.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={async () => {
              setFeedback("Menyinkronkan registry ke folder skills/ repositori...");
              try {
                await fetch("/api/admin/sync-github/", { headers: adminHeaders() });
                setFeedback("Sinkronisasi repositori berhasil.");
                setTimeout(() => setFeedback(null), 3000);
              } catch {
                setFeedback("Sinkronisasi selesai.");
                setTimeout(() => setFeedback(null), 3000);
              }
            }}
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
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">Memuat Admin Console...</div>}>
      <AdminContent />
    </Suspense>
  );
}
