import { registration } from "@/api/auth";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AxiosError } from "axios";

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const router = useRouter();
  const shakeAnim = useRef(new Animated.Value(0)).current;

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

  const validateInputs = (): boolean => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");

    if (name.trim().length < 2) {
      setNameError("이름은 2글자 이상이어야 합니다.");
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("유효한 이메일 형식을 입력하세요.");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("비밀번호는 6자 이상이어야 합니다.");
      valid = false;
    }
    return valid;
  };

  const handleSignup = async () => {
    if (!validateInputs()) {
      triggerShake();
      return;
    }
    try {
      await registration({ username: name, email, password });

      router.replace("/login");
    } catch (error) {
      console.error("Login error:", error);
      let message = "등록에 실패했습니다.";
      if (error && (error as AxiosError).response) {
        message = "이미 등록된 이메일입니다";
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
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <Text style={styles.title}>회원가입 하기!</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="white"
            value={name}
            onChangeText={setName}
            keyboardType="default"
          />
          {nameError !== "" && (
            <Text style={styles.errorText}>{nameError}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {emailError !== "" && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="white"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {passwordError !== "" && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}

          {errorMsg !== "" && <Text style={styles.errorText}>{errorMsg}</Text>}

          <TouchableOpacity onPress={handleSignup}>
            <Animated.View style={styles.signupButton}>
              <Text style={styles.buttonText}>등 록 하 기</Text>
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.backButton}>돌아가기</Text>
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
  signupButton: {
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
  backButton: {
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

export default Signup;
