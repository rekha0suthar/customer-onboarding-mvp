import { body, param, query } from 'express-validator';

/**
 * Validation rules for admin routes
 */

// User role validation
export const userRoleValidation = body('role')
  .notEmpty()
  .withMessage('Role is required')
  .isIn(['broker', 'admin'])
  .withMessage('Invalid role. Must be: broker or admin');

// User ID parameter validation
export const userIdParamValidation = param('id')
  .isInt({ min: 1 })
  .withMessage('Invalid user ID');

// Customer ID parameter validation
export const customerIdParamValidation = param('id')
  .isInt({ min: 1 })
  .withMessage('Invalid customer ID');

// Document ID parameter validation
export const documentIdParamValidation = param('id')
  .isInt({ min: 1 })
  .withMessage('Invalid document ID');

// Pagination query validation
export const paginationValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer')
    .toInt(),
];

// Role filter validation
export const roleFilterValidation = query('role')
  .optional()
  .isIn(['broker', 'admin'])
  .withMessage('Invalid role filter. Must be: broker or admin');

/**
 * Validation rule sets for specific endpoints
 */

// Update user role validation
export const updateUserRoleValidation = [
  userIdParamValidation,
  userRoleValidation,
];

// Get all users validation
export const getAllUsersValidation = [
  ...paginationValidation,
  roleFilterValidation,
];

// Get customer by ID validation
export const getCustomerByIdValidation = [
  customerIdParamValidation,
];

// Update customer status validation
export const updateCustomerStatusValidation = [
  customerIdParamValidation,
  body('onboarding_status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed', 'rejected'])
    .withMessage('Invalid status'),
  body('onboarding_step')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Step must be between 1 and 10'),
];

