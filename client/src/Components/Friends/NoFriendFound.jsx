import { UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";

const NoFriendFound = ({title, subtitle}) => {
  return (
    <div className="card bg-base-200/70  rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
      
      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <UserRoundPlus className="w-8 h-8 opacity-70" />
      </div>

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="text-sm text-zinc-400 mt-2">
       {subtitle}
      </p>

    </div>
  );
};

export default NoFriendFound;