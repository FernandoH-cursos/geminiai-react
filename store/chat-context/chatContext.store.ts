import { create } from "zustand";

import { Message } from "@/interfaces/chat.interfaces";
import * as GeminiActions from "@/actions/gemini";

import uuid from "react-native-uuid";

interface ChatContextState {
  geminiWriting: boolean;
  chatId: string;
  messages: Message[];
  addMessage: (prompt: string, attachments: any[]) => void;
  clearChat: () => void;
}

type Sender = "user" | "gemini";

const createMessage = (
  text: string,
  sender: Sender,
  attachments: any[] = []
): Message => {
  if (attachments.length > 0) {
    return {
      id: uuid.v4(),
      text,
      createdAt: new Date(),
      sender,
      type: "image",
      images: attachments.map((attachment) => attachment.uri),
    };
  }

  return {
    id: uuid.v4(),
    text,
    createdAt: new Date(),
    sender,
    type: "text",
  };
};

export const useChatContextStore = create<ChatContextState>((set, get) => ({
  geminiWriting: false,
  chatId: uuid.v4(),
  messages: [],

  addMessage: async (prompt: string, attachments: any[]) => {
    const userMessage = createMessage(prompt, "user", attachments);
    const geminiMessage = createMessage("Generando respuesta...", "gemini");
    const chatId = get().chatId;

    set((state) => ({
      geminiWriting: true,
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    GeminiActions.getChatStream(prompt, chatId, attachments, (text) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === geminiMessage.id ? { ...msg, text } : msg
        ),
      }));
    });

    set({
      geminiWriting: false,
    });
  },
  //* Esta función limpia el chat, reiniciando el estado de los mensajes y el ID del chat.
  clearChat() {
    set({
      messages: [],
      chatId: uuid.v4(),
      geminiWriting: false,
    });
  },
}));
