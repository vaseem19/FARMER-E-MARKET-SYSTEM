const db = require("../config/db");

const Order = {

  // ✅ Create Order
  createOrder: (data, cb) => {
    db.query(
      `INSERT INTO orders 
      (buyer_id, farmer_id, total_amount, status) 
      VALUES (?, ?, ?, ?)`,
      data,
      cb
    );
  },

  // ✅ Buyer Orders
  getOrdersByBuyer: (buyer_id, cb) => {
    db.query(
      "SELECT * FROM orders WHERE buyer_id = ? ORDER BY order_id DESC",
      [buyer_id],
      cb
    );
  },

  // ✅ Farmer Orders
  getOrdersByFarmer: (farmer_id, cb) => {
    db.query(
      "SELECT * FROM orders WHERE farmer_id = ? ORDER BY order_id DESC",
      [farmer_id],
      cb
    );
  },

  // ✅ Update Status
  updateStatus: (status, order_id, cb) => {
    db.query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [status, order_id],
      cb
    );
  }

};

module.exports = Order;