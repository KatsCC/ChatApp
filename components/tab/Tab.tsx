import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface TabProps {
  label: string;
  onPress: () => void;
}

const Tab: React.FC<TabProps> = ({ label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tab}>
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    padding: 10,
  },
  tabText: {
    fontSize: 18,
    color: "#333",
  },
});

export default Tab;
