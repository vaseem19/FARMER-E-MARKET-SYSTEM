import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddCrop() {
  const [formData, setFormData] = useState({
    crop_name: "",
    quantity: "",
    price: "",
    location: "",
    soil_type: ""
  });

  const [crops, setCrops] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadMyCrops = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/crops/my-crops",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCrops(res.data);
      } catch (err) {
        console.error("Error loading crops:", err);
      }
    };

    loadMyCrops();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { crop_name, quantity, price, location, soil_type } = formData;

    if (!crop_name || !quantity || !price || !location || !soil_type) {
      alert("Please fill all fields");
      return;
    }

    const duplicate = crops.find(
      (c) => c.crop_name.toLowerCase() === crop_name.toLowerCase()
    );

    if (duplicate) {
      alert(`${crop_name} already exists!`);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/crops/add",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`${crop_name} added successfully ✅`);

      setCrops([...crops, res.data]);

      setFormData({
        crop_name: "",
        quantity: "",
        price: "",
        location: "",
        soil_type: ""
      });

      setTimeout(() => {
        navigate("/farmer-dashboard");
      }, 800);

    } catch (err) {
      alert("Error adding crop ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="glass w-full max-w-lg p-8">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">🌾 Add New Crop</h1>
          <p className="text-gray-300 text-sm">
            List your crop for buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Crop Name */}
          <div>
            <label className="text-sm text-gray-300">Crop Name</label>
            <input
              type="text"
              name="crop_name"
              value={formData.crop_name}
              onChange={handleChange}
              placeholder="Enter crop name"
            />
          </div>

          {/* Quantity + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="kg"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="₹"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm text-gray-300">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
            >
              <option value="">Select Location</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="text-sm text-gray-300">Soil Type</label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleChange}
            >
              <option value="">Select Soil</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
            </select>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="btn btn-green w-full"
          >
            ➕ Add Crop
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddCrop;