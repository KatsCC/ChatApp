import axiosInstance from "./axiosInstance";

export interface ChatRoomCreateRequest {
  name: string;
  userIds: string[];
}

// 채팅방 생성
export const createChatRoom = (data: ChatRoomCreateRequest) => {
  return axiosInstance.post("/api/chat/rooms", data);
};

// 채팅방 불러오기
export const loadChatRoom = () => {
  return axiosInstance.get("/api/chat/rooms");
};

// 채팅방 정보
export const loadChatRoomDetail = (id: string | number) => {
  return axiosInstance.get(`/api/chat/rooms/${id}`);
};

// 최근 메세지 30개
export const recentMessage = (id: string | number) => {
  return axiosInstance.get(`api/chat/rooms/${id}/messages/recent`);
};

// 해당id의 메세지의 이전 30개
export const prevMessage = (
  id: string | number,
  firstMessageId: string | number
) => {
  return axiosInstance.get(
    `api/chat/rooms/${id}/messages/previous?firstMessageId=${firstMessageId}`
  );
};

// 초대하기
export const inviteRoom = (chatRoomId: string | number, userIds: string) => {
  return axiosInstance.post(`api/chat/rooms/${chatRoomId}/invite`, userIds);
};
