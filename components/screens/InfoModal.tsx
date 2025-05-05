import { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Modal from "react-native-modal";

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  id: string | number;
  name: string;
  comment: string;
}

const { height: screenHeight } = Dimensions.get("window");

const MAX_POSITION = 0;
const INITIAL_POSITION = screenHeight * 0.5;
const DISMISS_THRESHOLD = 100;

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  id,
  name,
  comment,
}) => {
  const translateY = useSharedValue(screenHeight);
  const lastPosition = useSharedValue(INITIAL_POSITION);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(INITIAL_POSITION, { duration: 250 });
      lastPosition.value = INITIAL_POSITION;
    } else {
      translateY.value = withTiming(screenHeight, { duration: 250 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const nextPos = lastPosition.value + e.translationY;
      translateY.value = Math.min(
        Math.max(nextPos, MAX_POSITION),
        screenHeight
      );
    })
    .onEnd((e) => {
      const finalPos = lastPosition.value + e.translationY;
      if (e.translationY > DISMISS_THRESHOLD) {
        translateY.value = withTiming(screenHeight, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        const clamped = Math.min(
          Math.max(finalPos, MAX_POSITION),
          screenHeight
        );
        translateY.value = withTiming(clamped, { duration: 200 });
        lastPosition.value = clamped;
      }
    });

  if (!visible) return null;

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      backdropOpacity={0}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.background}
            activeOpacity={1}
            onPress={() =>
              (translateY.value = withTiming(
                screenHeight,
                { duration: 200 },
                () => {
                  runOnJS(onClose)();
                }
              ))
            }
          />
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.modalContainer, animatedStyle]}>
              <Image
                source={require("@/assets/images/profileImage.jpg")}
                style={styles.avatar}
              />

              <View>
                <Text style={styles.fullNameText}>{name}</Text>
              </View>
              <View style={styles.commentBox}>
                <Text style={styles.mentionText}>{comment}</Text>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    flexDirection: "column",

    alignSelf: "center",

    alignItems: "center",

    padding: 10,
    marginVertical: 5,
    backgroundColor: "#36393e",
    borderRadius: 10,

    borderWidth: 5,
    borderColor: "#1e2124",
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  avatar: {
    width: "50%",

    borderRadius: 18,

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
  commentBox: {
    maxWidth: "90%",

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
});

export default InfoModal;
