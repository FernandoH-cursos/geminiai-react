import { create } from "zustand";

import { Message } from "@/interfaces/chat.interfaces";
import * as GeminiActions from "@/actions/gemini/basic-prompt.action";

import uuid from "react-native-uuid";

interface BasicPromptState {
  geminiWriting: boolean;
  messages: Message[];
  addMessage: (text: string) => void;
  setGeminiWriting: (isWriting: boolean) => void;
}

type Sender = "user" | "gemini";

const createMessage = (text: string, sender: Sender): Message => ({
  id: uuid.v4(),
  text,
  createdAt: new Date(),
  sender,
  type: "text",
});

export const useBasicPromptStore = create<BasicPromptState>((set) => ({
  geminiWriting: false,
  messages: [],

  addMessage: async(text: string) => {
    const userMessage = createMessage(text, "user");

    //* Añade el mensaje del usuario y establece que Gemini está escribiendo
    set((state) => ({
      geminiWriting: true,
      messages: [userMessage, ...state.messages],
    }));

    //* Llama a la API de Gemini para obtener la respuesta
    const geminiResponseText = await GeminiActions.getBasicPrompt(text);

    //* Crea el nuevo mensaje de Gemini
    const geminiMessage = createMessage(geminiResponseText, "gemini");

    //* Actualiza el estado con el mensaje de Gemini y establece que ya no está escribiendo
    set((state) => ({
      geminiWriting: false,
      messages: [geminiMessage, ...state.messages],
    }));

  },
  setGeminiWriting: (isWriting: boolean) => {
    set({
      geminiWriting: isWriting,
    });
  },
}));
