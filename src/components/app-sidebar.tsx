import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Plus, Trash2, LogOut, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/auth";
import { useChatStore } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const navigate = useNavigate();
  const { id: currentChatId } = useParams<{ id: string }>();
  const { user: auth0User, logout: auth0Logout } = useAuth0();
  const { user: storeUser, logout } = useAuthStore();
  const { deleteAllChats } = useChatStore();
  const chatsRaw = useChatStore((s) => s.chats);
  const chats = useMemo(
    () => [...chatsRaw].sort((a, b) => b.updatedAt - a.updatedAt),
    [chatsRaw]
  );

  const handleLogout = () => {
    logout();
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleNewChat = () => {
    navigate("/chat/new");
  };

  const handleDeleteAllChats = () => {
    deleteAllChats();
    navigate("/");
  };

  const displayName = auth0User?.name ?? storeUser?.name ?? storeUser?.email ?? "User";
  const displayEmail = auth0User?.email ?? storeUser?.email ?? null;
  const avatarUrl = auth0User?.picture ?? null;

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-zinc-900/80">
      <div className="flex flex-1 flex-col overflow-hidden p-4">
        <div className="flex items-center justify-between gap-2">
          <Link
            to="/"
            className="shrink-0 cursor-pointer rounded-md px-2 font-semibold text-lg text-foreground hover:bg-muted"
          >
            Fulcrum AI
          </Link>
          <div className="flex items-center gap-0.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    onClick={handleDeleteAllChats}
                    aria-label="Delete all chats"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete All Chats</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    type="button"
                    onClick={handleNewChat}
                    aria-label="New chat"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="mt-3 flex flex-1 flex-col gap-1 overflow-y-auto">
          {chats.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Your conversations will appear here. Start by clicking New Chat or sending a message.
            </p>
          ) : (
            chats.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  currentChatId === chat.id
                    ? "bg-zinc-700 text-foreground"
                    : "text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{chat.title}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-700 text-zinc-300"
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {displayName}
            </p>
            {displayEmail && (
              <p className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start gap-2 text-muted-foreground hover:bg-zinc-800 hover:text-foreground"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
