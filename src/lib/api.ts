import { useAuthStore } from "@/lib/auth";

const getBaseUrl = () =>
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Returns headers including Authorization Bearer token (sandbox token) when set.
 * Use for all requests to fulcrum-ai-backend.
 */
export function getAuthHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Get a sandbox bearer token from the backend. Call this first; then use the stored token for /api/chat and other endpoints.
 * Stores the token in the auth store (via login). Returns the token.
 */
export async function fetchSandboxToken(): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/sandbox-token`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Failed to get sandbox token: ${res.status}`);
  }
  const token = (data as { access_token?: string }).access_token;
  if (!token) throw new Error("No access_token in sandbox-token response");
  return token;
}

/**
 * Send a chat message to the backend. Uses sandbox token in Authorization header (get it via fetchSandboxToken first).
 * Returns the assistant response text, or throws on error.
 */
export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return (data as { response?: string }).response ?? "";
}
