import express from 'express';
import customerController from '../controllers/customer.controller.js';
import validate from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/rbac.middleware.js';
import { 
  updateProfileValidation, 
  updateOnboardingStatusValidation 
} from '../validators/customer.validators.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get customer profile
router.get('/profile', customerController.getProfile);

// Update customer profile
router.put('/profile', updateProfileValidation, validate, customerController.updateProfile);

// Get onboarding status
router.get('/status', customerController.getOnboardingStatus);

// Update onboarding step
router.put('/status', updateOnboardingStatusValidation, validate, customerController.updateOnboardingStep);

// Get customer activities
router.get('/activities', customerController.getActivities);

export default router;
