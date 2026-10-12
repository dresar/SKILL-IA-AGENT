export type UserRole = "SUPER_ADMIN" | "CURATOR" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  provider?: "google" | "credentials" | "demo";
}

export interface DemoAccount {
  role: UserRole;
  roleLabel: string;
  name: string;
  email: string;
  badge: string;
  description: string;
}

export const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "CURATOR"];

export const ADMIN_EMAILS = [
  "eka.ckp16799@gmail.com",
  "nailongping2@gmail.com"
];

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "SUPER_ADMIN",
    roleLabel: "Super Admin",
    name: "Eka Syarif Maulana",
    email: "eka.ckp16799@gmail.com",
    badge: "SUPER ADMIN",
    description: "Akses penuh manajemen skill, sync GitHub, dan audit logs."
  },
  {
    role: "SUPER_ADMIN",
    roleLabel: "Super Admin",
    name: "nailong ping Aja",
    email: "nailongping2@gmail.com",
    badge: "SUPER ADMIN",
    description: "Pemilik proyek database Neon dan administrator pusat."
  },
  {
    role: "CURATOR",
    roleLabel: "Curator",
    name: "Registry Curator",
    email: "curator@agent.io",
    badge: "CURATOR",
    description: "Kurasi skill, verifikasi metadata, dan audit status."
  },
  {
    role: "USER",
    roleLabel: "Explorer",
    name: "AI Engineer",
    email: "developer@community.org",
    badge: "USER",
    description: "Eksplorasi skill publik, copy instruksi agent, dan uji MCP."
  }
];

export function isUserRole(role: unknown): role is UserRole {
  return role === "SUPER_ADMIN" || role === "CURATOR" || role === "USER";
}

export function isAdminRole(role: unknown): role is "SUPER_ADMIN" | "CURATOR" {
  return role === "SUPER_ADMIN" || role === "CURATOR";
}

export function isSuperAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function getDemoAccountByEmail(email: string) {
  return DEMO_ACCOUNTS.find((account) => account.email.toLowerCase() === email.toLowerCase());
}

export function getAdminAccountByEmail(email: string) {
  const norm = email.toLowerCase().trim();
  if (isSuperAdminEmail(norm)) {
    const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === norm);
    return matched || {
      role: "SUPER_ADMIN" as UserRole,
      roleLabel: "Super Admin",
      name: norm.split("@")[0],
      email: norm,
      badge: "SUPER ADMIN",
      description: "Administrator sistem"
    };
  }
  const account = getDemoAccountByEmail(email);
  return account && isAdminRole(account.role) ? account : null;
}

export function getUserAccountByEmail(email: string) {
  const account = getDemoAccountByEmail(email);
  return account && account.role === "USER" ? account : null;
}
