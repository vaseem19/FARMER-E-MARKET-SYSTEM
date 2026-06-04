import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalOrders: 0,
  });

  const token = localStorage.getItem("token");

  // ================= FETCH ALL DATA =================
  const fetchData = async () => {
    try {
      const usersRes = await axios.get("http://localhost:5000/api/admin/users");
      const cropsRes = await axios.get("http://localhost:5000/api/admin/crops");
      const ordersRes = await axios.get("http://localhost:5000/api/admin/orders");
      const analyticsRes = await axios.get("http://localhost:5000/api/admin/analytics");

      setUsers(usersRes.data);
      setCrops(cropsRes.data);
      setOrders(ordersRes.data);
      setAnalytics(analyticsRes.data);

    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/user/${id}`);
    fetchData();
  };

  // ================= DELETE CROP =================
  const deleteCrop = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/crop/${id}`);
    fetchData();
  };

  // ================= UPDATE ORDER STATUS =================
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/farmer/${orderId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      fetchData();

    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen px-6 py-8">

      {/* TITLE */}
      <div className="glass p-6 text-center mb-6">
        <h1 className="text-3xl font-bold">🛠 Admin Dashboard</h1>
        <p className="text-gray-300 text-sm">
          Manage users, crops, and orders
        </p>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="glass p-6 text-center">
          <h2 className="text-gray-300">Total Sales</h2>
          <p className="text-2xl font-bold text-green-400">
            ₹ {analytics.totalSales}
          </p>
        </div>

        <div className="glass p-6 text-center">
          <h2 className="text-gray-300">Total Orders</h2>
          <p className="text-2xl font-bold text-blue-400">
            {analytics.totalOrders}
          </p>
        </div>

      </div>

      {/* ================= USERS ================= */}
      <div className="glass p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">👥 Users</h2>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.user_id}
              className="flex justify-between items-center p-3 bg-white/10 rounded-lg"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>

              <button
                onClick={() => deleteUser(user.user_id)}
                className="btn btn-red"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CROPS ================= */}
      <div className="glass p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">🌾 Crops</h2>

        <div className="space-y-3">
          {crops.map((crop) => (
            <div
              key={crop.crop_id}
              className="flex justify-between items-center p-3 bg-white/10 rounded-lg"
            >
              <div>
                <p className="font-semibold">{crop.crop_name}</p>
                <p className="text-sm text-gray-300">
                  ₹ {crop.price} | Qty: {crop.quantity}
                </p>
              </div>

              <button
                onClick={() => deleteCrop(crop.crop_id)}
                className="btn btn-red"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-4">📦 Orders Management</h2>

        <div className="space-y-3">

          {orders.map((order) => (
            <div
              key={order.order_id}
              className="p-4 bg-white/10 rounded-lg"
            >

              {/* HEADER */}
              <div className="flex justify-between">
                <p className="font-semibold">
                  Order #{order.order_id}
                </p>

                <span
                  className={`px-2 py-1 rounded text-xs ${
                    order.status === "Pending"
                      ? "bg-yellow-500"
                      : order.status === "Accepted"
                      ? "bg-blue-500"
                      : order.status === "Shipped"
                      ? "bg-indigo-500"
                      : order.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* INFO */}
              <p className="text-sm text-gray-300">
                Buyer: {order.buyer_name}
              </p>

              <p className="text-sm text-gray-300">
                ₹ {order.total_amount}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(order.created_at).toLocaleString()}
              </p>

              {/* STATUS BUTTONS */}
              <div className="flex gap-2 mt-3 flex-wrap">

                <button
                  onClick={() => updateStatus(order.order_id, "Pending")}
                  className="px-2 py-1 bg-yellow-400 rounded text-xs"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(order.order_id, "Accepted")}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                >
                  Accepted
                </button>

                <button
                  onClick={() => updateStatus(order.order_id, "Shipped")}
                  className="px-2 py-1 bg-indigo-500 text-white rounded text-xs"
                >
                  Shipped
                </button>

                <button
                  onClick={() => updateStatus(order.order_id, "Delivered")}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                >
                  Delivered
                </button>

                <button
                  onClick={() => updateStatus(order.order_id, "Cancelled")}
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Cancel
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;