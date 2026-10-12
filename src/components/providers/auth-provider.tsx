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
  loginUser: (email: string) => AuthUser;
  loginAdmin: (email: string) => AuthUser | null;
  loginWithGoogle: () => AuthUser;
  logout: () => void;
}

const STORAGE_KEY = "skill_uiai_auth";
const ROLE_COOKIE = "skill_uiai_role";
const EMAIL_COOKIE = "skill_uiai_email";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  login: () => null,
  loginUser: () => ({ id: "", email: "", name: "", role: "USER" }),
  loginAdmin: () => null,
  loginWithGoogle: () => ({ id: "", email: "", name: "", role: "SUPER_ADMIN" }),
  logout: () => {}
});

function createUser(email: string, name: string, role: UserRole, provider: AuthUser["provider"] = "credentials"): AuthUser {
  return {
    id: "usr-" + Math.random().toString(36).substring(2, 9),
    email,
    name,
    role,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    provider
  };
}

function writeAuthCookies(user: AuthUser | null) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  if (!user) {
    document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    document.cookie = `${EMAIL_COOKIE}=; path=/; max-age=0; SameSite=Lax${secure}`;
    return;
  }

  document.cookie = `${ROLE_COOKIE}=${encodeURIComponent(user.role)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
  document.cookie = `${EMAIL_COOKIE}=${encodeURIComponent(user.email)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

function isStoredUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthUser>;
  return typeof user.email === "string" && typeof user.name === "string" && isUserRole(user.role);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isStoredUser(parsed)) {
        setUser(parsed);
        writeAuthCookies(parsed);
      }
    } catch {}
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

  const loginUser = (email: string) => {
    const matched = getUserAccountByEmail(email);
    const newUser = matched
      ? createUser(matched.email, matched.name, "USER")
      : createUser(email, email.split("@")[0] || "User", "USER");

    saveUser(newUser);
    return newUser;
  };

  const loginAdmin = (email: string) => {
    const matched = getAdminAccountByEmail(email);
    if (!matched) return null;

    const newUser = createUser(matched.email, matched.name, matched.role);
    saveUser(newUser);
    return newUser;
  };

  const login = (email: string, role: UserRole = "USER") => {
    if (isAdminRole(role)) {
      return loginAdmin(email);
    }
    return loginUser(email);
  };

  const loginWithGoogle = () => {
    const defaultAdmin = DEMO_ACCOUNTS[0];
    const newUser = createUser(defaultAdmin.email, defaultAdmin.name, "SUPER_ADMIN", "google");
    saveUser(newUser);
    return newUser;
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
        loginAdmin,
        loginWithGoogle,
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
