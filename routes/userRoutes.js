const express = require("express");
const router = express.Router();
const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");

// 👇 IMPORT ALL
const {
  getProfile,
  updateProfile,
  sendEmailOTP,
  verifyEmailOTP,
  changePassword,
  uploadProfileImage   // ✅ NEW
} = require("../controllers/userController");


// ===============================
// MULTER CONFIG (IMAGE UPLOAD)
// ===============================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ===============================
// PROFILE
// ===============================
router.get("/profile", protect, getProfile);

// ===============================
// UPDATE NAME
// ===============================
router.put("/update", protect, updateProfile);

// ===============================
// EMAIL OTP
// ===============================
router.post("/send-email-otp", protect, sendEmailOTP);
router.post("/verify-email-otp", protect, verifyEmailOTP);

// ===============================
// CHANGE PASSWORD
// ===============================
router.put("/change-password", protect, changePassword);

// ===============================
// 📸 PROFILE IMAGE UPLOAD (NEW)
// ===============================
router.post(
  "/upload-profile",
  protect,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;