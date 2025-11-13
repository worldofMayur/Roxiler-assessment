import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getAdminDashboard,
  listUsers,
  listStores,
  createStoreAdmin,
  updateStoreAdmin,
} from '../controllers/admin.controller.js';

const router = Router();

// all admin routes require ADMIN role
router.use(requireAuth, requireRole(['ADMIN']));

router.get('/dashboard', getAdminDashboard);
router.get('/users', listUsers);
router.get('/stores', listStores);

// manage stores
router.post('/stores', createStoreAdmin);
router.put('/stores/:storeId', updateStoreAdmin);

export default router;
