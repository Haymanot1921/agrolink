// server/src/database/seeders/002_permissions.seeder.js
// Tables:
//   permissions (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     code VARCHAR(120) NOT NULL UNIQUE,       -- 'user.suspend', 'dispute.resolve', ...
//     description VARCHAR(500) NULL,
//     category VARCHAR(64) NULL,                -- 'user', 'dispute', 'assisted', ...
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
//
//   role_permissions (
//     role_id BIGINT UNSIGNED NOT NULL,
//     permission_id BIGINT UNSIGNED NOT NULL,
//     PRIMARY KEY (role_id, permission_id),
//     FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
//     FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
//   );
'use strict';

const {
  PERMISSIONS,
  PERMISSION_LIST,
  DEFAULT_ROLE_PERMISSIONS,
} = require('../../shared/constants/permissions');

function categoryFor(code) {
  const dot = code.indexOf('.');
  return dot > 0 ? code.slice(0, dot) : 'misc';
}

async function run({ pool }) {
  // 1. Upsert every permission
  const perms = PERMISSION_LIST.map((code) => [code, null, categoryFor(code)]);
  if (perms.length) {
    await pool.query(
      `INSERT INTO permissions (code, description, category)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         description = VALUES(description),
         category = VALUES(category)`,
      [perms],
    );
  }

  // 2. Load role ids
  const [roleRows] = await pool.query('SELECT id, code FROM roles');
  const roleIdByCode = new Map(roleRows.map((r) => [r.code, r.id]));

  // 3. Load permission ids
  const [permRows] = await pool.query('SELECT id, code FROM permissions');
  const permIdByCode = new Map(permRows.map((r) => [r.code, r.id]));

  // 4. Sync role → permission bundles for *system* roles (non-admin only).
  //    The `admin` and `super_admin` bundles are authoritative here; admins
  //    can add/remove custom role permissions via the admin UI but system
  //    role bundles are kept in sync with the code.
  const pairs = [];
  for (const [roleCode, permCodes] of Object.entries(DEFAULT_ROLE_PERMISSIONS)) {
    const roleId = roleIdByCode.get(roleCode);
    if (!roleId) continue;
    for (const code of permCodes) {
      const permId = permIdByCode.get(code);
      if (!permId) continue;
      pairs.push([roleId, permId]);
    }
  }

  if (pairs.length) {
    // mysql2 `INSERT IGNORE` is the simplest idempotent way for composite
    // primary key joins.
    // Chunk into groups of ~500 to avoid hitting parameter limits.
    for (let i = 0; i < pairs.length; i += 500) {
      const chunk = pairs.slice(i, i + 500);
      await pool.query(
        'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES ?',
        [chunk],
      );
    }
  }
}

module.exports = { run };