// controllers/userController.js

const db = require("../config/db");
const nodemailer = require("nodemailer");

// ===============================
// GET PROFILE
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, name, email, role, profile_image FROM users WHERE user_id = ?",
      [req.user.id]
    );

    const user = rows[0];

    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profile_image || ""
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// UPDATE NAME (simple update)
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    await db.query(
      "UPDATE users SET name = ? WHERE user_id = ?",
      [name, userId]
    );

    res.json({ message: "Name updated successfully" });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};

// ===============================
// SEND EMAIL OTP
// ===============================
exports.sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 10 * 60 * 1000;

    // Save OTP in DB
    await db.query(
      "UPDATE users SET otp = ?, otp_expire = ? WHERE user_id = ?",
      [otp, expireTime, req.user.id]
    );

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Email Update OTP",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`
    });

    res.json({ message: "OTP sent to new email 📩" });

  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ===============================
// VERIFY OTP & UPDATE EMAIL
// ===============================
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ? AND otp = ?",
      [req.user.id, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = rows[0];

    if (user.otp_expire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Update email
    await db.query(
      "UPDATE users SET email = ?, otp = NULL, otp_expire = NULL WHERE user_id = ?",
      [email, req.user.id]
    );

    res.json({ message: "Email updated successfully ✅" });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};

const bcrypt = require("bcryptjs");

// ===============================
// CHANGE PASSWORD
// ===============================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user from DB
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [req.user.id]
    );

    const user = rows[0];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update
    await db.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Password changed successfully 🔐" });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
};

const path = require("path");

// ===============================
// 📸 UPLOAD PROFILE IMAGE
// ===============================
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // Update in database
    await db.query(
      "UPDATE users SET profile_image = ? WHERE user_id = ?",
      [imageUrl, userId]
    );

    res.json({
      message: "Profile image updated successfully",
      imageUrl
    });

  } catch (error) {
    console.error("UPLOAD PROFILE IMAGE ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};