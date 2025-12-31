import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import FormInput from "../Components/Reuseable/FormInput";
import Logo from "../Components/Reuseable/Logo";
import LoadingButton from "../Components/Reuseable/LoadingButton";
import AuthSwitchLink from "../Components/Reuseable/AuthSwitchLink";
import AuthHeader from "../Components/Reuseable/AuthHeader";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    const { email, password } = formData;

    const rules = [
      [!email.trim(), "Email is required"],
      [!/\S+@\S+\.\S+/.test(email), "Invalid email format"],

      [!password, "Password is required"],
      [password.length < 6, "Password must be at least 6 characters"],
    ];

    for (const [condition, message] of rules) {
      if (condition) return toast.error(message);
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validateForm();
    if (!ok) return;

    const res = await login(formData);

    if (!res?.success) return; // ⛔ stop if login failed
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 ">
      {/* left side */}
      <div className="flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-2xl space-y-2">
          {/* LOGO */}
          <Logo />
          <AuthHeader
            title="Hey, you’re back!"
            subtitle="Log in to pick up where you left off"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              icon={<Mail className="size-4.5" />}
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => {
                  return {
                    ...prev,
                    email: e.target.value,
                  };
                });
              }}
            />
            <div className="relative">
              <FormInput
                label="Password"
                icon={<Lock className="size-4.5" />}
                type={showPassword ? "text" : "password"}
                placeholder="************"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      password: e.target.value,
                    };
                  });
                }}
              />

              <EyeOff
                className={`size-5 absolute top-13 right-5 -translate-y-1/2 cursor-pointer transition-all 
              ${showPassword ? "hidden" : "block"}`}
                onClick={() => setShowPassword(true)}
              />
              <Eye
                className={`size-5 absolute top-13 right-5 -translate-y-1/2 cursor-pointer transition-all
              ${showPassword ? "block" : "hidden"}`}
                onClick={() => setShowPassword(false)}
              />
            </div>

            <Link to='/forget-password' className="flex justify-end w-full link link-primary">
              ForgetPassword ?
            </Link>
            <LoadingButton
              isLoading={isLoggingIn}
              loadingText="loading"
              children="Login"
            />
          </form>

          <AuthSwitchLink
            message="Don't have an account?"
            to="/signup"
            linkText="Create account"
          />
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join Our Community"
        subtitle="Connect With Friends , Share Moments , and stay in touch your loved ones."
      />
    </div>
  );
};

export default LoginPage;
