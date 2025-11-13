import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const ROLES = ['ADMIN', 'USER', 'OWNER'];

function validateRole(role) {
  if (!ROLES.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}

// --------- SEED ADMIN + OWNER ACCOUNTS --------------

async function seedInitialUsers() {
  const conn = await pool.getConnection();
  try {
    // Admin
    const [rowsAdmin] = await conn.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      ['admin@example.com']
    );
    if (rowsAdmin.length === 0) {
      const passwordHash = await bcrypt.hash('Admin@123', 10);
      await conn.query(
        'INSERT INTO users (name, email, address, role, password_hash) VALUES (?,?,?,?,?)',
        [
          'Default Platform Administrator User',
          'admin@example.com',
          'Admin Address',
          'ADMIN',
          passwordHash,
        ]
      );
    }

    // Owner
    const [rowsOwner] = await conn.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      ['owner@example.com']
    );
    if (rowsOwner.length === 0) {
      const passwordHash = await bcrypt.hash('Owner@123', 10);
      await conn.query(
        'INSERT INTO users (name, email, address, role, password_hash) VALUES (?,?,?,?,?)',
        [
          'Default Store Owner Account',
          'owner@example.com',
          'Owner Address',
          'OWNER',
          passwordHash,
        ]
      );
    }
  } finally {
    conn.release();
  }
}

// call seeding once on module load
await seedInitialUsers();

// --------- MODEL FUNCTIONS --------------

export async function createUser({ name, email, address, password, role = 'USER' }) {
  validateRole(role);

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (existing.length > 0) {
      const error = new Error('Email already in use');
      error.status = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await conn.query(
      'INSERT INTO users (name, email, address, role, password_hash) VALUES (?,?,?,?,?)',
      [name, email, address, role, passwordHash]
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

export async function findUserByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
}

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
