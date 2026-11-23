// server/src/database/seeders/006_specializations.seeder.js
// Tables:
//   specializations (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     slug VARCHAR(80) NOT NULL UNIQUE,
//     name_en VARCHAR(160) NOT NULL,
//     name_am VARCHAR(160) NOT NULL,
//     is_system TINYINT(1) NOT NULL DEFAULT 1,
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
//   user_specializations (user_id, specialization_id, PRIMARY KEY(user_id, specialization_id));
//
// These are sub-areas within provider types (agronomy, veterinary, etc.) used
// by expert profiles and by the buyer-side expert directory filter.
'use strict';

const SPECIALIZATIONS = [
  { slug: 'crop-production', en: 'Crop Production', am: 'የሰብል ምርት' },
  { slug: 'soil-fertility', en: 'Soil Fertility', am: 'የአፈር ለምነት' },
  { slug: 'pest-management', en: 'Pest Management', am: 'የተባይ አስተዳደር' },
  { slug: 'irrigation', en: 'Irrigation', am: 'መስኖ' },
  { slug: 'post-harvest', en: 'Post-Harvest Handling', am: 'ከመኸር በኋላ አያያዝ' },
  { slug: 'livestock-health', en: 'Livestock Health', am: 'የእንስሳት ጤና' },
  { slug: 'animal-nutrition', en: 'Animal Nutrition', am: 'የእንስሳት አመጋገብ' },
  { slug: 'dairy-production', en: 'Dairy Production', am: 'የወተት ምርት' },
  { slug: 'poultry', en: 'Poultry', am: 'የዶሮ እርባታ' },
  { slug: 'apiculture', en: 'Apiculture', am: 'የንብ እርባታ' },
  { slug: 'horticulture', en: 'Horticulture', am: 'የአትክልትና ፍራፍሬ' },
  { slug: 'agroforestry', en: 'Agroforestry', am: 'የደንና እርሻ ውህደት' },
  { slug: 'coffee-quality', en: 'Coffee Quality', am: 'የቡና ጥራት' },
  { slug: 'seed-production', en: 'Seed Production', am: 'የዘር ምርት' },
  { slug: 'market-access', en: 'Market Access & Value Chain', am: 'የገበያ ተደራሽነት' },
];

async function run({ pool }) {
  const rows = SPECIALIZATIONS.map((s, idx) => [
    s.slug,
    s.en,
    s.am,
    1,
    1,
    idx + 1,
  ]);

  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    await pool.query(
      `INSERT INTO specializations (slug, name_en, name_am, is_system, is_active, sort_order)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         name_en = VALUES(name_en),
         name_am = VALUES(name_am),
         is_system = VALUES(is_system),
         sort_order = VALUES(sort_order)`,
      [chunk],
    );
  }
}

module.exports = { run };