import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import DotsIcon from "../ui/DotsIcon";
import ChatIcon from "../ui/ChatIcon";
import ChatModal from "../screens/ChatModal";
import { useModalStore } from "@/store/useModalStore";
import InfoModal from "../screens/InfoModal";
import { useChatRoomStore } from "@/store/useRoomStore";
import { createChatRoom } from "@/api/chatRooms";

const FriendItem = ({
  id,
  name,
  comment,
}: {
  id: string;
  name: string;
  comment: string;
}) => {
  const [heightAnim] = useState(new Animated.Value(70));
  const [heightImg] = useState(new Animated.Value(50));
  const [commentHeight] = useState(new Animated.Value(0));
  const [textWidth] = useState(new Animated.Value(60));
  const [iconSize] = useState(new Animated.Value(1));
  const [expanded, setExpanded] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [roomId, setRoomId] = useState<string>("");
  const [count, setCount] = useState(0);
  const { setVisible } = useModalStore();
  const { chatRooms, fetchChatRooms } = useChatRoomStore();

  const handlePress = () => {
    setExpanded(!expanded);
    Animated.spring(heightAnim, {
      toValue: expanded ? 70 : 280,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
    Animated.spring(heightImg, {
      toValue: expanded ? 50 : 160,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
    Animated.spring(iconSize, {
      toValue: expanded ? 1 : 2,
      friction: 5,
      tension: 40,
      useNativeDriver: false,
    }).start();
    Animated.sequence([
      Animated.delay(400),
      Animated.spring(textWidth, {
        toValue: expanded ? 60 : 0,
        friction: 80,
        tension: 50,
        useNativeDriver: false,
      }),
    ]).start();
    Animated.sequence([
      Animated.delay(200),
      Animated.spring(commentHeight, {
        toValue: expanded ? 0 : 60,
        friction: 8,
        tension: 50,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 멤버2명 한정에서 해당 id 포함된 값이 있으면 그걸 담는 값을 만듬, 없으면 방 생성한뒤 다시 진행
  const handleRoomId = async () => {
    try {
      await fetchChatRooms();
      const room = chatRooms.filter(
        (item) =>
          item.participants.length === 2 &&
          item.participants.some((participant) => participant.id === id)
      );
      console.log(room[0].id);

      setRoomId(room[0].id);

      if (room.length === 0) {
        await createChatRoom({ name, userIds: [id] });

        await fetchChatRooms();

        const updatedRoom = chatRooms.filter(
          (item) =>
            item.participants.length === 2 &&
            item.participants.some((participant) => participant.id === id)
        );

        if (updatedRoom.length === 0 && count < 3) {
          setCount((prev) => prev + 1);
          await handleRoomId();
        }

        setRoomId(updatedRoom[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChatIconPress = async () => {
    await handleRoomId();
    setIsModalVisible(true);
    setVisible(true);
  };

  const closeChatModal = () => {
    setIsModalVisible(false);
    setVisible(false);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.friendItem, { height: heightAnim }]}>
        <View style={styles.boxContainer}>
          <View style={styles.leftContainer}>
            <Animated.Image
              source={require("@/assets/images/profileImage.jpg")}
              style={[styles.avatar, { height: heightImg, width: heightImg }]}
            />
            {!expanded && (
              <Animated.Text
                style={[
                  styles.friendText,
                  {
                    width: textWidth.interpolate({
                      inputRange: [0, 60],
                      outputRange: ["0%", "60%"],
                    }),
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name}
              </Animated.Text>
            )}
          </View>
          <View style={[styles.rightContainer]}>
            <Animated.View
              style={{
                transform: [{ scale: iconSize }],
                marginRight: iconSize.interpolate({
                  inputRange: [1, 2],
                  outputRange: [10, 40],
                }),
              }}
            >
              <TouchableOpacity onPress={handleChatIconPress}>
                <ChatIcon />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              style={{
                transform: [{ scale: iconSize }],
                marginRight: iconSize.interpolate({
                  inputRange: [1, 2],
                  outputRange: [0, 10],
                }),
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIsInfoModalVisible(true);
                  setVisible(true);
                }}
              >
                <DotsIcon />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {expanded && <Text style={styles.fullNameText}>{name}</Text>}

        {expanded && (
          <Animated.View style={[styles.commentBox, { height: commentHeight }]}>
            <Text style={styles.friendText}>{comment}</Text>
          </Animated.View>
        )}
      </Animated.View>
      <InfoModal
        visible={isInfoModalVisible}
        onClose={() => {
          setIsInfoModalVisible(false);
          setVisible(false);
        }}
        id={id}
        name={name}
        comment={comment}
      />
      <ChatModal
        visible={isModalVisible}
        onClose={closeChatModal}
        id={roomId}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  friendItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#36393e",
    borderRadius: 10,
  },
  friendText: {
    fontSize: 17,
    fontWeight: 600,
    color: "#fff",
    width: "100%",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  commentBox: {
    width: "90%",
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#424549",
  },
  fullNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default FriendItem;
