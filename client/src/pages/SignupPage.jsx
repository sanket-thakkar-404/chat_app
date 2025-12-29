import { useState } from "react";
import { useAuthStore } from "../store/UseAuthStore";
import { Eye, EyeOff, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../Components/Reuseable/FormInput";
import AuthImagePattern from "../Components/Reuseable/AuthImagePattern";
import toast from "react-hot-toast";
import Logo from "../Components/Reuseable/Logo";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: {
      firstName: "",
      lastName: "",
    },
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const { fullname, email, password, confirmPassword } = formData;
    const { firstName, lastName } = fullname;

    const rules = [
      [!firstName, "First Name is required"],
      [firstName.length < 3, "First must be at least 3 characters"],

      [!lastName, "Last Name is required"],
      [lastName.length < 3, "Last must be at least 3 characters"],

      [!email.trim(), "Email is required"],
      [!/\S+@\S+\.\S+/.test(email), "Invalid email format"],

      [!password, "Password is required"],
      [password.length < 6, "Password must be at least 6 characters"],
    ];

    for (const [condition, message] of rules) {
      if (condition) return toast.error(message);
    }

    if (confirmPassword !== password) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = validateForm();
    if (!ok) return;

    const payload = {
      fullname: {
        firstName: formData.fullname.firstName,
        lastName: formData.fullname.lastName,
      },
      email: formData.email,
      password: formData.password,
    };

    const res = await signup(payload);

    if (!res?.success) return; // ⛔ stop if signup failed
    // console.log(res.data.email);
    sessionStorage.setItem("pendingEmail", res.data.email);

    navigate("/verify-email");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 ">
      {/* left side */}
      <div className="flex justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-2xl space-y-2">
          {/* LOGO */}
          <Logo />
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-13 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                value={formData.fullname.firstName}
                onChange={(e) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      fullname: {
                        ...prev.fullname,
                        firstName: e.target.value,
                      },
                    };
                  });
                }}
                icon={<User className="size-4.5" />}
                placeholder="First Name"
              />
              <FormInput
                label="Last Name"
                icon={<User className="size-4.5" />}
                placeholder="Last Name"
                value={formData.fullname.lastName}
                onChange={(e) => {
                  setFormData((prev) => {
                    return {
                      ...prev,
                      fullname: {
                        ...prev.fullname,
                        lastName: e.target.value,
                      },
                    };
                  });
                }}
              />
            </div>
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
            <div className="grid grid-cols-2 gap-2">
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
              <div className="relative">
                <FormInput
                  label="Confirm Password"
                  icon={<Lock className="size-4.5" />}
                  type="text"
                  placeholder="************"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        confirmPassword: e.target.value,
                      };
                    });
                  }}
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-lg  btn-primary w-full px-5 py-3 rounded-xl mt-2"
            >
              {isSigningUp ? (
                <h3>
                  Loading
                  <span className="loading loading-dots loading-xl"></span>
                </h3>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-9">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
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
export default SignUpPage;
