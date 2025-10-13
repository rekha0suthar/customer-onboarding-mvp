const pool = require('../config/database');

class Document {
  static async create(customerId, documentData) {
    const {
      document_type,
      document_name,
      file_path,
      file_size,
      mime_type,
    } = documentData;

    const query = `
      INSERT INTO documents (
        customer_id, document_type, document_name, 
        file_path, file_size, mime_type
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      customerId, document_type, document_name,
      file_path, file_size, mime_type
    ]);
    
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM documents WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCustomerId(customerId) {
    const query = `
      SELECT * FROM documents 
      WHERE customer_id = $1 
      ORDER BY uploaded_at DESC
    `;
    const result = await pool.query(query, [customerId]);
    return result.rows;
  }

  static async updateVerificationStatus(id, status, notes = null) {
    const query = `
      UPDATE documents 
      SET verification_status = $1, 
          verified_at = CURRENT_TIMESTAMP,
          notes = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, notes, id]);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM documents WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT d.*, c.first_name, c.last_name 
      FROM documents d
      JOIN customers c ON d.customer_id = c.id
      ORDER BY d.uploaded_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

module.exports = Document;

