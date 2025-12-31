import { useAuthStore } from "../Store/UseAuthStore";
import { Camera, Mail, User } from "lucide-react";
import FormInput from "../Components/Reuseable/FormInput";
import { useState } from "react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fullname = `${authUser.user.fullname.firstName} ${authUser.user.fullname.lastName}`;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
      await updateProfile({ avatar: base64Img });
    };
  };

  return (
    <div className="h-screen pt-10">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold ">Profile</h1>
            <p className="mt-2 text-gray-500">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.user.avatar || "avatar.jpg"}
                alt="Profile"
                className="size-42 rounded-full object-top object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-8 h-8  text-center text-black text-base-500" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-zinc-200">
                  Account Details
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Your basic profile information (read-only)
                </p>
              </div>

              <div className="space-y-6">
                <FormInput
                  type="text"
                  label="Full Name"
                  icon={<User />}
                  value={fullname}
                  disabled
                  className="bg-zinc-900 text-zinc-400 border-zinc-700 cursor-not-allowed"
                />

                <FormInput
                  type="text"
                  label="Email Address"
                  icon={<Mail />}
                  value={authUser?.user?.email}
                  disabled
                  className="bg-zinc-900 text-zinc-400 border-zinc-700 cursor-not-allowed"
                />

                <div className="mt-9">
                  <h1 className="text-xl font-semibold text-zinc-200">
                    Account Information
                  </h1>

                  <div className="flex items-center justify-between py-3 mt-8">
                    <span className="text-md text-zinc-400">Member Since</span>
                    <span className={`text-sm font-medium `}>
                      {authUser.user.createdAt?.split("T")[0]}
                    </span>
                  </div>
                  <hr className="text-zinc-600" />
                  <div className="flex items-center justify-between py-3 mt-3">
                    <span className="text-md text-zinc-400">
                      Account Status
                    </span>

                    {authUser?.user?.status === "online" ? (
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-zinc-400">
                        Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
