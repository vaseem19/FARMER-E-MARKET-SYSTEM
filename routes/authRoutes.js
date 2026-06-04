const express = require("express");

const router = express.Router();

// ===============================
// CONTROLLERS
// ===============================
const {
  registerUser,
  loginUser,
  sendResetOTP,
  resetPassword,
} = require("../controllers/authController");

// ===============================
// AUTH ROUTES
// ===============================

// ✅ Register
router.post("/register", registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Send OTP
router.post("/send-otp", sendResetOTP);

// ✅ Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;