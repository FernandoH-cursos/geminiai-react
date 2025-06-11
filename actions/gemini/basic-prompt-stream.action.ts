import { fetch } from "expo/fetch";
import { FileType, promptWithFiles } from "../helpers";

const API_URL = process.env.EXPO_PUBLIC_GEMINI_API_URL;

//* "expo/fetch" es una versión de la función fetch que está optimizada para funcionar en aplicaciones Expo.
//* Se utiliza para hacer solicitudes HTTP a un servidor, similar a la función fetch nativa de JavaScript, pero con algunas
//* adaptaciones para el entorno de Expo. Por ejemplo, para stream de datos, Expo utiliza una implementación que permite manejar
//* flujos de datos de manera eficiente, lo que es útil para aplicaciones que necesitan recibir datos en tiempo real o en partes.

export const getBasicPromptStream = async (
  prompt: string,
  files: FileType[],
  onChunk: (text: string) => void
) => {
  //* Si hay archivos adjuntos, se envían a la API de Gemini utilizando la función promptWithFiles que soporta FormData con archivos. 
  if (files.length > 0) {
    const response = await promptWithFiles("/basic-prompt-stream", prompt, files);
    console.log(JSON.stringify({response}, null, 2));

    onChunk(response);
    return;
  }

  //* Si no hay archivos adjuntos, se envía el prompt directamente a la API de Gemini usando expo/fetch. 
  const formData = new FormData();
  formData.append("prompt", prompt);

  try {
    const response = await fetch(`${API_URL}/basic-prompt-stream`, {
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

    //* Este 'reader' es un ReadableStream que permite leer los datos a medida que se reciben.
    const reader = response.body.getReader();
    //* TextDecoder permite decodificar los bytes recibidos en texto. Es útil para manejar flujos de datos que llegan en partes.
    //* El parámetro "utf-8" indica que los datos están codificados en UTF-8, que es un formato común para texto.
    const decoder = new TextDecoder("utf-8");

    //* Aquí se guarda el resultado final que se va construyendo a medida que se leen los datos del flujo.
    let result = "";

    while (true) {
      //* Leemos un fragmento de datos del flujo. 'done' indica si se ha llegado al final del flujo, y 'value' contiene los datos leídos.
      const { done, value } = await reader.read();
      // Si no hay más datos, salimos del bucle
      if (done) break;

      //* Decodificamos los bytes recibidos y los agregamos al resultado.
      //* Un 'chunk' es una parte de los datos que se recibe en el flujo. {stream: true} indica que se espera
      //* recibir datos en partes, no todo de una vez.
      const chunk = decoder.decode(value, { stream: true });
      result += chunk;

      //* Llamamos a la función onChunk con el texto decodificado.
      //* Esto permite que la aplicación maneje los datos a medida que se reciben, en
      //* lugar de esperar a que todo el flujo se complete.
      onChunk(result);

      // console.log({result});
    }
  } catch (error) {
    console.error(error);
    throw "Unpected error happened";
    
  }
};
