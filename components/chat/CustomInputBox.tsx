import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform } from "react-native";
import { ImagePickerAsset } from "expo-image-picker";

import { useThemeColor } from "@/hooks/useThemeColor";

import { getGalleryImages } from "@/actions/image-picker";

import { Button, Input, Layout } from "@ui-kitten/components";
import Ionicons from "@expo/vector-icons/Ionicons";
interface Props {
  onSendMessage: (message: string, attachments: ImagePickerAsset[]) => void;
}

const CustomInputBox = ({ onSendMessage }: Props) => {
  const isAndroid = Platform.OS === "android";
  const iconColor = useThemeColor({}, "icon");

  const [text, setText] = useState("");
  const [images, setImages] = useState<ImagePickerAsset[]>([]);

  //* Maneja el envío del mensaje a Gemini para que lo procese y lo envíe al chat
  const handleSendMessage = () => {
    onSendMessage(text.trim(), images);
    setText("");
    setImages([]);
  };

  //* Maneja la selección de imágenes desde la galería del dispositivo
  const handlePickImages = async () => {
    const MAX_IMAGES = 4;

    const selectedImages = await getGalleryImages();

    if (selectedImages.length === 0 || images.length >= MAX_IMAGES) return;

    //* Limitar la cantidad de imágenes a agregar, es decir, si ya hay 4 imágenes, no se pueden agregar más.
    const availableSlots = MAX_IMAGES - images.length;
    const imagesToAdd = selectedImages.slice(0, availableSlots);

    //* Si hay imágenes para agregar, las añadimos al estado de imágenes
    if (imagesToAdd.length > 0) {
      setImages([...images, ...imagesToAdd]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={isAndroid ? "height" : "padding"}
      keyboardVerticalOffset={isAndroid ? 0 : 85}
    >
      {/* Imágenes */}
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {images.map((image) => (
          <Image
            key={image.uri}
            source={{ uri: image.uri }}
            style={{ width: 50, height: 50, marginTop: 5, borderRadius: 5 }}
          />
        ))}
      </Layout>

      {/* Espacio para escribir y enviar mensaje */}
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: isAndroid ? 10 : 20,
        }}
      >
        <Button
          onPress={handlePickImages}
          appearance="ghost"
          accessoryRight={
            <Ionicons name="attach-outline" size={22} color={iconColor} />
          }
        />
        <Input
          value={text}
          onChangeText={setText}
          placeholder="Escribe tu mensaje"
          multiline
          numberOfLines={4}
          style={{ flex: 1 }}
        />
        <Button
          onPress={handleSendMessage}
          appearance="ghost"
          accessoryRight={
            <Ionicons name="paper-plane-outline" size={22} color={iconColor} />
          }
        />
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default CustomInputBox;
