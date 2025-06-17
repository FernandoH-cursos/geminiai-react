import { useImagePlaygroundStore } from "@/store/image-playground/imagePlayground.store";

import CustomInputBox from "@/components/chat/CustomInputBox";
import PreviousGenerationsGrid from "@/components/image-generation/PreviousGenerationsGrid";

import Slideshow from "@/components/image-generation/Slideshow";
import StyleSelector from "@/components/image-generation/StyleSelector";
import NoImages from "@/components/image-generation/NoImages";

import { Layout, Spinner } from "@ui-kitten/components";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const ImageGenerationScreen = () => {
  const insets = useSafeAreaInsets();

  const generatedImages = useImagePlaygroundStore((state) => state.images);
  const imageHistory = useImagePlaygroundStore((state) => state.history);
  const selectedStyle = useImagePlaygroundStore((state) => state.selectedStyle);
  const isGenerating = useImagePlaygroundStore((state) => state.isGenerating);
  const selectedImage = useImagePlaygroundStore((state) => state.selectedImage);
  console.log(JSON.stringify(generatedImages, null, 2));

  const {
    setSelectedStyle,
    generateImage,
    generateNextImage,
    setSelectedImage,
  } = useImagePlaygroundStore();
  return (
    <Layout style={{ flex: 1, paddingBottom: insets.bottom - 20 }}>
      {generatedImages.length === 0 && !isGenerating && <NoImages />}

      {generatedImages.length === 0 && isGenerating && (
        <Layout
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 300,
          }}
        >
          <Spinner size="large" />
        </Layout>
      )}

      {/* Slider con imagenes generadas */}
      {generatedImages.length > 0 && (
        <Slideshow
          images={generatedImages}
          isGenerating={isGenerating}
          onLastImage={generateNextImage}
        />
      )}

      {/* Selector de estilos */}
      <StyleSelector
        selectedStyle={selectedStyle}
        onSelectStyle={setSelectedStyle}
      />

      {/* Grid de galería con su historial  */}
      <PreviousGenerationsGrid
        selectedImage={selectedImage}
        onSelectedImage={setSelectedImage}
        images={imageHistory}
      />

      {/* Input para ingresar el prompt */}
      <CustomInputBox onSendMessage={generateImage} />
    </Layout>
  );
};

export default ImageGenerationScreen;
