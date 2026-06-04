const express = require("express");
const router = express.Router();
const getCropRecommendation = require("../utils/cropLogic");

router.post("/recommend", (req, res) => {
  try {
    const result = getCropRecommendation(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating recommendation" });
  }
});

const {
  addCrop,
  getMyCrops,
  getAllCrops
} = require("../controllers/cropController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");



// 🌾 Farmer routes
router.post("/add", protect, authorize("farmer"), addCrop);
router.get("/my-crops", protect, authorize("farmer"), getMyCrops);

// 🌍 Public route (NO TOKEN)
router.get("/", getAllCrops);



module.exports = router;