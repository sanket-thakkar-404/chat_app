// components/AuthHeader.jsx
import { MessageSquare } from "lucide-react";

const AuthHeader = ({ title, subtitle, className }) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <div className="flex flex-col items-center gap-2 group">
        <div
          className="size-13 rounded-xl bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
        >
          <MessageSquare className="size-7 text-primary" />
        </div>

        <h1 className="text-2xl font-bold mt-2">{title}</h1>

        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthHeader;
