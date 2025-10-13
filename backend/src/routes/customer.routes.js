const express = require('express');
const { body } = require('express-validator');
const customerController = require('../controllers/customer.controller');
const validate = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get customer profile
router.get('/profile', customerController.getProfile);

// Update customer profile
router.put(
  '/profile',
  [
    body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phone').optional().trim(),
    body('date_of_birth').optional().isISO8601().withMessage('Invalid date format'),
    body('address').optional().trim(),
    body('city').optional().trim(),
    body('state').optional().trim(),
    body('zip_code').optional().trim(),
    body('country').optional().trim(),
  ],
  validate,
  customerController.updateProfile
);

// Get onboarding status
router.get('/status', customerController.getOnboardingStatus);

// Update onboarding step
router.put(
  '/status',
  [
    body('status').optional().isIn(['pending', 'in_progress', 'completed', 'rejected'])
      .withMessage('Invalid status'),
    body('step').optional().isInt({ min: 1, max: 10 }).withMessage('Step must be between 1 and 10'),
  ],
  validate,
  customerController.updateOnboardingStep
);

// Get customer activities
router.get('/activities', customerController.getActivities);

module.exports = router;

