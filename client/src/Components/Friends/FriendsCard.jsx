import { Link } from "react-router-dom";
import { MessageSquare, CircleUserRound } from "lucide-react";

const FriendsCard = ({friend }) => {
  return (

      <div className="group card bg-base-200/80 border border-base-300 rounded-3xl p-5 shadow-sm
        hover:shadow-xl hover:border-primary/50 hover:bg-base-200 transition-all duration-300">

        {/* Top Section */}
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-base-300">
              <img
                src={friend.avatar}
                alt={friend.fullname.firstName}
                className="w-full h-full object-cover"
              />
            </div>

            
          </div>

          {/* User Details */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg tracking-tight">
              {`${friend.fullname.firstName} ${friend.fullname.lastName}`}
            </h3>

            <p className="text-sm text-zinc-400 truncate max-w-50">
              {friend.email}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-base-300 my-4" />

        {/* Action Button */}
        <Link
          to="/home"
          className="btn btn-primary rounded-2xl w-full flex gap-2 group-hover:gap-3 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Message
        </Link>
      </div>
  );
};

export default FriendsCard;