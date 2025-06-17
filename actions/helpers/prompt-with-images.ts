import geminiApi from "../gemini.api";

export interface FileType {
  uri: string;
  fileName?: string;
  mimetype?: string;
}

interface JsonBody {
  [key: string]: any;
}

//* Esta función envía un "prompt" y archivos a la API de Gemini utilizando FormData con axios
//* Tambien puede recibir un objeto JSON como cuerpo de la solicitud aparte del prompt y los archivos.

//* El generico <T> permite que la función sea reutilizable para diferentes tipos de respuesta.
export const promptWithFiles = async <T>(
  endpoint: string,
  body: JsonBody,
  files: FileType[]
): Promise<T> => {
  try {
    //* "FormData" es una interfaz que permite construir un conjunto de pares clave/valor para enviar datos a través de una solicitud HTTP.
    //* En este caso, se utiliza para enviar un "prompt" y archivos adjuntos(images) a la API de Gemini.
    const formData = new FormData();
    
    //* Añade los pares clave/valor del objeto "body" al FormData.
    Object.entries(body).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // * "files" es un array de objetos que representan archivos que se van a enviar a la API.
    files.forEach((file) => {
      formData.append("files", {
        uri: file.uri,
        name: file.fileName ?? "image.jpg",
        type: file.mimetype ?? "image/jpeg",
      } as unknown as Blob);
    });

    const response = await geminiApi.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log(JSON.stringify(response, null, 2));

    return response.data;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
    throw error;
  }
};
