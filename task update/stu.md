# Project Manager Module — Common Setup for All
## (Root / Shared Infrastructure / Common UI Design System / Public Pages / Auth / i18n)

> **Scope of this delivery:** Everything the **Project Manager** owns that is **shared by all 5 actors** (Farmer, Buyer, Service Provider [Input Supplier + Agricultural Expert], Support Agent, Administrator). **Administrator-specific modules are NOT included here** — they come in the next message.

---

## 📋 PROJECT MANAGER OWNERSHIP MAP

| Area | Path | Purpose |
|---|---|---|
| **Root + PM docs** | `/`, `.github/`, `docs/project-management/` | Project infra |
| **Backend shared infra** | `server/src/{config,shared,sockets,jobs,database}` | Cross-cutting backend |
| **Backend shared modules** | `server/src/modules/{auth,users,notifications,uploads,verification}` | Used by all 5 actors |
| **Web app shell** | `client/src/app/*` | Router, guards, providers |
| **Web common layouts** | `client/src/layouts/common/*` | Public, auth, error |
| **Web public pages** | `client/src/pages/{public,auth,marketplace,articles,market-prices,experts,errors,legal}` | Guest-accessible |
| **Web auth UI module** | `client/src/modules/auth/*` | Shared login/register forms |
| **Web design system** | `client/src/shared/*` | All actors import from here |
| **Web i18n** | `client/src/i18n/*` | EN + AM for all namespaces |
| **Mobile app shell** | `mobile/src/app/*` | Root navigator, providers |
| **Mobile common layouts** | `mobile/src/layouts/common/*` | Auth, offline, error |
| **Mobile auth navigation** | `mobile/src/navigation/auth/*` | Login/register stack |
| **Mobile design system** | `mobile/src/shared/*` | All actors import from here |
| **Mobile i18n** | `mobile/src/i18n/*` | EN + AM for all namespaces |
| **Architecture + DB docs** | `docs/architecture/*`, `docs/database/*` | Shared reference |

---

## 1️⃣ ROOT — Project Setup & CI

```
agrolink/
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── .editorconfig
├── .prettierrc
├── .eslintrc.js
├── package.json
├── package-lock.json
├── docker-compose.yml
├── Dockerfile.server
├── Dockerfile.client
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
│

```

---

## 2️⃣ BACKEND — Shared Infrastructure

