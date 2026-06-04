import { useState } from "react";
import axios from "axios";

function DiseaseDetection() {
  const [mode, setMode] = useState("risk");

  const [form, setForm] = useState({
    crop: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    pesticideDays: "",
  });

  const [riskResult, setRiskResult] = useState(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  // =================
  // INPUT CHANGE
  // =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =================
  // RISK API (SAFE)
  // =================
  const handleRisk = async (e) => {
    e.preventDefault();

    if (
      !form.crop ||
      !form.rainfall ||
      !form.temperature ||
      !form.humidity ||
      !form.pesticideDays
    ) {
      alert("⚠️ Please fill all fields before predicting risk");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/disease/risk",
        form
      );

      setRiskResult(res.data);
    } catch (err) {
      console.log(err);
      alert("❌ Error predicting risk");
    }
  };

  // =================
  // IMAGE API (FULL FIXED)
  // =================
  const handleImage = async () => {
    if (!file) {
      alert("⚠️ Please select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "http://localhost:5000/api/disease/image",
        formData
      );

      setImageResult(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert(err.response?.data?.error || "❌ Error detecting disease");
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h1>🌿 Disease Detection System</h1>

      {/* MODE */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setMode("risk")}>Risk Prediction</button>
        <button onClick={() => setMode("image")}>Image Detection</button>
      </div>

      {/* ================= RISK ================= */}
      {mode === "risk" && (
        <form onSubmit={handleRisk}>
          <input name="crop" placeholder="Crop" onChange={handleChange} />
          <input name="rainfall" placeholder="Rainfall" onChange={handleChange} />
          <input name="temperature" placeholder="Temperature" onChange={handleChange} />
          <input name="humidity" placeholder="Humidity" onChange={handleChange} />
          <input name="pesticideDays" placeholder="Pesticide Days" onChange={handleChange} />

          <button type="submit">Predict Risk</button>
        </form>
      )}

      {/* ================= IMAGE ================= */}
      {mode === "image" && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected = e.target.files[0];

              if (!selected) return;

              setFile(selected);
              setPreview(URL.createObjectURL(selected));
            }}
          />

          {preview && (
            <div>
              <img src={preview} width="200" alt="preview" />
            </div>
          )}

          <button onClick={handleImage}>
            Detect Disease
          </button>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {riskResult && (
        <div>
          <h3>Risk: {riskResult.riskLevel}</h3>
          <p>Diseases: {riskResult.diseases?.join(", ")}</p>
          <p>Tips: {riskResult.tips}</p>
        </div>
      )}

      {imageResult && (
        <div>
          <h3>Crop: {imageResult.crop}</h3>
          <h3>Disease: {imageResult.disease}</h3>
          <p>Confidence: {imageResult.confidence}%</p>
          <p>Cure: {imageResult.cure}</p>

          <a href={imageResult.video} target="_blank" rel="noreferrer">
            ▶ Watch Treatment Video
          </a>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;