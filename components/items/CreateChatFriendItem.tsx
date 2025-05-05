import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import AddIcon from "../ui/AddIcon";
import CheckIcon from "../ui/CheckIcon";

const CreateChatFriendItem = ({
  id,
  name,
  comment,
  handleAddFriends,
}: {
  id: string;
  name: string;
  comment: string;
  handleAddFriends: (id: string) => void;
}) => {
  const [add, setAdd] = useState<boolean>(false);
  const { width } = Dimensions.get("window");

  return (
    <View>
      <View style={styles.friendItem}>
        <View style={styles.boxContainer}>
          <View style={styles.leftContainer}>
            <Image
              source={require("@/assets/images/profileImage.jpg")}
              style={styles.avatar}
            />

            <Text
              style={[styles.friendText, { width: width - 250 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
          </View>
          <View style={styles.rightContainer}>
            <TouchableOpacity
              onPress={() => {
                handleAddFriends(id);
                setAdd(!add);
              }}
            >
              {add ? <CheckIcon /> : <AddIcon />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
    marginRight: 10,
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

export default CreateChatFriendItem;