```
server/
├── .env.example
├── package.json
├── README.md
├── nodemon.json
│
└── src/
    ├── app.js
    ├── server.js
    │
    ├── config/
    │   ├── environment.js
    │   ├── database.js
    │   ├── cors.js
    │   ├── cloudinary.js
    │   ├── socket.js
    │   ├── email.js
    │   ├── smsProvider.js
    │   ├── paymentGateway.js
    │   ├── videoProvider.js
    │   ├── maps.js
    │   └── logger.js
    │
    ├── database/
    │   ├── schema.sql
    │   ├── migrations/
    │   │   ├── 001_create_roles_permissions.sql
    │   │   ├── 002_create_users_auth.sql
    │   │   ├── 003_create_verification.sql
    │   │   ├── 004_create_farmer_profiles.sql
    │   │   ├── 005_create_assisted_farmer.sql
    │   │   ├── 006_create_buyer_orders_payments.sql
    │   │   ├── 007_create_input_supplier.sql
    │   │   ├── 008_create_expert_consultations.sql
    │   │   ├── 009_create_support_agent_tickets.sql
    │   │   ├── 010_create_administrator.sql
    │   │   ├── 011_create_messaging_reviews_disputes.sql
    │   │   ├── 012_create_market_prices_articles.sql
    │   │   └── 013_create_cache_queues.sql
    │   ├── seeders/
    │   │   ├── 001_roles.seeder.js
    │   │   ├── 002_permissions.seeder.js
    │   │   ├── 003_admin_user.seeder.js
    │   │   ├── 004_product_categories.seeder.js
    │   │   ├── 005_input_categories.seeder.js
    │   │   ├── 006_specializations.seeder.js
    │   │   ├── 007_payment_methods.seeder.js
    │   │   ├── 008_platform_settings.seeder.js
    │   │   ├── 009_knowledge_categories.seeder.js
    │   │   └── 010_provider_types.seeder.js
    │   ├── factories/
    │   │   ├── user.factory.js
    │   │   ├── admin.factory.js
    │   │   └── auditLog.factory.js
    │   └── migrationRunner.js
    │
    ├── shared/
    │   ├── middleware/
    │   │   ├── authenticate.js
    │   │   ├── authorizeRole.js
    │   │   ├── authorizePermission.js
    │   │   ├── requireMfa.js
    │   │   ├── requireConsent.js
    │   │   ├── validateRequest.js
    │   │   ├── errorHandler.js
    │   │   ├── notFound.js
    │   │   ├── rateLimiter.js
    │   │   ├── securityHeaders.js
    │   │   └── uploadMiddleware.js
    │   ├── utils/
    │   │   ├── ApiError.js
    │   │   ├── ApiResponse.js
    │   │   ├── asyncHandler.js
    │   │   ├── pagination.js
    │   │   ├── dateTime.js
    │   │   ├── currency.js
    │   │   ├── invoiceGenerator.js
    │   │   ├── paymentUtils.js
    │   │   ├── auditLogger.js
    │   │   ├── exportUtils.js
    │   │   └── consentVerifier.js
    │   ├── constants/
    │   │   ├── roles.js
    │   │   ├── permissions.js
    │   │   ├── providerTypes.js
    │   │   ├── accountStatuses.js
    │   │   ├── orderStatuses.js
    │   │   ├── paymentStatuses.js
    │   │   ├── ticketStatuses.js
    │   │   ├── ticketPriorities.js
    │   │   ├── consultationStatuses.js
    │   │   ├── caseStatuses.js
    │   │   ├── moderationStatuses.js
    │   │   ├── verificationStatuses.js
    │   │   ├── disputeStatuses.js
    │   │   ├── consentStatuses.js
    │   │   ├── assistedActionTypes.js
    │   │   ├── listingStatuses.js
    │   │   ├── notificationTypes.js
    │   │   ├── inputTypes.js
    │   │   ├── auditEventTypes.js
    │   │   └── cropTypes.js
    │   ├── validators/
    │   │   ├── commonSchemas.js
    │   │   └── paginationSchema.js
    │   └── events/
    │       ├── userEvents.js
    │       ├── notificationEvents.js
    │       ├── moderationEvents.js
    │       ├── disputeEvents.js
    │       ├── verificationEvents.js
    │       ├── assistedFarmerEvents.js
    │       └── auditEvents.js
    │
    ├── sockets/
    │   ├── index.js
    │   ├── adminNotifications.socket.js
    │   ├── moderationQueue.socket.js
    │   └── disputeUpdates.socket.js
    │
    ├── jobs/
    │   ├── verificationReminder.job.js
    │   ├── staleListingReview.job.js
    │   ├── disputeDeadlineReminder.job.js
    │   ├── reportGeneration.job.js
    │   ├── auditLogArchival.job.js
    │   ├── systemHealthCheck.job.js
    │   ├── consentExpiryReminder.job.js
    │   └── notificationDispatch.job.js
    │
    └── modules/
        ├── auth/
        │   ├── auth.routes.js
        │   ├── auth.controller.js
        │   ├── auth.service.js
        │   ├── auth.repository.js
        │   ├── auth.validator.js
        │   ├── otp.service.js
        │   ├── token.service.js
        │   └── password.service.js
        │
        ├── users/
        │   ├── users.routes.js
        │   ├── users.controller.js
        │   ├── users.service.js
        │   ├── users.repository.js
        │   ├── users.validator.js
        │   └── profile.factory.js
        │
        ├── notifications/
        │   ├── notifications.routes.js
        │   ├── notifications.controller.js
        │   ├── notifications.service.js
        │   └── notifications.repository.js
        │
        ├── uploads/
        │   ├── upload.routes.js
        │   ├── upload.controller.js
        │   └── upload.service.js
        │
        └── verification/
            ├── verification.routes.js
            ├── verification.controller.js
            ├── verification.service.js
            └── verification.repository.js
```

