import { create } from "zustand";

import { Message } from "@/interfaces/chat.interfaces";
import * as GeminiActions from "@/actions/gemini";

import uuid from "react-native-uuid";

interface BasicPromptState {
  geminiWriting: boolean;
  messages: Message[];
  addMessage: (prompt: string, attachments: any[]) => void;
  setGeminiWriting: (isWriting: boolean) => void;
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

export const useBasicPromptStore = create<BasicPromptState>((set) => ({
  geminiWriting: false,
  messages: [],

  addMessage: async (prompt: string, attachments: any[]) => {
    const userMessage = createMessage(prompt, "user", attachments);
    //* Crea un nuevo mensaje de Gemini con un texto inicial
    const geminiMessage = createMessage("Generando respuesta...", "gemini");

    //* Añade el mensaje del usuario y establece que Gemini está escribiendo
    set((state) => ({
      geminiWriting: true,
      messages: [geminiMessage, userMessage, ...state.messages],
    }));

    GeminiActions.getBasicPromptStream(prompt, attachments, (text) => {
      //* El map se utiliza para actualizar el mensaje de Gemini en el estado.
      //* Esto es necesario porque el mensaje de Gemini se va actualizando a medida que se recibe el texto.
      //* Si el mensaje de Gemini ya existe, se actualiza su texto. Si no, se crea uno nuevo.
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === geminiMessage.id ? { ...msg, text } : msg
        ),
      }));
    });

    set({
      geminiWriting: false,
    })

    //* Llama a la API de Gemini para obtener la respuesta
    // const geminiResponseText = await GeminiActions.getBasicPrompt(text);
    //* Crea el nuevo mensaje de Gemini
    // const geminiMessage = createMessage(geminiResponseText, "gemini");
    //* Actualiza el estado con el mensaje de Gemini y establece que ya no está escribiendo
    /*  set((state) => ({
      geminiWriting: false,
      messages: [geminiMessage, ...state.messages],
    })); */
  },
  setGeminiWriting: (isWriting: boolean) => {
    set({
      geminiWriting: isWriting,
    });
  },
}));
