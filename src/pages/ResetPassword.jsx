import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  const isStrongPassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(password);
  };

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!email) return alert("Enter email first ❌");

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/send-otp", {
        email,
      });

      alert("OTP sent successfully 📩");

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      return alert(
        "Password must contain:\n- 1 uppercase\n- 1 lowercase\n- 1 number\n- min 6 characters"
      );
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, otp, password }
      );

      alert(res.data.message || "Password reset successful ✅");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return alert("Enter email first ❌");

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });

      alert("OTP resent successfully 📩");

      setTimer(60);
      setCanResend(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="glass w-full max-w-md p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">🔑 Reset Password</h2>
          <p className="text-gray-300 text-sm">
            Enter email → OTP → new password
          </p>
        </div>

        {/* EMAIL SECTION */}
        <label className="text-sm text-gray-300">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOTP}
          className="btn btn-green w-full mt-2"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* OTP SECTION */}
        <div className="mt-5">
          <label className="text-sm text-gray-300">OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* PASSWORD SECTION */}
        <div className="mt-2">
          <label className="text-sm text-gray-300">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          className="btn btn-yellow w-full mt-4"
          disabled={loading}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>

        {/* RESEND OTP */}
        <div className="text-center mt-4">
          {canResend ? (
            <button onClick={handleResendOTP} className="text-blue-400">
              🔁 Resend OTP
            </button>
          ) : (
            <p className="text-gray-400 text-sm">
              Resend OTP in {timer}s
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;