import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import GearIcon from "../ui/GearIcon";
import FriendIcon from "../ui/FriendIcon";
import ReceiveModal from "./ReceiveModal";
import { updateMention, userProfile } from "@/api/user";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import LogoutIcon from "../ui/LogoutIcon";
import { useModalStore } from "@/store/useModalStore";
import Modal from "react-native-modal";
import { useFriendStore } from "@/store/useFriendsStore";

interface User {
  id: number;
  username: string;
  email: string;
  mention: string;
}

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [mention, setMention] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedMention, setEditedMention] = useState<string>(mention);
  const [modalVisible, setModalVisible] = useState(false);
  const { setVisible } = useModalStore();

  const router = useRouter();

  const loadProfile = async () => {
    try {
      const response = await userProfile();

      setUser(response.data);
      setMention(response.data.mention);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    setVisible(true);
  };

  const { fetchFriends } = useFriendStore();
  const closeModal = () => {
    setModalVisible(false);
    fetchFriends();
    setVisible(false);
  };

  const handleGearPress = () => {
    if (isEditing) {
      setEditedMention(mention);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleUpdateMention = async () => {
    try {
      await updateMention({ mention: editedMention });
      setMention(editedMention);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("jwtToken");
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={closeModal}
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
          <ReceiveModal />
          <TouchableOpacity
            onPress={closeModal}
            style={styles.closeModalButton}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.boxContainer}>
        <Image
          source={require("@/assets/images/profileImage.jpg")}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.friendIcon} onPress={openModal}>
          <FriendIcon />
        </TouchableOpacity>

        <View>
          <Text style={styles.fullNameText}>{user?.username}</Text>
        </View>
        <View style={styles.commentBox}>
          <TouchableOpacity style={styles.gearIcon} onPress={handleGearPress}>
            <GearIcon />
          </TouchableOpacity>
          {isEditing ? (
            <>
              <TextInput
                style={styles.mentionInput}
                value={editedMention}
                onChangeText={setEditedMention}
                multiline
                placeholder="수정할 내용을 입력하세요"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateMention}
              >
                <Text style={styles.updateButtonText}>수정하기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.mentionText}>{mention}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>
          <LogoutIcon />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#282b30",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  boxContainer: {
    flexDirection: "column",

    alignSelf: "center",

    alignItems: "center",
    width: "90%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#36393e",
    borderRadius: 10,
  },
  avatar: {
    width: "55%",
    borderRadius: 15,
    marginTop: 10,
  },
  fullNameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  gearIcon: {
    position: "absolute",
    right: -10,
    top: -10,
  },
  friendIcon: {
    position: "absolute",
    right: 20,
    top: 20,
  },
  commentBox: {
    width: "90%",
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#424549",
    borderRadius: 10,
  },
  mentionText: {
    fontSize: 17,
    fontWeight: 600,
    color: "#fff",
    width: "100%",
    marginBottom: 5,
  },
  mentionInput: {
    borderWidth: 2,
    borderColor: "#5A55FB",
    backgroundColor: "#36393e",
    color: "white",
    fontSize: 16,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#5A55FB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#282b30",
    borderRadius: 20,
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
  logoutButton: {
    width: "100%",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    position: "absolute",
    color: "#ff5555",
    fontSize: 16,
    fontWeight: "bold",
    right: 25,
  },
});

export default ProfileScreen;
