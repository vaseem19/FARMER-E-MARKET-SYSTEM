function getYieldPrediction(data) {
  let { rainfall, temperature, soilType, crop } = data;

  rainfall = Number(rainfall);
  temperature = Number(temperature);

  // 🌾 Base yield per crop
  let baseYield = 2;

  if (crop === "Rice") baseYield = 4;
  else if (crop === "Wheat") baseYield = 3;
  else if (crop === "Maize") baseYield = 2.5;
  else if (crop === "Cotton") baseYield = 2;
  else if (crop === "Groundnut") baseYield = 2.2;

  let score = 0;

  // 🌧️ Rainfall effect
  if (rainfall >= 200) score += 1;
  else if (rainfall >= 100) score += 0.5;
  else score -= 0.2;

  // 🌡️ Temperature effect
  if (temperature >= 20 && temperature <= 30) score += 1;
  else if (temperature >= 15 && temperature <= 35) score += 0.5;
  else score -= 0.2;

  // 🌱 Soil effect
  if (["loamy", "clay"].includes(soilType.toLowerCase())) score += 1;
  else score += 0.3;

  const yieldValue = baseYield + score;

  return {
    estimatedYield: `${yieldValue.toFixed(2)} tons/hectare`,
    confidence: score >= 2 ? "High" : "Medium",
  };
}

module.exports = getYieldPrediction;