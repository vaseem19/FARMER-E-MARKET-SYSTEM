import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user?.role) {
      if (user.role === "farmer") navigate("/farmer-dashboard");
      else if (user.role === "buyer") navigate("/buyer-dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanEmail = email.trim();

      if (!cleanEmail || !password) {
        setError("All fields are required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        setError("Invalid email format");
        return;
      }

      const res = await api.post("/auth/login", {
        email: cleanEmail,
        password,
      });

      const { token, user } = res.data;

      if (!token || !user) {
        setError("Invalid server response");
        return;
      }

      // ✅ STORE SESSION (FIXED)
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 IMPORTANT FIX (THIS WAS YOUR BUG)
      localStorage.setItem("userId", user.user_id);

      console.log("LOGIN SUCCESS USER ID:", user.user_id);

      // Redirect
      if (user.role === "farmer") {
        navigate("/farmer-dashboard");
      } else if (user.role === "buyer") {
        navigate("/buyer-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
        className="absolute w-full h-full object-cover"
      />

      <div className="absolute w-full h-full bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white/10 p-8 rounded-2xl w-full max-w-md text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          🌱 Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          {loading && <p className="text-blue-300">Logging in...</p>}
          {error && <p className="text-red-400">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20"
          />

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-gray-200">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 py-3 rounded-lg"
          >
            {loading ? "Please wait..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;