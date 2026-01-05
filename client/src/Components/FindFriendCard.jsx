import React from "react";
import { useNavigate } from "react-router-dom";

const FindFriendCard = () => {

  const navigate = useNavigate()

  const handleFindFriends = async () => {
    navigate('/home/add-friend')
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-6 text-zinc-400">
      <p className="text-lg font-medium text-zinc-200">No Friends Yet</p>
      <p className="text-sm mt-1">
        Start connecting and build your friend list.
      </p>

      <button
        onClick={handleFindFriends}
        className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary text-white font-medium transition"
      >
        Find Friends
      </button>
    </div>
  );
};

export default FindFriendCard;
