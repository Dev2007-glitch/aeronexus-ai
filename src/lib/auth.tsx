import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "passenger" | "pilot" | "crew" | "maintenance" | "security" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, role: Role, name?: string) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "aeronexus.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* noop */ }
    }
  }, []);

  const login = (email: string, role: Role, name?: string) => {
    const u: AuthUser = {
      id: role.toUpperCase().slice(0, 3) + "-" + Math.floor(10000 + Math.random() * 90000),
      name: name || email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      phone: "+1 (555) 010-" + Math.floor(1000 + Math.random() * 9000),
    };
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
}
