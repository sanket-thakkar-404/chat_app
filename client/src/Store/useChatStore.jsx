import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  isMessagesLoading: false,

  getMessage: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (err) {
      console.error("Error In getting Message :", err);
      toast.error(err.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.newMessage] });
      useUserStore.getState().bumpToRecent(selectedUser._id);
    } catch (err) {
      console.error("Error In Sending Messages :", err);
      toast.error(err.response.data.message);
    }
  },

  // this will help me to get message realtime
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const selectedUser = get().selectedUser;

      // update messages if this chat is open
      if (newMessage.senderId === selectedUser?._id) {
        set({ messages: [...get().messages, newMessage] });
      }

      // bump chat to top ALWAYS
      const otherUserId =
        newMessage.senderId === useAuthStore.getState().authUser._id
          ? newMessage.receiverId
          : newMessage.senderId;
      useUserStore.getState().bumpToRecent(otherUserId);

      if (!selectedUser || selectedUser._id !== newMessage.senderId) {
        useUserStore.getState().incrementUnread(newMessage.senderId);
        return;
      }

      // if chat IS open → append message normally
      set((s) => ({
        messages: [...s.messages, newMessage],
      }));
    });
  },

  unsubscribeFromMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  // todo: Optimize this one later
  setSelectedUser: (user) => {
    set({ selectedUser: user });
    console.log("Selected user set to:", user);
    if(!user) return;
    useUserStore.getState().clearUnread(user._id);
  },
}));
