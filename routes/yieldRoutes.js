const express = require("express");
const router = express.Router();
const getYieldPrediction = require("../utils/yieldLogic"); // adjust path if needed

router.get("/test", (req, res) => {
  res.send("Yield route working ✅");
});

router.post("/predict", (req, res) => {
  try {
    const result = getYieldPrediction(req.body);

    res.json({
      crop: req.body.crop,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Prediction failed",
    });
  }
});

module.exports = router;