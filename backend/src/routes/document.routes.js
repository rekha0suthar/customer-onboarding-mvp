const express = require('express');
const { body } = require('express-validator');
const documentController = require('../controllers/document.controller');
const validate = require('../middleware/validation.middleware');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

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

module.exports = router;

