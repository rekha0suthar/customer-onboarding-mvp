import pool from './../config/database.js';

class User {
  static async create(email, passwordHash, role = 'broker') {
    const query = `
      INSERT INTO users (email, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role, created_at
    `;
    const result = await pool.query(query, [email, passwordHash, role]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updatePassword(id, newPasswordHash) {
    const query = `
      UPDATE users 
      SET password_hash = $1
      WHERE id = $2
      RETURNING id, email, role
    `;
    const result = await pool.query(query, [newPasswordHash, id]);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}

export default User;

