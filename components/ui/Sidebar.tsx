import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PlusIcon from "./PlusIcon";
import InviteModal from "../screens/InviteModal";
import { useState } from "react";
import InfoModal from "../screens/InfoModal";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Users {
  id: string | number;
  email: string;
  mention: string;
  username: string;
}

interface RoomDetails {
  id: string | number;
  name: string;
  users: Users[];
}

interface SidebarProps {
  sidebarAnim: SharedValue<number>;
  roomDetails: RoomDetails;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarAnim,
  roomDetails,
  toggleSidebar,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<Users>();

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUserData = (item: Users) => {
    setUserInfo(item);
    setIsInfoModalVisible(true);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sidebarAnim.value }],
    };
  });
  return (
    <TouchableWithoutFeedback onPress={toggleSidebar}>
      <View style={styles.sidebarOverlay}>
        <TouchableWithoutFeedback>
          <Animated.View style={[styles.sidebar, animatedStyle]}>
            <Text style={styles.sidebarTitle}>{roomDetails?.name}</Text>
            <Text style={styles.sidebarHeader} />
            {roomDetails ? (
              <FlatList
                data={roomDetails.users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity onPress={() => handleUserData(item)}>
                      <Text style={styles.sidebarText}>{item?.username}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ flexGrow: 1 }}
              />
            ) : (
              <Text style={styles.sidebarText}>로딩 중...</Text>
            )}
            <TouchableOpacity onPress={openModal}>
              <PlusIcon />
            </TouchableOpacity>
            <View style={styles.modal}>
              <InviteModal
                visible={modalVisible}
                onClose={closeModal}
                id={roomDetails?.id}
              />
            </View>
            {userInfo ? (
              <View style={styles.modal}>
                <InfoModal
                  visible={isInfoModalVisible}
                  onClose={() => setIsInfoModalVisible(false)}
                  id={userInfo.id}
                  name={userInfo.username}
                  comment={userInfo.mention}
                />
              </View>
            ) : (
              ""
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  sidebar: {
    height: "100%",
    width: "50%",
    backgroundColor: "#2b2d31",
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
  sidebarHeader: {
    fontSize: 2,
    fontWeight: "bold",
    color: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    marginBottom: 10,
  },
  sidebarText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
});

export default Sidebar;
