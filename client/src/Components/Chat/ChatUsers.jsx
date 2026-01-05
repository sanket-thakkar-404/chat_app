import { useEffect } from "react";
import { useChatStore } from "../../Store/useChatStore";
import UserSkeletons from "../skeletons/UserSkeletons";
import { SquarePen } from "lucide-react";
import { useUserStore } from "../../Store/useUserStore";
import FindFriendCard from "../FindFriendCard";
import SearchUser from "../SearchUser";
import { useAuthStore } from "../../Store/UseAuthStore";

const ChatUsers = () => {
  const { setSelectedUser, selectedUser } = useChatStore();
  const {
    friends,
    getMyFriends,
    isLoadingFriend,
    recentMap,
    unreadMap,
  } = useUserStore();
  const { onlineUsers } = useAuthStore();

  const sortedFriends = [...friends].sort((a, b) => {
    const at = recentMap[a._id] || 0;
    const bt = recentMap[b._id] || 0;

    return bt - at; // newest chat first
  });
  
  useEffect(() => {
    getMyFriends();
  }, [getMyFriends]);

  return (
    <div className="w-full flex h-full flex-col border border-base-300 transition-all duration-300 p-3 ">
      <div className="flex justify-between items-center px-3 mb-4">
        <h5 className="text-lg">Chats</h5>
        <h5>
          <SquarePen className="size-5" />
        </h5>
      </div>

      <SearchUser />
      {isLoadingFriend ? (
        <UserSkeletons />
      ) : friends.length === 0 ? (
        <FindFriendCard />
      ) : (
        <div className="overflow-y-auto h-[80vh] message  w-full py-3">
          {sortedFriends.map((friend) => {
            const fullname = `${friend.fullname.firstName} ${friend.fullname.lastName}`;
            return (
              <button
                key={friend._id}
                onClick={() => setSelectedUser(friend)}
                className={`w-full justify-start p-3 flex  gap-3 hover:bg-base-300 transition-colors
        ${
          selectedUser?._id === friend._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }
      `}
              >
                <div className="relative  lg:mx-0">
                  <img
                    src={`${friend.avatar}?v=1`}
                    alt={fullname}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(friend._id) && (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>

                <div className="lg:block text-left min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    {fullname}

                    {unreadMap[friend._id] > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-white item-right">
                        {unreadMap[friend._id]}
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
      {/* <div className="overflow-y-auto w-full py-3">
        {users?.map((user) => {
          const fullname = `${user.fullname.firstName} ${user.fullname.lastName}`;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full justify-start p-3 flex  gap-3 hover:bg-base-300 transition-colors
        ${
          selectedUser?._id === user._id
            ? "bg-base-300 ring-1 ring-base-300"
            : ""
        }
      `}
            >
              <div className="relative  lg:mx-0">
                <img
                  src={`${user.avatar}?v=1`}
                  alt={fullname}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              <div className="lg:block text-left min-w-0">
                <div className="font-medium truncate">{fullname}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div> */}
    </div>
  );
};

export default ChatUsers;
