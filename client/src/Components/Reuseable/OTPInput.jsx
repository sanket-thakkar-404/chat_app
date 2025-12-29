import { useEffect, useRef, useState } from "react";

function OTPInput({ length, setUserOTP, setStatus, status }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    const newOtp = [...otp];

    (newOtp[index] = value.substring(value.length - 1)), setOtp(newOtp);

    if (value && inputRef.current[index + 1]) {
      inputRef.current[index + 1].focus();
    }

    const combinedOtp = newOtp.join("");

    setUserOTP(combinedOtp);
  };
  const handleKeydown = (e, index) => {
    // allow editing only when NOT checking
    if (status === "checking") return;
    if (e.code === "Backspace") {
      setStatus("idle");

      // only reset status if previously wrong
      if (status === "wrong") setStatus("idle");

      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0 && inputRef.current[index - 1]) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  useEffect(() => {
    inputRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (status === "wrong") {
      setOtp(Array(length).fill(""));
      setUserOTP("");

      setTimeout(() => {
        inputRef.current[0]?.focus();
        setStatus("idle");
      }, 400);
    }
  }, [status, length, setUserOTP, setStatus]);

  return (
    <div>
      {otp.map((value, index) => {
        return (
          <input
            type="text"
            ref={(input) => (inputRef.current[index] = input)}
            key={index}
            value={value}
            disabled={status == "checking"}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeydown(e, index)}
            className={`lg:w-20 lg:h-20 w-18 h-18 mt-3 border lg:mr-6 mr-2 rounded-xl md:mr-5 lg:text-4xl text-3xl text-center font-bold outline-none 

                  ${
                    status === "valid"
                      ? "border-green-300"
                      : status === "wrong"
                      ? "border-red-500"
                      : status === "checking"
                      ? "border-yellow-400 animate-pulse"
                      : value
                      ? "border-blue-500"
                      : "border-gray-500"
                  }
                `}
          />
        );
      })}
    </div>
  );
}

export default OTPInput;
