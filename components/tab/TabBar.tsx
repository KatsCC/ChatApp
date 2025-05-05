import { View, StyleSheet } from "react-native";
import Tab from "./Tab";

interface TabBarProps {
  onTabChange: (index: number) => void;
}

const TabBar: React.FC<TabBarProps> = ({ onTabChange }) => {
  return (
    <View style={styles.container}>
      <Tab label="홈" onPress={() => onTabChange(0)} />
      <Tab label="메세지" onPress={() => onTabChange(1)} />
      <Tab label="내정보" onPress={() => onTabChange(2)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#eee",
  },
});

export default TabBar;
