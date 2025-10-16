import Document from '../models/Document.model.js';
import Customer from '../models/Customer.model.js';
import OnboardingActivity from '../models/OnboardingActivity.model.js';

class DocumentController {
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { document_type } = req.body;

      if (!document_type) {
        return res.status(400).json({ error: 'Document type is required' });
      }

      // Get customer
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      // Create document record
      const document = await Document.create(customer.id, {
        document_type,
        document_name: req.file.originalname,
        file_content: req.file.buffer, // Binary data from memory storage
        file_size: req.file.size,
        mime_type: req.file.mimetype,
      });

      // Log activity
      await OnboardingActivity.create(
        customer.id,
        'DOCUMENT_UPLOAD',
        `Uploaded document: ${document_type}`
      );

      res.status(201).json({
        message: 'Document uploaded successfully',
        document: {
          id: document.id,
          document_type: document.document_type,
          document_name: document.document_name,
          file_size: document.file_size,
          verification_status: document.verification_status,
          uploaded_at: document.uploaded_at,
        },
      });
    } catch (error) {
      console.error('Upload document error:', error);
      res.status(500).json({ error: 'Failed to upload document', details: error.message });
    }
  }

  async getDocuments(req, res) {
    try {
      const customer = await Customer.findByUserId(req.user.userId);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer profile not found' });
      }

      const documents = await Document.findByCustomerId(customer.id);

      res.json({
        message: 'Documents retrieved successfully',
        count: documents.length,
        documents: documents.map(doc => ({
          id: doc.id,
          document_type: doc.document_type,
          document_name: doc.document_name,
          file_size: doc.file_size,
          mime_type: doc.mime_type,
          verification_status: doc.verification_status,
          uploaded_at: doc.uploaded_at,
          verified_at: doc.verified_at,
          notes: doc.notes,
        })),
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to fetch documents', details: error.message });
    }
  }

  async getDocument(req, res) {
    try {
      const { id } = req.params;
      
      const document = await Document.findById(id);
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Verify ownership
      const customer = await Customer.findByUserId(req.user.userId);
      if (!customer || document.customer_id !== customer.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({
        message: 'Document retrieved successfully',
        document: {
          id: document.id,
          document_type: document.document_type,
          document_name: document.document_name,
          file_size: document.file_size,
          mime_type: document.mime_type,
          verification_status: document.verification_status,
          uploaded_at: document.uploaded_at,
          verified_at: document.verified_at,
          notes: document.notes,
        },
      });
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({ error: 'Failed to fetch document', details: error.message });
    }
  }

  async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      
      const document = await Document.findById(id);
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Verify ownership
      const customer = await Customer.findByUserId(req.user.userId);
      if (!customer || document.customer_id !== customer.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Delete from database (file content is stored in DB)
      await Document.deleteById(id);

      // Log activity
      await OnboardingActivity.create(
        customer.id,
        'DOCUMENT_DELETE',
        `Deleted document: ${document.document_type}`
      );

      res.json({
        message: 'Document deleted successfully',
      });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Failed to delete document', details: error.message });
    }
  }

  async downloadDocument(req, res) {
    try {
      const { id } = req.params;
      
      const document = await Document.findById(id);
      
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Verify ownership
      const customer = await Customer.findByUserId(req.user.userId);
      if (!customer || document.customer_id !== customer.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get file content from database
      const fileContent = await Document.getFileContent(id);
      
      if (!fileContent) {
        return res.status(404).json({ error: 'File content not found' });
      }

      // Set headers for file download
      res.setHeader('Content-Type', document.mime_type);
      res.setHeader('Content-Disposition', `attachment; filename="${document.document_name}"`);
      res.setHeader('Content-Length', document.file_size);

      // Send file content as buffer
      res.send(fileContent);
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({ error: 'Failed to download document', details: error.message });
    }
  }
}

export default new DocumentController();

