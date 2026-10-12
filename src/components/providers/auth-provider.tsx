"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthUser, UserRole, DEMO_ACCOUNTS } from "@/lib/auth/types";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, role?: UserRole) => void;
  loginWithGoogle: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const STORAGE_KEY = "skill_uiai_auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isSuperAdmin: false,
  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  switchRole: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveUser = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = (email: string, role: UserRole = "USER") => {
    const matched = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    const finalRole = matched ? matched.role : role;
    const finalName = matched ? matched.name : email.split("@")[0];
    const newUser: AuthUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      name: finalName,
      role: finalRole,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
      provider: "credentials"
    };
    saveUser(newUser);
  };

  const loginWithGoogle = () => {
    const defaultAdmin = DEMO_ACCOUNTS[0];
    const newUser: AuthUser = {
      id: "usr-google-" + Math.random().toString(36).substring(2, 9),
      email: defaultAdmin.email,
      name: defaultAdmin.name,
      role: "SUPER_ADMIN",
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=google-admin`,
      provider: "google"
    };
    saveUser(newUser);
  };

  const switchRole = (role: UserRole) => {
    const acc = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    const updatedUser: AuthUser = {
      id: "usr-" + role.toLowerCase(),
      email: acc.email,
      name: acc.name,
      role: acc.role,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(acc.email)}`,
      provider: "demo"
    };
    saveUser(updatedUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "CURATOR";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        login,
        loginWithGoogle,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