---

## 3️⃣ WEB — App Shell + Common Layouts + Public Pages + Auth UI + Shared Design System + i18n

```
client/
├── .env.example
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── README.md
│
├── public/
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   ├── icons/
│   └── images/
│       ├── branding/
│       │   ├── logo.svg
│       │   ├── logo-dark.svg
│       │   └── hero-farm.jpg
│       ├── actors/
│       │   ├── farmer.svg
│       │   ├── buyer.svg
│       │   ├── input-supplier.svg
│       │   ├── agricultural-expert.svg
│       │   ├── support-agent.svg
│       │   └── administrator.svg
│       ├── illustrations/
│       ├── empty-states/
│       └── onboarding/
│
└── src/
    ├── main.jsx
    │
    ├── app/
    │   ├── App.jsx
    │   ├── router.jsx
    │   ├── providers.jsx
    │   ├── routeGuards.jsx
    │   └── errorBoundary.jsx
    │
    ├── i18n/
    │   ├── index.ts
    │   ├── config.ts
    │   ├── locales/
    │   │   ├── en/
    │   │   │   ├── common.json
    │   │   │   ├── auth.json
    │   │   │   ├── validation.json
    │   │   │   ├── public.json
    │   │   │   ├── farmer.json
    │   │   │   ├── buyer.json
    │   │   │   ├── input-supplier.json
    │   │   │   ├── agricultural-expert.json
    │   │   │   ├── support-agent.json
    │   │   │   └── administrator.json
    │   │   └── am/
    │   │       ├── common.json
    │   │       ├── auth.json
    │   │       ├── validation.json
    │   │       ├── public.json
    │   │       ├── farmer.json
    │   │       ├── buyer.json
    │   │       ├── input-supplier.json
    │   │       ├── agricultural-expert.json
    │   │       ├── support-agent.json
    │   │       └── administrator.json
    │   ├── hooks/
    │   │   ├── useTranslation.ts
    │   │   └── useLanguage.ts
    │   └── utils/
    │       └── formatters.ts
    │
    ├── layouts/
    │   └── common/
    │       ├── BaseLayout.jsx
    │       ├── AuthLayout.jsx
    │       ├── ErrorBoundaryLayout.jsx
    │       ├── LanguageSwitcher.jsx
    │       ├── PublicLayout.jsx
    │       ├── PublicHeader.jsx
    │       └── PublicFooter.jsx
    │
    ├── pages/
    │   ├── public/
    │   │   ├── HomePage.jsx
    │   │   ├── AboutPage.jsx
    │   │   ├── HowItWorksPage.jsx
    │   │   ├── PricingPage.jsx
    │   │   ├── FaqPage.jsx
    │   │   ├── ContactPage.jsx
    │   │   ├── HelpCenterPage.jsx
    │   │   ├── TermsPage.jsx
    │   │   ├── PrivacyPage.jsx
    │   │   ├── CookiesPage.jsx
    │   │   ├── AccessibilityPage.jsx
    │   │   ├── CareersPage.jsx
    │   │   ├── PressPage.jsx
    │   │   ├── BlogPage.jsx
    │   │   └── NotFoundPage.jsx
    │   │
    │   ├── auth/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── RoleSelectionPage.jsx
    │   │   ├── ForgotPasswordPage.jsx
    │   │   ├── ResetPasswordPage.jsx
    │   │   └── VerifyEmailPage.jsx
    │   │
    │   ├── marketplace/
    │   │   ├── PublicMarketplacePage.jsx
    │   │   ├── PublicProductDetailsPage.jsx
    │   │   ├── PublicCategoryPage.jsx
    │   │   └── PublicSearchResultsPage.jsx
    │   │
    │   ├── articles/
    │   │   ├── PublicArticlesPage.jsx
    │   │   ├── PublicArticleDetailsPage.jsx
    │   │   └── PublicArticleCategoryPage.jsx
    │   │
    │   ├── market-prices/
    │   │   ├── PublicMarketPricesPage.jsx
    │   │   └── PublicMarketPriceDetailsPage.jsx
    │   │
    │   ├── experts/
    │   │   ├── PublicExpertsPage.jsx
    │   │   └── PublicExpertDetailsPage.jsx
    │   │
    │   ├── errors/
    │   │   ├── UnauthorizedPage.jsx
    │   │   ├── ForbiddenPage.jsx
    │   │   ├── ServerErrorPage.jsx
    │   │   └── MaintenancePage.jsx
    │   │
    │   └── legal/
    │       ├── TermsPage.jsx
    │       ├── PrivacyPage.jsx
    │       └── CookiesPage.jsx
    │
    ├── modules/
    │   └── auth/
    │       ├── components/
    │       │   ├── AuthCard.jsx
    │       │   ├── LoginForm.jsx
    │       │   ├── RegisterForm.jsx
    │       │   ├── ServiceProviderTypeSelector.jsx
    │       │   ├── ForgotPasswordForm.jsx
    │       │   ├── ResetPasswordForm.jsx
    │       │   ├── OtpInput.jsx
    │       │   ├── RoleSelector.jsx
    │       │   └── PasswordStrengthMeter.jsx
    │       ├── hooks/
    │       │   ├── useLogin.js
    │       │   ├── useRegister.js
    │       │   ├── useOtp.js
    │       │   └── usePasswordReset.js
    │       └── services/
    │           └── authUi.service.js
    │
    ├── shared/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Select.jsx
    │   │   │   ├── Textarea.jsx
    │   │   │   ├── Checkbox.jsx
    │   │   │   ├── RadioGroup.jsx
    │   │   │   ├── Switch.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   ├── ConfirmDialog.jsx
    │   │   │   ├── Dropdown.jsx
    │   │   │   ├── Tabs.jsx
    │   │   │   ├── Accordion.jsx
    │   │   │   ├── DataTable.jsx
    │   │   │   ├── Pagination.jsx
    │   │   │   ├── SearchInput.jsx
    │   │   │   ├── DateRangePicker.jsx
    │   │   │   ├── FileUpload.jsx
    │   │   │   ├── ImageUploader.jsx
    │   │   │   ├── StatusBadge.jsx
    │   │   │   ├── Badge.jsx
    │   │   │   ├── Avatar.jsx
    │   │   │   ├── StarRating.jsx
    │   │   │   ├── EmptyState.jsx
    │   │   │   ├── ErrorState.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   ├── SkeletonLoader.jsx
    │   │   │   ├── Toast.jsx
    │   │   │   ├── Tooltip.jsx
    │   │   │   └── index.js
    │   │   ├── charts/
    │   │   │   ├── LineChart.jsx
    │   │   │   ├── BarChart.jsx
    │   │   │   ├── PieChart.jsx
    │   │   │   ├── AreaChart.jsx
    │   │   │   ├── ChartWrapper.jsx
    │   │   │   └── index.js
    │   │   ├── feedback/
    │   │   │   ├── Alert.jsx
    │   │   │   ├── ProgressBar.jsx
    │   │   │   ├── ErrorBoundary.jsx
    │   │   │   └── index.js
    │   │   ├── navigation/
    │   │   │   ├── Breadcrumbs.jsx
    │   │   │   ├── SidebarItem.jsx
    │   │   │   ├── Topbar.jsx
    │   │   │   └── index.js
    │   │   ├── forms/
    │   │   │   ├── FormField.jsx
    │   │   │   ├── FormSection.jsx
    │   │   │   └── index.js
    │   │   ├── layout/
    │   │   │   ├── PageHeader.jsx
    │   │   │   ├── ContentContainer.jsx
    │   │   │   ├── DashboardLayout.jsx
    │   │   │   └── index.js
    │   │   └── maps/
    │   │       ├── MapView.jsx
    │   │       ├── Marker.jsx
    │   │       ├── LocationPicker.jsx
    │   │       └── index.js
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useDebounce.js
    │   │   ├── usePagination.js
    │   │   ├── usePermissions.js
    │   │   ├── useRealtimeUpdates.js
    │   │   ├── useNetworkStatus.js
    │   │   ├── useAppState.js
    │   │   └── useLocalStorage.js
    │   ├── services/
    │   │   ├── apiClient.js
    │   │   ├── authService.js
    │   │   ├── uploadService.js
    │   │   └── websocketService.js
    │   ├── utils/
    │   │   ├── dateFormatter.js
    │   │   ├── currencyFormatter.js
    │   │   ├── fileValidators.js
    │   │   ├── permissionUtils.js
    │   │   ├── exportUtils.js
    │   │   ├── validators.js
    │   │   └── responsive.js
    │   ├── constants/
    │   │   ├── routes.js
    │   │   ├── roles.js
    │   │   ├── providerTypes.js
    │   │   ├── permissions.js
    │   │   ├── statuses.js
    │   │   ├── notificationTypes.js
    │   │   └── platform.js
    │   ├── styles/
    │   │   ├── globals.css
    │   │   ├── variables.css
    │   │   ├── dashboard.css
    │   │   ├── theme.js
    │   │   ├── ThemeProvider.jsx
    │   │   ├── colors.js
    │   │   ├── typography.js
    │   │   └── responsive.css
    │   └── store/
    │       ├── authStore.js
    │       ├── settingsStore.js
    │       ├── notificationStore.js
    │       └── index.js
    │
    ├── assets/
    │   ├── icons/
    │   ├── illustrations/
    │   └── images/
    │
    └── tests/
        ├── unit/
        ├── integration/
        └── fixtures/
```

