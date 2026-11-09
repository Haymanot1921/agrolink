# AgroLink Ethiopia — Mobile App (React Native + Expo)

Mobile application for the AgroLink Ethiopia marketplace, built with **React Native** and **Expo SDK 51**.

Supports **5 actors** (per SRS §4.1):
- Farmer
- Buyer
- Service Provider (Input Supplier + Agricultural Expert)
- Support Agent (assisted farmer access)
- Administrator

Bilingual: **English + Amharic** (SRS FR-ACCESS-006).

## Prerequisites

- Node.js **18 LTS** or higher
- npm **9+**
- Expo CLI is included with the project dependencies; do not install the legacy global `expo-cli`
- EAS CLI (`npm install -g eas-cli`) — for builds
- Android Studio (for Android dev) / Xcode 15+ (for iOS dev, macOS only)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env
cp .env.example .env.development
# Edit .env.development — set API_URL to your backend

# 3. Verify all assets exist
npm run assets:verify

# 4. Start the dev server
npm start

# Start the web app
npm run web
```

Run Expo through `npm start`, `npm run web`, or `npx expo` from this directory so the app's SDK-pinned CLI is used.

## Troubleshooting

The development environment sets `EXPO_OFFLINE=1`, so both `expo start` and `npm start` skip Expo's remote version lookup when the network is unavailable. To enable Expo's online features for a session, such as tunnel connections, set `$env:EXPO_OFFLINE = "0"` in PowerShell before starting Expo.

If Expo reports `Body is unusable: Body has already been read`, bypass its response cache and use the project-local CLI:

```powershell
$env:EXPO_NO_CACHE = "1"
npx expo start --web
```

## Run on device

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

## Builds (EAS)

```bash
# Dev build (installs a development client)
npm run eas:build:dev

# Preview build (APK for internal testers)
npm run eas:build:preview

# Production build (AAB + IPA)
npm run eas:build:prod
```

## Project structure

```
mobile/
├── assets/             # fonts, icons, images, lottie, map-style
├── src/
│   ├── app/            # App.tsx, providers, RootNavigator, guards
│   ├── i18n/           # EN + AM locales
│   ├── navigation/     # auth + 5 actor navigators
│   ├── layouts/        # common + per-actor wrappers
│   ├── modules/        # actor modules (farmer, buyer, …)
│   └── shared/         # UI, hooks, services, utils, constants, styles, store
└── tests/              # unit, integration, e2e
```

## SRS compliance

- ✅ 5 actors only — no transporter/delivery/AI (SRS §2.4)
- ✅ Assisted farmer workflow (§5.3, §6.2, §6.4, §6.8)
- ✅ English + Amharic (§FR-ACCESS-006)
- ✅ Payments record-only (§13.1)
- ✅ Maps display-only (§13.4)
- ✅ No delivery tracking

## License

Proprietary — AgroLink Ethiopia Project, 2025.mobile/src/
└── pages/                                   ← ⭐ NEW
    ├── public/
    │   ├── PrivacyScreen.tsx
    │   ├── CookiesScreen.tsx
    │   ├── AccessibilityScreen.tsx
    │   ├── CareersScreen.tsx
    │   ├── PressScreen.tsx
    │
    ├── auth/                                ← thin wrappers that point to navigation/auth
    │   ├── LoginPageScreen.tsx
    │   ├── RegisterPageScreen.tsx
    │   ├── RoleSelectionPageScreen.tsx
    │   ├── ForgotPasswordPageScreen.tsx
    │   ├── ResetPasswordPageScreen.tsx
    │   ├── VerifyEmailPageScreen.tsx
    │   └── index.ts
    │
    ├── marketplace/
    │   ├── PublicMarketplacePageScreen.tsx
    │   ├── PublicProductDetailsPageScreen.tsx
    │   ├── PublicCategoryPageScreen.tsx
    │   ├── PublicSearchResultsPageScreen.tsx
    │   └── index.ts
    │
    ├── articles/
    │   ├── PublicArticlesPageScreen.tsx
    │   ├── PublicArticleDetailsPageScreen.tsx
    │   ├── PublicArticleCategoryPageScreen.tsx
    │   └── index.ts
    │
    ├── market-prices/
    │   ├── PublicMarketPricesPageScreen.tsx
    │   ├── PublicMarketPriceDetailsPageScreen.tsx
    │   └── index.ts
    │
    ├── experts/
    │   ├── PublicExpertsPageScreen.tsx
    │   ├── PublicExpertDetailsPageScreen.tsx
    │   └── index.ts
    │
    ├── errors/
    │   ├── UnauthorizedPageScreen.tsx
    │   ├── ForbiddenPageScreen.tsx
    │   ├── ServerErrorPageScreen.tsx
    │   ├── MaintenancePageScreen.tsx
    │   └── index.ts
    │
    ├── legal/
    │   ├── TermsPageScreen.tsx
    │   ├── PrivacyPageScreen.tsx
    │   ├── CookiesPageScreen.tsx
    │   └── index.ts
    │
    └── index.ts                            ← barrel for all pages