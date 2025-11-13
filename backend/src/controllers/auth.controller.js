import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../models/User.js';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

export async function signup(req, res, next) {
  try {
    const { name, email, address, password } = req.body;

    // Validations
    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({
        message: 'Name must be between 20 and 60 characters.',
      });
    }
    if (!address || address.length > 400) {
      return res.status(400).json({
        message: 'Address must be at most 400 characters.',
      });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    if (!passwordRegex.test(password || '')) {
      return res.status(400).json({
        message:
          'Password must be 8–16 chars and include at least one uppercase letter and one special character.',
      });
    }

    // Create user in DB
    const newUser = await createUser({
      name,
      email,
      address,
      password,
      role: 'USER', // signup creates only users
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      role: newUser.role,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const user = await findUserByEmail(email); // MUST await in MySQL mode
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '1d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
}
