import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import RoomItem from "../items/RoomItem";
import PlusIcon from "../ui/PlusIcon";
import CreateChatRoomModal from "./CreateChatRoomModal";
import { useChatRoomStore } from "@/store/useRoomStore";
import { useModalStore } from "@/store/useModalStore";
import * as Notifications from "expo-notifications";
import { markRoomAsNew } from "@/hooks/useNewMessageMark";
import { usePushNotificationListener } from "@/hooks/usePushNotification";

export interface MessageScreenProps {
  childGestureRef: React.Ref<any>;
}

const MessageScreen: React.FC<MessageScreenProps> = ({ childGestureRef }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchChatRooms, getSortedChatRooms } = useChatRoomStore();
  const { setVisible } = useModalStore();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    setVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    fetchChatRooms();
    setVisible(false);
  };

  const sortedRooms = getSortedChatRooms();

  useEffect(() => {
    const handleInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      const data = response?.notification?.request?.content?.data;
      console.log(data, "data");

      if (data?.type === "new_message" && data.roomId) {
        await markRoomAsNew(data.roomId);
      }
    };

    handleInitialNotification();
  }, []);
  usePushNotificationListener();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>메세지</Text>
      <TouchableOpacity style={styles.plusButton} onPress={openModal}>
        <PlusIcon />
      </TouchableOpacity>

      <NativeViewGestureHandler
        ref={childGestureRef}
        simultaneousHandlers={childGestureRef}
      >
        <FlatList
          data={sortedRooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomItem id={item.id} name={item.name} comment={item.comment} />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </NativeViewGestureHandler>
      <CreateChatRoomModal visible={modalVisible} onClose={closeModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingBottom: 50,
    backgroundColor: "#282b30",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    paddingBottom: 5,
    textAlign: "center",
  },
  listContainer: {
    width: "100%",
    paddingBottom: 30,
  },
  plusButton: {
    position: "absolute",
    top: 8,
    right: 40,
  },
});

export default MessageScreen;
