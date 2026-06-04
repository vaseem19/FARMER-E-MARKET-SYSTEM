import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function FarmerDashboard() {
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadMyCrops();
    loadOrders();
  }, []);

  // ================= CROPS =================
  const loadMyCrops = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/crops/my-crops",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCrops(res.data || []);
    } catch (err) {
      console.error("Crops Error:", err);
    }
  };

  // ================= ORDERS =================
  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/orders/farmer",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data || []);
    } catch (err) {
      console.error("Orders Error:", err);
    }
  };

  // ================= REVENUE =================
  const totalRevenue = orders.reduce(
    (sum, o) => sum + Number(o.total_amount || 0),
    0
  );

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="glass w-full max-w-6xl p-6 md:p-10">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">
            👋 Welcome, {user?.name || "Farmer"}
          </h2>
          <p className="text-gray-300">
            Manage your farm smartly 🚜
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className="section text-center">
            <h2 className="text-2xl font-bold">
              {crops.length}
            </h2>
            <p className="text-gray-300">Total Crops</p>
          </div>

          <div className="section text-center">
            <h2 className="text-2xl font-bold">
              {orders.length}
            </h2>
            <p className="text-gray-300">Orders</p>
          </div>

          <div className="section text-center">
            <h2 className="text-2xl font-bold text-green-400">
              ₹ {totalRevenue}
            </h2>
            <p className="text-gray-300">Revenue</p>
          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <button
            onClick={() => navigate("/add-crop")}
            className="btn btn-green"
          >
            ➕ Add Crop
          </button>

          <button
            onClick={() => navigate("/history")}
            className="btn btn-yellow"
          >
            📜 View History
          </button>

          {/* ✅ FIXED ORDERS BUTTON */}
          <button
            onClick={() => navigate("/farmer-orders")}
            className="btn btn-blue"
          >
            📦 Manage Orders
          </button>

        </div>

        {/* AI TOOLS */}
        <h2 className="text-xl font-semibold mb-3">
          🤖 Smart AI Tools
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">

          {[
            {
              title: "🌱 Crop Recommendation",
              desc: "Get best crop suggestions",
              path: "/crop-recommendation",
            },
            {
              title: "📊 Yield Prediction",
              desc: "Estimate crop production",
              path: "/yield-prediction",
            },
            {
              title: "🌿 Disease Detection",
              desc: "Detect crop diseases",
              path: "/disease-detection",
            },
            {
              title: "🧪 Fertilizer Recommendation",
              desc: "Get best fertilizers",
              path: "/fertilizer",
            },
            {
              title: "🌦 Weather Info",
              desc: "Check live weather",
              path: "/weather",
            },
            {
              title: "🤝 Farmer Connect",
              desc: "Connect with farmers",
              path: "/farmer-connect",
            },
          ].map((tool, i) => (
            <div
              key={i}
              onClick={() => navigate(tool.path)}
              className="section cursor-pointer hover:scale-105"
            >
              <h3 className="font-semibold">{tool.title}</h3>
              <p className="text-sm text-gray-300">
                {tool.desc}
              </p>
            </div>
          ))}

        </div>

        {/* CROPS */}
        <h2 className="text-xl font-semibold mb-4">
          🌾 Your Crops
        </h2>

        {crops.length === 0 ? (
          <p className="text-gray-300">
            No crops added yet
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">

            {crops.map((crop) => (
              <div key={crop.crop_id} className="section">
                <h3 className="text-lg font-semibold text-green-400">
                  {crop.crop_name}
                </h3>

                <p>📦 {crop.quantity} kg</p>
                <p>💰 ₹{crop.price}</p>
                <p>📍 {crop.location}</p>
                <p>🌱 {crop.soil_type || "N/A"}</p>

              </div>
            ))}

          </div>
        )}

      </div>
    </motion.div>
  );
}

export default FarmerDashboard;