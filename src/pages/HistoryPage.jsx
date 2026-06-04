import { useEffect, useState } from "react";
import axios from "axios";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://127.0.0.1:8000/history");

      console.log("FULL RESPONSE:", res.data);

      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Error fetching history", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-white">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          📊 Prediction History
        </h2>
        <p className="text-gray-300 mt-2">
          View all your past AI predictions
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <div className="glass max-w-6xl mx-auto p-6 rounded-2xl overflow-x-auto">

        {loading ? (
          <p className="text-center text-gray-300">
            Loading history...
          </p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-300">
            No Data Found 🚫
          </p>
        ) : (
          <table className="w-full text-left">

            {/* HEADER */}
            <thead className="border-b border-white/20">
              <tr className="text-gray-300">
                <th className="p-3">Crop</th>
                <th className="p-3">Location</th>
                <th className="p-3">Quantity (kg)</th>
                <th className="p-3">Predicted Price (₹)</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="p-3 font-semibold">
                    {item.crop}
                  </td>

                  <td className="p-3 text-gray-200">
                    {item.location}
                  </td>

                  <td className="p-3">
                    {item.quantity}
                  </td>

                  <td className="p-3 text-green-300 font-semibold">
                    ₹{item.predicted_price}
                  </td>

                  <td className="p-3 text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}

export default HistoryPage;