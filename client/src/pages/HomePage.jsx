import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import ChatPage from "./ChatPage";
import GroupPages from "./GroupPages";
import Sidebar from "../Components/Sidebar";
import StarredPage from "./StarredPage";
import AddFriendPage from "./AddFriendPage";
import SettingPage from "./SettingPage";
import SidebarButton from "../Components/SidebarButton";
import NotificationPage from "./NotificationPage";

const HomePage = () => {
  return (
    <div className="h-screen bg-base-200 pt-15">
      <div className="grid lg:grid-cols-20 md:grid-cols-6 sm:grid-cols-6 h-full relative">
        <div className=" lg:col-span-1 col-span-1 sm:col-span-1 hidden md:block md:col-span-1 sm:block">
          <Sidebar />
        </div>

        <div className="lg:col-span-19 md:col-span-5 sm:col-span-5">
          <Routes>
            <Route index element={<Navigate to="/home/chat" replace />} />

            <Route path="chat" element={<ChatPage />} />
            <Route path="groups" element={<GroupPages />} />
            <Route path="starred" element={<StarredPage />} />
            <Route path="add-friend" element={<AddFriendPage />} />
            <Route path="notification" element={<NotificationPage />} />
          </Routes>
        </div>

        <div className="fixed bottom-10 right-8 md:hidden lg:hidden ">
          <SidebarButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
