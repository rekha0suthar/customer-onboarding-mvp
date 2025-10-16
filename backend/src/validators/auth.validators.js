import { body } from 'express-validator';

/**
 * Validation rules for authentication routes
 */

// Common email validation (reusable)
export const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Valid email is required');

// Common password validation (reusable)
export const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .matches(/(?=.*[a-z])/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/(?=.*[A-Z])/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/(?=.*\d)/)
  .withMessage('Password must contain at least one number');

// First name validation
export const firstNameValidation = body('first_name')
  .notEmpty()
  .trim()
  .withMessage('First name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('First name must be between 2 and 50 characters');

// Last name validation
export const lastNameValidation = body('last_name')
  .notEmpty()
  .trim()
  .withMessage('Last name is required')
  .isLength({ min: 2, max: 50 })
  .withMessage('Last name must be between 2 and 50 characters');

// GSTIN validation (Indian GST number)
export const gstinValidation = body('gstin')
  .optional()
  .trim()
  .isLength({ min: 15, max: 15 })
  .withMessage('GSTIN must be exactly 15 characters')
  .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
  .withMessage('Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)');

/**
 * Validation rule sets for specific endpoints
 */

// Registration validation rules
export const registerValidation = [
  emailValidation,
  passwordValidation,
  firstNameValidation,
  lastNameValidation,
  gstinValidation,
];

// Login validation rules
export const loginValidation = [
  emailValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Change password validation rules (if needed in future)
export const changePasswordValidation = [
  body('current_password')
    .notEmpty()
    .withMessage('Current password is required'),
  body('new_password')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/(?=.*[a-z])/)
    .withMessage('New password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/)
    .withMessage('New password must contain at least one number'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

