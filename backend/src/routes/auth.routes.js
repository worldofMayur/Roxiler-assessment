import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const router = Router();

// POST /api/auth/signup  (normal user registration)
router.post('/signup', signup);

// POST /api/auth/login   (all roles)
router.post('/login', login);

export default router;
