import geminiApi from "../gemini.api";

export const getBasicPrompt = async (prompt: string): Promise<string> => {
  const response = await geminiApi.post(
    "/basic-prompt",
    {
      prompt,
    },
    {
      responseType: "text",
    }
  );

  // console.log(JSON.stringify({ response: response.data }, null, 2));

  return response.data.trim();
};
