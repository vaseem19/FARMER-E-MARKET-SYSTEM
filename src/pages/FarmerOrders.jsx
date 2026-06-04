import { useEffect, useState } from "react";
import api from "../services/api";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/farmer");
      setOrders(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/farmer/${id}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen p-6 text-white">

      <h2 className="text-2xl font-bold mb-6">
        📦 Farmer Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="border p-4 mb-4 rounded-lg">

            <p>📦 Order #{order.order_id}</p>
            <p>👤 Buyer: {order.buyer_name}</p>
            <p>💰 ₹{order.total_amount}</p>

            {/* STATUS */}
            <p className="font-bold mt-2">
              Status: {order.status}
            </p>

            {/* ITEMS */}
            {order.items?.length > 0 && (
              <div className="mt-2">
                <p>🌾 Items:</p>
                {order.items.map((item, i) => (
                  <p key={i}>
                    • {item.crop_name} — {item.quantity} kg — ₹{item.price}
                  </p>
                ))}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3 flex-wrap">

              {order.status === "Pending" && (
                <>
                  <button
                    onClick={() => updateStatus(order.order_id, "Accepted")}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(order.order_id, "Cancelled")}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}

              {order.status === "Accepted" && (
                <button
                  onClick={() => updateStatus(order.order_id, "Shipped")}
                  className="bg-purple-600 px-3 py-1 rounded"
                >
                  Ship
                </button>
              )}

              {order.status === "Shipped" && (
                <button
                  onClick={() => updateStatus(order.order_id, "Delivered")}
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Deliver
                </button>
              )}

              {order.status === "Delivered" && (
                <span className="text-green-400 font-bold">
                  ✔ Completed
                </span>
              )}

              {order.status === "Cancelled" && (
                <span className="text-red-400 font-bold">
                  ❌ Cancelled
                </span>
              )}

            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default FarmerOrders;