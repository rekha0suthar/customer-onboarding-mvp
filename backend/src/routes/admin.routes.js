import express from 'express';
import adminController from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(requireAuth);
router.use(requireAdmin);

// Admin dashboard overview
router.get('/overview', adminController.getOverview);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);

// Customer management (view all brokers' customers)
router.get('/customers', adminController.getAllCustomers);
router.get('/customers/:id', adminController.getCustomerById);

export default router;

