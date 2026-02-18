import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Paperclip, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMCP } from "@/hooks/use-mcp";

const MODEL_OPTIONS = [
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "claude-3", label: "Claude 3" },
] as const;

export function PromptInput() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { callTool, isConnected } = useMCP();

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      setAttachedFiles(Array.from(files));
    }
    e.target.value = "";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const message = input.trim();
    setInput("");
    setAttachedFiles([]);

    try {
      if (message.startsWith("/tool ")) {
        const toolName = message.split(" ")[1];
        const args = message.split(" ").slice(2).join(" ");

        if (isConnected) {
          try {
            const result = await callTool(toolName, JSON.parse(args || "{}"));
            console.log("Tool result:", result);
          } catch (error) {
            console.error("Tool call failed:", error);
          }
        }
      } else {
        console.log("Sending message:", message);
        console.log("Selected model:", selectedModel);
        if (attachedFiles.length) {
          console.log("Attached files:", attachedFiles.map((f) => f.name));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const currentModelLabel =
    MODEL_OPTIONS.find((m) => m.value === selectedModel)?.label ?? "Gemini 2.5 Flash Lite";

  return (
    <div className="w-full">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          className={cn(
            "min-h-[120px] flex-1 resize-none border-0 bg-transparent px-4 pt-4 pb-2",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-zinc-500 text-zinc-200"
          )}
          rows={4}
        />
        <div className="flex items-center gap-1 border-t border-border px-2 py-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="sr-only"
            aria-hidden
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200"
            onClick={handleAttachmentClick}
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger
              className={cn(
                "h-9 w-auto shrink-0 gap-1.5 border-0 bg-transparent px-3 py-0 shadow-none",
                "hover:bg-zinc-700/80 hover:text-zinc-200",
                "text-sm font-medium text-zinc-400"
              )}
            >
              <SelectValue placeholder="Select model">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  {currentModelLabel}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="min-w-[12rem]">
              {MODEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="icon"
            className="ml-auto h-9 w-9 shrink-0 rounded-full bg-zinc-600 text-zinc-200 hover:bg-zinc-500 disabled:opacity-50"
            type="button"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {attachedFiles.length > 0 && (
        <p className="mt-1.5 text-xs text-zinc-500">
          {attachedFiles.length} file(s) attached:{" "}
          {attachedFiles.map((f) => f.name).join(", ")}
        </p>
      )}
    </div>
  );
}
