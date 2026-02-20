import { useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
import { useAuthStore } from "@/lib/auth";

/**
 * Syncs Auth0 state (user + access token) into the app auth store.
 * Auth0 disabled: set a guest user so sidebar and app work without Auth0.
 */
export function AuthSync() {
  // const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    // Auth0 disabled: set guest user so chat loads directly
    const existingToken = localStorage.getItem("auth_token");
    if (!existingToken) {
      login("guest-token", {
        id: "guest",
        email: "guest@local",
        name: "Guest",
      });
    }

    // Original Auth0 sync (commented):
    // if (!isAuthenticated || !user) {
    //   ranForUser.current = null;
    //   logout();
    //   return;
    // }
    // const userKey = user.sub ?? "";
    // if (ranForUser.current === userKey) return;
    // ranForUser.current = userKey;
    // let cancelled = false;
    // getAccessTokenSilently()
    //   .then((token) => {
    //     if (cancelled) return;
    //     login(token, { id: user.sub ?? "", email: user.email ?? "", name: user.name ?? undefined });
    //   })
    //   .catch((err) => {
    //     if (cancelled) return;
    //     ranForUser.current = null;
    //     console.error("[AuthSync] getAccessTokenSilently failed:", err);
    //     logout();
    //   });
    // return () => { cancelled = true; };
  }, [login]);

  return null;
}
