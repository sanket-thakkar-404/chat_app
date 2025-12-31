// components/LoadingButton.jsx
const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = "Loading",
  className = "",
  type = "submit",
  onclick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      onClick={onclick}
      className={`btn btn-lg btn-primary w-full px-5 py-3 rounded-xl mt-2 ${className}`}
      {...props}
    >
      {isLoading ? (
        <h3>
          {loadingText}
          <span className="loading loading-dots loading-xl"></span>
        </h3>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;