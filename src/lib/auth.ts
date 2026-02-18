import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("auth_token"),
  isAuthenticated: !!localStorage.getItem("auth_token"),
  login: (token: string, user: User) => {
    localStorage.setItem("auth_token", token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ token: null, user: null, isAuthenticated: false });
  },
  setUser: (user: User) => {
    set({ user });
  },
}));

// JWT helper functions
export function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= (decoded.exp as number) * 1000;
}
