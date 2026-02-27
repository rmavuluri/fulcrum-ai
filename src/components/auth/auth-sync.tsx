import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { fetchSandboxToken } from "@/lib/api";

/**
 * On load: get sandbox token from fulcrum-ai-backend and store it.
 * All API calls (chat, documents) then use this token in Authorization header.
 */
export function AuthSync() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    let cancelled = false;

    fetchSandboxToken()
      .then((token) => {
        if (cancelled) return;
        login(token, {
          id: "sandbox",
          email: "",
          name: "Sandbox",
        });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[AuthSync] fetchSandboxToken failed:", err);
        logout();
      });

    return () => {
      cancelled = true;
    };
  }, [login, logout]);

  return null;
}
