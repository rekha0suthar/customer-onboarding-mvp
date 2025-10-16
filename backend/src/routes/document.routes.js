import express from 'express';
import documentController from '../controllers/document.controller.js';
import validate from '../middleware/validation.middleware.js';
import { requireAuth } from '../middleware/rbac.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { uploadDocumentValidation } from '../validators/document.validators.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Upload document
router.post(
  '/upload',
  upload.single('document'),
  uploadDocumentValidation,
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
