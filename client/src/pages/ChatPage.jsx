import  { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useChatStore } from "../Store/useChatStore";
import ChatContainer from '../Components/Chat/ChatContainer'
import NoChatSelected from "../Components/Chat/NoChatSelected";
import ChatUsers from "../Components/Chat/ChatUsers";

const ChatPage = () => {
  const chatPanelRef = useRef(null);
  const [chatPanel, setChatPanel] = useState(false);
  const {selectedUser} = useChatStore()

  useEffect(() => {
    if (chatPanel) {
      gsap.to(chatPanelRef.current, {
        transform: "translateY(0)",
        duration: 0.8,
        ease: "power2.out",
      });
    } else {
      gsap.to(chatPanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [chatPanel]);

  return (
    <div className="grid lg:grid-cols-19 md:grid-cols-5 h-full w-full">
      <div 
      onClick={()=> setChatPanel(true)}
      className="md:col-span-7 lg:col-span-5 sm:col-span-19 ">
        <ChatUsers/>
      </div>
      <div className="md:col-span-5 hidden md:hidden  lg:block  lg:col-span-14 sm:col-span-5 ">
        {selectedUser ? <ChatContainer/> : <NoChatSelected/>}
      </div>

      <div
        ref={chatPanelRef}
       
        className=" absolute bottom-0 left-0 md:left-35 lg:hidden translate-y-full bg-base-300 h-full md:w-[86%] lg:w-[80%] w-full z-20"
      >
         {selectedUser ? <ChatContainer  setChatPanel={setChatPanel}/> : <NoChatSelected/>}
       
      </div>
    </div>
  );
};

export default ChatPage;
