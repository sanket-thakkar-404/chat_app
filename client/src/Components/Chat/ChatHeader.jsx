import React from "react";
import { useAuthStore } from "../../Store/UseAuthStore";
import { useChatStore } from "../../Store/useChatStore";
import { X } from "lucide-react";

const ChatHeader = (props) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const fullname = `${selectedUser.fullname.firstName} ${selectedUser.fullname.lastName}`;

  return (
    <div className="p-2.5 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.avatar || "/avatar.png"} alt={fullname} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{fullname}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? (
                <span className="w-2.5 h-2.5 rounded-full text-emerald-400">
                  Online
                </span>
              ) : (
                <span className="text-sm font-medium text-zinc-400">
                  Offline
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          className="hidden lg:block cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <X />
        </button>

        <button
          className="lg:hidden cursor-pointer"
          onClick={() => {
            setSelectedUser(null);
            props.setChatPanel(false);
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
