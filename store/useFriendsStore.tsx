import { getFriendList } from "@/api/friends";
import { create } from "zustand";

export interface Friend {
  id: string;
  username: string;
  email: string;
  mention: string;
}

interface FriendStore {
  friends: Friend[];
  setFriends: (friends: Friend[]) => void;
  fetchFriends: () => Promise<void>;
}

export const useFriendStore = create<FriendStore>((set) => ({
  friends: [],

  setFriends: (friends: Friend[]) => set({ friends }),

  fetchFriends: async () => {
    try {
      const response = await getFriendList();

      const data: Friend[] = await response.data;
      set({ friends: data });
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  },
}));
