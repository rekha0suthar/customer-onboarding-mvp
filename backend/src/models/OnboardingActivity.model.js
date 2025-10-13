const pool = require('../config/database');

class OnboardingActivity {
  static async create(customerId, activityType, activityDescription) {
    const query = `
      INSERT INTO onboarding_activities (
        customer_id, activity_type, activity_description
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      customerId, activityType, activityDescription
    ]);
    
    return result.rows[0];
  }

  static async findByCustomerId(customerId, limit = 50) {
    const query = `
      SELECT * FROM onboarding_activities 
      WHERE customer_id = $1 
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [customerId, limit]);
    return result.rows;
  }

  static async getAll(limit = 100, offset = 0) {
    const query = `
      SELECT oa.*, c.first_name, c.last_name, u.email 
      FROM onboarding_activities oa
      JOIN customers c ON oa.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      ORDER BY oa.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

module.exports = OnboardingActivity;

