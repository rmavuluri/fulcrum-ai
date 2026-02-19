import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PromptInput } from "./prompt-input";
import { sendChatMessage } from "@/lib/api";
import { useChatStore, type ChatMessage } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

const TITLE_MAX_LEN = 36;

export function ChatArea() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChat, createChat, updateChat } = useChatStore();
  /** Chat we created this session (e.g. from / or /chat/new) so follow-up messages use it before URL updates */
  const createdThisSessionRef = useRef<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with store when route id changes; clear "created this session" when user opens new chat
  useEffect(() => {
    if (id && id !== "new") {
      createdThisSessionRef.current = null;
      const chat = getChat(id);
      if (chat) setMessages(chat.messages);
      else setMessages([]);
    } else {
      setMessages([]);
      createdThisSessionRef.current = null;
    }
    setError(null);
  }, [id, getChat]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      setError(null);
      const userMsg: ChatMessage = { role: "user", content: message };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      try {
        const response = await sendChatMessage(message);
        const assistantMsg: ChatMessage = { role: "assistant", content: response };
        setMessages((prev) => [...prev, assistantMsg]);

        const nextMessages = [...messages, userMsg, assistantMsg];
        const hasUrlChatId = id && id !== "new";
        const existingSessionId = createdThisSessionRef.current;
        const chatIdToUse = hasUrlChatId ? id! : existingSessionId;

        if (chatIdToUse) {
          updateChat(chatIdToUse, { messages: nextMessages });
          if (!hasUrlChatId) navigate(`/chat/${chatIdToUse}`, { replace: true });
        } else {
          const chatId = createChat();
          createdThisSessionRef.current = chatId;
          const title =
            message.length > TITLE_MAX_LEN ? message.slice(0, TITLE_MAX_LEN) + "…" : message;
          updateChat(chatId, { title, messages: nextMessages });
          navigate(`/chat/${chatId}`, { replace: true });
        }
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : "Failed to send message";
        setError(errMsg);
        const errAssistantMsg: ChatMessage = { role: "assistant", content: `Error: ${errMsg}` };
        setMessages((prev) => [...prev, errAssistantMsg]);
        const nextMessages = [...messages, userMsg, errAssistantMsg];
        const chatIdToUse = (id && id !== "new") ? id : createdThisSessionRef.current;
        if (chatIdToUse) updateChat(chatIdToUse, { messages: nextMessages });
      } finally {
        setLoading(false);
      }
    },
    [id, messages, createChat, updateChat, navigate]
  );

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col bg-black">
      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        {!hasMessages && (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-foreground">Hello there!</h1>
              <p className="text-muted-foreground">How can I help you today?</p>
            </div>
          </div>
        )}
        {hasMessages && (
          <div className="mx-auto w-full max-w-3xl space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    msg.role === "user"
                      ? "bg-emerald-600/90 text-white"
                      : "bg-zinc-800 text-zinc-200"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-zinc-800 px-4 py-3 text-zinc-400 text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        )}
        {error && !loading && (
          <p className="mx-auto mt-2 max-w-3xl text-sm text-red-400">{error}</p>
        )}
      </div>
      <div className="flex justify-center border-t border-border px-4 pb-6 pt-2">
        <div className="w-full max-w-3xl">
          <PromptInput onSendMessage={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}
