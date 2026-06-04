import { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function YieldPrediction() {
  const [formData, setFormData] = useState({
    crop: "",
    rainfall: "",
    temperature: "",
    soilType: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.crop ||
      !formData.rainfall ||
      !formData.temperature ||
      !formData.soilType
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/yield/predict",
        {
          crop: formData.crop,
          rainfall: formData.rainfall,
          temperature: formData.temperature,
          soilType: formData.soilType,
        }
      );

      setResult(res.data);
    } catch (err) {
      setError("Failed to predict yield");
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? [
        {
          name: result.crop,
          yield: parseFloat(result.estimatedYield),
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
        🌾 Crop Yield Prediction
      </h1>

      {/* Form */}
      <form
        onSubmit={handlePredict}
        className="max-w-2xl mx-auto grid gap-5 bg-gray-100 p-8 rounded-2xl shadow-lg"
      >
        {/* Rainfall */}
        <input
          type="number"
          name="rainfall"
          placeholder="Rainfall (mm)"
          value={formData.rainfall}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Temperature */}
        <input
          type="number"
          name="temperature"
          placeholder="Temperature (°C)"
          value={formData.temperature}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Soil Type */}
        <select
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Soil Type</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
          <option value="loamy">Loamy</option>
          <option value="black">Black</option>
        </select>

        {/* Crop */}
        <select
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Crop</option>
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Maize">Maize</option>
          <option value="Cotton">Cotton</option>
          <option value="Groundnut">Groundnut</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          className="bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Predict Yield"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-600 text-center mt-5 font-medium">
          {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div className="max-w-2xl mx-auto mt-10 bg-gray-100 p-8 rounded-2xl shadow-lg text-center">
          
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            📦 Expected Yield: {result.estimatedYield}
          </h2>

          <p className="mb-2 text-lg">
            🌾 <strong>Crop:</strong> {result.crop}
          </p>

          <p className="mb-4 text-lg">
            📊 <strong>Confidence:</strong> {result.confidence}
          </p>

          {/* Chart */}
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="#16a34a" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default YieldPrediction;