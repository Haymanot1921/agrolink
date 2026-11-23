// server/src/database/seeders/003_admin_user.seeder.js
// Tables:
//   users (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     email VARCHAR(254) NOT NULL UNIQUE,
//     phone VARCHAR(20) NOT NULL UNIQUE,
//     full_name VARCHAR(120) NOT NULL,
//     password_hash VARCHAR(255) NOT NULL,
//     primary_role_id BIGINT UNSIGNED NOT NULL,   -- FK roles(id)
//     status ENUM('pending','active','suspended','deactivated','deleted') NOT NULL DEFAULT 'pending',
//     language CHAR(2) NOT NULL DEFAULT 'en',
//     is_email_verified TINYINT(1) DEFAULT 0,
//     is_phone_verified TINYINT(1) DEFAULT 0,
//     verification_status ENUM('unverified','pending','under_review','approved','rejected','additional_info_requested') DEFAULT 'unverified',
//     token_version INT NOT NULL DEFAULT 0,
//     last_login_at DATETIME NULL,
//     deleted_at DATETIME NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     INDEX (status), INDEX (primary_role_id)
//   );
//
//   user_roles (id, user_id, role_id, PRIMARY KEY(user_id, role_id), ...)
'use strict';

const bcrypt = require('bcryptjs');
const env = require('../../config/environment');
const { ROLES } = require('../../shared/constants/roles');

const SUPERADMIN = {
  email: process.env.SEED_SUPERADMIN_EMAIL || 'superadmin@agrolink.et',
  phone: process.env.SEED_SUPERADMIN_PHONE || '+251900000000',
  fullName: 'Super Administrator',
  password: process.env.SEED_SUPERADMIN_PASSWORD || 'ChangeMe#2026',
};

const ADMIN = {
  email: 'admin@agrolink.et',
  phone: '+251900000001',
  fullName: 'Platform Administrator',
  password: 'Admin#2026',
};

async function ensureAdmin({ pool, user, roleCode }) {
  const [roleRows] = await pool.query('SELECT id FROM roles WHERE code = ? LIMIT 1', [roleCode]);
  if (!roleRows.length) throw new Error(`Role '${roleCode}' not found — run 001_roles.seeder.js first`);
  const roleId = roleRows[0].id;

  // Idempotent: only inserts if the email doesn't already exist.
  // If it exists, we leave the password hash alone (no accidental reset).
  const passwordHash = bcrypt.hashSync(user.password, env.security.bcryptRounds);

  await pool.query(
    `INSERT INTO users
       (email, phone, full_name, password_hash, primary_role_id, status,
        language, is_email_verified, is_phone_verified, verification_status)
     VALUES (?, ?, ?, ?, ?, 'active', 'en', 1, 1, 'approved')
     ON DUPLICATE KEY UPDATE
       full_name = VALUES(full_name),
       primary_role_id = VALUES(primary_role_id),
       status = 'active',
       is_email_verified = 1,
       is_phone_verified = 1,
       verification_status = 'approved'`,
    [user.email, user.phone, user.fullName, passwordHash, roleId],
  );

  // Fetch the user id (inserted or pre-existing)
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [user.email]);
  const userId = rows[0].id;

  // Grant both primary_role and user_roles entry
  await pool.query(
    'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
    [userId, roleId],
  );

  return userId;
}

async function run({ pool }) {
  await ensureAdmin({ pool, user: SUPERADMIN, roleCode: ROLES.SUPER_ADMIN });
  await ensureAdmin({ pool, user: ADMIN, roleCode: ROLES.ADMIN });
}

module.exports = { run };