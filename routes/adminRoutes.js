const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  getAllOrders,
  getAnalytics,
} = require("../controllers/orderController");

// USERS
router.get("/users", async (req, res) => {
  const [users] = await db.query(
    "SELECT user_id, name, email, role FROM users"
  );
  res.json(users);
});

// CROPS
router.get("/crops", async (req, res) => {
  const [crops] = await db.query("SELECT * FROM crops");
  res.json(crops);
});

// DELETE USER
router.delete("/user/:id", async (req, res) => {

  try {

    const userId = req.params.id;

    // ✅ Delete related order_items first
    await db.query(`
      DELETE oi FROM order_items oi
      JOIN orders o ON oi.order_id = o.order_id
      WHERE o.buyer_id = ?
    `, [userId]);

    // ✅ Delete orders
    await db.query(
      "DELETE FROM orders WHERE buyer_id = ?",
      [userId]
    );

    // ✅ Delete crops
    await db.query(
      "DELETE FROM crops WHERE farmer_id = ?",
      [userId]
    );

    // ✅ Finally delete user
    await db.query(
      "DELETE FROM users WHERE user_id = ?",
      [userId]
    );

    res.json({
      success: true,
      message: "User deleted successfully ✅",
    });

  } catch (error) {

    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

// DELETE CROP
router.delete("/crop/:id", async (req, res) => {
  await db.query("DELETE FROM crops WHERE crop_id = ?", [req.params.id]);
  res.json({ message: "Crop deleted" });
});

// ✅ ORDERS
router.get("/orders", getAllOrders);

// ✅ ANALYTICS
router.get("/analytics", getAnalytics);

module.exports = router;