# AgroLink Ethiopia — Farmer Module (Complete: Backend + Web + Mobile)

**SRS coverage:** §4.1.1 (Farmer actor), §5.2 (FEAT-FARMER), §5.4 (FEAT-MARKET — farmer side), §5.7 (farmer-side orders), §5.8 (farmer-side consultations), §5.9 (market prices), §5.10 (articles), §5.11 (messages), §5.12 (notifications), §5.13 (support), §5.14 (reviews), §6.1 (direct registration), §6.3 (direct create product), §6.5 (buyer places order → farmer receives), §6.6 (consultation), §7.1, §7.4, §10.4 (listing ownership), §11.2 (Farmer Dashboard), §11.7 (mobile).

---

## 📦 FARMER MODULE — COMPLETE STRUCTURE

```
agrolink-ethiopia/
│
├── server/src/modules/farmer/                          # ═══ BACKEND ═══
│   │
│   ├── farmer-dashboard/
│   │   ├── dashboard.routes.js
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.service.js
│   │   ├── dashboard.repository.js
│   │   └── dashboard.validator.js                       # date range, filters
│   │
│   ├── farmer-profile/                                 # FR-FARMER-001..010
│   │   ├── profile.routes.js
│   │   ├── profile.controller.js
│   │   ├── profile.service.js
│   │   ├── profile.repository.js
│   │   ├── profile.validator.js
│   │   ├── farmerProfile.model.js                      # FR-FARMER-002, 005
│   │   ├── farmDetails.model.js
│   │   ├── accessMethod.model.js                       # FR-FARMER-003 (direct | assisted)
│   │   └── verificationStatus.model.js                 # FR-FARMER-009
│   │
│   ├── farmer-products/                                # §5.4 FR-MARKET-001..019 (farmer side)
│   │   ├── products.routes.js
│   │   ├── products.controller.js
│   │   ├── products.service.js
│   │   ├── products.repository.js
│   │   ├── products.validator.js
│   │   ├── product.model.js                            # FR-MARKET-002, 006
│   │   ├── productImage.model.js                       # FR-MARKET-003
│   │   ├── productHistory.model.js                     # FR-MARKET-018
│   │   └── listingOwnership.guard.js                   # FR-MARKET-011, 020
│   │
│   ├── farmer-orders/                                  # §5.7 FR-ORDER-001..015 (farmer side)
│   │   ├── orders.routes.js
│   │   ├── orders.controller.js
│   │   ├── orders.service.js
│   │   ├── orders.repository.js
│   │   ├── orders.validator.js
│   │   ├── order.model.js                              # FR-ORDER-002, 003
│   │   ├── orderItem.model.js
│   │   ├── orderStatusTransition.js                    # FR-ORDER-006, 007
│   │   └── orderHistory.model.js                       # FR-ORDER-013
│   │
│   ├── farmer-consultations/                           # §5.8 FR-CONSULT-001..012 (farmer side)
│   │   ├── consultations.routes.js
│   │   ├── consultations.controller.js
│   │   ├── consultations.service.js
│   │   ├── consultations.repository.js
│   │   ├── consultations.validator.js
│   │   ├── consultationRequest.model.js                # FR-CONSULT-003, 004
│   │   ├── consultation.model.js                       # FR-CONSULT-007
│   │   └── consultationFeedback.model.js               # FR-CONSULT-011
│   │
│   ├── farmer-market-prices/                           # §5.9 FR-PRICE-003, 004, 005 (read-only)
│   │   ├── marketPrices.routes.js
│   │   ├── marketPrices.controller.js
│   │   ├── marketPrices.service.js
│   │   └── marketPrices.repository.js
│   │
│   ├── farmer-articles/                                # §5.10 FR-ARTICLE-004..007 (read-only)
│   │   ├── articles.routes.js
│   │   ├── articles.controller.js
│   │   ├── articles.service.js
│   │   ├── articles.repository.js
│   │   └── savedArticle.model.js
│   │
│   ├── farmer-messages/                                # §5.11 FR-MESSAGE-001..007
│   │   ├── messages.routes.js
│   │   ├── messages.controller.js
│   │   ├── messages.service.js
│   │   ├── messages.repository.js
│   │   ├── messages.validator.js
│   │   ├── conversation.model.js                       # FR-MESSAGE-002
│   │   ├── message.model.js                            # FR-MESSAGE-003
│   │   ├── messageRead.model.js                        # FR-MESSAGE-005
│   │   └── messageReport.model.js                      # FR-MESSAGE-006
│   │
│   ├── farmer-notifications/                           # §5.12 FR-NOTIFY-001..010
│   │   ├── notifications.routes.js
│   │   ├── notifications.controller.js
│   │   ├── notifications.service.js
│   │   ├── notifications.repository.js
│   │   └── notificationPreference.model.js
│   │
│   ├── farmer-reviews/                                 # §5.14 FR-REVIEW-001..005 (buyer→farmer)
│   │   ├── reviews.routes.js
│   │   ├── reviews.controller.js
│   │   ├── reviews.service.js
│   │   ├── reviews.repository.js
│   │   ├── reviews.validator.js
│   │   └── reviewEligibility.js                        # FR-REVIEW-003
│   │
│   ├── farmer-support/                                 # §5.13 FR-SUPPORT-001..009
│   │   ├── support.routes.js
│   │   ├── support.controller.js
│   │   ├── support.service.js
│   │   ├── support.repository.js
│   │   ├── support.validator.js
│   │   ├── supportTicket.model.js
│   │   └── supportMessage.model.js
│   │
│   ├── farmer-settings/
│   │   ├── settings.routes.js
│   │   ├── settings.controller.js
│   │   ├── settings.service.js
│   │   ├── settings.repository.js
│   │   └── settings.validator.js
│   │
│   └── index.js                                        # registers all farmer routes under /api/v1/farmers
│
│
├── client/src/layouts/farmer/                          # ═══ WEB LAYOUTS ═══ (§11.2)
│   ├── FarmerLayout.jsx
│   ├── FarmerSidebar.jsx
│   ├── FarmerTopbar.jsx
│   ├── FarmerNavigation.jsx
│   ├── FarmerMobileMenu.jsx
│   └── FarmerFooter.jsx
│
├── client/src/modules/farmer/                          # ═══ WEB MODULES ═══
│   │
│   ├── dashboard/                                      # §11.2 Overview
│   │   ├── pages/FarmerDashboard.jsx
│   │   ├── components/
│   │   │   ├── WelcomeBanner.jsx
│   │   │   ├── FarmerStats.jsx
│   │   │   ├── SalesOverview.jsx
│   │   │   ├── RecentOrders.jsx
│   │   │   ├── TopProducts.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── WeatherWidget.jsx
│   │   ├── hooks/useFarmerDashboard.js
│   │   └── services/dashboardService.js
│   │
│   ├── products/                                       # §11.2 My Products / Add / Manage
│   │   ├── pages/
│   │   │   ├── MyProducts.jsx
│   │   │   ├── AddProduct.jsx                          # §6.3 direct farmer creates product
│   │   │   ├── EditProduct.jsx
│   │   │   └── ProductDetails.jsx
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductTable.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductImageUpload.jsx                  # FR-MARKET-003
│   │   │   ├── ProductStatusBadge.jsx                  # draft/pending/published/rejected/inactive/sold_out
│   │   │   └── CreationMethodBadge.jsx                 # FR-MARKET-019 (direct vs assisted)
│   │   ├── hooks/useFarmerProducts.js
│   │   ├── services/productService.js
│   │   └── validators/productSchema.js
│   │
│   ├── orders/                                         # §11.2 Orders
│   │   ├── pages/
│   │   │   ├── FarmerOrders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   └── OrderHistory.jsx
│   │   ├── components/
│   │   │   ├── OrderTable.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── OrderFilters.jsx
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   ├── OrderActionMenu.jsx                     # accept/reject (FR-ORDER-005)
│   │   │   └── OrderTimeline.jsx                       # FR-ORDER-006
│   │   ├── hooks/useFarmerOrders.js
│   │   └── services/orderService.js
│   │
│   ├── consultations/                                  # §11.2 Consultation Requests
│   │   ├── pages/
│   │   │   ├── MyConsultations.jsx
│   │   │   ├── NewConsultation.jsx                     # §6.6
│   │   │   ├── ConsultationDetails.jsx
│   │   │   ├── FindExperts.jsx                         # FR-CONSULT-001
│   │   │   └── ConsultationHistory.jsx                 # FR-CONSULT-009
│   │   ├── components/
│   │   │   ├── ConsultationCard.jsx
│   │   │   ├── ConsultationTable.jsx
│   │   │   ├── ConsultationForm.jsx
│   │   │   ├── ExpertCard.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   └── ConsultationStatusBadge.jsx
│   │   ├── hooks/useConsultations.js
│   │   └── services/consultationService.js
│   │
│   ├── messages/                                       # §11.2 Messages
│   │   ├── pages/FarmerMessages.jsx
│   │   ├── components/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageComposer.jsx
│   │   │   └── AttachmentPreview.jsx
│   │   ├── hooks/useFarmerChat.js
│   │   └── services/messageService.js
│   │
│   ├── market-prices/                                  # §11.2 Market Prices
│   │   ├── pages/
│   │   │   ├── MarketPrices.jsx
│   │   │   ├── MarketPriceDetails.jsx
│   │   │   ├── PriceAlerts.jsx
│   │   │   └── MarketInsights.jsx
│   │   ├── components/
│   │   │   ├── MarketPriceTable.jsx
│   │   │   ├── PriceTrendChart.jsx
│   │   │   ├── PriceAlertForm.jsx
│   │   │   └── MarketLocationFilter.jsx
│   │   ├── hooks/useMarketPrices.js
│   │   └── services/marketPriceService.js
│   │
│   ├── articles/                                       # §11.2 Articles and Resources
│   │   ├── pages/
│   │   │   ├── ArticlesResources.jsx
│   │   │   ├── ArticleDetails.jsx
│   │   │   ├── SavedArticles.jsx
│   │   │   └── DownloadableResources.jsx
│   │   ├── components/
│   │   │   ├── FeaturedArticle.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleGrid.jsx
│   │   │   └── ArticleCategories.jsx
│   │   ├── hooks/useArticles.js
│   │   └── services/articleService.js
│   │
│   ├── profile-verification/                           # §11.2 Profile + Settings entry
│   │   ├── pages/
│   │   │   ├── FarmerProfile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── FarmDetails.jsx                         # FR-FARMER-005
│   │   │   ├── MyDocuments.jsx
│   │   │   └── VerificationStatus.jsx                  # FR-FARMER-009
│   │   ├── components/
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── AvatarUploader.jsx
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── FarmDetailsForm.jsx
│   │   │   ├── AccessMethodCard.jsx                    # FR-FARMER-003 (Direct | Assisted)
│   │   │   ├── DocumentUploader.jsx
│   │   │   └── VerificationTimeline.jsx
│   │   ├── hooks/useFarmerProfile.js
│   │   ├── services/profileService.js
│   │   └── validators/profileSchema.js
│   │
│   ├── reviews/                                        # §11.2 reviews received
│   │   ├── pages/
│   │   │   ├── ReceivedReviews.jsx
│   │   │   └── ReviewDetails.jsx
│   │   ├── components/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewSummary.jsx
│   │   │   └── ReviewFilters.jsx
│   │   ├── hooks/useFarmerReviews.js
│   │   └── services/reviewService.js
│   │
│   ├── notifications/                                  # §11.2 Notifications
│   │   ├── pages/FarmerNotifications.jsx
│   │   ├── components/
│   │   │   ├── NotificationList.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   └── NotificationFilters.jsx
│   │   ├── hooks/useNotifications.js
│   │   └── services/notificationService.js
│   │
│   ├── support/                                        # §11.2 Support
│   │   ├── pages/
│   │   │   ├── HelpCenter.jsx
│   │   │   ├── ContactSupport.jsx
│   │   │   ├── CreateSupportTicket.jsx
│   │   │   └── SupportTicketDetails.jsx
│   │   ├── components/
│   │   │   ├── SupportTicketForm.jsx
│   │   │   ├── SupportTicketList.jsx
│   │   │   └── SupportTicketStatusBadge.jsx
│   │   ├── hooks/useFarmerSupport.js
│   │   └── services/supportService.js
│   │
│   ├── settings/                                       # §11.2 Settings
│   │   ├── pages/FarmerSettings.jsx
│   │   ├── components/
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── SecuritySettings.jsx
│   │   │   ├── NotificationSettings.jsx
│   │   │   ├── PrivacySettings.jsx
│   │   │   ├── LanguageSettings.jsx                    # English / Amharic (FR-ACCESS-006)
│   │   │   └── AppearanceSettings.jsx
│   │   ├── hooks/useFarmerSettings.js
│   │   └── services/settingsService.js
│   │
│   └── index.js                                        # exports farmer route tree
│
│
├── mobile/src/navigation/farmer/                       # ═══ MOBILE NAVIGATION ═══
│   ├── FarmerTabNavigator.tsx                          # bottom tabs: Home, Products, Orders, Messages, More
│   ├── FarmerDrawerNavigator.tsx
│   ├── FarmerStackNavigator.tsx
│   ├── DashboardStack.tsx
│   ├── ProductsStack.tsx
│   ├── OrdersStack.tsx
│   ├── ConsultationsStack.tsx
│   ├── MessagesStack.tsx
│   ├── MarketPricesStack.tsx
│   ├── ArticlesStack.tsx
│   ├── NotificationsStack.tsx
│   ├── ProfileStack.tsx
│   └── SettingsStack.tsx
│
├── mobile/src/layouts/farmer/                          # ═══ MOBILE LAYOUTS ═══
│   ├── FarmerScreenWrapper.tsx
│   ├── FarmerDrawerContent.tsx
│   ├── FarmerTabBar.tsx
│   ├── FarmerTopbar.tsx
│   ├── FarmerBreadcrumbs.tsx
│   ├── FarmerFooter.tsx
│   └── WeatherStatusIndicator.tsx
│
├── mobile/src/modules/farmer/                          # ═══ MOBILE MODULES ═══
│   │
│   ├── dashboard/
│   │   ├── screens/FarmerDashboard.screen.tsx
│   │   ├── components/
│   │   │   ├── WelcomeBanner.tsx
│   │   │   ├── FarmerStats.tsx
│   │   │   ├── SalesOverview.tsx
│   │   │   ├── RecentOrders.tsx
│   │   │   ├── TopProducts.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── WeatherWidget.tsx
│   │   ├── hooks/useFarmerDashboard.ts
│   │   └── services/dashboard.service.ts
│   │
│   ├── products/
│   │   ├── screens/
│   │   │   ├── MyProducts.screen.tsx
│   │   │   ├── AddProduct.screen.tsx
│   │   │   ├── EditProduct.screen.tsx
│   │   │   └── ProductDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductImagePicker.tsx                  # camera + multi-gallery
│   │   │   ├── ProductImageGallery.tsx                 # swipeable
│   │   │   ├── ProductStatusBadge.tsx
│   │   │   ├── CreationMethodBadge.tsx                 # direct vs assisted
│   │   │   └── ProductBulkUpload.tsx                   # CSV (optional)
│   │   ├── hooks/useFarmerProducts.ts
│   │   ├── services/product.service.ts
│   │   └── validators/productSchema.ts
│   │
│   ├── orders/
│   │   ├── screens/
│   │   │   ├── FarmerOrders.screen.tsx
│   │   │   ├── OrderDetails.screen.tsx
│   │   │   └── OrderHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── OrderFilters.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   └── OrderActionSheet.tsx                    # accept / reject / prepare
│   │   ├── hooks/useFarmerOrders.ts
│   │   └── services/order.service.ts
│   │
│   ├── consultations/
│   │   ├── screens/
│   │   │   ├── MyConsultations.screen.tsx
│   │   │   ├── NewConsultation.screen.tsx
│   │   │   ├── ConsultationDetails.screen.tsx
│   │   │   ├── FindExperts.screen.tsx
│   │   │   └── ConsultationHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── ConsultationList.tsx
│   │   │   ├── ConsultationCard.tsx
│   │   │   ├── ConsultationForm.tsx
│   │   │   ├── ExpertCard.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── ConsultationPhotoPicker.tsx            # attach crop photos
│   │   │   └── ConsultationStatusBadge.tsx
│   │   ├── hooks/useConsultations.ts
│   │   └── services/consultation.service.ts
│   │
│   ├── messages/
│   │   ├── screens/
│   │   │   ├── FarmerMessages.screen.tsx
│   │   │   └── FarmerConversation.screen.tsx
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageComposer.tsx
│   │   │   ├── MessageAttachmentPicker.tsx            # camera + doc
│   │   │   ├── VoiceMessageRecorder.tsx               # expo-av
│   │   │   └── AttachmentPreview.tsx
│   │   ├── hooks/useFarmerChat.ts
│   │   └── services/message.service.ts
│   │
│   ├── market-prices/
│   │   ├── screens/
│   │   │   ├── MarketPrices.screen.tsx
│   │   │   ├── MarketPriceDetails.screen.tsx
│   │   │   ├── PriceAlerts.screen.tsx
│   │   │   └── MarketInsights.screen.tsx
│   │   ├── components/
│   │   │   ├── MarketPriceList.tsx
│   │   │   ├── PriceTrendChart.tsx
│   │   │   ├── PriceAlertForm.tsx
│   │   │   └── MarketLocationFilter.tsx
│   │   ├── hooks/useMarketPrices.ts
│   │   └── services/marketPrice.service.ts
│   │
│   ├── articles/
│   │   ├── screens/
│   │   │   ├── ArticlesResources.screen.tsx
│   │   │   ├── ArticleDetails.screen.tsx
│   │   │   ├── SavedArticles.screen.tsx
│   │   │   └── DownloadableResources.screen.tsx
│   │   ├── components/
│   │   │   ├── FeaturedArticle.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── ArticleCategories.tsx
│   │   │   └── DownloadResourceButton.tsx            # expo-file-system
│   │   ├── hooks/useArticles.ts
│   │   └── services/article.service.ts
│   │
│   ├── profile-verification/
│   │   ├── screens/
│   │   │   ├── FarmerProfile.screen.tsx
│   │   │   ├── EditProfile.screen.tsx
│   │   │   ├── FarmDetails.screen.tsx
│   │   │   ├── MyDocuments.screen.tsx
│   │   │   └── VerificationStatus.screen.tsx
│   │   ├── components/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── AvatarPicker.tsx                       # camera + gallery
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── FarmDetailsForm.tsx
│   │   │   ├── FarmLocationPicker.tsx                 # map display-only
│   │   │   ├── AccessMethodCard.tsx                   # direct vs assisted
│   │   │   ├── DocumentPicker.tsx                     # camera + doc
│   │   │   └── VerificationTimeline.tsx
│   │   ├── hooks/useFarmerProfile.ts
│   │   ├── services/profile.service.ts
│   │   └── validators/profileSchema.ts
│   │
│   ├── reviews/
│   │   ├── screens/
│   │   │   ├── ReceivedReviews.screen.tsx
│   │   │   └── ReviewDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewSummary.tsx
│   │   │   └── ReviewFilters.tsx
│   │   ├── hooks/useFarmerReviews.ts
│   │   └── services/review.service.ts
│   │
│   ├── notifications/
│   │   ├── screens/FarmerNotifications.screen.tsx
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── NotificationFilters.tsx
│   │   │   └── NotificationPreferences.tsx
│   │   ├── hooks/useNotifications.ts
│   │   └── services/notification.service.ts
│   │
│   ├── support/
│   │   ├── screens/
│   │   │   ├── HelpCenter.screen.tsx
│   │   │   ├── ContactSupport.screen.tsx
│   │   │   ├── CreateSupportTicket.screen.tsx
│   │   │   └── SupportTicketDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── SupportTicketList.tsx
│   │   │   ├── SupportTicketForm.tsx
│   │   │   └── SupportAttachmentPicker.tsx            # camera + doc
│   │   ├── hooks/useFarmerSupport.ts
│   │   └── services/support.service.ts
│   │
│   └── settings/
│       ├── screens/
│       │   ├── FarmerSettings.screen.tsx
│       │   ├── AccountSecurity.screen.tsx
│       │   ├── NotificationSettings.screen.tsx
│       │   └── LanguagePreferences.screen.tsx
│       ├── components/
│       │   ├── AccountSettingsForm.tsx
│       │   ├── PasswordChangeForm.tsx
│       │   ├── TwoFactorSettings.tsx
│       │   ├── LanguageSelector.tsx
│       │   └── PrivacyPreferences.tsx
│       ├── hooks/useFarmerSettings.ts
│       └── services/settings.service.ts
│
│
├── client/src/i18n/locales/en/farmer.json              # ═══ I18N ═══
├── client/src/i18n/locales/am/farmer.json
├── mobile/src/i18n/locales/en/farmer.json
└── mobile/src/i18n/locales/am/farmer.json
```

