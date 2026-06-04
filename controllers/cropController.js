const db = require("../config/db");


exports.addCrop = async (req, res) => {
  try {
     console.log("BODY 👉", req.body);   // 👈 ADD THIS
     console.log("USER 👉", req.user);
    const { crop_name, quantity, price, location, soil_type } = req.body;

    const farmer_id = req.user.id;

    await db.query(
      "INSERT INTO crops (crop_name, quantity, price, location, soil_type, farmer_id) VALUES (?, ?, ?, ?, ?, ?)",
      [crop_name, quantity, price, location, soil_type, farmer_id]
    );

    res.json({ message: "Crop added successfully" });

  } catch (error) {
    console.log("ERROR 👉", error);   // 👈 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};



exports.getMyCrops = async (req, res) => {

  try {

    const farmer_id = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM crops WHERE farmer_id = ?",
      [farmer_id]
    );

    res.json(rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({ message: "Server error" });

  }

};



exports.getAllCrops = async (req, res) => {

  try {

    const [rows] = await db.query(
      "SELECT * FROM crops"
    );

    res.json(rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({ message: "Server error" });

  }

};