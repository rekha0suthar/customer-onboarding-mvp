import jwt from 'jsonwebtoken';
import { secret as JWT_SECRET } from '../config/jwt.js';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user has required role(s)
 * Usage: requireRole('admin') or requireRole('admin', 'broker')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - No user context' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions',
        required: roles,
        current: req.user.role 
      });
    }

    next();
  };
};

/**
 * Convenience: Admin-only middleware
 */
export const requireAdmin = requireRole('admin');

/**
 * Convenience: Broker or Admin middleware
 */
export const requireBrokerOrAdmin = requireRole('broker', 'admin');

