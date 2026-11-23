// server/src/database/seeders/004_product_categories.seeder.js
// Table:
//   product_categories (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     slug VARCHAR(80) NOT NULL UNIQUE,          -- 'teff', 'wheat', ...
//     group_code VARCHAR(32) NOT NULL,            -- 'cereal', 'vegetable', ...
//     name_en VARCHAR(120) NOT NULL,
//     name_am VARCHAR(120) NOT NULL,
//     is_system TINYINT(1) NOT NULL DEFAULT 1,
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
'use strict';

const {
  CROP_TYPES,
  CROP_TYPE_LIST,
  groupFor,
  nameFor,
} = require('../../shared/constants/cropTypes');

async function run({ pool }) {
  const rows = CROP_TYPE_LIST.map((crop, idx) => [
    crop,
    groupFor(crop),
    nameFor(crop, 'en'),
    nameFor(crop, 'am'),
    1,        // is_system
    1,        // is_active
    idx + 1,  // sort_order — deterministic
  ]);

  if (!rows.length) return;

  // Chunk to stay under max packet size on MySQL.
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    await pool.query(
      `INSERT INTO product_categories
         (slug, group_code, name_en, name_am, is_system, is_active, sort_order)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         group_code = VALUES(group_code),
         name_en = VALUES(name_en),
         name_am = VALUES(name_am),
         is_system = VALUES(is_system),
         sort_order = VALUES(sort_order)`,
      [chunk],
    );
  }
}

module.exports = { run };