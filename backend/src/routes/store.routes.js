import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { getStoresForUser } from '../controllers/store.controller.js';

const router = Router();

// Normal user: view list of stores
router.get('/', requireAuth, requireRole(['USER']), getStoresForUser);

export default router;
