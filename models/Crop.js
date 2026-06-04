const db = require("../config/db");

const Crop = {
  addCrop: (data, callback) => {
    const sql = `
      INSERT INTO crops (farmer_id, crop_name, quantity, price, location, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, data, callback);
  },

  getCropsByFarmer: (farmer_id, callback) => {
    const sql = "SELECT * FROM crops WHERE farmer_id = ?";
    db.query(sql, [farmer_id], callback);
  },

  getAllCrops: (callback) => {
    const sql = "SELECT * FROM crops";
    db.query(sql, callback);
  }
};

module.exports = Crop;
