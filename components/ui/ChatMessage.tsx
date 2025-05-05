import { FlatList, StyleSheet } from "react-native";
import MessageItem from "../items/MessageItem";
import { Message } from "./Room";

interface ChatMessagesProps {
  messages: Message[];
  flatListRef: React.RefObject<FlatList<any>>;
  onScroll: (event: any) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  flatListRef,
  onScroll,
}) => {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => {
        const isSameUser =
          index > 0 && item.senderId === messages[index - 1].senderId;
        return <MessageItem message={item} isSameUser={isSameUser} />;
      }}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ flexGrow: 1 }}
      onScroll={onScroll}
      style={styles.chatList}
    />
  );
};

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
    width: "100%",
  },
});

export default ChatMessages;
