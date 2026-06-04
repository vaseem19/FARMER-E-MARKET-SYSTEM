const express = require("express");
const router = express.Router();
const axios = require("axios");

// ✅ SECURE API key (IMPORTANT)
const apiKey = process.env.WEATHER_API_KEY;


// 🌾 Smart Crop Suggestion Function (UPGRADED)
const getCropSuggestion = (temp, humidity, weatherMain) => {
  if (weatherMain === "Rain") return "Rice 🌾 (Best for rainy conditions)";
  
  if (temp > 32 && humidity < 40)
    return "Millets 🌱 (Drought resistant)";
  
  if (temp < 20)
    return "Wheat 🌿 (Cool weather crop)";
  
  if (humidity > 70)
    return "Sugarcane 🍃 (Needs high moisture)";
  
  if (temp > 25 && humidity > 50)
    return "Maize 🌽";

  return "Vegetables 🥕 (General farming)";
};


// 📍 GET weather by coordinates (AUTO LOCATION)
router.get("/coords", async (req, res) => {
  let { lat, lon } = req.query;

  console.log("📍 LAT:", lat, "📍 LON:", lon);

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude & Longitude required" });
  }

  lat = parseFloat(lat);
  lon = parseFloat(lon);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    console.log("🌐 URL:", url);

    const response = await axios.get(url);
    const data = response.data;

    const condition = data.weather[0].main;

    // 🌾 Crop suggestion
    const cropSuggestion = getCropSuggestion(
      data.main.temp,
      data.main.humidity,
      condition
    );

    // 🧠 Farming score
    const farmingScore = Math.max(
      0,
      Math.min(
        100,
        Math.floor(
          100 -
          Math.abs(30 - data.main.temp) * 2 -
          Math.abs(60 - data.main.humidity)
        )
      )
    );

    res.json({
      ...data,
      cropSuggestion,
      condition,       // ✅ for frontend background
      farmingScore,    // ✅ new feature
    });

  } catch (error) {
    console.error("❌ STATUS:", error.response?.status);
    console.error("❌ DATA:", error.response?.data);
    console.error("❌ MESSAGE:", error.message);

    res.status(500).json({
      error: "Weather fetch failed",
      details: error.response?.data || error.message,
    });
  }
});


// 🌧 GET forecast
router.get("/forecast/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json(response.data);

  } catch (error) {
    console.error("❌ Forecast error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Forecast failed",
      details: error.response?.data || error.message,
    });
  }
});


// 🌾 GET weather by city + alerts
router.get("/:city", async (req, res) => {
  const city = req.params.city;
  console.log("✅ Weather route hit:", city);

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = response.data;

    const condition = data.weather[0].main;

    // 🔔 Smart Alerts (UPGRADED)
    let alert = "";

    if (data.main.temp > 40) {
      alert = "🔥 Heatwave! Immediate irrigation needed";
    } else if (condition === "Rain") {
      alert = "🌧 Heavy rain! Protect crops & drainage";
    } else if (data.wind.speed > 10) {
      alert = "🌬 Strong winds! Secure crops";
    } else if (data.main.humidity > 80) {
      alert = "💧 High humidity! Risk of fungal diseases";
    } else if (condition === "Clouds") {
      alert = "☁ Cloudy weather, monitor crops";
    } else {
      alert = "☀ Good weather for farming";
    }

    // 🌾 Crop suggestion
    const cropSuggestion = getCropSuggestion(
      data.main.temp,
      data.main.humidity,
      condition
    );

    // 🧠 Farming score
    const farmingScore = Math.max(
      0,
      Math.min(
        100,
        Math.floor(
          100 -
          Math.abs(30 - data.main.temp) * 2 -
          Math.abs(60 - data.main.humidity)
        )
      )
    );

    res.json({
      ...data,
      alert,
      cropSuggestion,
      condition,     // ✅ IMPORTANT for frontend UI
      farmingScore,  // ✅ new feature
    });

  } catch (error) {
    console.error("❌ Weather error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Weather fetch failed",
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;