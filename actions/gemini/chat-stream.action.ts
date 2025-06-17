import { fetch } from "expo/fetch";
import { FileType, promptWithFiles } from "../helpers";

const API_URL = process.env.EXPO_PUBLIC_GEMINI_API_URL;

//* Caso de uso que obtiene un flujo de chat desde la API de Gemini pero con el contexto de un chat específico (historial). 
export const getChatStream = async (
  prompt: string,
  chatId: string,
  files: FileType[],
  onChunk: (text: string) => void
) => {
  if (files.length > 0) {
    const response = await promptWithFiles<string>(
      "/chat-stream",
      { prompt, chatId },
      files
    );

    onChunk(response);
    return;
  }

  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("chatId", chatId);

  try {
    const response = await fetch(`${API_URL}/chat-stream`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "plain/text",
      },
      body: formData,
    });

    if (!response.body) {
      console.error("Theres no body in the response");
      throw new Error("Theres no body in the response");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      onChunk(result);
    }
  } catch (error) {
    console.error(error);
    throw "Unpected error happened";
  }
};
