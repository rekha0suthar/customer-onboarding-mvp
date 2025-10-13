#!/usr/bin/env node
/**
 * Migration script to update roles from VARCHAR to ENUM
 */

import pool from '../config/database.js';

async function migrateRoles() {
  try {
    console.log('🔄 Starting role migration...\n');

    // Step 1: Create the enum type
    console.log('1️⃣ Creating user_role enum type...');
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('broker', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
    console.log('✅ Enum type created or already exists\n');

    // Step 2: Update existing customer roles to broker
    console.log('2️⃣ Updating existing "customer" roles to "broker"...');
    const updateResult = await pool.query(`
      UPDATE users 
      SET role = 'broker' 
      WHERE role = 'customer'
    `);
    console.log(`✅ Updated ${updateResult.rowCount} user(s)\n`);

    // Step 3: Drop existing default
    console.log('3️⃣ Dropping existing default...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN role DROP DEFAULT
    `);
    console.log('✅ Default dropped\n');

    // Step 4: Alter the column type
    console.log('4️⃣ Converting role column from VARCHAR to ENUM...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN role TYPE user_role 
      USING role::user_role
    `);
    console.log('✅ Column type converted successfully\n');

    // Step 5: Set default
    console.log('5️⃣ Setting default role to "broker"...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN role SET DEFAULT 'broker'::user_role
    `);
    console.log('✅ Default role set\n');

    // Step 6: Make it NOT NULL
    console.log('6️⃣ Making role column NOT NULL...');
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN role SET NOT NULL
    `);
    console.log('✅ Role column is now NOT NULL\n');

    // Verify
    const result = await pool.query(`
      SELECT column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'role'
    `);

    console.log('📋 Final schema for role column:');
    console.log(result.rows[0]);
    console.log('\n✅ Role migration completed successfully!');
    console.log('   All users with role="customer" are now "broker"');
    console.log('   Role column is now user_role ENUM NOT NULL DEFAULT \'broker\'\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateRoles();

