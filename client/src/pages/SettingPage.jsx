import { useState } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../Store/UseAuthStore";
import Theme from "../Components/Theme";
import ThemePreview from "../Components/ThemePreview";
import Heading from "../Components/Reuseable/Heading";
import ActionRow from "../Components/Reuseable/ActionRow";
import LoadingButton from "../Components/Reuseable/LoadingButton";
import { useNavigate } from "react-router-dom";

const SettingPage = () => {
  const [open, setOpen] = useState(false);
  const { authUser, isResettingPassword, resetPassword } = useAuthStore();
  const navigate = useNavigate();
  const email = authUser?.user?.email;

  const handleChange = async () => {
    if (!email) return;

    const res = await resetPassword(email);
    if (!res?.success) return;
    sessionStorage.setItem("otp_mode", "reset");
    sessionStorage.setItem("reset_email", res.data.user.email);
    navigate("/verify-email");
  };

  return (
    <div className="h-screen theme container mx-auto px-4 pt-15 max-w-7xl">
      <div className="space-y-6">
        <Heading
          title="Theme"
          subtitle="choose a theme for your chat interface"
        />
        {/* All Theme */}
        <Theme />

        {/* Theme Preview */}
        <ThemePreview />

        {/* Additional Setting */}
        {authUser && (
          <div className="mt-5 p-3 border border-red-500/40 rounded-lg">
            <h2 className="text-lg text-red-500 font-bold mb-2">Danger Zone</h2>
            <ActionRow
              title="Update your account password"
              subtitle=" Update your account password. You will be required to log in again after changing it."
              btnText="Change Password"
              onClick={() => setOpen(true)}
            />
          </div>
        )}

        <div
          className={`${
            open ? "fixed" : "hidden"
          } inset-0 z-50 flex items-center justify-center`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-base-200/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 lg:max-w-2xl max-w-lg bg-base-100 border border-zinc-800 rounded-xl shadow-2xl mb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h2 className="text-sm font-semibold">Change password</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 text-center">
              <div className="text-lg font-semibold mb-2">
                Confirm your email
              </div>

              <p className="text-sm text-zinc-400">
                For security reasons, please confirm your email before changing
                your password.
              </p>

              <input
                type="text"
                value={email}
                disabled
                className="w-full mt-5 px-3 py-2 text-sm rounded-md 
          bg-zinc-800 border border-zinc-700 text-zinc-400 cursor-not-allowed"
              />
            </div>

            {/* Footer */}
            <LoadingButton
              type="button"
              onclick={handleChange}
              isLoading={isResettingPassword}
              loadingText="Confirming"
              children="Confirm Change"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
