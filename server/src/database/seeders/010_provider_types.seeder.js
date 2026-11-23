// server/src/database/seeders/010_provider_types.seeder.js
// Table:
//   provider_types (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     code VARCHAR(64) NOT NULL UNIQUE,             -- 'agronomy_expert', ...
//     name_en VARCHAR(160) NOT NULL,
//     name_am VARCHAR(160) NOT NULL,
//     role_scope ENUM('expert','service_provider','both') NOT NULL DEFAULT 'both',
//     is_system TINYINT(1) NOT NULL DEFAULT 1,
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
'use strict';

const { PROVIDER_TYPES, PROVIDER_TYPE_LIST } = require('../../shared/constants/providerTypes');

const META = {
  [PROVIDER_TYPES.INPUT_SUPPLIER]: {
    en: 'Input Supplier', am: 'የግብዓት አቅራቢ', roleScope: 'service_provider',
  },
  [PROVIDER_TYPES.EQUIPMENT_SUPPLIER]: {
    en: 'Equipment Supplier', am: 'የመሳሪያ አቅራቢ', roleScope: 'service_provider',
  },
  [PROVIDER_TYPES.AGRONOMY_EXPERT]: {
    en: 'Agronomy Expert', am: 'የግብርና ባለሙያ', roleScope: 'expert',
  },
  [PROVIDER_TYPES.VETERINARY_EXPERT]: {
    en: 'Veterinary Expert', am: 'የእንስሳት ህክምና ባለሙያ', roleScope: 'expert',
  },
  [PROVIDER_TYPES.SOIL_SPECIALIST]: {
    en: 'Soil Specialist', am: 'የአፈር ባለሙያ', roleScope: 'expert',
  },
  [PROVIDER_TYPES.IRRIGATION_SPECIALIST]: {
    en: 'Irrigation Specialist', am: 'የመስኖ ባለሙያ', roleScope: 'expert',
  },
  [PROVIDER_TYPES.LOGISTICS_AGGREGATOR]: {
    en: 'Logistics Aggregator', am: 'የሎጂስቲክስ አስተባባሪ', roleScope: 'service_provider',
  },
};

async function run({ pool }) {
  const rows = PROVIDER_TYPE_LIST.map((code, idx) => {
    const m = META[code] || { en: code, am: code, roleScope: 'both' };
    return [
      code,
      m.en,
      m.am,
      m.roleScope,
      1,          // is_system
      1,          // is_active
      idx + 1,
    ];
  });

  await pool.query(
    `INSERT INTO provider_types
       (code, name_en, name_am, role_scope, is_system, is_active, sort_order)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       name_en = VALUES(name_en),
       name_am = VALUES(name_am),
       role_scope = VALUES(role_scope),
       is_system = VALUES(is_system),
       sort_order = VALUES(sort_order)`,
    [rows],
  );
}

module.exports = { run };