import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

const hasAuth0Config =
  typeof import.meta.env.VITE_AUTH0_DOMAIN === "string" &&
  import.meta.env.VITE_AUTH0_DOMAIN.trim() !== "" &&
  typeof import.meta.env.VITE_AUTH0_CLIENT_ID === "string" &&
  import.meta.env.VITE_AUTH0_CLIENT_ID.trim() !== "";

export function Login() {
  const { loginWithRedirect, isLoading } = useAuth0();
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    if (!hasAuth0Config) {
      setError(
        "Auth0 not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env and restart the dev server (npm run dev)."
      );
      return;
    }
    setIsRedirecting(true);
    try {
      await loginWithRedirect();
    } catch (err) {
      setIsRedirecting(false);
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error("[Login] loginWithRedirect failed:", err);
    }
  };

  const busy = isLoading || isRedirecting;

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Fulcrum AI</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>
        {!hasAuth0Config && (
          <p className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
            Add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to your .env file and
            restart the dev server.
          </p>
        )}
        {error && (
          <p className="rounded-md bg-destructive/20 p-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button
          type="button"
          className="w-full"
          disabled={busy || !hasAuth0Config}
          onClick={handleSignIn}
        >
          {busy ? "Redirecting to Auth0..." : "Sign in with Auth0"}
        </Button>
      </div>
    </div>
  );
}
