// mobile/scripts/verify-assets.js
// Verifies every asset required by assets.ts actually exists on disk.
// Run via: npm run assets:verify (or in CI before eas build).

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.resolve(__dirname, '..', 'assets');
const ASSETS_TS = path.join(ASSETS_DIR, 'assets.ts');

const EXPECTED = [
  // fonts
  'fonts/NotoSans-Regular.ttf',
  'fonts/NotoSans-Bold.ttf',
  'fonts/NotoSansEthiopic-Regular.ttf',
  'fonts/NotoSansEthiopic-Bold.ttf',
  // icons
  'icons/app-icon.png',
  'icons/adaptive-icon.png',
  'icons/splash.png',
  'icons/notification-icon.png',
  'icons/cart-badge.png',
  // actor icons
  'icons/actors/farmer.png',
  'icons/actors/buyer.png',
  'icons/actors/input-supplier.png',
  'icons/actors/agricultural-expert.png',
  'icons/actors/support-agent.png',
  'icons/actors/administrator.png',
  // map + lottie
  'map-style.json',
  'lottie/loading.json',
  'lottie/success.json',
  'lottie/empty.json',
  'lottie/empty-cart.json',
  'lottie/payment-processing.json',
  'lottie/weather-sunny.json',
];

const missing = EXPECTED.filter((relPath) => !fs.existsSync(path.join(ASSETS_DIR, relPath)));

if (!fs.existsSync(ASSETS_TS)) {
  console.error('❌ Missing assets.ts registry file');
  process.exit(1);
}

if (missing.length > 0) {
  console.error(`❌ Missing ${missing.length} asset(s):`);
  missing.forEach((m) => console.error(`   - ${m}`));
  process.exit(1);
}

console.log(`✅ All ${EXPECTED.length} assets present.`);