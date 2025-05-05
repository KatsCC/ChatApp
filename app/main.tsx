import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Dimensions, StyleSheet } from "react-native";
import HomeScreen from "@/components/screens/HomeScreen";
import MessageScreen from "@/components/screens/MessageScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";
import HomeIcon from "@/components/ui/HomeIcon";
import MessageIcon from "@/components/ui/MessageIcon";
import ProfileIcon from "@/components/ui/ProfileIcon";
import RingAnimation from "@/components/ui/RingAnimation";
import { useModalStore } from "@/store/useModalStore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const Main = () => {
  const currentTab = useSharedValue(0);
  const translateX = useSharedValue(0);
  const SWIPE_THRESHOLD = 100;

  const childGestureRef = useRef(null);

  const handleTabChange = (index: number) => {
    if (index < 0 || index > 2) return;
    currentTab.value = index;
    translateX.value = withSpring(-index * width, {
      damping: 20,
      stiffness: 160,
      mass: 1,
      overshootClamping: false,
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      const effectiveTranslationX =
        Math.abs(event.translationX) > 30 ? event.translationX : 0;
      const base = -currentTab.value * width;
      translateX.value = base + effectiveTranslationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD && currentTab.value > 0) {
        runOnJS(handleTabChange)(currentTab.value - 1);
      } else if (
        event.translationX < -SWIPE_THRESHOLD &&
        currentTab.value < 2
      ) {
        runOnJS(handleTabChange)(currentTab.value + 1);
      } else {
        translateX.value = withSpring(-currentTab.value * width);
      }
    })
    .simultaneousWithExternalGesture(childGestureRef);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <GestureDetector
          gesture={
            useModalStore().isVisible
              ? Gesture.Pan().enabled(false)
              : panGesture
          }
        >
          <Animated.View style={[styles.tabContentContainer, animatedStyle]}>
            <HomeScreen childGestureRef={childGestureRef} />
            <MessageScreen childGestureRef={childGestureRef} />
            <ProfileScreen />
          </Animated.View>
        </GestureDetector>
        <View style={styles.tabs}>
          <RingAnimation onPress={() => handleTabChange(0)}>
            <HomeIcon />
          </RingAnimation>
          <RingAnimation onPress={() => handleTabChange(1)}>
            <MessageIcon />
          </RingAnimation>
          <RingAnimation onPress={() => handleTabChange(2)}>
            <ProfileIcon />
          </RingAnimation>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#282b30",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#282b30",
  },
  tabs: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#282b30",
  },
  tabContentContainer: {
    flexDirection: "row",
    width: "300%", // 3개의 탭이 가로로 나열됨.
    height: "100%",
  },
});

export default Main;
