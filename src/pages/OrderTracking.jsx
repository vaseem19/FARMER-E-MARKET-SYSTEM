import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const statusSteps = ["Pending", "Accepted", "Shipped", "Delivered"];

function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    try {
      // ✅ FIXED API ROUTE HERE
      const res = await axios.get(
        `http://localhost:5000/api/orders/buyer/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrder(res.data);
    } catch (err) {
      console.error("TRACK ERROR:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-300">
        Loading tracking...
      </div>
    );

  if (!order)
    return (
      <div className="text-center mt-20 text-red-400">
        Order not found
      </div>
    );

  const isCancelled = order.status === "Cancelled";
  const currentIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen p-6 text-white">

      {/* HEADER */}
      <div className="glass p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold">
          📦 Order #{order.order_id}
        </h1>
        <p className="text-gray-300 mt-2">
          Track your order progress in real-time
        </p>
      </div>

      {/* STATUS */}
      <div className="glass p-6 rounded-2xl mb-8">

        <h2 className="text-lg font-semibold mb-6">
          🚚 Delivery Status
        </h2>

        {isCancelled ? (
          <div className="text-red-400 font-bold text-lg">
            ❌ This order was cancelled
          </div>
        ) : (
          <div className="relative">

            <div className="absolute top-5 left-0 w-full h-1 bg-white/20"></div>

            <div
              className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-500"
              style={{
                width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            ></div>

            <div className="flex justify-between relative">

              {statusSteps.map((step, idx) => (
                <div key={step} className="flex flex-col items-center">

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                    ${
                      idx <= currentIndex
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <span className="text-sm mt-2">{step}</span>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>

      {/* ITEMS */}
      <div className="glass p-5 rounded-2xl">
        <h2 className="font-semibold mb-4">🛒 Items</h2>

        {order.items?.map((item) => (
          <div key={item.crop_id} className="flex justify-between border-b py-2">
            <div>
              <p className="text-green-300">{item.crop_name}</p>
              <p className="text-sm text-gray-300">
                {item.quantity} × ₹{item.price}
              </p>
            </div>

            <p>₹{item.quantity * item.price}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default OrderTracking;