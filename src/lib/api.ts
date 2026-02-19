import { useAuthStore } from "@/lib/auth";

const getBaseUrl = () =>
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Returns headers including Authorization Bearer token when user is authenticated.
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
 * Fetch current user from backend (requires valid JWT).
 */
export async function fetchMe(): Promise<{ user: { id: string; email: string; name?: string } }> {
  const res = await fetch(`${getBaseUrl()}/api/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

/**
 * Send a chat message to the backend (document-aware Claude). Requires valid JWT.
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
