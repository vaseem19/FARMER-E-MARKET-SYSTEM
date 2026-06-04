function normalizeSoil(soil) {
  if (!soil) return "";

  soil = soil.toLowerCase();

  if (soil.includes("clay")) return "clay";
  if (soil.includes("sandy")) return "sandy";
  if (soil.includes("black")) return "black";
  if (soil.includes("loamy")) return "loamy";
  if (soil.includes("red")) return "red";

  return soil;
}

function getCropRecommendation(data) {
  let {
    rainfall,
    temperature,
    humidity,
    soilType,
    pH,
    season,
    waterAvailability,
  } = data;

  soilType = normalizeSoil(soilType);

  const crops = [
    {
      name: "Rice 🌾",
      score: 0,
      reason: [],
      match: (d) => {
        if (d.rainfall > 200) { d.score += 2; d.reason.push("High rainfall"); }
        if (d.temperature >= 20 && d.temperature <= 35) { d.score += 2; d.reason.push("Warm temperature"); }
        if (d.soilType === "clay" || d.soilType === "loamy") { d.score += 2; d.reason.push("Suitable soil"); }
        if (d.waterAvailability === "high") { d.score += 1; d.reason.push("High water availability"); }
        if (d.season === "kharif") { d.score += 1; d.reason.push("Kharif season"); }
      }
    },
    {
      name: "Wheat 🌿",
      score: 0,
      reason: [],
      match: (d) => {
        if (d.rainfall >= 50 && d.rainfall <= 150) { d.score += 2; d.reason.push("Moderate rainfall"); }
        if (d.temperature >= 10 && d.temperature <= 25) { d.score += 2; d.reason.push("Cool temperature"); }
        if (d.pH >= 6 && d.pH <= 7.5) { d.score += 1; d.reason.push("Ideal pH"); }
        if (d.season === "rabi") { d.score += 1; d.reason.push("Rabi season"); }
      }
    },
    {
      name: "Groundnut 🥜",
      score: 0,
      reason: [],
      match: (d) => {
        if (d.rainfall < 100) { d.score += 2; d.reason.push("Low rainfall"); }
        if (d.temperature >= 20 && d.temperature <= 30) { d.score += 2; d.reason.push("Warm temp"); }
        if (d.soilType === "sandy" || d.soilType === "red") { d.score += 2; d.reason.push("Sandy/Red soil"); }
      }
    },
    {
      name: "Cotton 🌱",
      score: 0,
      reason: [],
      match: (d) => {
        if (d.rainfall >= 100 && d.rainfall <= 200) { d.score += 2; d.reason.push("Moderate rainfall"); }
        if (d.temperature >= 25 && d.temperature <= 35) { d.score += 2; d.reason.push("Hot temp"); }
        if (d.soilType === "black") { d.score += 2; d.reason.push("Black soil"); }
      }
    },
    {
      name: "Maize 🌽",
      score: 0,
      reason: [],
      match: (d) => {
        if (d.rainfall >= 50 && d.rainfall <= 200) { d.score += 2; d.reason.push("Flexible rainfall"); }
        if (d.temperature >= 18 && d.temperature <= 30) { d.score += 2; d.reason.push("Moderate temp"); }
        if (["loamy", "red", "clay"].includes(d.soilType)) {
          d.score += 1;
          d.reason.push("Adaptable soil");
        }
      }
    }
  ];

  crops.forEach((crop) => {
    crop.score = 0;
    crop.reason = [];

    crop.match({
      rainfall,
      temperature,
      humidity,
      soilType,
      pH,
      season,
      waterAvailability,
      score: crop.score,
      reason: crop.reason
    });

    crop.score = crop.reason.length;
  });

  const bestCrop = crops.sort((a, b) => b.score - a.score)[0];

  return {
    crop: bestCrop.name,
    reason: bestCrop.reason.join(", "),
    score: bestCrop.score
  };
}

module.exports = getCropRecommendation;