---

## 4️⃣ MOBILE — App Shell + Common Layouts + Auth Navigation + Shared Design System + i18n

```
mobile/
├── app.json
├── app.config.js
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── eas.json
├── package.json
├── .env.example
├── .env.development
├── .env.production
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── README.md
│
├── assets/
│   ├── fonts/
│   │   ├── NotoSans-Regular.ttf
│   │   ├── NotoSans-Bold.ttf
│   │   ├── NotoSansEthiopic-Regular.ttf
│   │   └── NotoSansEthiopic-Bold.ttf
│   ├── icons/
│   │   ├── app-icon.png
│   │   ├── adaptive-icon.png
│   │   ├── splash.png
│   │   ├── notification-icon.png
│   │   ├── cart-badge.png
│   │   └── actors/
│   │       ├── farmer.png
│   │       ├── buyer.png
│   │       ├── input-supplier.png
│   │       ├── agricultural-expert.png
│   │       ├── support-agent.png
│   │       └── administrator.png
│   ├── images/
│   │   ├── marketplace/
│   │   ├── products/
│   │   ├── farms/
│   │   ├── crops/
│   │   ├── weather/
│   │   ├── agricultural-inputs/
│   │   ├── consultations/
│   │   ├── user-verification/
│   │   ├── assisted-farmer/
│   │   ├── moderation/
│   │   ├── reports/
│   │   ├── illustrations/
│   │   ├── empty-states/
│   │   └── onboarding/
│   ├── map-style.json
│   └── lottie/
│       ├── loading.json
│       ├── success.json
│       ├── empty.json
│       ├── empty-cart.json
│       ├── payment-processing.json
│       └── weather-sunny.json
│
└── src/
    ├── app/
    │   ├── App.tsx
    │   ├── providers.tsx
    │   ├── RootNavigator.tsx
    │   ├── navigationRef.ts
    │   ├── linking.ts
    │   └── routeGuards.tsx
    │
    ├── i18n/
    │   ├── index.ts
    │   ├── config.ts
    │   ├── locales/
    │   │   ├── en/
    │   │   │   ├── common.json
    │   │   │   ├── auth.json
    │   │   │   ├── validation.json
    │   │   │   ├── mobile.json
    │   │   │   ├── farmer.json
    │   │   │   ├── buyer.json
    │   │   │   ├── input-supplier.json
    │   │   │   ├── agricultural-expert.json
    │   │   │   ├── support-agent.json
    │   │   │   └── administrator.json
    │   │   └── am/
    │   │       ├── common.json
    │   │       ├── auth.json
    │   │       ├── validation.json
    │   │       ├── mobile.json
    │   │       ├── farmer.json
    │   │       ├── buyer.json
    │   │       ├── input-supplier.json
    │   │       ├── agricultural-expert.json
    │   │       ├── support-agent.json
    │   │       └── administrator.json
    │   ├── hooks/
    │   │   ├── useTranslation.ts
    │   │   └── useLanguage.ts
    │   └── utils/
    │       └── formatters.ts
    │
    ├── navigation/
    │   ├── types.ts
    │   └── auth/
    │       ├── AuthStack.tsx
    │       ├── OnboardingScreen.tsx
    │       ├── RoleSelectionScreen.tsx
    │       ├── ServiceProviderTypeScreen.tsx
    │       ├── LoginScreen.tsx
    │       ├── RegisterScreen.tsx
    │       ├── ForgotPasswordScreen.tsx
    │       └── OtpVerificationScreen.tsx
    │
    ├── layouts/
    │   └── common/
    │       ├── BaseScreen.tsx
    │       ├── AuthLayout.tsx
    │       ├── ErrorBoundaryLayout.tsx
    │       ├── LanguageSwitcherModal.tsx
    │       ├── OfflineBanner.tsx
    │       └── NetworkStatusProvider.tsx
    │
    ├── shared/
    │   ├── components/
    │   │   ├── ui/
    │   │   │   ├── AppButton.tsx
    │   │   │   ├── AppIconButton.tsx
    │   │   │   ├── AppInput.tsx
    │   │   │   ├── AppTextarea.tsx
    │   │   │   ├── AppSelect.tsx
    │   │   │   ├── AppCheckbox.tsx
    │   │   │   ├── AppRadioGroup.tsx
    │   │   │   ├── AppSwitch.tsx
    │   │   │   ├── AppModal.tsx
    │   │   │   ├── BottomSheet.tsx
    │   │   │   ├── AppDropdown.tsx
    │   │   │   ├── AppTabs.tsx
    │   │   │   ├── AppAccordion.tsx
    │   │   │   ├── AppFlatList.tsx
    │   │   │   ├── InfiniteScrollList.tsx
    │   │   │   ├── AppSearchBar.tsx
    │   │   │   ├── DateRangePicker.tsx
    │   │   │   ├── FilePicker.tsx
    │   │   │   ├── ImagePicker.tsx
    │   │   │   ├── MultiImagePicker.tsx
    │   │   │   ├── CameraCapture.tsx
    │   │   │   ├── Avatar.tsx
    │   │   │   ├── Badge.tsx
    │   │   │   ├── StatusBadge.tsx
    │   │   │   ├── StarRating.tsx
    │   │   │   ├── PriceTag.tsx
    │   │   │   ├── QuantityStepper.tsx
    │   │   │   ├── EmptyState.tsx
    │   │   │   ├── ErrorState.tsx
    │   │   │   ├── LoadingSpinner.tsx
    │   │   │   ├── SkeletonLoader.tsx
    │   │   │   ├── PullToRefresh.tsx
    │   │   │   ├── ConfirmDialog.tsx
    │   │   │   ├── Toast.tsx
    │   │   │   ├── KeyboardAvoidingWrapper.tsx
    │   │   │   ├── SafeAreaWrapper.tsx
    │   │   │   └── index.ts
    │   │   ├── charts/
    │   │   │   ├── LineChart.tsx
    │   │   │   ├── BarChart.tsx
    │   │   │   ├── PieChart.tsx
    │   │   │   ├── AreaChart.tsx
    │   │   │   ├── ChartWrapper.tsx
    │   │   │   └── index.ts
    │   │   ├── feedback/
    │   │   │   ├── Alert.tsx
    │   │   │   ├── ProgressBar.tsx
    │   │   │   └── index.ts
    │   │   ├── navigation/
    │   │   │   ├── AppBreadcrumbs.tsx
    │   │   │   ├── DrawerItem.tsx
    │   │   │   ├── TabBarIcon.tsx
    │   │   │   └── index.ts
    │   │   ├── maps/
    │   │   │   ├── MapView.tsx
    │   │   │   ├── Marker.tsx
    │   │   │   ├── LocationPicker.tsx
    │   │   │   └── index.ts
    │   │   ├── media/
    │   │   │   ├── VideoView.tsx
    │   │   │   ├── AudioIndicator.tsx
    │   │   │   ├── VoiceNotePlayer.tsx
    │   │   │   ├── VoiceNoteRecorder.tsx
    │   │   │   ├── VideoPlayer.tsx
    │   │   │   └── index.ts
    │   │   ├── shopping/
    │   │   │   ├── ProductCarousel.tsx
    │   │   │   ├── CartBadge.tsx
    │   │   │   ├── MiniCartSheet.tsx
    │   │   │   ├── CheckoutStepper.tsx
    │   │   │   └── index.ts
    │   │   └── weather/
    │   │       ├── WeatherCard.tsx
    │   │       ├── WeatherForecastRow.tsx
    │   │       ├── WeatherAlertBanner.tsx
    │   │       └── index.ts
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   ├── useDebounce.ts
    │   │   ├── usePagination.ts
    │   │   ├── usePermissions.ts
    │   │   ├── useRealtimeUpdates.ts
    │   │   ├── useNetworkStatus.ts
    │   │   ├── useAppState.ts
    │   │   ├── useKeyboard.ts
    │   │   ├── useDeviceInfo.ts
    │   │   ├── useLocalStorage.ts
    │   │   ├── useBiometrics.ts
    │   │   ├── usePushNotifications.ts
    │   │   ├── useGeolocation.ts
    │   │   ├── useCamera.ts
    │   │   ├── useMicrophone.ts
    │   │   ├── useCallKeep.ts
    │   │   ├── useImagePicker.ts
    │   │   ├── useWeather.ts
    │   │   ├── useDeepLink.ts
    │   │   └── usePaymentDeepLink.ts
    │   ├── services/
    │   │   ├── apiClient.ts
    │   │   ├── authService.ts
    │   │   ├── uploadService.ts
    │   │   ├── websocketService.ts
    │   │   ├── pushNotificationService.ts
    │   │   ├── biometricService.ts
    │   │   ├── locationService.ts
    │   │   ├── cameraService.ts
    │   │   ├── microphoneService.ts
    │   │   ├── videoCallService.ts
    │   │   ├── imagePickerService.ts
    │   │   ├── fileService.ts
    │   │   ├── paymentGatewayService.ts
    │   │   ├── weatherService.ts
    │   │   ├── csvExportService.ts
    │   │   └── offlineQueue.ts
    │   ├── utils/
    │   │   ├── dateFormatter.ts
    │   │   ├── currencyFormatter.ts
    │   │   ├── weatherFormatter.ts
    │   │   ├── fileValidators.ts
    │   │   ├── permissionUtils.ts
    │   │   ├── exportUtils.ts
    │   │   ├── validators.ts
    │   │   └── responsive.ts
    │   ├── constants/
    │   │   ├── routes.ts
    │   │   ├── roles.ts
    │   │   ├── providerTypes.ts
    │   │   ├── permissions.ts
    │   │   ├── orderStatuses.ts
    │   │   ├── paymentStatuses.ts
    │   │   ├── ticketStatuses.ts
    │   │   ├── ticketPriorities.ts
    │   │   ├── consultationStatuses.ts
    │   │   ├── caseStatuses.ts
    │   │   ├── moderationStatuses.ts
    │   │   ├── verificationStatuses.ts
    │   │   ├── disputeStatuses.ts
    │   │   ├── consentTypes.ts
    │   │   ├── notificationTypes.ts
    │   │   ├── productCategories.ts
    │   │   ├── inputTypes.ts
    │   │   ├── inputCategories.ts
    │   │   ├── cropTypes.ts
    │   │   └── platform.ts
    │   ├── styles/
    │   │   ├── colors.ts
    │   │   ├── typography.ts
    │   │   ├── spacing.ts
    │   │   ├── shadows.ts
    │   │   ├── theme.ts
    │   │   ├── ThemeProvider.tsx
    │   │   └── useTheme.ts
    │   └── store/
    │       ├── authStore.ts
    │       ├── settingsStore.ts
    │       ├── notificationStore.ts
    │       ├── cartStore.ts
    │       ├── checkoutStore.ts
    │       ├── favoritesStore.ts
    │       ├── productDraftStore.ts
    │       ├── weatherStore.ts
    │       ├── storeStatusStore.ts
    │       ├── callStore.ts
    │       ├── workQueueStore.ts
    │       └── index.ts
    │
    └── tests/
        ├── unit/
        ├── integration/
        └── e2e/
            ├── config.json
            └── auth.e2e.ts
```

