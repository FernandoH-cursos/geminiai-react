import * as ImagePicker from 'expo-image-picker';


//* Función para obtener imágenes de la galería del dispositivo 
export const getGalleryImages = async (): Promise<ImagePicker.ImagePickerAsset[]> => {
  //* Solicitar permisos para acceder a la galería de imágenes
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  //* Si el permiso no es concedido, retornar un arreglo vacío
  if (status !== 'granted') return [];

  //* Abrir galería de imágenes y permitir la selección de múltiples imágenes, aspect ratio de 4:3, calidad de imagen al 70% y
  //* un límite de selección de 4 imágenes.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    aspect: [4, 3],
    allowsMultipleSelection: true,
    quality: 0.7,
    selectionLimit: 4,
  });

  //* Si la selección es cancelada, retornar un arreglo vacío
  if (result.canceled) return [];
  
  // console.log(JSON.stringify(result, null, 2));

  return result.assets;
} 