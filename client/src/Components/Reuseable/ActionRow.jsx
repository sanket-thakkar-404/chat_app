
const ActionRow = ({title , subtitle , onClick , btnText}) => {
  return (
    <div className="flex items-center  justify-between px-5 py-5">
      <div>
        <p className="text-sm font-medium text-zinc-200">
         {title}
        </p>
        <p className="text-sm text-zinc-400 mt-1">
          {subtitle}
        </p>
      </div>

      <button
        onClick={onClick}
        className="p-3  text-sm  rounded-md border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:font-bold"
      >
        {btnText}
      </button>
    </div>
  );
};

export default ActionRow;
