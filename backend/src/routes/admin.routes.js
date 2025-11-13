import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getAdminDashboard,
  listUsers,
  listStores,
} from '../controllers/admin.controller.js';

const router = Router();

// all admin routes require ADMIN role
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/dashboard', getAdminDashboard);
router.get('/users', listUsers);
router.get('/stores', listStores);

export default router;
