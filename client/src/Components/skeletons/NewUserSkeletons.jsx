import React from "react";

const NewUserSkeletons = () => {

 const skeletonContacts = Array(8).fill(null);
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 ">
       {skeletonContacts.map((_, idx)=> (
         <div key={idx} className="flex w-52   flex-col gap-4">
          <div className="flex items-center gap-4 ">
            <div className="skeleton h-30 w-30 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-50"></div>
              <div className="skeleton h-4 w-50"></div>
            </div>
          </div>
          <div className="skeleton h-52 w-85"></div>
        </div>
       ))}
        
      </div>

  );
};

export default NewUserSkeletons;
