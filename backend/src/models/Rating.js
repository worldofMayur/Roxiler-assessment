import pool from '../config/db.js';

export async function upsertRating(userId, storeId, value) {
  const conn = await pool.getConnection();
  try {
    // Using INSERT ... ON DUPLICATE KEY UPDATE thanks to UNIQUE(user_id, store_id)
    await conn.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, value]
    );

    // Get row back if needed
    const [rows] = await conn.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
      [userId, storeId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function getAverageRatingForStore(storeId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT AVG(rating) AS avgRating FROM ratings WHERE store_id = ?',
      [storeId]
    );
    const avg = rows[0].avgRating;
    if (avg === null) return null;
    return Number(avg);
  } finally {
    conn.release();
  }
}

export async function getUserRatingForStore(userId, storeId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
      [userId, storeId]
    );
    return rows.length ? rows[0] : null;
  } finally {
    conn.release();
  }
}

export async function getRatingsForStore(storeId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM ratings WHERE store_id = ?',
      [storeId]
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function getAllRatings() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM ratings');
    return rows;
  } finally {
    conn.release();
  }
}
