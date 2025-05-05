import { login } from "@/api/auth";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { AxiosError } from "axios";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { registerPushToken } from "@/api/user";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const expoPushToken = usePushNotifications();

  //shake animation 설정
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      const token = response.data;
      await SecureStore.setItemAsync("jwtToken", JSON.stringify(token));

      if (expoPushToken) {
        await registerPushToken({ email, expoPushToken });
      }

      router.replace("/main");
    } catch (error) {
      let message = "로그인에 실패했습니다.";
      if (error && (error as AxiosError).response) {
        message = "이메일 또는 비밀번호를 확인해주세요.";
      }
      setErrorMsg(message);
      triggerShake();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.boxContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[{ transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.title}>로그인 하기!</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="white"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errorMsg !== "" && <Text style={styles.errorText}>{errorMsg}</Text>}
          <TouchableOpacity onPress={handleLogin}>
            <View style={styles.loginButton}>
              <Text style={styles.buttonText}>로그인</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupButton}>회원가입</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#282b30",
  },
  boxContainer: {
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#36393e",
    boxShadow: "0 0 50 15 rgba(0, 0, 0, 0.30)",
    elevation: 10,
    borderRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "rgb(136, 136, 136)",
    color: "white",
    fontSize: 16,
    borderRadius: 30,
    padding: 12,
    marginVertical: 10,
  },
  loginButton: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#5A55FB",
    borderRadius: 30,
    padding: 12,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    marginTop: 16,
    textAlign: "center",
    textDecorationLine: "underline",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 5,
  },
});

export default Login;
