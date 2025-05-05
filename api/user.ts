import axiosInstance from "./axiosInstance";

// 유저 상세정보
export const userProfile = () => {
  return axiosInstance.get("/user/me");
};

export interface PushTokenRequest {
  email: string;
  expoPushToken: string;
}

// expo-token 등록
export const registerPushToken = (data: PushTokenRequest) => {
  return axiosInstance.post("/user/push-token", data);
};

export interface MentionRequest {
  mention: string;
}

// mention 수정
export const updateMention = (data: MentionRequest) => {
  return axiosInstance.put("/user/me/mention", data);
};
