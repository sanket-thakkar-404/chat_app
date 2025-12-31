import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import { useAuthStore } from "./Store/UseAuthStore";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import { Toaster } from 'react-hot-toast';
import VerifyOtp from "./pages/VerifyOtp";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";



const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="skeleton skeleton-text text-2xl md:text-3xl">
          Checking authentication...
        </span>
      </div>
    );
  }

  return (
    <div data-theme="dark">
      {!hideNavbar && <Navbar />}

      <Routes>
     
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/home" />}
        />
        <Route
          path="/verify-email"
          element={!authUser ? <VerifyOtp /> : <Navigate to="/home" />}
        />
       
        <Route
          path="/forget-password"
          element={!authUser ? <ForgetPassword /> : <Navigate to="/home" />}
        />
        <Route
          path="/reset-password"
          element={!authUser ? <ResetPassword /> : <Navigate to="/home" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/home" />}
        />
        <Route path="/settings" element={<SettingPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

    <Toaster/>
      
    </div>
  );
};

export default App;
