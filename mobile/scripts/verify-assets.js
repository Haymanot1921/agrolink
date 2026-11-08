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
  'icons/favicon.png',
  'icons/cart-badge.png',
  // actor icons
  'icons/actors/farmer.png',
  'icons/actors/buyer.png',
  'icons/actors/input-supplier.png',
  'icons/actors/agricultural-expert.png',
  'icons/actors/support-agent.png',
  'icons/actors/administrator.png',
  // images
  'images/marketplace/hero-marketplace.jpg',
  'images/marketplace/banner-fresh-produce.jpg',
  'images/marketplace/banner-support-local.jpg',
  'images/marketplace/category-default.jpg',
  'images/marketplace/search-empty.png',
  'images/products/placeholder-product.png',
  'images/products/teff.jpg',
  'images/products/wheat.jpg',
  'images/products/maize.jpg',
  'images/products/coffee.jpg',
  'images/products/sesame.jpg',
  'images/products/beans.jpg',
  'images/products/vegetables.jpg',
  'images/farms/farm-hero.jpg',
  'images/farms/farm-smallholder.jpg',
  'images/farms/farm-commercial.jpg',
  'images/farms/farm-placeholder.png',
  'images/crops/crop-teff.png',
  'images/crops/crop-wheat.png',
  'images/crops/crop-maize.png',
  'images/crops/crop-sorghum.png',
  'images/crops/crop-coffee.png',
  'images/crops/crop-barley.png',
  'images/weather/sunny.png',
  'images/weather/cloudy.png',
  'images/weather/rainy.png',
  'images/weather/stormy.png',
  'images/weather/windy.png',
  'images/weather/partly-cloudy.png',
  'images/agricultural-inputs/hero-inputs.jpg',
  'images/agricultural-inputs/seeds.jpg',
  'images/agricultural-inputs/fertilizer.jpg',
  'images/agricultural-inputs/pesticide.jpg',
  'images/agricultural-inputs/tools.jpg',
  'images/agricultural-inputs/equipment.jpg',
  'images/agricultural-inputs/placeholder-input.png',
  'images/consultations/hero-consultation.jpg',
  'images/consultations/expert-placeholder.png',
  'images/consultations/consultation-room.jpg',
  'images/consultations/video-call-bg.jpg',
  'images/consultations/consultation-empty.png',
  'images/user-verification/hero-verification.jpg',
  'images/user-verification/id-card-placeholder.png',
  'images/user-verification/license-placeholder.png',
  'images/user-verification/tax-cert-placeholder.png',
  'images/user-verification/verification-badge.png',
  'images/assisted-farmer/hero-assisted.jpg',
  'images/assisted-farmer/search-farmer.png',
  'images/assisted-farmer/consent-capture.png',
  'images/assisted-farmer/on-behalf-banner.jpg',
  'images/assisted-farmer/assistance-history.png',
  'images/moderation/hero-moderation.jpg',
  'images/moderation/listing-pending.png',
  'images/moderation/review-flagged.png',
  'images/moderation/content-report.png',
  'images/reports/hero-reports.jpg',
  'images/reports/report-empty.png',
  'images/reports/export-success.png',
  'images/reports/chart-placeholder.png',
  'images/empty-states/no-products.png',
  'images/empty-states/no-orders.png',
  'images/empty-states/no-messages.png',
  'images/empty-states/no-tickets.png',
  'images/empty-states/no-results.png',
  'images/empty-states/no-notifications.png',
  'images/empty-states/no-reviews.png',
  'images/empty-states/no-disputes.png',
  'images/onboarding/onboarding-1.png',
  'images/onboarding/onboarding-2.png',
  'images/onboarding/onboarding-3.png',
  'images/onboarding/onboarding-4.png',
  'images/onboarding/onboarding-5.png',
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