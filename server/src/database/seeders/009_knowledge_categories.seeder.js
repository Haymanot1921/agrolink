// server/src/database/seeders/009_knowledge_categories.seeder.js
// Table:
//   knowledge_categories (
//     id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
//     slug VARCHAR(80) NOT NULL UNIQUE,
//     name_en VARCHAR(160) NOT NULL,
//     name_am VARCHAR(160) NOT NULL,
//     description_en VARCHAR(500) NULL,
//     description_am VARCHAR(500) NULL,
//     is_system TINYINT(1) NOT NULL DEFAULT 1,
//     is_active TINYINT(1) NOT NULL DEFAULT 1,
//     sort_order INT NOT NULL DEFAULT 0,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//   );
//
// Educational articles (SRS §5.10) reference these categories.
'use strict';

const CATEGORIES = [
  { slug: 'crop-management', en: 'Crop Management', am: 'የሰብል አስተዳደር' },
  { slug: 'livestock', en: 'Livestock', am: 'እንስሳት' },
  { slug: 'soil-and-water', en: 'Soil & Water', am: 'አፈርና ውሃ' },
  { slug: 'pest-and-disease', en: 'Pest & Disease', am: 'ተባይና በሽታ' },
  { slug: 'post-harvest', en: 'Post-Harvest', am: 'ከመኸር በኋላ' },
  { slug: 'market-and-business', en: 'Market & Business', am: 'ገበያና ንግድ' },
  { slug: 'climate-smart', en: 'Climate-Smart Agriculture', am: 'የአየር ንብረት ተስማሚ እርሻ' },
  { slug: 'coffee', en: 'Coffee', am: 'ቡና' },
  { slug: 'beekeeping', en: 'Beekeeping', am: 'የንብ እርባታ' },
  { slug: 'financial-literacy', en: 'Financial Literacy', am: 'የፋይናንስ እውቀት' },
  { slug: 'policy-and-regulation', en: 'Policy & Regulation', am: 'ፖሊሲና ደንብ' },
  { slug: 'general', en: 'General', am: 'አጠቃላይ' },
];

async function run({ pool }) {
  const rows = CATEGORIES.map((c, idx) => [
    c.slug,
    c.en,
    c.am,
    null,       // description_en
    null,       // description_am
    1,          // is_system
    1,          // is_active
    idx + 1,
  ]);

  await pool.query(
    `INSERT INTO knowledge_categories
       (slug, name_en, name_am, description_en, description_am, is_system, is_active, sort_order)
     VALUES ?
     ON DUPLICATE KEY UPDATE
       name_en = VALUES(name_en),
       name_am = VALUES(name_am),
       is_system = VALUES(is_system),
       sort_order = VALUES(sort_order)`,
    [rows],
  );
}

module.exports = { run };