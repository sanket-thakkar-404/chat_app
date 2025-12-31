// components/AuthSwitchLink.jsx
import { Link } from "react-router-dom";

const AuthSwitchLink = ({
  message,
  linkText,
  to,
  className = "",
  classLInk,
}) => {
  return (
    <div className={`text-center mt-9 ${className}`}>
      <p className="text-base-content/60">
        {message}{" "}
        <Link to={to} className={`link link-primary ${classLInk}`}>
           {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthSwitchLink;