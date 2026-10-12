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

export function getDemoAccountByEmail(email: string) {
  return DEMO_ACCOUNTS.find((account) => account.email.toLowerCase() === email.toLowerCase());
}

export function getAdminAccountByEmail(email: string) {
  const account = getDemoAccountByEmail(email);
  return account && isAdminRole(account.role) ? account : null;
}

export function getUserAccountByEmail(email: string) {
  const account = getDemoAccountByEmail(email);
  return account && account.role === "USER" ? account : null;
}
