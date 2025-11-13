import pool from '../config/db.js';

// We assign owner@example.com as owner of first two stores.
// We need its ID, so we'll resolve it via a small query.
async function seedStores() {
  const conn = await pool.getConnection();
  try {
    // Check if we already have stores
    const [rows] = await conn.query('SELECT COUNT(*) AS count FROM stores');
    if (rows[0].count > 0) return;

    // find owner id
    const [ownerRows] = await conn.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      ['owner@example.com']
    );
    const ownerId = ownerRows.length > 0 ? ownerRows[0].id : null;

    // Insert demo stores
    await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)',
      [
        'Star Supermarket Central Branch',
        'central@starsupermarket.com',
        'Main Street 1, Downtown City',
        ownerId,
      ]
    );

    await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)',
      [
        'Tech World Electronics Plaza',
        'contact@techworld.com',
        'Market Road 5, Tech District',
        ownerId,
      ]
    );

    await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)',
      [
        'Fresh Farm Organic Foods',
        'hello@freshfarm.com',
        'Green Avenue 9, Garden Area',
        null,
      ]
    );
  } finally {
    conn.release();
  }
}

await seedStores();

export async function getAllStores() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, owner_id AS ownerId FROM stores'
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function findStoreById(id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, owner_id AS ownerId FROM stores WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function createStore({ name, email, address, ownerId = null }) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?,?,?,?)',
      [name, email, address, ownerId]
    );

    return {
      id: result.insertId,
      name,
      email,
      address,
      ownerId,
    };
  } finally {
    conn.release();
  }
}

export async function getStoresByOwner(ownerId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, owner_id AS ownerId FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    return rows;
  } finally {
    conn.release();
  }
}
