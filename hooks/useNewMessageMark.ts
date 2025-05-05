import AsyncStorage from "@react-native-async-storage/async-storage";

const getRoomMarkKey = (roomId: string | number) => `room_${roomId}_new`;

export const markRoomAsNew = async (roomId: string | number) => {
  try {
    await AsyncStorage.setItem(getRoomMarkKey(roomId), "true");
  } catch (err) {
    console.error("새 메시지 마크 저장 실패", err);
  }
};

export const clearRoomNewMark = async (roomId: string | number) => {
  try {
    await AsyncStorage.removeItem(getRoomMarkKey(roomId));
  } catch (err) {
    console.error("새 메시지 마크 삭제 실패", err);
  }
};

export const checkRoomNewMark = async (
  roomId: string | number
): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(getRoomMarkKey(roomId));
    return value === "true";
  } catch (err) {
    console.error("새 메시지 마크 확인 실패", err);
    return false;
  }
};
