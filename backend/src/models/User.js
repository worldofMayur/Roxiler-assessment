import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function ensureAdminAndOwnerSeeded() {
  const conn = await pool.getConnection();
  try {
    const [adminRows] = await conn.query('SELECT id FROM users WHERE email = ? LIMIT 1', [
      'admin@example.com',
    ]);
    if (!adminRows.length) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await conn.query(
        'INSERT INTO users (name, email, address, password_hash, role) VALUES (?,?,?,?,?)',
        [
          'Administrator Account',
          'admin@example.com',
          'Admin HQ, System City',
          passwordHash,
          'ADMIN',
        ]
      );
    }

    const [ownerRows] = await conn.query('SELECT id FROM users WHERE email = ? LIMIT 1', [
      'owner@example.com',
    ]);
    if (!ownerRows.length) {
      const passwordHash = await bcrypt.hash('Owner@123', 10);
      await conn.query(
        'INSERT INTO users (name, email, address, password_hash, role) VALUES (?,?,?,?,?)',
        [
          'Default Store Owner',
          'owner@example.com',
          'Owner Street 10, Business District',
          passwordHash,
          'OWNER',
        ]
      );
    }
  } finally {
    conn.release();
  }
}

await ensureAdminAndOwnerSeeded();

export async function getAllUsers() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, role FROM users'
    );
    return rows;
  } finally {
    conn.release();
  }
}

export async function findUserByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, password_hash AS passwordHash, role FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (!rows.length) return null;
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function findUserById(id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT id, name, email, address, password_hash AS passwordHash, role FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows.length) return null;
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function createUser({ name, email, address, password, role }) {
  const conn = await pool.getConnection();
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      const error = new Error('User with this email already exists.');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await conn.query(
      'INSERT INTO users (name, email, address, password_hash, role) VALUES (?,?,?,?,?)',
      [name, email, address, passwordHash, role]
    );

    return {
      id: result.insertId,
      name,
      email,
      address,
      role,
    };
  } finally {
    conn.release();
  }
}

// --- New helper for deletes ---

export async function deleteUser(id) {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM users WHERE id = ?', [id]);
  } finally {
    conn.release();
  }
}
