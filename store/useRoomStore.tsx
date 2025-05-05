import { create } from "zustand";
import { loadChatRoom } from "@/api/chatRooms";

export interface ChatRoom {
  id: string;
  name: string;
  comment: string;
  participants: Participants[];
  newMark?: boolean;
}

export interface Participants {
  id: string;
  username: string;
}

interface ChatRoomState {
  chatRooms: ChatRoom[];
  setChatRooms: (rooms: ChatRoom[]) => void;
  updateChatRoom: (id: string, updates: Partial<ChatRoom>) => void;
  fetchChatRooms: () => Promise<void>;
  getSortedChatRooms: () => ChatRoom[];
}

export const useChatRoomStore = create<ChatRoomState>((set, get) => ({
  chatRooms: [],
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  updateChatRoom: (id, updates) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((room) =>
        room.id === id ? { ...room, ...updates } : room
      ),
    })),

  fetchChatRooms: async () => {
    try {
      const response = await loadChatRoom();
      set({ chatRooms: response.data });
    } catch (error) {
      console.error("Failed to fetch chat rooms", error);
    }
  },

  getSortedChatRooms: () => {
    const rooms = get().chatRooms;
    return rooms.slice().sort((a, b) => {
      if (a.newMark && !b.newMark) return -1;
      if (!a.newMark && b.newMark) return 1;
      return 0;
    });
  },
}));
