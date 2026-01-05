import React from "react";

const Heading = ({title , subtitle , className}) => {
  return (
    <div className={`flex flex-col gap-1`}>
      <h2 className={`"text-xl font-semibold" ${className}`}>{title}</h2>
      <p className="text-sm text-base-content/70">
       {subtitle}
      </p>
    </div>
  );
};

export default Heading;
