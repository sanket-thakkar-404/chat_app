import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useUserStore = create((set, get) => ({
  recommendedUsers: [],
  friends: [],
  recentMap: {},
  unreadMap: {},
  incomingRequests: [],
  outgoingFriendRequests: [],
  acceptedRequests: [],

  isLoadingUsers: false,
  isLoadingFriend: false,
  isSendingRequest: false,
  isFriendRequests: false,
  isAcceptingRequest: false,

  // -------------------- GET RECOMMENDED USERS --------------------
  getRecommendedUsers: async () => {
    try {
      set({ isLoadingUsers: true });

      const res = await axiosInstance.get("/users/");
      set({ recommendedUsers: res.data || [] });
    } catch (err) {
      console.error("Error fetching recommended users:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching recommended users:");
      console.log("STATUS:", err?.response?.status);
      console.log("MESSAGE:", err?.response?.data?.message);
      console.log("DATA:", err?.response?.data);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  // -------------------- GET MY FRIENDS --------------------
  getMyFriends: async () => {
    try {
      set({ isLoadingFriend: true });
      const res = await axiosInstance.get("/users/friends");
      set({ friends: res.data.friend || [] });
    } catch (err) {
      console.error("Error fetching friends:", err);
      toast.error("Failed to load friends");
    } finally {
      set({ isLoadingFriend: false });
    }
  },

  // -------------------- GET INCOMING REQUESTS --------------------
  getFriendRequests: async () => {
    set({ isFriendRequests: true });
    try {
      const res = await axiosInstance.get("/users/friend-requests");
      set({
        incomingRequests: res.data.incomingReq || [],
        acceptedRequests: res.data.acceptedReq || [],
      });
    } catch (err) {
      console.error("Error fetching incoming requests:", err);
      toast.error("Failed to load friend requests");
    } finally {
      set({ isFriendRequests: false });
    }
  },

  // -------------------- GET OUTGOING REQUESTS --------------------
  getOutgoingFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/users/outgoing-friend-requests");
      console.log(res.data.outgoingReq);
      set({ outgoingFriendRequests: res.data.outgoingReq || [] });
    } catch (err) {
      console.error("Error fetching outgoing requests:", err);
      toast.error("Failed to load sent requests");
    }
  },

  // -------------------- SEND FRIEND REQUEST --------------------
  sendFriendRequest: async (userId) => {
    try {
      set({ isSendingRequest: true });

      const res = await axiosInstance.post(`/users/friend-request/${userId}`);

      toast.success(res.data.message || "Friend request sent");

      // refresh outgoing list
      await get().getOutgoingFriendRequests();
    } catch (err) {
      console.error("Send friend request failed:", err);

      toast.error(
        err?.response?.data?.message || "Failed to send friend request"
      );
    } finally {
      set({ isSendingRequest: false });
    }
  },
  // -------------------- ACCEPT FRIEND REQUEST --------------------
  acceptFriendRequest: async (userId) => {
    set({ isAcceptingRequest: true });

    try {
      const res = await axiosInstance.put(
        `/users/friend-request/${userId}/accept`
      );
      console.log(res);

      toast.success(res.data.message || "Request accepted");

      // remove from UI instantly
      set((state) => ({
        incomingRequests: state.incomingRequests.filter(
          (u) => u._id !== userId
        ),
      }));

      set((state) => ({
        acceptedRequests: [
          ...(state.acceptedRequests || []),
          res.data.acceptedReq,
        ],
      }));

      // sync fresh state
      await Promise.all([get().getFriendRequests(), get().getMyFriends()]);
    } catch (err) {
      console.error("Accept request failed:", err);
      toast.error(err?.response?.data?.message || "Failed to accept request");
    } finally {
      set({ isAcceptingRequest: false });
    }
  },

  bumpToRecent: (userId) =>
    set((state) => {
      console.log("🔥 bumping", userId);
      console.log("🟡 before", state.recentMap);

      return {
        recentMap: {
          ...state.recentMap,
          [userId]: Date.now(),
        },
      };
    }),

  incrementUnread: (userId) =>
    set((state) => ({
      unreadMap: {
        ...state.unreadMap,
        [userId]: (state.unreadMap[userId] || 0) + 1,
      },
    })),

  clearUnread: (userId) =>
    set((state) => {
      const copy = { ...state.unreadMap };
      delete copy[userId];
      return { unreadMap: copy };
    }),
}));
