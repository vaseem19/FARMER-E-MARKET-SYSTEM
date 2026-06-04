import { useState, useEffect } from "react";
import axios from "axios";

function MyCrops() {
  const [crops, setCrops] = useState([]);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/crops/my-crops", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const uniqueCrops = mergeDuplicates(res.data);
        setCrops(uniqueCrops);
      } catch (err) {
        console.error("Error fetching crops:", err);
      }
    };

    fetchCrops();
  }, []);

  const mergeDuplicates = (cropsArray) => {
    const map = {};
    cropsArray.forEach((crop) => {
      const key = crop.crop_name.toLowerCase();
      if (map[key]) {
        map[key].quantity += crop.quantity;
        map[key].price = crop.price;
        map[key].soil_type = crop.soil_type;
      } else {
        map[key] = { ...crop };
      }
    });

    return Object.values(map);
  };

  return (
    <div className="min-h-screen p-6 text-white">

      {/* HEADER */}
      <div className="glass p-6 text-center mb-8">
        <h2 className="text-3xl font-bold">🌾 My Crops</h2>
        <p className="text-gray-300 mt-2">
          Manage and view your uploaded crops
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto space-y-4">

        {crops.length === 0 ? (
          <div className="glass p-6 text-center">
            <p className="text-gray-300">No crops found. Add some crops 🌱</p>
          </div>
        ) : (
          crops.map((crop, index) => (
            <div
              key={index}
              className="glass p-5 rounded-2xl flex justify-between items-center hover:scale-[1.02] transition"
            >
              <div>
                <h3 className="text-xl font-semibold text-green-300">
                  🌱 {crop.crop_name}
                </h3>

                <p className="text-gray-200">Qty: {crop.quantity} kg</p>
                <p className="text-gray-200">Price: ₹{crop.price}</p>

                {crop.soil_type && (
                  <p className="text-gray-300 text-sm">
                    Soil: {crop.soil_type}
                  </p>
                )}
              </div>

              {/* optional badge */}
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                  Active
                </span>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default MyCrops;