import { useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
  Easing,
} from "react-native";

interface RingAnimationProps {
  onPress?: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
}

const RingAnimation: React.FC<RingAnimationProps> = ({ onPress, children }) => {
  const ringAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerRingAnimation = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(ringAnim, {
          toValue: 15,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: -15,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <TouchableOpacity
      onPress={(e) => {
        triggerRingAnimation();
        if (onPress) {
          onPress(e);
        }
      }}
    >
      <Animated.View
        style={[
          {
            transform: [
              {
                rotate: ringAnim.interpolate({
                  inputRange: [-15, 15],
                  outputRange: ["-15deg", "15deg"],
                }),
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RingAnimation;
