import bcrypt from 'bcryptjs';

let users = [];
let nextId = 1;

const ROLES = ['ADMIN', 'USER', 'OWNER'];

function validateRole(role) {
  if (!ROLES.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}

// --------- SEED ADMIN USER --------------
async function seedAdmin() {
  const existing = users.find((u) => u.email === 'admin@example.com');
  if (existing) return;

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  users.push({
    id: nextId++,
    name: 'Default Platform Administrator User', // >20 chars
    email: 'admin@example.com',
    address: 'Admin Address',
    role: 'ADMIN',
    passwordHash,
  });
}

await seedAdmin();

// --------- CRUD FUNCTIONS --------------

export async function createUser({ name, email, address, password, role = 'USER' }) {
  validateRole(role);

  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: nextId++,
    name,
    email,
    address,
    role,
    passwordHash,
  };

  users.push(newUser);
  return newUser;
}

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getAllUsers() {
  return users;
}
