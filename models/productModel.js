const db = require("../config/db");

exports.addProduct = (product, callback) => {
  const sql = "INSERT INTO product (farmer_id, name, price, quantity) VALUES (?, ?, ?, ?)";
  db.query(sql, [product.farmer_id, product.name, product.price, product.quantity], callback);
};

exports.getAllProducts = (callback) => {
  db.query("SELECT * FROM product", callback);
};
