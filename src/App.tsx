import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/app-layout";
import { AuthSync } from "./components/auth/auth-sync";
import { Login } from "./components/auth/login";
import { ProtectedRoute } from "./components/protected-route";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <AuthSync />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
