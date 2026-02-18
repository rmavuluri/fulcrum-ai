import { PromptInput } from "./prompt-input";

export function ChatArea() {
  return (
    <div className="flex h-full flex-col bg-black">
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Hello there!</h1>
          <p className="text-muted-foreground">How can I help you today?</p>
        </div>
      </div>
      <div className="flex justify-center px-4 pb-6 pt-2">
        <div className="w-full max-w-3xl">
          <PromptInput />
        </div>
      </div>
    </div>
  );
}
