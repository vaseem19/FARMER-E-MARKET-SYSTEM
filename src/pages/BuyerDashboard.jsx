import axios from "axios";
import { useEffect, useState } from "react";
import CropCard from "../components/CropCard";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function BuyerDashboard() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, []);

  // ================= FETCH CROPS =================
  const fetchCrops = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/crops");

      const fixedCrops = (res.data || []).map((crop) => ({
        ...crop,
        crop_id: crop.crop_id || crop.id,
      }));

      setCrops(fixedCrops);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD TO CART =================
  const addToCart = (crop) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.crop_id === crop.crop_id);

      if (exists) {
        return prev.map((c) =>
          c.crop_id === crop.crop_id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [
        ...prev,
        {
          crop_id: crop.crop_id,
          name: crop.crop_name,
          price: crop.price,
          quantity: 1,
        },
      ];
    });
  };

  // ================= BUY SINGLE ITEM =================
  const handleBuy = async (crop) => {
    try {
      await api.post("/orders", {
        items: [
          {
            crop_id: crop.crop_id,
            quantity: 1,
            price: Number(crop.price),
          },
        ],
      });

      alert("✅ Order placed successfully");
      fetchCrops();
    } catch (err) {
      console.error(err);
      alert("❌ Order failed");
    }
  };

  // ================= CHECKOUT CART =================
  const handleCheckout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.user_id) return alert("⚠️ Login required");
      if (cart.length === 0) return alert("⚠️ Cart empty");

      await api.post("/orders", {
        items: cart,
      });

      alert("✅ Checkout successful");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("❌ Checkout failed");
    }
  };

  return (
    <div className="min-h-screen p-6 text-white">

      {/* HEADER */}
      <div className="glass p-5 mb-6 text-center">
        <h1 className="text-2xl font-bold">🛒 Buyer Dashboard</h1>

        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => navigate("/my-orders")}
            className="bg-green-600 px-4 py-2 rounded"
          >
            My Orders
          </button>

          <button
            onClick={handleCheckout}
            className="bg-yellow-600 px-4 py-2 rounded"
          >
            Checkout ({cart.length})
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading crops...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">

          {crops.map((crop) => (
            <div key={crop.crop_id} className="border p-3 rounded">

              <CropCard
                crop={crop}
                onAddToCart={addToCart}
                onBuy={handleBuy}
              />

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default BuyerDashboard;