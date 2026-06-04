const db = require("../config/db");

// ✅ Get farmers with connection status
exports.getFarmersWithStatus = (currentUserId, callback) => {
  const sql = `
    SELECT 
      u.user_id,
      u.name,
      u.email,

      CASE 
        WHEN c.user_id IS NOT NULL THEN 1
        ELSE 0
      END AS isConnected

    FROM users u

    LEFT JOIN connections c 
      ON u.user_id = c.connected_user_id 
      AND c.user_id = ?

    WHERE u.role = 'farmer'
    AND u.user_id != ?
  `;

  db.query(sql, [currentUserId, currentUserId], callback);
};