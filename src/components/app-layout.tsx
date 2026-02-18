import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { PanelLeft, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppSidebar } from "./app-sidebar";
import { ChatArea } from "./chat-area";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {sidebarOpen ? <AppSidebar /> : null}
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center border-b border-border bg-zinc-900/80 px-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sidebarOpen ? "Close sidebar" : "Open sidebar"}
            </TooltipContent>
          </Tooltip>
        </header>
        <div className="min-h-0 flex-1">
          <Routes>
            <Route path="/" element={<ChatArea />} />
            <Route path="/chat/:id" element={<ChatArea />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
