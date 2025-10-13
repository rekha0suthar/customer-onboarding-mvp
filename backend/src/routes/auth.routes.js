import express from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name').notEmpty().trim().withMessage('First name is required'),
    body('last_name').notEmpty().trim().withMessage('Last name is required'),
    body('gstin')
      .optional()
      .trim()
      .isLength({ min: 15, max: 15 })
      .withMessage('GSTIN must be 15 characters')
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
      .withMessage('Invalid GSTIN format'),
  ],
  validate,
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

// Get current user profile
router.get('/profile', requireAuth, authController.getProfile);

export default router;
