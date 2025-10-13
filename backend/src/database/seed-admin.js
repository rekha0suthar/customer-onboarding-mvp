#!/usr/bin/env node
/**
 * Seed script to create the first admin user
 * Usage: node src/database/seed-admin.js [email] [password]
 * Or set ADMIN_EMAIL and ADMIN_PASSWORD env vars
 */

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

dotenv.config();

const createAdmin = async (email, password) => {
  try {
    console.log('🔐 Creating admin user...\n');

    // Get email and password from args or env
    const adminEmail = email || process.env.ADMIN_EMAIL;
    const adminPassword = password || process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('❌ Error: Email and password required');
      console.log('Usage:');
      console.log('  node src/database/seed-admin.js <email> <password>');
      console.log('  OR set ADMIN_EMAIL and ADMIN_PASSWORD env vars');
      process.exit(1);
    }

    // Check if admin already exists
    const existing = await pool.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.role === 'admin') {
        console.log(`✅ Admin user already exists: ${user.email} (ID: ${user.id})`);
        console.log('   No changes made.\n');
        process.exit(0);
      } else {
        // Promote existing user to admin
        await pool.query(
          'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          ['admin', user.id]
        );
        console.log(`✅ Existing user promoted to admin: ${user.email} (ID: ${user.id})\n`);
        process.exit(0);
      }
    }

    // Hash password
    console.log('⏳ Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    console.log('✅ Password hashed\n');

    // Create admin user
    console.log('📝 Creating admin user in database...');
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, email, role, created_at`,
      [adminEmail, passwordHash, 'admin']
    );

    const admin = result.rows[0];

    console.log('\n✅ Admin user created successfully!\n');
    console.log('📋 Admin User Details:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}\n`);

    console.log('🔑 Login Credentials:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}\n`);

    console.log('🌐 Admin can access:');
    console.log(`   - GET  /api/admin/overview`);
    console.log(`   - GET  /api/admin/users`);
    console.log(`   - PUT  /api/admin/users/:id/role`);
    console.log(`   - GET  /api/admin/customers`);
    console.log(`   - GET  /api/admin/customers/:id\n`);

    console.log('⚠️  IMPORTANT: Change your password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Get args from command line
const [,, email, password] = process.argv;

createAdmin(email, password);

