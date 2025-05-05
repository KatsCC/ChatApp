import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AddIcon from "../ui/AddIcon";
import CheckIcon from "../ui/CheckIcon";
import { receiveFriendRequest } from "@/api/friends";

interface ReceiveFriendItem {
  id: string;
  username: string;
}

const ReceiveFriendItem: React.FC<ReceiveFriendItem> = ({ id, username }) => {
  const [requested, setRequested] = useState<boolean>(false);

  const handleRequest = async () => {
    try {
      await receiveFriendRequest(id);
      setRequested(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.itemContainer}>
      <View>
        <Image
          source={require("@/assets/images/profileImage.jpg")}
          style={styles.avatar}
        ></Image>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{username}</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, requested && styles.buttonDisabled]}
        onPress={handleRequest}
        disabled={requested}
      >
        {requested ? <CheckIcon /> : <AddIcon />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    paddingLeft: -10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  comment: {
    fontSize: 14,
    color: "#aaa",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#5A55FB",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ReceiveFriendItem;
