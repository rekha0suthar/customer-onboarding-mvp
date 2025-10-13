import User from '../models/User.model.js';
import Customer from '../models/Customer.model.js';
import pool from '../config/database.js';

class AdminController {
  /**
   * Get admin dashboard overview
   */
  async getOverview(req, res) {
    try {
      const stats = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users WHERE role = 'broker') as total_brokers,
          (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
          (SELECT COUNT(*) FROM customers) as total_customers,
          (SELECT COUNT(*) FROM documents) as total_documents,
          (SELECT COUNT(*) FROM onboarding_activities) as total_activities
      `);

      const recentUsers = await pool.query(`
        SELECT u.id, u.email, u.role, u.created_at,
               c.first_name, c.last_name
        FROM users u
        LEFT JOIN customers c ON c.user_id = u.id
        ORDER BY u.created_at DESC
        LIMIT 10
      `);

      res.json({
        message: 'Admin overview retrieved successfully',
        stats: stats.rows[0],
        recentUsers: recentUsers.rows,
      });
    } catch (error) {
      console.error('Admin overview error:', error);
      res.status(500).json({ error: 'Failed to fetch admin overview', details: error.message });
    }
  }

  /**
   * Get all users (with pagination)
   */
  async getAllUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      const role = req.query.role; // Optional filter by role

      let query = `
        SELECT u.id, u.email, u.role, u.created_at,
               c.id as customer_id, c.first_name, c.last_name, c.gstin
        FROM users u
        LEFT JOIN customers c ON c.user_id = u.id
      `;

      const params = [];
      if (role) {
        query += ` WHERE u.role = $1`;
        params.push(role);
        query += ` ORDER BY u.created_at DESC LIMIT $2 OFFSET $3`;
        params.push(limit, offset);
      } else {
        query += ` ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`;
        params.push(limit, offset);
      }

      const result = await pool.query(query, params);

      res.json({
        message: 'Users retrieved successfully',
        count: result.rows.length,
        users: result.rows,
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
  }

  /**
   * Promote/demote user role
   */
  async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      // Validate role
      if (!['broker', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "broker" or "admin"' });
      }

      // Prevent self-demotion
      if (parseInt(id) === req.user.userId && role === 'broker') {
        return res.status(400).json({ error: 'Cannot demote yourself from admin' });
      }

      const result = await pool.query(
        'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, role',
        [role, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: `User role updated to ${role} successfully`,
        user: result.rows[0],
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
  }

  /**
   * Get all customers (brokers' profiles)
   */
  async getAllCustomers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await pool.query(`
        SELECT c.*, u.email, u.role, u.created_at as user_created_at
        FROM customers c
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

      res.json({
        message: 'Customers retrieved successfully',
        count: result.rows.length,
        customers: result.rows,
      });
    } catch (error) {
      console.error('Get all customers error:', error);
      res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
    }
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(req, res) {
    try {
      const { id } = req.params;

      const result = await pool.query(`
        SELECT c.*, u.email, u.role, u.created_at as user_created_at
        FROM customers c
        JOIN users u ON c.user_id = u.id
        WHERE c.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      // Get customer's documents
      const documents = await pool.query(`
        SELECT id, document_type, document_name, verification_status, uploaded_at
        FROM documents
        WHERE customer_id = $1
        ORDER BY uploaded_at DESC
      `, [id]);

      // Get customer's activities
      const activities = await pool.query(`
        SELECT *
        FROM onboarding_activities
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 20
      `, [id]);

      res.json({
        message: 'Customer details retrieved successfully',
        customer: result.rows[0],
        documents: documents.rows,
        activities: activities.rows,
      });
    } catch (error) {
      console.error('Get customer by ID error:', error);
      res.status(500).json({ error: 'Failed to fetch customer details', details: error.message });
    }
  }
}

export default new AdminController();

