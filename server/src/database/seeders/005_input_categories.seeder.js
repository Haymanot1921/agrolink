// server/src/database/seeders/005_input_categories.seeder.js
// Table:
//   input_categories (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     slug VARCHAR(120) NOT NULL UNIQUE,          -- 'seed.cereal', 'fertilizer.organic', ...
//     group_code VARCHAR(32) NOT NULL,            -- 'seed', 'fertilizer', 'equipment', ...
//     name_en VARCHAR(160) NOT NULL,
//     name_am VARCHAR(160) NOT NULL,
//     is_restricted TINYINT(1) NOT NULL DEFAULT 0,
//     is_system TINYINT(1) NOT NULL DEFAULT 1,
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
'use strict';

const {
  INPUT_TYPES,
  INPUT_TYPE_LIST,
  groupFor,
  isRestricted,
} = require('../../shared/constants/inputTypes');

// Human labels — mirrored from the shared constants so the DB stays self-
// documenting. Add translations as needed via i18n at render time.
const LABELS = {
  'seed.cereal': { en: 'Cereal seeds', am: 'የእህል ዘር' },
  'seed.legume': { en: 'Legume seeds', am: 'የጥራጥሬ ዘር' },
  'seed.vegetable': { en: 'Vegetable seeds', am: 'የአትክልት ዘር' },
  'seed.fruit': { en: 'Fruit seeds', am: 'የፍራፍሬ ዘር' },
  'seed.oilseed': { en: 'Oilseed', am: 'የቅባት እህል' },
  'seed.root': { en: 'Root crop seeds', am: 'የስር ሰብል ዘር' },
  'seed.forage': { en: 'Forage seeds', am: 'የመኖ ዘር' },
  'seed.hybrid': { en: 'Hybrid seeds', am: 'የተዳቀለ ዘር' },
  'fertilizer.organic': { en: 'Organic fertilizer', am: 'ተፈጥሯዊ ማዳበሪያ' },
  'fertilizer.inorganic': { en: 'Inorganic fertilizer', am: 'ኬሚካል ማዳበሪያ' },
  'fertilizer.compost': { en: 'Compost', am: 'ኮምፖስት' },
  'protection.pesticide': { en: 'Pesticide', am: 'ፀረ-ተባይ' },
  'protection.herbicide': { en: 'Herbicide', am: 'ፀረ-አረም' },
  'protection.fungicide': { en: 'Fungicide', am: 'ፀረ-ፈንገስ' },
  'protection.insecticide': { en: 'Insecticide', am: 'ፀረ-ተባይ ኬሚካል' },
  'livestock.feed': { en: 'Animal feed', am: 'የእንስሳት መኖ' },
  'livestock.vet_medicine': { en: 'Veterinary medicine', am: 'የእንስሳት መድሃኒት' },
  'livestock.vaccine': { en: 'Vaccine', am: 'ክትባት' },
  'equipment.hand_tool': { en: 'Hand tools', am: 'የእጅ መሳሪያዎች' },
  'equipment.irrigation': { en: 'Irrigation equipment', am: 'የመስኖ መሳሪያ' },
  'equipment.sprayer': { en: 'Sprayer', am: 'ማስፈንጠሪያ' },
  'equipment.tractor_attachment': { en: 'Tractor attachment', am: 'የትራክተር መለዋወጫ' },
  'equipment.harvest': { en: 'Harvest equipment', am: 'የመኸር መሳሪያ' },
  'equipment.storage': { en: 'Storage equipment', am: 'የማከማቻ መሳሪያ' },
  'equipment.processing': { en: 'Processing equipment', am: 'የማቀነባበሪያ መሳሪያ' },
  'other.packaging': { en: 'Packaging', am: 'ማሸጊያ' },
  'other': { en: 'Other', am: 'ሌላ' },
};

async function run({ pool }) {
  const rows = INPUT_TYPE_LIST.map((type, idx) => {
    const labels = LABELS[type] || { en: type, am: type };
    return [
      type,
      groupFor(type),
      labels.en,
      labels.am,
      isRestricted(type) ? 1 : 0,
      1,
      1,
      idx + 1,
    ];
  });

  if (!rows.length) return;

  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    await pool.query(
      `INSERT INTO input_categories
         (slug, group_code, name_en, name_am, is_restricted, is_system, is_active, sort_order)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         group_code = VALUES(group_code),
         name_en = VALUES(name_en),
         name_am = VALUES(name_am),
         is_restricted = VALUES(is_restricted),
         is_system = VALUES(is_system),
         sort_order = VALUES(sort_order)`,
      [chunk],
    );
  }
}

module.exports = { run };