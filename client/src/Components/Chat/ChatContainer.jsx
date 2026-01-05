import  { useEffect } from "react";
import MessageSkeleton from "../skeletons/MessageSkeletons";
import { useChatStore } from "../../Store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../../Store/UseAuthStore";
import { formatMessageTime } from "../../lib/utils";
import { useRef } from "react";
import ChatLoading from "../Reuseable/ChatLoading";

const ChatContainer = (props) => {
  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessage,
    subscribeToMessage,
    unsubscribeFromMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessage(selectedUser._id);
    subscribeToMessage();
    return () => {
      unsubscribeFromMessage(); // runs when component unmounts
    };
  }, [
    getMessage,
    selectedUser._id,
    subscribeToMessage,
    unsubscribeFromMessage,
  ]);

  const uniqueMessages = Array.from(
    new Map(messages.map((m) => [m._id, m])).values()
  );

  const messagesEndRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // scroll instantly on first load
  useEffect(() => {
    scrollToBottom(false);
  }, []);

  // scroll smoothly on new messages
  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex h-[93vh]  flex-col flex-1 ">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!authUser?._id) {
    return (
    <ChatLoading />
    );
  }

  return (
    <div className="flex h-[93vh] flex-col flex-1  ">
      <ChatHeader setChatPanel={props.setChatPanel} />
      <div className="flex-1 message p-4 space-y-3">
        {uniqueMessages.map((message) => {
          if (!message) return null;

          let userId = authUser?._id;
          if (!userId) {
            userId = message.receiverId;
          } // avoid first-render crash

          const isOwn = message.senderId === userId;

          const avatar = isOwn
            ? authUser?.avatar || "/avatar.jpg"
            : selectedUser?.avatar || "/avatar.png";

          return (
            <div
              key={message._id}
              ref={messagesEndRef}
              className={`flex items-end gap-2 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar (hide on own side for cleaner look — optional) */}
              {!isOwn && (
                <div className="avatar">
                  <div className="size-9 rounded-full border">
                    <img src={avatar} alt="user" />
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[78%] min-w-30 rounded-2xl px-3.5 py-2.5 shadow-sm
            ${
              isOwn
                ? "bg-primary text-white rounded-br-none"
                : "bg-base-300 text-zinc-200 rounded-bl-none"
            }`}
              >
                {/* Image Attachment */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="rounded-lg mb-2 max-w-55 border border-zinc-700"
                  />
                )}

                {/* Text */}
                {message.text && (
                  <p className="leading-relaxed break-wrap-break-word">{message.text}</p>
                )}

                {/* Timestamp */}
                <span
                  className={`text-[10px] opacity-70 mt-1 block ${
                    isOwn ? "text-right" : "text-left"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>

              {/* Avatar for own message (optional UI symmetry) */}
              {isOwn && (
                <div className="avatar">
                  <div className="size-9 rounded-full border">
                    <img src={avatar} alt="you" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
