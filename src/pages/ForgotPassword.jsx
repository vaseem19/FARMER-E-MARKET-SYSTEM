import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      alert("Please enter your email ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );

      alert(res.data.message || "OTP sent successfully ✅");

      // Navigate to reset page with email
      navigate("/reset-password", { state: { email } });

    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
    <div className="card p-5 shadow" style={{ width: "500px", borderRadius: "15px" }}>
      
      <h2 className="text-center mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="form-control form-control-lg mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSendOTP}
        className="btn btn-primary btn-lg w-100"
        disabled={loading}
      >
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>

    </div>
  </div>
);
}

export default ForgotPassword;