import { createContext, useContext, useState, ReactNode } from "react";
import type { User, Role } from "../types";
import * as api from "../services/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role, roomNumber?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("shems_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function persist(token: string, user: User) {
    localStorage.setItem("shems_token", token);
    localStorage.setItem("shems_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await api.login(email, password);
      persist(token, user);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function register(name: string, email: string, password: string, role: Role, roomNumber?: string) {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await api.register(name, email, password, role, roomNumber);
      persist(token, user);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("shems_token");
    localStorage.removeItem("shems_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
