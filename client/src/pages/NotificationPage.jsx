import React, { useEffect } from "react";
import { useUserStore } from "../Store/useUserStore";
import UserSkeletons from "../Components/skeletons/UserSkeletons";
import NoFriendFound from "../Components/Friends/NoFriendFound";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  Plus,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../Components/Friends/NoNotificationsFound";
import FriendSkeletons from "../Components/skeletons/FriendSkeletons";

const NotificationPage = () => {
  const {
    isAcceptingRequest,
    acceptFriendRequest,
    isFriendRequests,
    getFriendRequests,
    incomingRequests,
    acceptedRequests,
  } = useUserStore();

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  const handleAccept = async (userId) => {
    await acceptFriendRequest(userId);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {isFriendRequests ? (
          <FriendSkeletons />
        ) : (
          <>
            {incomingRequests.length === 0 ? (
              <NoFriendFound
                title="No Friend Requests Yet"
                subtitle="Find people you know and send them a friend request."
              />
            ) : (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-3 h-auto message">
                  {incomingRequests.map((request) => {
                    console.log(request);
                    if(!request.sender) return null;
                    const fullname = `${request.sender.fullname.firstName} ${request.sender.fullname.lastName}`;

                    return (
                      <div
                        key={request._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                <img
                                  src={request.sender.avatar}
                                  alt={request.sender.fullname.firstName}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {fullname}
                                  {/* {request.sender.fullName.firstName} */}
                                </h3>
                                <p>{fullname} requested your friend </p>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleAccept(request._id)}
                              disabled={isAcceptingRequest}
                            >
                              {isAcceptingRequest ? (
                                <h2>
                                  Accepting{" "}
                                  <span className="loading loading-dots loading-xl"></span>
                                </h2>
                              ) : (
                                <>
                                  <>
                                    <Plus className="size-4 mr-2" />
                                    Accept Request
                                  </>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

             <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
               

                <div className="space-y-3 h-[70vh] message">
                  {acceptedRequests.map((notification) => {
                    const fullname = `${notification.recipients.fullname.firstName} ${notification.recipients.fullname.lastName}`;

                    return (
                      <div
                        key={notification._id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification.recipients.avatar}
                                alt={fullname}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{fullname}</h3>
                              <p className="text-sm my-1">
                                {fullname} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
