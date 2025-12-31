import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import Logo from "../Components/Reuseable/Logo";
import { useAuthStore } from "../Store/UseAuthStore";
import OTPInput from "../Components/Reuseable/OTPInput";
import toast from "react-hot-toast";
import LoadingButton from "../Components/Reuseable/LoadingButton";

const VerifyOtp = () => {
  // OTP length
  const length = 6;

  // Mode → "signup" or "reset"
  const mode = sessionStorage.getItem("otp_mode") || "signup";
  const isResetMode = mode === "reset";

  // Email (from whichever step stored it)
  const email =
    sessionStorage.getItem("pendingEmail") ||
    sessionStorage.getItem("reset_email");

  const navigate = useNavigate();

  // Store values
  const {
    verifyOTP,
    isVerifyingOTP,
    resendOTP,
    isResendOTP,
    resetCode,
    isResendingCode,
  } = useAuthStore();

  const [status, setStatus] = useState("idle");
  const [userOTP, setUserOTP] = useState("");
  const [coolDown, setCoolDown] = useState(0);

  // ---------------- VERIFY OTP ----------------
  const handleVerify = async () => {
    if (!email) {
      toast.error("No email found — restart process");
      if(isResetMode) {
        navigate('/forget-password')
        return;
      } 
      navigate('/signup')
      return;
    }

    if (!userOTP || userOTP.length !== length) {
      toast.error("Enter full OTP");
      return;
    }

    setStatus("checking");

    if (isResetMode) {
      const res = await resetCode(email, userOTP);
      if (!res?.success) {
        setStatus("wrong");
        return;
      }
      setStatus("valid");
    } else {
      const res = await verifyOTP(email, userOTP);
      if (!res?.success) {
        setStatus("wrong");
        return;
      }
      setStatus("valid");
    }
    // -------- RESET PASSWORD MODE --------
    if (isResetMode) {
      toast.success("OTP verified — continue to reset password");

      // keep reset email for next step
      sessionStorage.removeItem("otp_mode");
      navigate("/reset-password");
      return;
    }

    // -------- SIGNUP MODE --------
    toast.success("Email verified 🎉");

    sessionStorage.removeItem("pendingEmail");
    sessionStorage.removeItem("otp_mode");
  };

  // ---------------- RESEND OTP ----------------
  const handleResend = async () => {
    if (coolDown > 0) return;

    const res = await resendOTP(email, mode);

    if (res?.coolDown) {
      setCoolDown(res.coolDown);
      return;
    }

    if (res?.success) {
      toast.success("OTP sent again");
      setCoolDown(60);
    }
  };

  // ---------------- COOLDOWN TIMER ----------------
  useEffect(() => {
    if (coolDown <= 0) return;

    const timer = setInterval(() => {
      setCoolDown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [coolDown]);

  return (
    <div className="grid lg:grid-cols-2">
      <div className="min-h-screen flex justify-center items-center p-4">
        <div className="flex flex-col justify-around h-full rounded-3xl shadow-lg w-full max-w-3xl p-6 sm:p-8 text-center">
          <div className="flex flex-col gap-20">
            <Logo />

            {/* Title changes based on mode */}
            <h1 className="text-2xl font-bold">
              {isResetMode ? "Verify Reset Code" : "Verify Your Email"}
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-xl">
              {isResetMode
                ? "Enter the OTP sent for password reset"
                : "Enter the OTP sent to your email"}
              <br />
              <span className="font-semibold text-lg text-blue-500">
                {email}
              </span>
            </p>

            {/* OTP Input */}
            <OTPInput
              length={length}
              setUserOTP={setUserOTP}
              setStatus={setStatus}
              status={status}
            />
          </div>

          <div>
            {/* VERIFY BUTTON */}
            {isResetMode ? (
              <LoadingButton
                isLoading={isResendingCode}
                onClick={handleVerify}
                loadingText="sending"
                children="Verify & Continue"
              />
            ) : (
              <LoadingButton
                isLoading={isVerifyingOTP}
                onClick={handleVerify}
                loadingText="sending"
                children="Verify Email"
              />
            )}

            {/*  */}

            {/* RESEND SECTION */}
            <p className="text-gray-500 mt-6 text-sm">
              Didn’t receive code?
              <button
                disabled={isResendOTP || coolDown > 0}
                onClick={handleResend}
                className="text-blue-600 font-semibold ml-1 disabled:text-gray-400"
              >
                {isResendOTP ? (
                  <>
                    Sending <span className="loading loading-dots loading-sm" />
                  </>
                ) : coolDown > 0 ? (
                  `Resend in ${coolDown}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect with friends, share moments, and stay in touch with the people who matter."
      />
    </div>
  );
};

export default VerifyOtp;
