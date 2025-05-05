import { View, TouchableOpacity, StyleSheet } from "react-native";
import ExitIcon from "../ui/ExitIcon";
import MenuIcon from "../ui/MenuIcon";

interface ChatHeaderProps {
  handleClose: () => void;
  onMenuPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  handleClose,
  onMenuPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleClose}>
        <ExitIcon />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress}>
        <MenuIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});

export default ChatHeader;
