import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/buyer");
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = async (id) => {
    try {
      await api.put(`/orders/buyer/${id}/cancel`);

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === id ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="min-h-screen p-6 text-white">

      <h2 className="text-2xl font-bold mb-4">
        🧾 My Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="border p-4 mb-4 rounded">

            <p>📦 Order #{order.order_id}</p>
            <p>💰 ₹{order.total_amount}</p>
            <p>📌 Status: {order.status}</p>

            {/* ITEMS */}
            <div className="mt-2">
              <p>🌾 Items:</p>
              {order.items?.map((item, i) => (
                <p key={i}>
                  • {item.crop_name} — {item.quantity} kg
                </p>
              ))}
            </div>

            {/* ACTION */}
            <div className="mt-3 flex gap-2">

              <button
                onClick={() => navigate(`/track/${order.order_id}`)}
                className="bg-blue-600 px-3 py-1 rounded"
              >
                Track
              </button>

              {order.status === "Pending" && (
                <button
                  onClick={() => cancelOrder(order.order_id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default MyOrders;