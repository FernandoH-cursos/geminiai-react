import * as GeminiActions from "@/actions/gemini";
import { urlToImageFile } from "@/actions/helpers";

import { create } from "zustand";

/*
? Estados:
* 'isGenerating' permite saber si se está generando una imagen o no(loader).
* 'images' es un array que contiene las imágenes generadas pero se limpia al iniciar una nueva generación.
* 'history' es un array que contiene el historial de imágenes generadas.
* 'previousPrompt' es un string que contiene el último prompt utilizado para generar imágenes.
*  'previousImages' es un array que contiene las imágenes seleccionadas anteriormente, ya sea de la galería o otro medio.
*  'selectedStyle' es un string que contiene el estilo seleccionado para la generación de imágenes.
*  'selectedImage' es un string que contiene la imagen seleccionada actualmente en la galeria.
* 
? Acciones:
* 'generateImage' es una función que recibe un prompt y un array de imágenes, y se encarga de generar una nueva imagen.
* 'generateNextImage' es una función que se encarga de generar la siguiente imagen en base al historial de imágenes.
*  'setSelectedStyle' es una función que permite establecer el estilo seleccionado para la generación de imágenes.
*  'setSelectedImage' es una función que permite establecer la imagen seleccionada actualmente en la galería.
*/

interface ImagePlaygroundState {
  // State
  isGenerating: boolean;
  images: string[];
  history: string[];
  previousPrompt: string;
  previousImages: GeminiActions.ImageFile[];
  selectedStyle: string;
  selectedImage: string;

  // Acciones
  generateImage: (
    prompt: string,
    images: GeminiActions.ImageFile[]
  ) => Promise<void>;
  generateNextImage: () => Promise<void>;
  setSelectedStyle: (style: string) => void;
  setSelectedImage: (imageUrl: string) => void;
}

export const useImagePlaygroundStore = create<ImagePlaygroundState>(
  (set, get) => ({
    isGenerating: false,
    images: [],
    history: [],
    previousPrompt: "",
    previousImages: [],
    selectedStyle: "",
    selectedImage: "",

    generateImage: async (
      prompt: string,
      images: GeminiActions.ImageFile[]
    ): Promise<void> => {
      const selectedStyle = get().selectedStyle;
      const selectedImage = get().selectedImage;

      set({
        isGenerating: true,
        images: [],
        previousPrompt: prompt,
        previousImages: images,
      });

      //* Si el estilo seleccionado no es vacío, se añade al prompt.
      if (selectedStyle !== "") {
        prompt = `${prompt} con un estilo ${selectedStyle}`;
      }

      //* Si hay una imagen seleccionada, se convierte a un archivo de imagen. 
      if (selectedImage !== "") {
        const imageFile = await urlToImageFile(selectedImage);
        console.log(JSON.stringify(imageFile, null, 2));
        images.push(imageFile);
      }

      const { imageUrl } = await GeminiActions.getImageGeneration(
        prompt,
        images
      );

      if (!imageUrl) {
        set({ isGenerating: false });
        return;
      }

      //* Actualiza el estado con la nueva imagen generada.
      const currentImages = [imageUrl, ...get().history];
      set({
        isGenerating: false,
        images: [imageUrl],
        history: currentImages,
      });

      //** Añade la nueva imagen al historial al llegar a la ultima imagen generada.
      setTimeout(() => {
        get().generateNextImage();
      }, 500);
    },
    generateNextImage: async (): Promise<void> => {
      let previousPrompt = get().previousPrompt;

      const currentImages = get().images;
      const currentHistory = get().history;
      const previousImages = get().previousImages;
      const selectedStyle = get().selectedStyle;

      //* Si el estilo seleccionado no es vacío, se añade al prompt previo
      if (selectedStyle !== "") {
        previousPrompt = `${previousPrompt} con un estilo ${selectedStyle}`;
      }

      set({
        isGenerating: true,
      });

      const { imageUrl } = await GeminiActions.getImageGeneration(
        previousPrompt,
        previousImages
      );

      if (!imageUrl) {
        set({ isGenerating: false });
        return;
      }

      //* Actualiza el estado con la nueva imagen generada.
      set({
        isGenerating: false,
        images: [...currentImages, imageUrl],
        history: [imageUrl, ...currentHistory],
      });
    },
    setSelectedStyle: (style: string) => {
      //* Si el estilo seleccionado es el mismo que el actual, se deselecciona.
      if (style === get().selectedStyle) {
        set({ selectedStyle: "" });
        return;
      }

      set({ selectedStyle: style });
    },
    setSelectedImage: (imageUrl: string) => {
      //* Si la imagen seleccionada es la misma que la actual, se deselecciona.
      if (imageUrl === get().selectedImage) {
        set({ selectedImage: "" });
        return;
      }

      set({ selectedImage: imageUrl });
    },
  })
);
