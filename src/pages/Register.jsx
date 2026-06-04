import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Password strength validation
  const isStrongPassword = (password) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(password);

  // ✅ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cleanName = name.trim();
      const cleanEmail = email.trim();

      // ✅ Empty validation
      if (!cleanName || !cleanEmail || !password) {
        setError("All fields are required");
        return;
      }

      // ✅ Email validation
      if (!emailRegex.test(cleanEmail)) {
        setError("Invalid email format");
        return;
      }

      // ✅ Password validation
      if (!isStrongPassword(password)) {
        setError(
          "Password must contain uppercase, lowercase, number and be at least 6 characters"
        );
        return;
      }

      // ✅ API call
      await api.post("/auth/register", {
        name: cleanName,
        email: cleanEmail,
        password,
        role,
      });

      // ✅ Success UX
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <img
        src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
        alt="farm background"
        className="absolute w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/60 backdrop-blur-sm"></div>

      {/* Register Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          🌱 Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Password hint */}
          {password.length > 0 && (
            <small
              className={
                isStrongPassword(password)
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {isStrongPassword(password)
                ? "Strong password ✅"
                : "Use uppercase, lowercase, number (min 6 chars)"}
            </small>
          )}

          {/* Role */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="farmer" className="text-black">Farmer</option>
            <option value="buyer" className="text-black">Buyer</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 py-3 rounded-lg hover:bg-green-600 transition duration-300 font-semibold disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-sm text-center mt-4 text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;