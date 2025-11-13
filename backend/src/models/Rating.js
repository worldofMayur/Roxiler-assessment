import pool from '../config/db.js';

export async function getAllRatings() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, user_id AS userId, store_id AS storeId, rating, created_at AS createdAt, updated_at AS updatedAt FROM ratings'
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function getRatingsForStore(storeId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, user_id AS userId, store_id AS storeId, rating, created_at AS createdAt, updated_at AS updatedAt FROM ratings WHERE store_id = ?',
      [storeId]
    );
    return rows;
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
    if (rows.length === 0 || rows[0].avgRating == null) return 0;
    return Number(rows[0].avgRating);
  } finally {
    conn.release();
  }
}

export async function getUserRatingForStore(userId, storeId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, user_id AS userId, store_id AS storeId, rating, created_at AS createdAt, updated_at AS updatedAt FROM ratings WHERE user_id = ? AND store_id = ? LIMIT 1',
      [userId, storeId]
    );
    if (!rows.length) return null;
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function upsertRating(userId, storeId, rating) {
  const conn = await pool.getConnection();
  try {
    // Assuming UNIQUE(user_id, store_id) is set on ratings table; if not, this still works but may create duplicates.
    await conn.query(
      `
      INSERT INTO ratings (user_id, store_id, rating)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP
      `,
      [userId, storeId, rating]
    );
  } finally {
    conn.release();
  }
}

// --- New helpers for delete flows ---

export async function deleteRatingsByStore(storeId) {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM ratings WHERE store_id = ?', [storeId]);
  } finally {
    conn.release();
  }
}

export async function deleteRatingsByUser(userId) {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM ratings WHERE user_id = ?', [userId]);
  } finally {
    conn.release();
  }
}
