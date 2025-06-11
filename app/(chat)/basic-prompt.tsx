import { useBasicPromptStore } from "@/store/basic-prompt/basicPrompt.store";

import { ChatMessages } from "@/components/chat/ChatMessages";
import CustomInputBox from "@/components/chat/CustomInputBox";

import { Layout } from "@ui-kitten/components";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const BasicPromptScreen = () => {
  const insets = useSafeAreaInsets();

  const isGeminiWriting = useBasicPromptStore((state) => state.geminiWriting);
  const messages = useBasicPromptStore((state) => state.messages);
  const { addMessage } = useBasicPromptStore();

  return (
    <Layout style={{ flex: 1, paddingBottom: insets.bottom - 20 }}>
      <ChatMessages messages={messages} isGeminiWriting={isGeminiWriting} />

      <CustomInputBox onSendMessage={(message, attachments) => {
        // console.log(JSON.stringify({ message,attachments }, null, 2));
        addMessage(message, attachments);
      }} />
    </Layout>
  );
};

export default BasicPromptScreen;
