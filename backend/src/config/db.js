import mysql from 'mysql2/promise';

// TEMP: log config once to understand what's going on
console.log('DB CONFIG (from env):', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  db: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',

  // IMPORTANT: if env is missing, fallback to your actual password
  password: process.env.DB_PASSWORD ?? 'Krishna@River55',

  database: process.env.DB_NAME || 'store_rating_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
