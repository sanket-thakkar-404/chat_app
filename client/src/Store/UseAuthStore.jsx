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
  isSetNewPassword: false,
  isResendingCode: false,
  isResettingPassword: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
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
      // console.log(res);
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

  logout: async () => {
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

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success(res.data.message || "Login Account Successfully");
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error in Login Page :", err.message);
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  resetPassword: async (email) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post("/auth/request-password-reset", {
        email,
      });
      // console.log(res)
      toast.success(res.data.message || "Resend Code Sent Successfully");
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error in resetting Password :", err);

      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("user not found")) {
        return { success: false, reason: undefined };
      }
      toast.error(err.response?.data?.message || "Reset Code failed");
    } finally {
      set({ isResettingPassword: false });
    }
  },

  resetCode: async (email, code) => {
    set({ isResendingCode: true });
    try {
      const res = await axiosInstance.post("/auth/verify-reset-code", {
        email,
        code,
      });
      // console.log(res);
      toast.success(res.data.message || "OTP verified successfully");
      return { success: true, data: res.data };
    } catch (err) {
      console.error("OTP verify failed:", err);
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      set({ isResendingCode: false });
    }
  },

  setNewPassword: async (formData) => {
    set({ isSetNewPassword: true });
    try {
      const res = await axiosInstance.post("/auth/reset-password", formData);
      toast.success(res.data.message || "Password reset successfully");
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Error Resetting Password ", err);
      toast.error(err.response?.data?.message || "Invalid Reset Password");
    } finally {
      set({ isSetNewPassword: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data );
      set({ authUser: res.data });
      toast.success(res.data.message || "Profile pic updated successfully");
    } catch (err) {
      console.error("Error in Updating Profile", err);
     const message =
    err?.response?.data?.message ||
    err?.message ||
    "Failed to update profile";

  toast.error(message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
