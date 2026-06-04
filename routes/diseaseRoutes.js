import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const AI_URL = "http://127.0.0.1:8000";

// =========================
// 🌾 RISK ROUTE
// =========================
router.post("/risk", async (req, res) => {
  try {
    const response = await axios.post(`${AI_URL}/risk`, req.body);
    res.json(response.data);
  } catch (err) {
    console.log("Risk error:", err.message);
    res.status(500).json({ error: "Risk service failed" });
  }
});

// =========================
// 📷 IMAGE ROUTE
// =========================
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(`${AI_URL}/image`, formData, {
      headers: formData.getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log("Image error:", err.message);
    res.status(500).json({ error: "Image service failed" });
  }
});

export default router;