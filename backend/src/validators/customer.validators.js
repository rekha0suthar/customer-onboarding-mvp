import { body } from 'express-validator';

/**
 * Validation rules for customer profile routes
 */

// Phone number validation
export const phoneValidation = body('phone')
  .optional()
  .trim()
  .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
  .withMessage('Invalid phone number format');

// Date of birth validation
export const dateOfBirthValidation = body('date_of_birth')
  .optional()
  .isISO8601()
  .withMessage('Invalid date format (use YYYY-MM-DD)')
  .custom((value) => {
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    if (age < 18 || age > 120) {
      throw new Error('Age must be between 18 and 120 years');
    }
    return true;
  });

// Address validation
export const addressValidation = body('address')
  .optional()
  .trim()
  .isLength({ max: 255 })
  .withMessage('Address must not exceed 255 characters');

// City validation
export const cityValidation = body('city')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('City name must not exceed 100 characters');

// State validation
export const stateValidation = body('state')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('State name must not exceed 100 characters');

// Zip code validation
export const zipCodeValidation = body('zip_code')
  .optional()
  .trim()
  .matches(/^[0-9]{5,6}$/)
  .withMessage('Zip code must be 5-6 digits');

// Country validation
export const countryValidation = body('country')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('Country name must not exceed 100 characters');

// GSTIN validation (reusable from auth)
export const gstinValidation = body('gstin')
  .optional()
  .trim()
  .isLength({ min: 15, max: 15 })
  .withMessage('GSTIN must be exactly 15 characters')
  .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
  .withMessage('Invalid GSTIN format');

// First name validation
export const firstNameValidation = body('first_name')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('First name cannot be empty')
  .isLength({ min: 2, max: 50 })
  .withMessage('First name must be between 2 and 50 characters');

// Last name validation
export const lastNameValidation = body('last_name')
  .optional()
  .trim()
  .notEmpty()
  .withMessage('Last name cannot be empty')
  .isLength({ min: 2, max: 50 })
  .withMessage('Last name must be between 2 and 50 characters');

/**
 * Validation rule sets for specific endpoints
 */

// Update profile validation rules
export const updateProfileValidation = [
  firstNameValidation,
  lastNameValidation,
  gstinValidation,
  phoneValidation,
  dateOfBirthValidation,
  addressValidation,
  cityValidation,
  stateValidation,
  zipCodeValidation,
  countryValidation,
];

// Update onboarding status validation
export const updateOnboardingStatusValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'rejected'])
    .withMessage('Invalid status. Must be: pending, in_progress, completed, or rejected'),
  body('step')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Step must be an integer between 1 and 10'),
];

