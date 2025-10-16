import { body } from 'express-validator';

/**
 * Validation rules for document routes
 */

// Document type validation
export const documentTypeValidation = body('document_type')
  .notEmpty()
  .withMessage('Document type is required')
  .isIn(['id_proof', 'address_proof', 'income_proof', 'photo', 'other'])
  .withMessage('Invalid document type. Must be: id_proof, address_proof, income_proof, photo, or other');

/**
 * Validation rule sets for specific endpoints
 */

// Upload document validation rules
export const uploadDocumentValidation = [
  documentTypeValidation,
];

// Update document verification status (admin only)
export const verifyDocumentValidation = [
  body('verification_status')
    .notEmpty()
    .withMessage('Verification status is required')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status. Must be: pending, approved, or rejected'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

