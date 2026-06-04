import { useEffect, useState } from "react";
import api from "../services/api";

function BuyerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/buyer"); // ✅ FIXED
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-5">
      <h2>🧾 My Orders</h2>

      {orders.map((order) => (
        <div key={order.order_id} className="border p-3 m-2">
          <p>Order ID: {order.order_id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total_amount}</p>
          <p>{new Date(order.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default BuyerOrders;