import { TouchableOpacity, View, StyleSheet, Image, Text } from "react-native";
import { useModalStore } from "@/store/useModalStore";
import { useEffect, useState } from "react";
import ChatModal from "../screens/ChatModal";
import { checkRoomNewMark, clearRoomNewMark } from "@/hooks/useNewMessageMark";
import { useChatRoomStore } from "@/store/useRoomStore";

const RoomItem = ({
  id,
  name,
  comment,
}: {
  id: string;
  name: string;
  comment: string;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const { updateChatRoom } = useChatRoomStore();
  const { setVisible } = useModalStore();

  useEffect(() => {
    const loadMark = async () => {
      const flag = await checkRoomNewMark(id);
      setIsNew(flag);
      updateChatRoom(id, { newMark: flag });
    };
    loadMark();
  }, [id, isModalVisible]);

  const openChatModal = async () => {
    await clearRoomNewMark(id);
    setIsModalVisible(true);
    setVisible(true);
  };
  const closeChatModal = () => {
    setIsModalVisible(false);
    setVisible(false);
  };

  return (
    <TouchableOpacity onPress={openChatModal}>
      <View style={styles.friendItem}>
        <View style={styles.boxContainer}>
          <Image
            source={require("@/assets/images/profileImage.jpg")}
            style={styles.avatar}
          />

          <Text
            style={styles.friendText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>
          {isNew && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>!!</Text>
            </View>
          )}
        </View>
      </View>
      <ChatModal visible={isModalVisible} onClose={closeChatModal} id={id} />
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

  friendItem: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    width: "95%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#36393e",
    borderRadius: 10,
  },
  friendText: {
    flex: 1,
    fontSize: 17,
    fontWeight: 600,
    color: "#fff",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
  badge: {
    backgroundColor: "#5A55FB",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default RoomItem;
