import { useChatContextStore } from '@/store/chat-context/chatContext.store';

import { ChatMessages } from '@/components/chat/ChatMessages';
import CustomInputBox from '@/components/chat/CustomInputBox';

import { Layout } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const ChatHistoryScreen = () => {
  const insets = useSafeAreaInsets();

  const isGeminiWriting = useChatContextStore((state) => state.geminiWriting);
  const messages = useChatContextStore((state) => state.messages);
    const { addMessage } = useChatContextStore();

  return (
    <Layout style={{ flex: 1, paddingBottom: insets.bottom - 20 }}>
      <ChatMessages messages={messages} isGeminiWriting={isGeminiWriting} />

      <CustomInputBox onSendMessage={addMessage} />
    </Layout>
  );
};

export default ChatHistoryScreen;
