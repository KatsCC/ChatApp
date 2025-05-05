import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { createChatRoom, ChatRoomCreateRequest } from "@/api/chatRooms";
import CreateChatFriendItem from "../items/CreateChatFriendItem";
import { useFriendStore } from "@/store/useFriendsStore";
import Modal from "react-native-modal";

interface CreateChatRoomModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateChatRoomModal: React.FC<CreateChatRoomModalProps> = ({
  visible,
  onClose,
}) => {
  const [roomName, setRoomName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [addIds, setAddIds] = useState<string[]>([]);
  const { friends } = useFriendStore();

  useEffect(() => {
    if (!visible) {
      setRoomName("");
      setAddIds([]);
      setError("");
    }
  }, [visible]);

  const handleCreateRoom = async () => {
    if (roomName.trim().length < 2) {
      setError("채팅방 이름은 2글자 이상이어야 합니다.");
      return;
    }
    try {
      const requestData: ChatRoomCreateRequest = {
        name: roomName.trim(),
        userIds: addIds,
      };
      await createChatRoom(requestData);
      onClose();
    } catch (error) {
      console.error("채팅방 생성 실패", error);
      setError("채팅방 생성에 실패하였습니다.");
    }
  };

  const handleAddFriends = (id: string) => {
    setAddIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((item) => item !== id)
        : [...prevIds, id]
    );
  };
  useEffect(() => {
    console.log(addIds);
  }, [addIds]);

  const selectedFriends = friends.filter((friend) =>
    addIds.includes(friend.id)
  );

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      animationInTiming={400}
      animationOutTiming={400}
      backdropOpacity={0.2}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>채팅방 생성</Text>
        {selectedFriends.length > 0 && (
          <FlatList
            data={selectedFriends}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.friendChip}>
                <Text
                  style={styles.friendChipText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.username}
                </Text>
              </View>
            )}
            contentContainerStyle={styles.chipList}
          />
        )}
        <TextInput
          style={styles.input}
          value={roomName}
          onChangeText={setRoomName}
          placeholder="채팅방 이름"
          placeholderTextColor="#aaa"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CreateChatFriendItem
              id={item.id}
              name={item.username}
              comment={item.mention}
              handleAddFriends={handleAddFriends}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleCreateRoom} style={styles.button}>
            <Text style={styles.buttonText}>생성</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "#282b30",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  listContainer: {
    width: "100%",
    minHeight: "75%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  chipList: {
    marginBottom: 25,
    alignSelf: "flex-start",
  },
  friendChip: {
    height: 30,
    backgroundColor: "#5A55FB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,

    maxWidth: 120,
  },
  friendChipText: {
    color: "white",
    fontSize: 14,
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#36393e",
    color: "white",
    fontSize: 16,
    borderRadius: 30,
    padding: 12,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#5A55FB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default CreateChatRoomModal;
