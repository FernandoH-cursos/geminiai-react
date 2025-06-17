

import { ImagePickerAsset } from "expo-image-picker";
import { FileType, promptWithFiles } from "../helpers";



export type ImageFile = FileType | ImagePickerAsset;

export interface ImageGenerationResponse {
  imageUrl: string;
  text: string;
}

export const getImageGeneration = async (
  prompt: string,
  files: ImageFile[]
): Promise<ImageGenerationResponse> => {
  console.log(JSON.stringify({  files }, null, 2));
  const response = await promptWithFiles<ImageGenerationResponse>(
    "/image-generation",
    { prompt },
    files as FileType[],
  );

  return response;
};
