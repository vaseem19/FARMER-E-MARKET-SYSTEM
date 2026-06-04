import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./FarmerConnect.css";

function FarmerConnect() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserId = localStorage.getItem("userId");

  // 🔥 Fetch farmers
  const fetchFarmers = useCallback(async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/farmers/${currentUserId}`
      );

      setFarmers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  const filteredFarmers = (farmers || []).filter((f) =>
    (f.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="connect-container">
      <h2>🤝 Farmer Connect</h2>

      <input
        type="text"
        placeholder="Search farmers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      {loading ? (
        <p>Loading farmers...</p>
      ) : (
        <div className="card-container">

          {/* TEST BUTTON (GUARANTEED WORKING) */}
          <div className="card">
            <h3>Test Farmer</h3>
            <p>test@gmail.com</p>

            <button onClick={() => alert("🚧 Feature Coming Soon")}>
              Connect
            </button>
          </div>

          {/* REAL FARMERS */}
          {filteredFarmers.map((farmer) => (
            <div key={farmer.user_id} className="card">
              <h3>{farmer.name}</h3>
              <p>{farmer.email}</p>

              <button onClick={() => alert("🚧 Feature Coming Soon")}>
                Connect
              </button>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default FarmerConnect;