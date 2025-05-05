import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

const Index = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        if (token) {
          router.replace("/main");
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error(error);
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkToken();
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282b30",
  },
});

export default Index;
