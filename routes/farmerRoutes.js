import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ GET FARMERS ONLY
router.get("/:userId", (req, res) => {
  const sql = `
    SELECT user_id, name, email
    FROM users
    WHERE role = 'farmer'
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

export default router;