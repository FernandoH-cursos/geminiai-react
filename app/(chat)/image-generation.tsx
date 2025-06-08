import CustomInputBox from '@/components/chat/CustomInputBox';
import PreviousGenerationsGrid from '@/components/image-generation/PreviousGenerationsGrid';
import Slideshow from '@/components/image-generation/Slideshow';
import StyleSelector from '@/components/image-generation/StyleSelector';

import { Layout } from '@ui-kitten/components';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const placeHolderImages = [
  'https://picsum.photos/id/10/200/300',
  'https://picsum.photos/id/20/200/300',
  'https://picsum.photos/id/30/200/300',
  'https://picsum.photos/id/40/200/300',
  'https://picsum.photos/id/50/200/300',
  'https://picsum.photos/id/60/200/300',
  'https://picsum.photos/id/70/200/300',
  'https://picsum.photos/id/80/200/300',
  'https://picsum.photos/id/90/200/300',
  'https://picsum.photos/id/100/200/300',
  'https://picsum.photos/id/110/200/300',
  'https://picsum.photos/id/120/200/300',
  'https://picsum.photos/id/130/200/300',
  'https://picsum.photos/id/140/200/300',
  'https://picsum.photos/id/150/200/300',
];

const ImageGenerationScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <Layout style={{ flex: 1, paddingBottom: insets.bottom - 20 }}>
      <Slideshow
        images={placeHolderImages}
        isGenerating
        onLastImage={() => {
          console.log("Última imagen generada");
        }}
      />
      {/* Selector de estilos */}
      <StyleSelector onSelectStyle={() => {}} />

      <PreviousGenerationsGrid images={placeHolderImages} />

      <CustomInputBox onSendMessage={() => {}} />
    </Layout>
  );
};

export default ImageGenerationScreen;
