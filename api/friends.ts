import axiosInstance from "./axiosInstance";

export interface Friend {
  id: string;
  email: string;
  username: string;
  mention: string;
  senderUsername: string;
  requestId: string;
}

// 친구 목록
export const getFriendList = () => {
  return axiosInstance.get("/friends/list");
};

// 이메일 검색 API
export const searchFriends = (email: string) => {
  return axiosInstance.get<Friend[]>("/friends/search", { params: { email } });
};

// 친구 요청 보내기 API
export const sendFriendRequest = (recipientId: number) => {
  return axiosInstance.post("/friends/request", { recipientId });
};

// 받은 친구 요청 확인
export const getFriendRequest = () => {
  return axiosInstance.get("/friends/requests");
};

// 친구 요청 수락
export const receiveFriendRequest = (id: string) => {
  return axiosInstance.post(`/friends/requests/${id}/accept`);
};
