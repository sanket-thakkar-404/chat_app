import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  UsersRound,
  Star,
  Settings,
  Plus,
  X,
  PackagePlus
} from "lucide-react";

const SidebarButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { label: "Setting", path: "/home/setting", icon: Settings },
    { label: "Starred", path: "/home/starred", icon: Star },
    { label: "Notification", path: "/home/notification", icon: PackagePlus },
    { label: "Add Friend", path: "/home/add-friend", icon: Plus },
    { label: "Groups", path: "/home/groups", icon: UsersRound },
    { label: "Chat", path: "/home/chat", icon: MessageSquare },
  ];

  return (
    <div className="relative w-full h-full ">
      {/* floating actions */}
      {isOpen &&
        actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className="absolute -translate-x-1/2
  w-40 px-3 py-2 -right-22 rounded shadow hover:scale-110 cursor-pointer
   flex items-center gap-2 justify-between whitespace-nowrap"
              style={{ bottom: `${(index + 1) * 60}px` }}
            >
              <span>{item.label}</span>

              <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center  ">
                <Icon className="size-6" />
              </div>
            </button>
          );
        })}

      {/* FAB button */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-15 h-15 bg-primary text-white
          flex items-center justify-center
          rounded-full cursor-pointer"
      >
        {isOpen ? <X /> : <Plus />}
      </div>
    </div>
  );
};

export default SidebarButton;
