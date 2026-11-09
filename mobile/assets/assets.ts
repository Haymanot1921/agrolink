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
  splash:              require('./icons/splash.png'),
  notification:       require('./icons/notification-icon.png'),
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

export const OnboardingImages = {
  step1:              ActorIcons.farmer,
  step2:              ActorIcons.buyer,
  step3:              ActorIcons.agriculturalExpert,
  step4:              ActorIcons.supportAgent,
  step5:              ActorIcons.administrator,
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