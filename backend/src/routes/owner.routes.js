import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getOwnerDashboard,
  getOwnerStoresSummary,
  getStoreRaters,
} from '../controllers/owner.controller.js';

const router = Router();

// all owner routes require OWNER role
router.use(requireAuth, requireRole(['OWNER']));

router.get('/dashboard', getOwnerDashboard);
router.get('/stores', getOwnerStoresSummary);
router.get('/stores/:storeId/raters', getStoreRaters);

export default router;
