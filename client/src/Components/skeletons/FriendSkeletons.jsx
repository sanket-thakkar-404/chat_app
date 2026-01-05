import React from "react";

const FriendSkeletons = () => {
  const skeletonContacts = Array(3).fill(null);

  return (
    <div className="flex gap-10">
      {skeletonContacts.map((_, idx) => {
        return (
          <div key={idx} className="flex w-52 flex-col gap-4">
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
          </div>
        );
      })}
    </div>
  );
};

export default FriendSkeletons;
