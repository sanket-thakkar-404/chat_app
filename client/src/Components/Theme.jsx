import { useThemeStore } from "../Store/useThemeStore";
import { THEMES } from "../Constants";

const Theme = () => {

   const { theme, setTheme } = useThemeStore();

  return (
    <div className="grid grid-cols-3 mx-auto sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-2">
      {THEMES.map((elem, index) => {
        return (
          <button
            key={index}
            className={`
                group flex flex-col  items-center gap-1.5 p-2 rounded-lg transition-colors
                ${theme === elem ? "bg-zinc-500" : "hover:bg-zinc-200/50"}
              `}
            onClick={() => setTheme(elem)}
          >
            <div
              className="relative h-12 w-full rounded-md overflow-hidden"
              data-theme={elem}
            >
              <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                <div className="rounded bg-primary"></div>
                <div className="rounded bg-secondary"></div>
                <div className="rounded bg-accent"></div>
                <div className="rounded bg-neutral"></div>
              </div>
            </div>
            <span className="text-[11px] font-medium truncate w-full text-center">
              {elem.charAt(0).toUpperCase() + elem.slice(1)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Theme;
