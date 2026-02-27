import { create } from "zustand";

/** Chats are persisted to localStorage under this key. No backend or DB setup needed. */
const STORAGE_KEY = "fulcrum_chats";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type Chat = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

type ChatState = {
  chats: Chat[];
  loadFromStorage: () => void;
  saveToStorage: () => void;
  getChat: (id: string) => Chat | undefined;
  createChat: (id?: string) => string;
  updateChat: (id: string, update: Partial<Pick<Chat, "title" | "messages">>) => void;
  deleteChat: (id: string) => void;
  deleteAllChats: () => void;
  getOrderedChats: () => Chat[];
};

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Chat[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveChats(chats: Chat[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // ignore
  }
}

function generateId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: loadChats(),

  loadFromStorage: () => set({ chats: loadChats() }),

  saveToStorage: () => {
    saveChats(get().chats);
  },

  getChat: (id: string) => get().chats.find((c) => c.id === id),

  createChat: (id?: string) => {
    const chatId = id ?? generateId();
    const newChat: Chat = {
      id: chatId,
      title: "New chat",
      messages: [],
      updatedAt: Date.now(),
    };
    set((state) => ({
      chats: [newChat, ...state.chats.filter((c) => c.id !== chatId)],
    }));
    saveChats(get().chats);
    return chatId;
  },

  updateChat: (id: string, update: Partial<Pick<Chat, "title" | "messages">>) => {
    set((state) => ({
      chats: state.chats.map((c) =>
        c.id === id
          ? {
              ...c,
              ...update,
              updatedAt: Date.now(),
              title: update.title ?? c.title,
              messages: update.messages ?? c.messages,
            }
          : c
      ),
    }));
    saveChats(get().chats);
  },

  deleteChat: (id: string) => {
    set((state) => ({ chats: state.chats.filter((c) => c.id !== id) }));
    saveChats(get().chats);
  },

  deleteAllChats: () => {
    set({ chats: [] });
    localStorage.removeItem(STORAGE_KEY);
  },

  getOrderedChats: () => {
    return [...get().chats].sort((a, b) => b.updatedAt - a.updatedAt);
  },
}));
