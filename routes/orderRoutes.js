const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

/*
========================================
📦 ORDERS ROUTES (FINAL CLEAN)
========================================
*/

// ================= BUYER =================

// Create Order
router.post(
  "/",
  protect,
  authorize("buyer"),
  orderController.createOrder
);

// Get buyer orders
router.get(
  "/buyer",
  protect,
  authorize("buyer"),
  orderController.getBuyerOrders
);

// Track single order
router.get(
  "/buyer/:order_id",
  protect,
  authorize("buyer"),
  orderController.getSingleOrder
);

// Cancel order
router.put(
  "/buyer/:order_id/cancel",
  protect,
  authorize("buyer"),
  orderController.cancelOrder
);

// ================= FARMER =================

// Farmer orders (IMPORTANT FOR YOUR DASHBOARD)
router.get(
  "/farmer",
  protect,
  authorize("farmer"),
  orderController.getFarmerOrders
);

// Farmer update order status
router.put(
  "/farmer/:order_id/status",
  protect,
  authorize("farmer"),
  orderController.updateOrderStatus
);

// ================= ADMIN =================

// All orders
router.get(
  "/admin",
  protect,
  authorize("admin"),
  orderController.getAllOrders
);

module.exports = router;