import { Animated, StyleSheet } from "react-native";

interface TabScreenProps {
  slideAnim: Animated.Value;
  children: React.ReactNode;
}

const TabScreen: React.FC<TabScreenProps> = ({ slideAnim, children }) => {
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "300%",
    height: "100%",
  },
});

export default TabScreen;