---

## 🔑 What PM owns here (shared/common only)

| Section | Files | Purpose |
|---|---|---|
| **Root + CI** | 20 files | Project setup, Docker, CI, PM docs |
| **Backend shared infra** | ~65 files | DB, config, middleware, utils, constants, sockets, jobs |
| **Backend shared modules** | ~25 files | `auth`, `users`, `notifications`, `uploads`, `verification` |
| **Web app shell** | 5 files | Router, guards, providers |
| **Web common layouts** | 7 files | Public/auth/error layouts |
| **Web public pages** | 35 files | Guest-accessible pages (SRS §11.1) |
| **Web auth UI** | 13 files | Shared forms for all 5 actors |
| **Web shared design system** | ~70 files | UI, charts, hooks, services, utils, constants, styles, store |
| **Web i18n** | 22 files | EN + AM for all 10 namespaces |
| **Mobile app shell** | 6 files | Root navigator, providers, linking |
| **Mobile common layouts** | 6 files | Auth, offline, error |
| **Mobile auth navigation** | 8 files | Login/register/role-select stack |
| **Mobile shared design system** | ~90 files | UI, charts, hooks, services, utils, constants, styles, store |
| **Mobile i18n** | 22 files | EN + AM for all 10 namespaces |
| **Architecture + DB docs** | ~20 files | SRS reference, ERD, assisted-listing spec |

