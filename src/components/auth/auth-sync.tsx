import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "@/lib/auth";

/**
 * Syncs Auth0 state (user + access token) into the app auth store
 * so ProtectedRoute and API calls can use the same token.
 */
export function AuthSync() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const ranForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      ranForUser.current = null;
      logout();
      return;
    }

    const userKey = user.sub ?? "";
    if (ranForUser.current === userKey) return;
    ranForUser.current = userKey;

    let cancelled = false;

    getAccessTokenSilently()
      .then((token) => {
        if (cancelled) return;
        login(token, {
          id: user.sub ?? "",
          email: user.email ?? "",
          name: user.name ?? undefined,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        ranForUser.current = null;
        console.error("[AuthSync] getAccessTokenSilently failed:", err);
        logout();
      });

    return () => {
      cancelled = true;
    };
    // Only run when Auth0 auth state or user identity changes; avoid re-running on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.sub]);

  return null;
}
