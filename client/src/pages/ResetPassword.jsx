import React, { useState } from "react";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import Logo from "../Components/Reuseable/Logo";
import AuthHeader from "../Components/Reuseable/AuthHeader";
import FormInput from "../Components/Reuseable/FormInput";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LoadingButton from "../Components/Reuseable/LoadingButton";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const email = sessionStorage.getItem("reset_email");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { setNewPassword, isSetNewPassword } = useAuthStore();
  const [formData, setFormData] = useState({
    email,
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const { password, confirmPassword } = formData;

    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length <= 6) toast.error("Password must be at least 6 characters");

    if (confirmPassword !== password) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validateForm();

    if (!ok) return;

    const payload = {
      email: formData.email,
      newPassword: formData.password,
    };

    const res = await setNewPassword(payload);

    if (!res?.success) return;

    sessionStorage.removeItem('reset_email');

    toast.success("Password updated successfully — log in to continue");
    navigate("/login");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 ">
      {/* left side */}
      <div className="flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-2xl space-y-2">
          <Logo />
          <AuthHeader
            title="Reset your password"
            subtitle="Create a new password for your account"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              value={formData.email}
              disabled
              icon={<Mail className="size-4.5" />}
              type="email"
              className="text-zinc-400"
              placeholder="Enter your email"
            />
            <div className="relative">
              <FormInput
                label="New Password"
                icon={<Lock className="size-4.5" />}
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      password: e.target.value,
                    };
                  });
                }}
              />

              <EyeOff
                className={`size-5 absolute top-13 right-5 -translate-y-1/2 cursor-pointer transition-all 
              ${showPassword ? "hidden" : "block"}`}
                onClick={() => setShowPassword(true)}
              />
              <Eye
                className={`size-5 absolute top-13 right-5 -translate-y-1/2 cursor-pointer transition-all
              ${showPassword ? "block" : "hidden"}`}
                onClick={() => setShowPassword(false)}
              />
            </div>
            <div className="relative">
              <FormInput
                label="Confirm New Password"
                icon={<Lock className="size-4.5" />}
                type="text"
                placeholder="************"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      confirmPassword: e.target.value,
                    };
                  });
                }}
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}

            <LoadingButton
              isLoading={isSetNewPassword}
              loadingText="Saving"
              children="Reset password"
            />
          </form>
        </div>
      </div>

      <AuthImagePattern
        title="Hey, you’re back!"
        subtitle="Log in to pick up where you left off"
      />
    </div>
  );
};

export default ResetPassword;
