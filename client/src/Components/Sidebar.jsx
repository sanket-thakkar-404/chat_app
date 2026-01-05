import { MessageSquare, UsersRound, Plus, Star, Settings, PackagePlus, BellDot } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const iconClasses = "size-6";

  const linkClasses = ({ isActive }) =>
    `
      w-15 h-12 rounded-xl flex items-center justify-center
      transition-all
      ${
        isActive
          ? "bg-primary/20 text-primary"
          : "text-base-content/60 hover:text-white hover:bg-white/10"
      }
    `;

  return (
    <aside className="h-full bg-base-300/30 border-r border-base-300
      flex flex-col items-center justify-between py-4">

      {/* top icons */}
      <div className="flex flex-col gap-6">

        <NavLink to="/home/chat" className={linkClasses}>
          <MessageSquare className={iconClasses} />
        </NavLink>

        <NavLink to="/home/add-friend" className={linkClasses}>
          <Plus className={iconClasses} />
        </NavLink>
         <NavLink to="/home/notification" className={linkClasses}>
          <BellDot  className={iconClasses} />
        </NavLink>

        <NavLink to="/home/starred" className={linkClasses}>
          <Star className={iconClasses} />
        </NavLink>

      </div>

    </aside>
  );
};

export default Sidebar;