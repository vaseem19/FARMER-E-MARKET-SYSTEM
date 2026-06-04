const express = require("express");
const router = express.Router();

/*
  Temporary BAP Routes
  (Safe version so server does not crash)
*/

// Test route
router.get("/", (req, res) => {
  res.json({ message: "BAP route working successfully 🚀" });
});

// Example POST route
router.post("/add", (req, res) => {
  const { name, description } = req.body;

  res.json({
    message: "BAP data received",
    data: { name, description }
  });
});

module.exports = router;