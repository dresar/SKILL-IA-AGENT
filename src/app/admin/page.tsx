"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Lock,
  Wand2,
  Edit3,
  Eye,
  Copy,
  Check,
  RotateCcw,
  Save,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { AiPromptStudio, PreviewMode } from "@/components/admin/ai-prompt-studio";

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
  const actionParam = searchParams.get("action");
  const nameParam = searchParams.get("name");
  const slugParam = searchParams.get("slug");
  const catParam = searchParams.get("cat");
  const cmdParam = searchParams.get("cmd");

  const [viewMode, setViewMode] = useState<"grid" | "create" | "edit" | "detail" | "prompt_studio">("grid");
  const [skillsList, setSkillsList] = useState<AdminSkill[]>(INITIAL_SKILLS);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeSkill, setActiveSkill] = useState<AdminSkill | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
    fetchSkills();
  }, [user]);

  useEffect(() => {
    if (actionParam === "create") {
      setFormData({
        id: "",
        name: nameParam || "",
        slug: slugParam || "",
        category: catParam || "frontend",
        skillType: catParam || "frontend",
        summary: "",
        description: "",
        authorDisplay: "Eka Syarif Maulana",
        command: cmdParam || "",
        previewImageUrl: "",
        status: "published",
        verificationStatus: "verified"
      });
      setViewMode("create");
    }
  }, [actionParam, nameParam, slugParam, catParam, cmdParam]);

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
    setFormData({
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
    setFormData({
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

  const handleStartPromptStudio = (skill: AdminSkill) => {
    setActiveSkill(skill);
    setViewMode("prompt_studio");
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) return;

    if (viewMode === "create") {
      const newSkill: AdminSkill = {
        id: "sk-" + Math.random().toString(36).substring(2, 7),
        slug: formData.slug.toLowerCase().trim(),
        name: formData.name.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim() || formData.summary.trim(),
        skillType: formData.skillType,
        authorDisplay: formData.authorDisplay,
        status: formData.status as any,
        verificationStatus: formData.verificationStatus,
        previewImageUrl: formData.previewImageUrl.trim() || undefined,
        categories: [{ id: "cat-" + formData.category, slug: formData.category, name: formData.category.toUpperCase() }],
        primaryRecipe: {
          command: formData.command || `npx skills add dresar/SKILL-IA-AGENT -s ${formData.slug}`,
          target: "antigravity"
        }
      };

      setSkillsList([newSkill, ...skillsList]);

      try {
        await fetch("/api/admin/skills/", {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify(formData)
        });
      } catch {}

      setFeedback(`Skill "${newSkill.name}" berhasil dibuat dan disimpan.`);
      setViewMode("grid");
      setTimeout(() => setFeedback(null), 3500);
    } else if (viewMode === "edit") {
      const updatedList = skillsList.map((s) => {
        if (s.id === formData.id || s.slug === formData.slug) {
          return {
            ...s,
            name: formData.name.trim(),
            slug: formData.slug.toLowerCase().trim(),
            summary: formData.summary.trim(),
            description: formData.description.trim() || formData.summary.trim(),
            skillType: formData.skillType,
            authorDisplay: formData.authorDisplay,
            status: formData.status as any,
            verificationStatus: formData.verificationStatus,
            previewImageUrl: formData.previewImageUrl.trim() || s.previewImageUrl,
            categories: [{ id: "cat-" + formData.category, slug: formData.category, name: formData.category.toUpperCase() }],
            primaryRecipe: {
              command: formData.command || `npx skills add dresar/SKILL-IA-AGENT -s ${formData.slug}`,
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
          body: JSON.stringify(formData)
        });
      } catch {}

      setFeedback(`Perubahan untuk "${formData.name}" berhasil disimpan.`);
      setViewMode("grid");
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

  const handleCopyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSavePreviewOption = async (mode: PreviewMode, imageUrl: string) => {
    if (!activeSkill) return;
    const updatedList = skillsList.map((s) => {
      if (s.id === activeSkill.id) {
        return {
          ...s,
          previewImageUrl: imageUrl
        };
      }
      return s;
    });
    setSkillsList(updatedList);

    try {
      await fetch("/api/admin/skills/", {
        method: "PUT",
        headers: adminHeaders(),
        body: JSON.stringify({ id: activeSkill.id, previewImageUrl: imageUrl })
      });
    } catch {}

    setFeedback(`Gambar 1:1 untuk "${activeSkill.name}" berhasil diperbarui.`);
    setViewMode("grid");
    setTimeout(() => setFeedback(null), 3500);
  };

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
      {viewMode === "grid" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  Registry Skills
                </h1>
                <Badge variant="accent" className="text-[10px] font-mono">
                  {filteredSkills.length} SKILL
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Katalog kurasi dan runtime agen cerdas dalam grid visual 1:1 presisi.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleStartCreate}
                className="text-xs font-semibold gap-1.5 h-9 px-3.5 bg-indigo-600 hover:bg-indigo-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Skill</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchSkills}
                className="text-xs font-semibold gap-1.5 h-9 px-3 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                title="Segarkan data dari database"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Segarkan</span>
              </Button>
            </div>
          </div>

          {feedback && (
            <div className="p-3.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between">
              <span>{feedback}</span>
              <button onClick={() => setFeedback(null)} className="text-xs font-bold p-1">×</button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari berdasarkan nama, slug, penulis, perintah..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs">
                {["all", "published", "pending", "draft"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      statusFilter === st
                        ? "bg-slate-800 text-white font-semibold shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st === "all" ? "Semua" : st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

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
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSkills.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
              >
                <div>
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-950 border-b border-slate-800 flex items-center justify-center">
                    <img
                      src={s.previewImageUrl || `/previews/${s.slug}.svg`}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/brand/logo.svg";
                      }}
                    />

                    <div className="absolute top-2.5 right-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s)}
                        title="Klik untuk ubah status"
                      >
                        <Badge
                          variant={s.status === "published" ? "success" : s.status === "pending" ? "outline" : "default"}
                          className={`text-[10px] ${s.status === "pending" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : ""}`}
                        >
                          {s.status}
                        </Badge>
                      </button>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/80 border border-slate-800 text-slate-300 backdrop-blur-sm">
                        {s.categories[0]?.name || s.skillType}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 truncate group-hover:text-indigo-300 transition-colors">
                        {s.name}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5 font-mono">
                        <span className="truncate">{s.slug}</span>
                        <span className="text-slate-500 shrink-0">{s.authorDisplay}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {s.summary}
                    </p>

                    {s.primaryRecipe?.command && (
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-indigo-300 flex items-center justify-between gap-1">
                        <span className="truncate">{s.primaryRecipe.command}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCommand(s.primaryRecipe!.command, s.id)}
                          className="text-slate-500 hover:text-slate-200 shrink-0 p-1"
                          title="Salin perintah"
                        >
                          {copiedId === s.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(s)}
                      className="h-7 px-2 text-indigo-400 hover:text-indigo-300 text-xs"
                      title="Edit skill"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      <span>Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartPromptStudio(s)}
                      className="h-7 px-2 text-amber-400 hover:text-amber-300 text-xs"
                      title="Buka Prompt Studio 1:1 khusus skill ini"
                    >
                      <Wand2 className="w-3.5 h-3.5 mr-1" />
                      <span>Prompt 1:1</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartDetail(s)}
                      className="h-7 px-2 text-slate-400 hover:text-slate-200 text-xs"
                      title="Detail"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>

                    {deleteConfirmId === s.id ? (
                      <div className="flex items-center gap-1 bg-red-950 p-0.5 rounded border border-red-800">
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(s.id, s.name)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white"
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1 py-0.5 rounded text-[10px] text-slate-400"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(s.id)}
                        className="h-7 px-2 text-slate-500 hover:text-red-400 text-xs"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === "prompt_studio" && activeSkill && (
        <div className="space-y-4">
          <AiPromptStudio
            skillName={activeSkill.name}
            skillSlug={activeSkill.slug}
            skillSummary={activeSkill.summary}
            category={activeSkill.categories[0]?.name || activeSkill.skillType}
            currentImageUrl={activeSkill.previewImageUrl}
            onSavePreview={handleSavePreviewOption}
            onClose={() => setViewMode("grid")}
          />
        </div>
      )}

      {(viewMode === "create" || viewMode === "edit") && (
        <form onSubmit={handleSaveSkill} className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-5 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  {viewMode === "create" ? "Tambah Skill Baru ke Registry" : `Edit Skill: ${formData.name}`}
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
                onClick={() => setViewMode("grid")}
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
                value={formData.name}
                onChange={(e) => {
                  const v = e.target.value;
                  const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  setFormData({
                    ...formData,
                    name: v,
                    slug: viewMode === "create" ? slug : formData.slug
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
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, skillType: e.target.value })}
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
                value={formData.authorDisplay}
                onChange={(e) => setFormData({ ...formData, authorDisplay: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Publikasi
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                value={formData.command}
                onChange={(e) => setFormData({ ...formData, command: e.target.value })}
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
                value={formData.previewImageUrl}
                onChange={(e) => setFormData({ ...formData, previewImageUrl: e.target.value })}
                placeholder="https://... atau /previews/nama-skill.svg"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-800 bg-slate-950 text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </form>
      )}

      {viewMode === "detail" && activeSkill && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 sm:p-7 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartPromptStudio(activeSkill)}
                className="text-xs border-amber-500/40 text-amber-300"
              >
                <Wand2 className="w-3.5 h-3.5 mr-1" />
                <span>Prompt 1:1</span>
              </Button>
              <Link href={`/skills/${activeSkill.slug}/`} target="_blank">
                <Button variant="outline" size="sm" className="text-xs border-slate-800 text-slate-300">
                  <span>Publik</span>
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
                Pratinjau Gambar 1:1
              </h3>
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center">
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
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-mono">Memuat Registry Grid...</div>}>
      <AdminContent />
    </Suspense>
  );
}
