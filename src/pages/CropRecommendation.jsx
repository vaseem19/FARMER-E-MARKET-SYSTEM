import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function CropRecommendation() {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    rainfall: "",
    temperature: "",
    humidity: "",
    soilType: "",
    ph: "",
    season: "",
    farmSize: "",
    water: "",
    experience: "",
    market: ""
  });

  const [result, setResult] = useState(null);
  const [yieldData, setYield] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);
    setYield(null);

    try {
      const cropRes = await axios.post(
        "http://localhost:5000/api/crops/recommend",
        {
          rainfall: Number(formData.rainfall),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          soilType: formData.soilType,
          pH: Number(formData.ph),
          season: formData.season,
          waterAvailability: formData.water
        }
      );

      setResult(cropRes.data);

      const yieldRes = await axios.post(
        "http://localhost:5000/api/yield/predict",
        {
          rainfall: Number(formData.rainfall),
          temperature: Number(formData.temperature),
          soilType: formData.soilType,
          crop: cropRes.data.crop
        }
      );

      setYield(yieldRes.data);

    } catch (err) {
      setError(t("somethingWrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">

      {/* Debug remove later */}
      <div className="mb-4 text-sm opacity-70">
        {i18n.language}
      </div>

      {/* HEADER */}
      <div className="glass w-full max-w-4xl p-6 text-center mb-6">
        <h1 className="text-3xl font-bold">
          🌱 {t("smartCrop")}
        </h1>

        <p className="text-gray-300 text-sm mt-1">
          {t("aiSystem")}
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="glass w-full max-w-4xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        <input
          type="number"
          name="rainfall"
          placeholder={t("rainfall")}
          value={formData.rainfall}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="temperature"
          placeholder={t("temperature")}
          value={formData.temperature}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="humidity"
          placeholder={t("humidity")}
          value={formData.humidity}
          onChange={handleChange}
          required
        />

        <select
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          required
        >
          <option value="">{t("selectSoil")}</option>
          <option value="clay">{t("clay")}</option>
          <option value="sandy">{t("sandy")}</option>
          <option value="black">{t("black")}</option>
          <option value="loamy">{t("loamy")}</option>
          <option value="red">{t("red")}</option>
        </select>

        <input
          type="number"
          step="0.1"
          name="ph"
          placeholder={t("soilPh")}
          value={formData.ph}
          onChange={handleChange}
          required
        />

        <select
          name="season"
          value={formData.season}
          onChange={handleChange}
          required
        >
          <option value="">{t("selectSeason")}</option>
          <option value="kharif">{t("kharif")}</option>
          <option value="rabi">{t("rabi")}</option>
          <option value="zaid">{t("zaid")}</option>
        </select>

        <input
          type="number"
          name="farmSize"
          placeholder={t("farmSize")}
          value={formData.farmSize}
          onChange={handleChange}
        />

        <select
          name="water"
          value={formData.water}
          onChange={handleChange}
          required
        >
          <option value="">{t("waterAvailability")}</option>
          <option value="low">{t("low")}</option>
          <option value="medium">{t("medium")}</option>
          <option value="high">{t("high")}</option>
        </select>

        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option value="">{t("farmingExperience")}</option>
          <option value="beginner">{t("beginner")}</option>
          <option value="intermediate">{t("intermediate")}</option>
          <option value="expert">{t("expert")}</option>
        </select>

        <select
          name="market"
          value={formData.market}
          onChange={handleChange}
        >
          <option value="">{t("marketPreference")}</option>
          <option value="food">{t("foodCrops")}</option>
          <option value="cash">{t("cashCrops")}</option>
          <option value="mixed">{t("mixedFarming")}</option>
        </select>

        <div className="md:col-span-2 text-center mt-2">
          <button type="submit" className="btn btn-green w-full">
            {loading ? t("processing") : t("getRecommendation")}
          </button>
        </div>

      </form>

      {/* ERROR */}
      {error && (
        <div className="glass w-full max-w-4xl mt-4 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {/* RESULT */}
      {result && (
        <div className="glass w-full max-w-4xl mt-6 p-6 text-center">

          <h2 className="text-2xl font-bold">
            🌱 {t("recommendedCrop")}: {result.crop}
          </h2>

          <p className="text-gray-300 mt-2">
            {result.reason}
          </p>

          {yieldData && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <h3 className="text-lg font-semibold">
                📦 {t("expectedYield")}: {yieldData.expectedYield}
              </h3>

              <p className="text-gray-300">
                📊 {t("confidence")}: {yieldData.confidence}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default CropRecommendation;