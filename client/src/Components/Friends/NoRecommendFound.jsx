import { UsersRound } from "lucide-react";

const NoRecommendFound = () => {
  return (
    <div className="card bg-base-200/80 border border-base-300 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">

      <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center mb-4">
        <UsersRound className="w-8 h-8 opacity-70" />
      </div>

      <h3 className="text-lg font-semibold">
        No recommendations right now
      </h3>

      <p className="text-sm text-zinc-400 mt-2">
        Check back soon — new people will appear here
      </p>
    </div>
  );
};

export default NoRecommendFound;