import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import { submitRating } from '../controllers/rating.controller.js';

const router = Router();

// POST /api/ratings/:storeId  (normal user submit / update rating)
router.post('/:storeId', requireAuth, requireRole(['USER']), submitRating);

export default router;
