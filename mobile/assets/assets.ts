// mobile/assets/assets.ts
// Central asset registry — import once, use everywhere.

export const Fonts = {
  regular:            require('./fonts/NotoSans-Regular.ttf'),
  bold:               require('./fonts/NotoSans-Bold.ttf'),
  ethiopicRegular:    require('./fonts/NotoSansEthiopic-Regular.ttf'),
  ethiopicBold:       require('./fonts/NotoSansEthiopic-Bold.ttf'),
} as const;

export const FontFamily = {
  regular:            'NotoSans-Regular',
  bold:               'NotoSans-Bold',
  ethiopicRegular:    'NotoSansEthiopic-Regular',
  ethiopicBold:       'NotoSansEthiopic-Bold',
} as const;

export const Icons = {
  app:                require('./icons/app-icon.png'),
  adaptive:           require('./icons/adaptive-icon.png'),
  splash:             require('./icons/splash.png'),
  notification:       require('./icons/notification-icon.png'),
  favicon:            require('./icons/favicon.png'),
  cartBadge:          require('./icons/cart-badge.png'),
} as const;

export const ActorIcons = {
  farmer:             require('./icons/actors/farmer.png'),
  buyer:              require('./icons/actors/buyer.png'),
  inputSupplier:      require('./icons/actors/input-supplier.png'),
  agriculturalExpert: require('./icons/actors/agricultural-expert.png'),
  supportAgent:       require('./icons/actors/support-agent.png'),
  administrator:      require('./icons/actors/administrator.png'),
} as const;

export const MarketplaceImages = {
  hero:               require('./images/marketplace/hero-marketplace.jpg'),
  bannerFresh:        require('./images/marketplace/banner-fresh-produce.jpg'),
  bannerSupport:      require('./images/marketplace/banner-support-local.jpg'),
  categoryDefault:    require('./images/marketplace/category-default.jpg'),
  searchEmpty:        require('./images/marketplace/search-empty.png'),
} as const;

export const ProductImages = {
  placeholder:        require('./images/products/placeholder-product.png'),
  teff:               require('./images/products/teff.jpg'),
  wheat:              require('./images/products/wheat.jpg'),
  maize:              require('./images/products/maize.jpg'),
  coffee:             require('./images/products/coffee.jpg'),
  sesame:             require('./images/products/sesame.jpg'),
  beans:              require('./images/products/beans.jpg'),
  vegetables:         require('./images/products/vegetables.jpg'),
} as const;

export const FarmImages = {
  hero:               require('./images/farms/farm-hero.jpg'),
  smallholder:        require('./images/farms/farm-smallholder.jpg'),
  commercial:         require('./images/farms/farm-commercial.jpg'),
  placeholder:        require('./images/farms/farm-placeholder.png'),
} as const;

export const CropIcons = {
  teff:               require('./images/crops/crop-teff.png'),
  wheat:              require('./images/crops/crop-wheat.png'),
  maize:              require('./images/crops/crop-maize.png'),
  sorghum:            require('./images/crops/crop-sorghum.png'),
  coffee:             require('./images/crops/crop-coffee.png'),
  barley:             require('./images/crops/crop-barley.png'),
} as const;

export const WeatherIcons = {
  sunny:              require('./images/weather/sunny.png'),
  cloudy:             require('./images/weather/cloudy.png'),
  rainy:              require('./images/weather/rainy.png'),
  stormy:             require('./images/weather/stormy.png'),
  windy:              require('./images/weather/windy.png'),
  partlyCloudy:       require('./images/weather/partly-cloudy.png'),
} as const;

export const AgriculturalInputImages = {
  hero:               require('./images/agricultural-inputs/hero-inputs.jpg'),
  seeds:              require('./images/agricultural-inputs/seeds.jpg'),
  fertilizer:         require('./images/agricultural-inputs/fertilizer.jpg'),
  pesticide:          require('./images/agricultural-inputs/pesticide.jpg'),
  tools:              require('./images/agricultural-inputs/tools.jpg'),
  equipment:          require('./images/agricultural-inputs/equipment.jpg'),
  placeholder:        require('./images/agricultural-inputs/placeholder-input.png'),
} as const;

export const ConsultationImages = {
  hero:               require('./images/consultations/hero-consultation.jpg'),
  expertPlaceholder:  require('./images/consultations/expert-placeholder.png'),
  room:               require('./images/consultations/consultation-room.jpg'),
  videoCallBg:        require('./images/consultations/video-call-bg.jpg'),
  empty:              require('./images/consultations/consultation-empty.png'),
} as const;

export const UserVerificationImages = {
  hero:               require('./images/user-verification/hero-verification.jpg'),
  idCard:             require('./images/user-verification/id-card-placeholder.png'),
  license:            require('./images/user-verification/license-placeholder.png'),
  taxCert:            require('./images/user-verification/tax-cert-placeholder.png'),
  badge:              require('./images/user-verification/verification-badge.png'),
} as const;

export const AssistedFarmerImages = {
  hero:               require('./images/assisted-farmer/hero-assisted.jpg'),
  searchFarmer:       require('./images/assisted-farmer/search-farmer.png'),
  consentCapture:     require('./images/assisted-farmer/consent-capture.png'),
  onBehalfBanner:     require('./images/assisted-farmer/on-behalf-banner.jpg'),
  history:            require('./images/assisted-farmer/assistance-history.png'),
} as const;

export const ModerationImages = {
  hero:               require('./images/moderation/hero-moderation.jpg'),
  listingPending:     require('./images/moderation/listing-pending.png'),
  reviewFlagged:      require('./images/moderation/review-flagged.png'),
  contentReport:      require('./images/moderation/content-report.png'),
} as const;

export const ReportImages = {
  hero:               require('./images/reports/hero-reports.jpg'),
  empty:              require('./images/reports/report-empty.png'),
  exportSuccess:      require('./images/reports/export-success.png'),
  chartPlaceholder:   require('./images/reports/chart-placeholder.png'),
} as const;

export const EmptyStateImages = {
  noProducts:         require('./images/empty-states/no-products.png'),
  noOrders:           require('./images/empty-states/no-orders.png'),
  noMessages:         require('./images/empty-states/no-messages.png'),
  noTickets:          require('./images/empty-states/no-tickets.png'),
  noResults:          require('./images/empty-states/no-results.png'),
  noNotifications:    require('./images/empty-states/no-notifications.png'),
  noReviews:          require('./images/empty-states/no-reviews.png'),
  noDisputes:         require('./images/empty-states/no-disputes.png'),
} as const;

export const OnboardingImages = {
  step1:              require('./images/onboarding/onboarding-1.png'),
  step2:              require('./images/onboarding/onboarding-2.png'),
  step3:              require('./images/onboarding/onboarding-3.png'),
  step4:              require('./images/onboarding/onboarding-4.png'),
  step5:              require('./images/onboarding/onboarding-5.png'),
} as const;

export const Lottie = {
  loading:            require('./lottie/loading.json'),
  success:            require('./lottie/success.json'),
  empty:              require('./lottie/empty.json'),
  emptyCart:          require('./lottie/empty-cart.json'),
  paymentProcessing:  require('./lottie/payment-processing.json'),
  weatherSunny:       require('./lottie/weather-sunny.json'),
} as const;

export const Maps = {
  style:              require('./map-style.json'),
} as const;