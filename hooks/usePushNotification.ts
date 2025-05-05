import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { markRoomAsNew } from "@/hooks/useNewMessageMark";
import { Platform } from "react-native";

export const usePushNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function registerForPushNotificationsAsync() {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return;
      }
      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data);

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#5A55FB",
        });
      }
    }
    registerForPushNotificationsAsync();
  }, []);

  return expoPushToken;
};

export const usePushNotificationListener = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { roomId } = notification.request.content.data;

        if (roomId) {
          markRoomAsNew(roomId);
        }
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);
};
