import User from '../models/User.model.js';
import Customer from '../models/Customer.model.js';
import OnboardingActivity from '../models/OnboardingActivity.model.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';

class AuthController {
  async register(req, res) {
    try {
      const { email, password, first_name, last_name, gstin } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const passwordHash = await hashPassword(password);

      const user = await User.create(email, passwordHash, 'broker');

      let customer;
      try {
        customer = await Customer.create(user.id, {
          first_name,
          last_name,
          gstin: gstin || null,
        });
      } catch (profileError) {
        await User.deleteById(user.id);
        
        if (profileError.code === '23505' && profileError.constraint === 'customers_gstin_key') {
          return res.status(400).json({ error: 'GSTIN number already registered' });
        }
        throw profileError;
      }

      await OnboardingActivity.create(
        customer.id,
        'REGISTRATION',
        'Customer registered successfully'
      );

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

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const customer = await Customer.findByUserId(user.id);

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        customerId: customer ? customer.id : null,
      });

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

export default new AuthController();

