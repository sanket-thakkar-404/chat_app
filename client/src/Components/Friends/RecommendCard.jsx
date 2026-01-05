import { CheckCircle2, CheckCircleIcon, UserPlusIcon } from "lucide-react";
import { useUserStore } from "../../Store/useUserStore";

const RecommendCard = ({ user, hasRequestBeenSent }) => {
  const { sendFriendRequest, isSendingRequest } = useUserStore();

  const handleRequest = async (userId) => {
    await sendFriendRequest(userId);
  };

  return (
    <div className="card bg-base-200 border border-base-300 rounded-2xl hover:shadow-xl hover:border-primary/40 transition-all duration-300">
      <div className="card-body p-5 space-y-5  w-full">
        {/* USER HEADER */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-14 rounded-full ring ring-base-300 ring-offset-2">
              <img src={user.avatar} alt={user.fullname.firstName} />
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base leading-tight">
              {`${user.fullname.firstName} ${user.fullname.lastName}`}
            </h3>

            <p className="text-sm text-zinc-400 truncate ">{user.email}</p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={() => handleRequest(user._id)}
          className={`btn w-full mt-2 ${
            hasRequestBeenSent || isSendingRequest
              ? "btn-disabled"
              : "btn-primary"
          }`}
          disabled={
            hasRequestBeenSent === user._id || isSendingRequest === user._id
          }
        >
          {hasRequestBeenSent ? (
            <>
              <CheckCircleIcon className="size-4 mr-2" />
              Request Sent
            </>
          ) : isSendingRequest ? (
            <>
              <h2>
                sending{" "}
                <span className="loading loading-dots loading-xl"></span>
              </h2>
            </>
          ) : (
            <>
              <UserPlusIcon className="size-4 mr-2" />
              Send Friend Request
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecommendCard;
