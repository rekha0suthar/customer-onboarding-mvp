import express from 'express';
import authController from '../controllers/auth.controller.js';
import validate from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/rbac.middleware.js';
import { registerValidation, loginValidation } from '../validators/auth.validators.js';

const router = express.Router();

// Register
router.post('/register', registerValidation, validate, authController.register);

// Login
router.post('/login', loginValidation, validate, authController.login);

// Get current user profile
router.get('/profile', requireAuth, authController.getProfile);

export default router;
