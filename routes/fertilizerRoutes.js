import express from "express";

const router = express.Router();

router.post("/recommend", (req, res) => {
  const {
    nitrogen,
    phosphorus,
    potassium,
    temperature,
    humidity,
    crop,
    soil
  } = req.body;

  let fertilizer = "";
  let advice = "";

  // 🌾 Crop + Soil + Nutrient Based Logic

  if (crop.toLowerCase() === "rice") {
    if (nitrogen < 50) {
      fertilizer = "Urea";
      advice = "Apply in split doses for better absorption in paddy fields.";
    } else {
      fertilizer = "NPK 20-20-20";
      advice = "Balanced fertilizer for healthy rice growth.";
    }
  }

  else if (crop.toLowerCase() === "wheat") {
    if (phosphorus < 40) {
      fertilizer = "DAP";
      advice = "Improves root development in wheat.";
    } else {
      fertilizer = "NPK 10-26-26";
      advice = "Good for grain formation.";
    }
  }

  else if (soil.toLowerCase() === "sandy") {
    fertilizer = "Compost + Urea";
    advice = "Sandy soil needs organic matter to retain nutrients.";
  }

  else if (soil.toLowerCase() === "clay") {
    fertilizer = "NPK + Gypsum";
    advice = "Improves soil structure and drainage.";
  }

  else {
    // Default fallback
    if (nitrogen < 50) fertilizer = "Urea";
    else if (phosphorus < 50) fertilizer = "DAP";
    else if (potassium < 50) fertilizer = "MOP";
    else fertilizer = "NPK";

    advice = "Apply based on soil test results for best yield.";
  }

  res.json({
    success: true,
    fertilizer,
    advice,
    message: `Best fertilizer for ${crop} is ${fertilizer}`
  });
});

export default router;