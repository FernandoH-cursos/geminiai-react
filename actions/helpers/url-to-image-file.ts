import * as GeminiActions from '@/actions/gemini';

export const urlToImageFile = async(url: string): Promise<GeminiActions.ImageFile> => {
  const response = await fetch(url);

  // Convierte la respuesta a un blob
  const blob = await response.blob();

  return {
    uri: url,
    mimetype: blob.type ?? "image/jpeg",
    fileName: url.split("/").pop() ?? "image.jpg",
  }
}