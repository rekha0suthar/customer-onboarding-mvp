const User = require('../models/User.model');
const Customer = require('../models/Customer.model');
const OnboardingActivity = require('../models/OnboardingActivity.model');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

class AuthController {
  async register(req, res) {
    try {
      const { email, password, first_name, last_name, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await User.create(email, passwordHash, 'customer');

      // Create customer profile
      const customer = await Customer.create(user.id, {
        first_name,
        last_name,
        phone: phone || null,
      });

      // Log onboarding activity
      await OnboardingActivity.create(
        customer.id,
        'REGISTRATION',
        'Customer registered successfully'
      );

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        customerId: customer.id,
      });

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        customer: {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          onboarding_status: customer.onboarding_status,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed', details: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Get customer profile
      const customer = await Customer.findByUserId(user.id);

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        customerId: customer ? customer.id : null,
      });

      // Log activity
      if (customer) {
        await OnboardingActivity.create(
          customer.id,
          'LOGIN',
          'Customer logged in'
        );
      }

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        customer: customer ? {
          id: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          onboarding_status: customer.onboarding_status,
          onboarding_step: customer.onboarding_step,
        } : null,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const customer = await Customer.findByUserId(user.id);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        customer: customer || null,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
  }
}

module.exports = new AuthController();