---

## 🔑 Farmer Module → SRS Requirement Mapping

| SRS | Where implemented |
|---|---|
| **FR-FARMER-001..010** | `server/modules/farmer/farmer-profile/*` + web/mobile `profile-verification/*` |
| **FR-FARMER-003** (access method) | `accessMethod.model.js` + `AccessMethodCard` (both platforms) |
| **FR-MARKET-001** (create product) | `farmer-products/products.service.js` + `AddProduct` page / `AddProduct.screen.tsx` |
| **FR-MARKET-002** (required fields) | `product.model.js` + `productSchema.js` |
| **FR-MARKET-003** (image upload) | `productImage.model.js` + `ProductImageUpload` / `ProductImagePicker` |
| **FR-MARKET-006** (statuses) | `listingStatuses.js` + `ProductStatusBadge` |
| **FR-MARKET-011** (ownership check) | `listingOwnership.guard.js` |
| **FR-MARKET-018** (history) | `productHistory.model.js` |
| **FR-MARKET-019/020** (direct vs assisted + farmer as seller) | `product.model.creation_method` + `CreationMethodBadge` |
| **FR-ORDER-002/003** (record + preserve price) | `order.model.js` / `orderItem.model.js` |
| **FR-ORDER-005** (accept/reject) | `orders.service.js` + `OrderActionMenu` / `OrderActionSheet` |
| **FR-ORDER-006/007** (statuses + transitions) | `orderStatusTransition.js` + `OrderStatusBadge` / `OrderTimeline` |
| **FR-ORDER-010** (no overselling) | backend transaction in `orders.service.js` |
| **FR-CONSULT-001..012** | `farmer-consultations/*` + `consultations/*` (web) + `consultations/*` (mobile) |
| **FR-PRICE-003..005** (browse + filter + date shown) | `farmer-market-prices/*` + `MarketPrices/*` |
| **FR-ARTICLE-004..007** (browse/search/filter/EN+AM) | `farmer-articles/*` + `articles/*` |
| **FR-MESSAGE-001..007** | `farmer-messages/*` + `messages/*` |
| **FR-NOTIFY-001..010** | `farmer-notifications/*` + `notifications/*` |
| **FR-REVIEW-001..005** (receive) | `farmer-reviews/*` + `reviews/*` |
| **FR-SUPPORT-001..009** | `farmer-support/*` + `support/*` |
| **§6.3 Use Case: Direct Farmer Creates Product** | `AddProduct.jsx` + `products.service.js` |
| **§6.5 Use Case: Buyer Places an Order** (farmer receives) | `order.model` + `FarmerOrders` + `OrderActionMenu` |
| **§6.6 Use Case: Agricultural Consultation** | `NewConsultation` + `consultations.service.js` |
| **§11.2 Farmer Dashboard sections** | Every folder in `client/src/modules/farmer/` matches a §11.2 item |
| **§11.7 Mobile farmer experience** | `mobile/src/modules/farmer/*` (simple reg/login, clear product creation, image upload, order status, consultations, market info, notifications, messages, profile) |
| **§FR-ACCESS-006** (EN + AM) | `i18n/locales/{en,am}/farmer.json` |
| **§2.4 excluded** | ❌ No delivery/transport/AI modules — farmer module is clean |

---

## ✅ Summary

**Farmer module = fully delivered in 3 layers:**

1. **Backend** — 11 sub-modules under `server/src/modules/farmer/`, each with route → controller → service → repository → validator → models, plus ownership guard + order status transitions.
2. **Web (React + Vite)** — 11 sub-modules under `client/src/modules/farmer/` + 6 layout files + i18n EN/AM.
3. **Mobile (React Native + Expo)** — 11 sub-modules under `mobile/src/modules/farmer/` + navigation stacks + layouts + i18n EN/AM.

**Not included** (correctly):
- ❌ No delivery/transport/vehicle/route modules (SRS §2.4 excluded)
- ❌ No AI/ML (SRS §2.4 excluded)
- ❌ No assisted listing creation by farmer — that belongs to **Support Agent module** (`support-agent/assisted-farmer-onboarding/*`). Farmer only *sees* the badge and can request corrections (FR-ASSISTED-011), which lives in Support Agent module and surfaces here as `CreationMethodBadge` + profile `AccessMethodCard`.

👉 Want **Buyer + Service Provider module** next, or **Support Agent (with assisted flow)**?