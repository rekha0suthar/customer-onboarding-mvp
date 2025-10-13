import express from 'express';
import { body } from 'express-validator';
import documentController from '../controllers/document.controller.js';
import validate from '../middleware/validation.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Upload document
router.post(
  '/upload',
  upload.single('document'),
  [
    body('document_type')
      .notEmpty()
      .withMessage('Document type is required')
      .isIn(['id_proof', 'address_proof', 'income_proof', 'photo', 'other'])
      .withMessage('Invalid document type'),
  ],
  validate,
  documentController.uploadDocument
);

// Get all documents for current user
router.get('/', documentController.getDocuments);

// Get specific document
router.get('/:id', documentController.getDocument);

// Download document
router.get('/:id/download', documentController.downloadDocument);

// Delete document
router.delete('/:id', documentController.deleteDocument);

export default router;
