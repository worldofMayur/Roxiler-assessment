import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';
import {
  getAdminDashboard,
  listUsers,
  listStores,
  createStoreAdmin,
  updateStoreAdmin,
  deleteUserAdmin,
  deleteStoreAdmin,
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
router.delete('/stores/:storeId', deleteStoreAdmin);

// manage users
router.delete('/users/:userId', deleteUserAdmin);

export default router;
