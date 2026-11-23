// server/src/database/seeders/001_roles.seeder.js
// Table contract (from migrations):
//   roles (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     code VARCHAR(64) NOT NULL UNIQUE,        -- 'admin', 'farmer', ...
//     name VARCHAR(120) NOT NULL,
//     description VARCHAR(500) NULL,
//     is_system TINYINT(1) NOT NULL DEFAULT 0,
//     is_assignable TINYINT(1) NOT NULL DEFAULT 1,
//     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   );
'use strict';

const { ROLES, ROLE_LIST, INTERNAL_ROLES } = require('../../shared/constants/roles');

const ROLE_META = {
  [ROLES.BUYER]: { name: 'Buyer', description: 'Purchases produce and services from the marketplace.' },
  [ROLES.FARMER]: { name: 'Farmer', description: 'Lists produce and manages orders as a seller.' },
  [ROLES.EXPERT]: { name: 'Agricultural Expert', description: 'Provides paid consultations to buyers and farmers.' },
  [ROLES.SERVICE_PROVIDER]: { name: 'Service Provider', description: 'Sells agricultural inputs, tools, and equipment.' },
  [ROLES.SUPPORT_AGENT]: { name: 'Support Agent', description: 'Assists farmers in low-connectivity settings on their behalf.' },
  [ROLES.ADMIN]: { name: 'Administrator', description: 'Manages platform operations and moderation.' },
  [ROLES.SUPER_ADMIN]: { name: 'Super Administrator', description: 'Full platform access, including privileged configuration.' },
};

async function run({ pool }) {
  const now = ROLE_LIST.map((code) => {
    const meta = ROLE_META[code] || { name: code, description: null };
    const internal = INTERNAL_ROLES.includes(code);
    return [
      code,
      meta.name,
      meta.description,
      1,                     // is_system — all seven are system roles
      internal ? 0 : 1,      // is_assignable — internal roles not self-assignable
    ];
  });

  await pool.query(
    `INSERT INTO roles (code, name, description, is_system, is_assignable)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       description = VALUES(description),
       is_system = VALUES(is_system),
       is_assignable = VALUES(is_assignable)`,
    [now],
  );
}

module.exports = { run };