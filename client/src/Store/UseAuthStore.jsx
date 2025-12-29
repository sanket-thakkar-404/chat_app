import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isResendOTP: false,
  isVerifyingOTP: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
    } catch (err) {
      console.error("Error in checkAuth  : ", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", formData);
      // console.log(res.data.user.email);
      toast.success(res.data.message || "Account created Successfully");
      return { success: true, data: res.data.user };
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || "Signup failed");
      return { success: false };
    } finally {
      setTimeout(() => {
        set({ isSigningUp: false });
      }, 1000);
    }
  },
  verifyOTP: async (email, code) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/verify-email", {
        email,
        code,
      });
      set({ authUser: res.data });
      console.log(res);
      toast.success(res.data.message || "OTP verified successfully");
      return { success: true, data: res.data };
    } catch (err) {
      console.error("OTP verify failed:", err);
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      set({ isVerifyingOtp: false });
    }
  },
  resendOTP: async (email) => {
    set({ isResendOTP: true });

    try {
      const res = await axiosInstance.post("/auth/resend-verification", {
        email,
      });

      toast.success(res.data.message || "OTP sent again");

      return { success: true };
    } catch (err) {
      console.error("Resend OTP Error:", err);

      // ⛔ Handle backend coolDown response
      if (err.response?.status === 429) {
        const msg = err.response.data?.message || "";

        // extract seconds from message: "please Wait 55's"
        const seconds = parseInt(msg.match(/\d+/)?.[0] || 60);

        return { success: false, coolDown: seconds };
      }

      toast.error(err.response?.data?.message || "Failed to resend OTP");
      return { success: false };
    } finally {
      set({ isResendOTP: false });
    }
  },
  Logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out SuccessFully");
    } catch (err) {
      console.error("Error in Logging out ", err);
      toast.error("Error in Logging Out");
    }
  },
}));
