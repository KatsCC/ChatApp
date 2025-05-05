import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FriendItem from "../items/FriendItem";
import PlusIcon from "../ui/PlusIcon";
import { useEffect, useState } from "react";
import AddFriendModal from "./AddFriendModal";
import { useFriendStore } from "@/store/useFriendsStore";
import { useModalStore } from "@/store/useModalStore";
import Modal from "react-native-modal";
import { MessageScreenProps } from "./MessageScreen";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

const HomeScreen: React.FC<MessageScreenProps> = ({ childGestureRef }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { friends, fetchFriends } = useFriendStore();
  const { setVisible } = useModalStore();

  useEffect(() => {
    const loadFriends = async () => {
      setIsLoading(true);
      await fetchFriends();
      setIsLoading(false);
    };
    loadFriends();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    setVisible(true);
  };
  const onClose = () => {
    setModalVisible(false);
    setVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>친구 목록</Text>
      <TouchableOpacity style={styles.plusButton} onPress={openModal}>
        <PlusIcon />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={onClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={400}
        animationOutTiming={400}
        backdropOpacity={0.2}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <AddFriendModal />
          <TouchableOpacity onPress={onClose} style={styles.closeModalButton}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.loadingIndicator}
          />
        </View>
      ) : (
        <NativeViewGestureHandler
          ref={childGestureRef}
          simultaneousHandlers={childGestureRef}
        >
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FriendItem
                id={item.id}
                name={item.username}
                comment={item.mention}
              />
            )}
            contentContainerStyle={styles.listContainer}
          />
        </NativeViewGestureHandler>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "33.33%",
    justifyContent: "center",
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
  plusButton: {
    position: "absolute",
    top: 8,
    right: 40,
  },
  loadingIndicator: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: { flex: 1 },
  listContainer: {
    width: "100%",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#282b30",
    padding: 20,
  },
  closeModalButton: {
    marginTop: 20,
    backgroundColor: "#5A55FB",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default HomeScreen;
