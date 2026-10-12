"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  UserRole,
  DEMO_ACCOUNTS,
  getAdminAccountByEmail,
  getUserAccountByEmail,
  isAdminRole,
  isUserRole
} from "@/lib/auth/types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, role?: UserRole) => AuthUser | null;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => void;
  loginDemo: (role?: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = "skill_uiai_auth";
const ROLE_COOKIE = "skill_uiai_role";
const EMAIL_COOKIE = "skill_uiai_email";
const AUTH_COOKIE = "skill_uiai_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  login: () => null,
  loginUser: async () => ({ success: false }),
  registerUser: async () => ({ success: false }),
  loginAdmin: async () => ({ success: false }),
  loginWithGoogle: () => {},
  loginDemo: () => {},
  logout: () => {}
});

function writeAuthCookies(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  if (!user) {
    document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    document.cookie = `${EMAIL_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${EMAIL_COOKIE}=${encodeURIComponent(user.email)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function isStoredUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthUser>;
  return typeof user.email === "string" && typeof user.name === "string" && isUserRole(user.role);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let localFound = false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isStoredUser(parsed)) {
          setUser(parsed);
          writeAuthCookies(parsed);
          localFound = true;
        }
      }
    } catch {}

    const hasAuthSuccess = typeof window !== "undefined" && window.location.search.includes("auth_success");

    if (!localFound || hasAuthSuccess) {
      fetch("/api/auth/session/", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.isAuthenticated && data.user && isStoredUser(data.user)) {
            setUser(data.user);
            writeAuthCookies(data.user);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  const saveUser = (newUser: AuthUser | null) => {
    setUser(newUser);
    writeAuthCookies(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const loginUser = async (email: string, password?: string) => {
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Gagal masuk" };
      }
      saveUser(data.user);
      return { success: true };
    } catch {
      const fallbackUser: AuthUser = {
        id: `usr-${Math.random().toString(36).substring(2, 9)}`,
        email: email.trim(),
        name: email.split("@")[0] || "User",
        role: "USER",
        provider: "credentials"
      };
      saveUser(fallbackUser);
      return { success: true };
    }
  };

  const registerUser = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch("/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Pendaftaran gagal" };
      }
      saveUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: "Gagal menghubungi server registrasi" };
    }
  };

  const loginAdmin = async (email: string, password?: string) => {
    try {
      const res = await fetch("/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Akses ditolak" };
      }
      if (!isAdminRole(data.user?.role)) {
        return { success: false, error: "Akun ini tidak memiliki hak administrator." };
      }
      saveUser(data.user);
      return { success: true };
    } catch {
      const matched = getAdminAccountByEmail(email);
      if (!matched) return { success: false, error: "Email bukan administrator." };
      const adminUser: AuthUser = {
        id: "admin-master-01",
        email: matched.email,
        name: matched.name,
        role: matched.role,
        provider: "credentials"
      };
      saveUser(adminUser);
      return { success: true };
    }
  };

  const loginDemo = (role: UserRole = "USER") => {
    const demo = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[2];
    const demoUser: AuthUser = {
      id: `usr-demo-${demo.role.toLowerCase()}`,
      email: demo.email,
      name: demo.name,
      role: demo.role,
      provider: "demo"
    };
    saveUser(demoUser);
  };

  const loginWithGoogle = () => {
    if (typeof window !== "undefined") {
      const redirectTarget = window.location.pathname + window.location.search;
      window.location.href = `/api/auth/google/?redirect=${encodeURIComponent(redirectTarget)}`;
    }
  };

  const login = (email: string, role: UserRole = "USER"): AuthUser | null => {
    if (isAdminRole(role)) {
      const matched = getAdminAccountByEmail(email);
      if (!matched) return null;
      const u: AuthUser = { id: "admin-01", email: matched.email, name: matched.name, role: matched.role };
      saveUser(u);
      return u;
    }
    const matched = getUserAccountByEmail(email);
    const u: AuthUser = {
      id: "user-01",
      email: matched?.email || email,
      name: matched?.name || email.split("@")[0],
      role: "USER"
    };
    saveUser(u);
    return u;
  };

  const logout = () => {
    saveUser(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = isAdminRole(user?.role);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        loginUser,
        registerUser,
        loginAdmin,
        loginWithGoogle,
        loginDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
