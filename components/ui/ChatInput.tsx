import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  inputHeight: number;
  setInputHeight: (height: number) => void;
  sendMessage: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  inputHeight,
  setInputHeight,
  sendMessage,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        value={inputText}
        onChangeText={setInputText}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor="#bbb"
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={sendMessage}
        keyboardType="default"
        onContentSizeChange={(event) =>
          setInputHeight(
            Math.min(120, Math.max(40, event.nativeEvent.contentSize.height))
          )
        }
        onKeyPress={(e) => {
          if (e.nativeEvent.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>전송</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#2b2d31",
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#555",
    borderRadius: 8,
  },
  sendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#5A55FB",
    borderRadius: 8,
    width: 65,
    height: 43,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChatInput;
