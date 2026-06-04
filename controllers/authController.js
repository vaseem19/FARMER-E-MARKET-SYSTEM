const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const nodemailer = require("nodemailer");

// ===============================
// REGISTER
// ===============================
exports.registerUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    // ===============================
    // ✅ EMPTY FIELD VALIDATION
    // ===============================
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ===============================
    // ✅ EMAIL VALIDATION
    // ===============================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ===============================
    // ✅ PASSWORD VALIDATION
    // ===============================
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // ===============================
    // ✅ CHECK EXISTING EMAIL
    // ===============================
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // ===============================
    // ✅ HASH PASSWORD
    // ===============================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===============================
    // ✅ INSERT USER
    // ===============================
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully ✅",
      user_id: result.insertId,
    });

  } catch (error) {

    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

// ===============================
// LOGIN
// ===============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// FORGOT PASSWORD - SEND OTP
// ===============================
exports.sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 10 * 60 * 1000;

    await db.query(
      "UPDATE users SET otp = ?, otp_expire = ? WHERE email = ?",
      [otp, expireTime, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      html: `<h2>Your OTP is: ${otp}</h2><p>Valid for 10 minutes</p>`
    });

    res.json({ message: "OTP sent successfully 📩" });

  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ===============================
// VERIFY OTP + RESET PASSWORD
// ===============================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND otp = ?",
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = rows[0];

    if (user.otp_expire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE users SET password = ?, otp = NULL, otp_expire = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Password reset successful 🔐" });

  } catch (error) {
    res.status(500).json({ message: "Reset failed" });
  }
};