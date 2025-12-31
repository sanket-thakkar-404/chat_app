import { Navigate, NavLink, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col md:grid md:grid-cols-2 text-black">
      {/* Left Image (Full screen on mobile) */}
      <div
        className="
          relative
          bg-[url('https://i.pinimg.com/736x/f4/ef/38/f4ef387b3e6de02fb7a7acc055193ebc.jpg')]
          bg-cover bg-center
          h-screen md:h-full
        "
      >
        <h1 className="text-3xl font-bold p-4 text-black">TALKS</h1>

        {/* Bottom Panel — overlay only on mobile */}
        <div
          className="
          absolute bottom-0 left-0 right-0
          rounded-t-3xl
          px-8 py-8
          bg-[#1d232a]
          text-white
          shadow-lg
          md:hidden
        "
        >
          <h2 className="text-2xl font-bold mb-6">Get Started With TALKS</h2>

          <button
            onClick={() => navigate("/home")}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center text-lg hover:text-black hover:bg-white active:scale-95"
          >
            Say Hey!
          </button>
        </div>
      </div>

      {/* Right Panel — only for desktop */}
      <div className="hidden md:flex flex-col justify-center px-24 gap-15 text-white">
        {/* Big Bold Heading */}
        <h1 className="text-8xl font-extrabold tracking-tight">Say hello!</h1>

        {/* Soft Sub-text */}
        <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
          Talk freely, share moments, and stay connected with people who matter
          — start your next conversation today.
        </p>

        {/* Minimal Outlined Button */}
        <button
          onClick={() => navigate("/home")}
          className="inline-flex items-center justify-center px-8 py-3 border border-black rounded-full text-xl font-medium hover:text-black hover:bg-white transition "
        >
          Say hey!
        </button>
      </div>
    </div>
  );
}
