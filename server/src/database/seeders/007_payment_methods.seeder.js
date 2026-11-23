// server/src/database/seeders/007_payment_methods.seeder.js
// Table:
//   payment_methods (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     code VARCHAR(40) NOT NULL UNIQUE,            -- 'telebirr', 'cbe_birr', 'cash_on_record'
//     name_en VARCHAR(120) NOT NULL,
//     name_am VARCHAR(120) NOT NULL,
//     provider VARCHAR(40) NOT NULL,                -- normalized provider key
//     is_record_only TINYINT(1) NOT NULL DEFAULT 1, -- SRS §13.1: record-only in first release
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
'use strict';

const { PAYMENT_METHODS, PAYMENT_METHOD_LIST } = require('../../shared/constants/paymentStatuses');

const METHOD_META = {
  [PAYMENT_METHODS.TELEBIRR]: {
    en: 'Telebirr', am: 'ቴሌብር', provider: 'telebirr',
  },
  [PAYMENT_METHODS.CBE_BIRR]: {
    en: 'CBE Birr', am: 'ሲቢኢ ብር', provider: 'cbe_birr',
  },
  [PAYMENT_METHODS.CASH_ON_RECORD]: {
    en: 'Cash (record only)', am: 'ጥሬ ገንዘብ (በመዝገብ ብቻ)', provider: 'cash',
  },
};

async function run({ pool }) {
  const rows = PAYMENT_METHOD_LIST.map((code, idx) => {
    const meta = METHOD_META[code] || { en: code, am: code, provider: code };
    return [
      code,
      meta.en,
      meta.am,
      meta.provider,
      1,          // is_record_only — always 1 in first release
      1,          // is_active
      idx + 1,
    ];
  });

  await pool.query(
    `INSERT INTO payment_methods
       (code, name_en, name_am, provider, is_record_only, is_active, sort_order)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       name_en = VALUES(name_en),
       name_am = VALUES(name_am),
       provider = VALUES(provider),
       is_record_only = VALUES(is_record_only),
       sort_order = VALUES(sort_order)`,
    [rows],
  );
}

module.exports = { run };