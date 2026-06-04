const db = require("../config/db");

/*
=========================================
📦 ORDER CONTROLLER (FINAL FIXED VERSION)
=========================================
*/

// ===============================
// ✅ CREATE ORDER
// ===============================
exports.createOrder = async (req, res) => {
  let connection;

  try {
    connection = await db.getConnection();

    const buyer_id = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required",
      });
    }

    await connection.beginTransaction();

    let total_amount = 0;

    for (let item of items) {
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (!price || !quantity) {
        throw new Error("Invalid price or quantity");
      }

      total_amount += price * quantity;
    }

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (buyer_id, total_amount, status)
       VALUES (?, ?, 'Pending')`,
      [buyer_id, total_amount]
    );

    const order_id = orderResult.insertId;

    for (let item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, crop_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [order_id, item.crop_id, item.quantity, item.price]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Order placed successfully ✅",
      order_id,
    });

  } catch (err) {
    if (connection) await connection.rollback();

    console.error("CREATE ORDER ERROR:", err);

    res.status(500).json({
      message: err.message || "Failed to place order",
    });

  } finally {
    if (connection) connection.release();
  }
};


// ===============================
// ✅ GET BUYER ORDERS
// ===============================
exports.getBuyerOrders = async (req, res) => {
  try {
    const buyer_id = req.user.id;

    const [orders] = await db.execute(
      `SELECT *
       FROM orders
       WHERE buyer_id = ?
       ORDER BY created_at DESC`,
      [buyer_id]
    );

    for (let order of orders) {
      const [items] = await db.execute(
        `SELECT 
          oi.crop_id,
          oi.quantity,
          oi.unit_price AS price,
          c.crop_name
         FROM order_items oi
         JOIN crops c ON oi.crop_id = c.crop_id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );

      order.items = items;
    }

    res.json(orders);

  } catch (err) {
    console.error("BUYER ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch buyer orders" });
  }
};


// ===============================
// ✅ GET FARMER ORDERS (FIXED)
// ===============================
exports.getFarmerOrders = async (req, res) => {
  try {
    const farmer_id = req.user.id;

    const [orders] = await db.execute(
      `SELECT DISTINCT
        o.order_id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS buyer_name
       FROM orders o
       JOIN users u ON o.buyer_id = u.user_id
       JOIN order_items oi ON o.order_id = oi.order_id
       JOIN crops c ON oi.crop_id = c.crop_id
       WHERE c.farmer_id = ?
       ORDER BY o.created_at DESC`,
      [farmer_id]
    );

    // ✅ Attach items for each order (IMPORTANT FIX)
    for (let order of orders) {
      const [items] = await db.execute(
        `SELECT 
          oi.quantity,
          oi.unit_price AS price,
          c.crop_name
         FROM order_items oi
         JOIN crops c ON oi.crop_id = c.crop_id
         WHERE oi.order_id = ?`,
        [order.order_id]
      );

      order.items = items;
    }

    res.json(orders);

  } catch (err) {
    console.error("FARMER ORDERS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch farmer orders",
    });
  }
};


// ===============================
// ✅ UPDATE ORDER STATUS (FIXED FLOW)
// ===============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Pending",
      "Accepted",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const [current] = await db.execute(
      "SELECT status FROM orders WHERE order_id = ?",
      [order_id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const currentStatus = current[0].status;

    const flow = {
      Pending: ["Accepted", "Cancelled"],
      Accepted: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: []
    };

    if (!flow[currentStatus].includes(status)) {
      return res.status(400).json({
        message: `Cannot change ${currentStatus} → ${status}`
      });
    }

    await db.execute(
      `UPDATE orders SET status = ? WHERE order_id = ?`,
      [status, order_id]
    );

    res.json({
      success: true,
      message: "Order status updated ✅"
    });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({
      message: "Update failed"
    });
  }
};


// ===============================
// ✅ SINGLE ORDER (TRACK)
// ===============================
exports.getSingleOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const buyer_id = req.user.id;

    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE order_id = ? AND buyer_id = ?`,
      [order_id, buyer_id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const [items] = await db.execute(
      `SELECT 
        oi.crop_id,
        oi.quantity,
        oi.unit_price AS price,
        c.crop_name
       FROM order_items oi
       JOIN crops c ON oi.crop_id = c.crop_id
       WHERE oi.order_id = ?`,
      [order_id]
    );

    res.json({
      ...orders[0],
      items,
    });

  } catch (error) {
    console.error("TRACK ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// ✅ CANCEL ORDER
// ===============================
exports.cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const buyer_id = req.user.id;

    const [result] = await db.execute(
      `UPDATE orders
       SET status = 'Cancelled'
       WHERE order_id = ?
       AND buyer_id = ?
       AND status = 'Pending'`,
      [order_id, buyer_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Cannot cancel order"
      });
    }

    res.json({
      success: true,
      message: "Order cancelled"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cancel failed" });
  }
};


// ===============================
// ✅ ADMIN: ALL ORDERS
// ===============================
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT 
        o.order_id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS buyer_name
       FROM orders o
       JOIN users u ON o.buyer_id = u.user_id
       ORDER BY o.created_at DESC`
    );

    res.json(orders);

  } catch (err) {
    console.error("ADMIN ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


// ===============================
// ✅ ADMIN ANALYTICS
// ===============================
exports.getAnalytics = async (req, res) => {
  try {
    const [[sales]] = await db.execute(
      `SELECT SUM(total_amount) AS total_sales
       FROM orders
       WHERE status != 'Cancelled'`
    );

    const [[count]] = await db.execute(
      `SELECT COUNT(*) AS total_orders
       FROM orders
       WHERE status != 'Cancelled'`
    );

    res.json({
      totalSales: sales.total_sales || 0,
      totalOrders: count.total_orders || 0,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analytics error" });
  }
};