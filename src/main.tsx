import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.tsx";

const domain = import.meta.env.VITE_AUTH0_DOMAIN?.trim() ?? "";
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID?.trim() ?? "";
const audience = import.meta.env.VITE_AUTH0_AUDIENCE?.trim() ?? "";

if (!domain || !clientId) {
  console.warn(
    "Auth0 not configured: set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env and restart the dev server"
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={domain ?? ""}
      clientId={clientId ?? ""}
      authorizationParams={{
        redirect_uri: window.location.origin,
        ...(audience ? { audience } : {}),
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
