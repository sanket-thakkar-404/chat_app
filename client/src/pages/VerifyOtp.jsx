import React, { useEffect, useState } from "react";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import Logo from "../Components/Reuseable/Logo";
import { useAuthStore } from "../Store/UseAuthStore";
import OTPInput from "../Components/Reuseable/OTPInput";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const length = 6;
  const email = sessionStorage.getItem("pendingEmail");
  const { verifyOTP, isVerifyingOTP } = useAuthStore();
  const [status, setStatus] = useState("idle");
  const { resendOTP, isResendOTP } = useAuthStore();
  const [coolDown, setCoolDown] = useState(0);

  const [userOTP, setUserOTP] = useState();

  const handleVerify = async () => {
    if (!email) {
      toast.error("No email found — please sign up again");
      return;
    }

    setStatus("checking");
    console.log(typeof userOTP);
    const res = await verifyOTP(email, userOTP);

    if (!res?.success) {
      setStatus("wrong");
      return;
    }
    console.log("VERIFY RESPONSE =>", res);
    console.log("USER OTP =>", userOTP);
    setStatus("valid");
    toast.success("Email verified 🎉");

    sessionStorage.removeItem("pendingEmail");
  };

  const handleResend = async () => {
    if (coolDown > 0) return;

    const res = await resendOTP(email);

    // backend blocked — start countdown
    if (res?.coolDown) {
      setCoolDown(res.coolDown);
      return;
    }

    if (res?.success) {
      toast.success("OTP sent again");
      setCoolDown(60); // default cooldown if backend didn’t provide
    }
  };

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
      <div className="min-h-screen  flex justify-center items-center p-4">
        <div className="flex flex-col justify-around h-full rounded-3xl shadow-lg w-full max-w-3xl p-6 sm:p-8 text-center">
          {/* App Name */}
          <div className="flex flex-col gap-20">
            <Logo />

            {/* Subtitle */}
            <p className="text-gray-500 text-xl">
              Enter your 6 digit code we sent to <br />
              <span className="font-semibold text-lg text-blue-500">
                {email}
              </span>
            </p>

            {/* OTP Component */}
            {/* <OTPInput length={6} /> */}
            <OTPInput
              length={length}
              setUserOTP={setUserOTP}
              setStatus={setStatus}
              status={status}
            />
          </div>

          <div>
            {/* Verify Button */}
            <button
              disabled={isVerifyingOTP}
              onClick={handleVerify}
              className="btn btn-primary w-full mt-8 text-xl p-3 cursor-pointer"
            >
              {isVerifyingOTP ? (
                <h3>
                  Loading
                  <span className="loading loading-dots loading-xl"></span>
                </h3>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Footer */}
            <p className="text-gray-500 mt-6 text-sm">
              Didn’t receive code?
              <button
                disabled={isResendOTP || coolDown > 0}
                onClick={handleResend}
                className="text-blue-600 font-semibold ml-1 cursor-pointer disabled:text-gray-400"
              >
                {isResendOTP ? (
                  <span>
                    Sending{" "}
                    <span className="loading loading-dots loading-sm"></span>
                  </span>
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
        subtitle="Connect With Friends , Share Moments , and stay in touch your loved ones."
      />
    </div>
  );
};

export default VerifyOtp;
