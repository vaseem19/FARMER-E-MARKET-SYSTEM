import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Fertilizer() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    crop: "",
    soil: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { nitrogen, phosphorus, potassium, temperature, humidity, crop, soil } = form;

  // ✅ Basic validation
  if (
    !nitrogen || !phosphorus || !potassium ||
    !temperature || !humidity || !crop || !soil
  ) {
    alert("⚠️ Please fill all fields");
    return;
  }

  // ✅ Numeric validation
  if (
    isNaN(nitrogen) ||
    isNaN(phosphorus) ||
    isNaN(potassium) ||
    isNaN(temperature) ||
    isNaN(humidity)
  ) {
    alert("⚠️ N, P, K, Temperature and Humidity must be numbers");
    return;
  }

  // ✅ Range validation (important for agriculture data)
  if (humidity < 0 || humidity > 100) {
    alert("⚠️ Humidity must be between 0 and 100");
    return;
  }

  if (temperature < -10 || temperature > 60) {
    alert("⚠️ Temperature seems unrealistic");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/fertilizer/recommend",
      {
        ...form,
        nitrogen: Number(nitrogen),
        phosphorus: Number(phosphorus),
        potassium: Number(potassium),
        temperature: Number(temperature),
        humidity: Number(humidity),
      }
    );

    setResult(res.data);
  } catch (err) {
    alert(t("fertilizerError"));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen p-6 text-white">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          🌿 {t("fertilizerTitle")}
        </h1>

        <p className="text-gray-300 mt-2">
          {t("fertilizerDesc")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="glass max-w-3xl mx-auto p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <input name="nitrogen" type="number" placeholder={t("nitrogen")} onChange={handleChange} />
<input name="phosphorus" type="number" placeholder={t("phosphorus")} onChange={handleChange} />
<input name="potassium" type="number" placeholder={t("potassium")} onChange={handleChange} />

<input name="temperature" type="number" placeholder={t("temperature")} onChange={handleChange} />
<input name="humidity" type="number" placeholder={t("humidity")} onChange={handleChange} />

        <input name="crop" placeholder={t("cropType")} onChange={handleChange} />
        <input name="soil" placeholder={t("soilType")} onChange={handleChange} />

        <div className="md:col-span-2">
          <button type="submit" className="btn btn-green w-full">
            {loading ? t("analyzing") : t("getFertilizer")}
          </button>
        </div>

      </form>

      {result && (
        <div className="glass max-w-3xl mx-auto mt-8 p-6 rounded-2xl text-center">

          <h3 className="text-xl font-semibold text-green-300">
            ✅ {t("recommendedFertilizer")}
          </h3>

          <h2 className="text-3xl font-bold mt-2">
            {result.fertilizer}
          </h2>

          <p className="mt-2 text-gray-200 font-medium">
            {result.message}
          </p>

          <p className="mt-2 text-gray-300">
            💡 {result.advice}
          </p>

        </div>
      )}

    </div>
  );
}

export default Fertilizer;