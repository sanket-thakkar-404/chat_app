import { useEffect, useState } from "react";
import { useUserStore } from "../Store/useUserStore";
import { Link } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";
import FriendSkeletons from "../Components/skeletons/FriendSkeletons";
import FriendsCard from "../Components/Friends/FriendsCard";
import NoFriendFound from "../Components/Friends/NoFriendFound";
import NewUserSkeletons from "../Components/skeletons/NewUserSkeletons";
import NoRecommendFound from "../Components/Friends/NoRecommendFound";
import RecommendCard from "../Components/Friends/RecommendCard";

const AddFriendPage = () => {
  const [outGoingRequestIds, setOutGoingRequestIds] = useState(new Set());

  const {
    recommendedUsers,
    outgoingFriendRequests,
    friends,
    getRecommendedUsers,
    getOutgoingFriendRequests,
    getMyFriends,
    isLoadingUsers,
    isLoadingFriend,
  } = useUserStore();

  useEffect(() => {
    getRecommendedUsers();
    getOutgoingFriendRequests();
    getMyFriends();
  }, [getRecommendedUsers, getOutgoingFriendRequests, getMyFriends]);

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendRequests && outgoingFriendRequests.length > 0) {
      outgoingFriendRequests.forEach((req) => {
        outgoingIds.add(req.recipients._id);
      });
      setOutGoingRequestIds(outgoingIds);
    }
  }, [outgoingFriendRequests]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link
            to="/home/notification"
            className="flex gap-2 btn btn-outline rounded-2xl"
          >
            <UserRoundPlus className="size-5" /> FriendRequest
          </Link>
        </div>
        {isLoadingFriend ? (
          <FriendSkeletons />
        ) : friends.length === 0 ? (
          <NoFriendFound title="You haven’t added any friends yet" subtitle=" Start connecting with people and grow your circle"/>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => {
              console.log(friend)
              return <FriendsCard key={friend._id} friend={friend} />;
            })}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {" "}
                  Discover New People
                </h2>
                <p className="opacity-70">
                  Find new friends and start conversations instantly
                </p>
              </div>
            </div>
          </div>

          {isLoadingUsers ? (
            <NewUserSkeletons />
          ) : recommendedUsers.length === 0 ? (
            <NoRecommendFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outGoingRequestIds.has(user._id);
                console.log(hasRequestBeenSent);
                return (
                  <RecommendCard
                    key={user._id}
                    user={user}
                    hasRequestBeenSent={hasRequestBeenSent}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AddFriendPage;
