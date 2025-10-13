const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('first_name').notEmpty().trim().withMessage('First name is required'),
    body('last_name').notEmpty().trim().withMessage('Last name is required'),
    body('phone').optional().trim(),
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
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;

