import React, { useState } from "react";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import Logo from "../Components/Reuseable/Logo";
import AuthHeader from "../Components/Reuseable/AuthHeader";
import FormInput from "../Components/Reuseable/FormInput";
import { Mail } from "lucide-react";
import LoadingButton from "../Components/Reuseable/LoadingButton";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import AuthSwitchLink from "../Components/Reuseable/AuthSwitchLink";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const { resetPassword, isResettingPassword } = useAuthStore();
  const [showRegister, setShowRegister] = useState(false);

  const validateForm = () => {
    const value = email.trim().toLowerCase();

    if (!value) {
      toast.error("Email is required");
      return false;
    }

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!EMAIL_REGEX.test(value)) {
      toast.error("Enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = validateForm();

    if (!ok) return;

    const res = await resetPassword(email);
    if (!res?.success) {
      // ⛔ stop if login failed
      if (res.reason === undefined) {
        setShowRegister(true);
        return toast.error("Please sign up first.");
      }
      return;
    } else {
      sessionStorage.setItem("otp_mode", "reset");
      // console.log(res.data.user.email)
      sessionStorage.setItem("reset_email", res.data.user.email);
      navigate('/verify-email')
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-2xl space-y-2">
          {/* Logo */}
          <Logo />
          <AuthHeader
            title="Forgot your password?"
            subtitle="Enter your email and we’ll send you a get reset Code."
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-20">
            <FormInput
              label="Email"
              type="email"
              value={email}
              placeholder="Enter your registered email"
              icon={<Mail className="size-4.5" />}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            {showRegister ? (
              <AuthSwitchLink
                to="/signup"
                linkText="Register"
                className="btn btn-primary btn-lg no-underline px-5 py-3 rounded-xl mt-2"
                classLInk="text-white"
              />
            ) : (
              <LoadingButton
                children="Send code"
                isLoading={isResettingPassword}
                loadingText="Sending"
              />
            )}
          </form>
        </div>
      </div>
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with the people who matter."
      />
    </div>
  );
};

export default ForgetPassword;
