import { View, Text, Image, StyleSheet } from "react-native";

interface Message {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

interface MessageItemProps {
  message: Message;
  isSameUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isSameUser }) => {
  return (
    <View>
      {!isSameUser && (
        <View style={styles.chatMessage}>
          <View style={styles.memberInfo}>
            <Image
              source={require("@/assets/images/profileImage.jpg")}
              style={styles.memberImage}
            />
            <View>
              <Text style={styles.memberName}>{message.senderName}</Text>
              <Text style={styles.createdAt}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
      )}
      <View>
        <Text style={styles.chatText}>{message.content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatMessage: {
    marginTop: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 17,
    marginRight: 10,
  },
  memberName: {
    fontWeight: "bold",
    color: "#fff",
  },
  createdAt: {
    fontSize: 12,
    color: "#bbb",
  },
  chatText: {
    color: "#fff",
    fontSize: 16,
    paddingLeft: 70,
    paddingRight: 40,
  },
});

export default MessageItem;