**Total ≈ 400+ files** — the entire shared foundation that Students 2–5 build on.

---

## ✅ What's intentionally NOT here (next message)

- ❌ No `server/src/modules/administrator/*` — Admin backend
- ❌ No `client/src/modules/administrator/*` — Admin web
- ❌ No `client/src/layouts/administrator/*` — Admin web layouts
- ❌ No `mobile/src/modules/administrator/*` — Admin mobile
- ❌ No `mobile/src/navigation/administrator/*` — Admin mobile nav
- ❌ No `mobile/src/layouts/administrator/*` — Admin mobile layouts

Those come in the **Administrator Module** delivery (next message).

---

## 📌 Summary

This is the **Project Manager Common Setup** — the entire shared foundation:

- ✅ **Root + PM docs** — project infra
- ✅ **Backend shared infra** — everything cross-cutting (auth, users, notifications, uploads, verification, DB, sockets, jobs)
- ✅ **Web shell + common layouts + public pages + auth UI + design system + i18n**
- ✅ **Mobile shell + common layouts + auth navigation + design system + i18n**

**No Administrator module. No actor-specific modules. Pure shared foundation.**

👉 Say **"Administrator module"** and I'll deliver the complete Administrator module (backend + web + mobile) — deduplicated, single source of truth, no overlap with this Project Manager delivery.