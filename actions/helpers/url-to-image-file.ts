import { FileType } from "./prompt-with-images";

export const urlToImageFile = async(url: string): Promise<FileType> => {
  const response = await fetch(url);

  // Convierte la respuesta a un blob
  const blob = await response.blob();

  return {
    uri: url,
    mimetype: blob.type ?? "image/jpeg",
    fileName: url.split("/").pop() ?? "image.jpg",
  }
}