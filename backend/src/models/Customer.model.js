const pool = require('../config/database');

class Customer {
  static async create(userId, profileData) {
    const {
      first_name,
      last_name,
      phone = null,
      date_of_birth = null,
      address = null,
      city = null,
      state = null,
      zip_code = null,
      country = null,
    } = profileData;

    const query = `
      INSERT INTO customers (
        user_id, first_name, last_name, phone, date_of_birth,
        address, city, state, zip_code, country
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      userId, first_name, last_name, phone, date_of_birth,
      address, city, state, zip_code, country
    ]);
    
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM customers WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, profileData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build update query
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && key !== 'id' && key !== 'user_id') {
        fields.push(`${key} = $${paramCount}`);
        values.push(profileData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE customers 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateOnboardingStatus(id, status, step) {
    const query = `
      UPDATE customers 
      SET onboarding_status = $1, onboarding_step = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, step, id]);
    return result.rows[0];
  }

  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT c.*, u.email 
      FROM customers c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

module.exports = Customer;

