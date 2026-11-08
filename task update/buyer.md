# AgroLink Ethiopia — Buyer Module (Complete: Backend + Web + Mobile)

**SRS coverage:** §4.1.2 (Buyer actor), §5.4 (marketplace browse), §5.6 (FEAT-SEARCH), §5.7 (FEAT-ORDER — buyer side), §5.8 (FEAT-CONSULT — buyer-side request), §5.9 (market prices), §5.10 (articles), §5.11 (messages), §5.12 (notifications), §5.13 (support), §5.14 (reviews), §5.15 (complaints/disputes), §6.5 (buyer places order), §6.6 (consultation), §7.1, §7.4 (order rules), §8.1 (search indexing), §11.3 (Buyer Dashboard), §11.7 (mobile buyer experience).

---

## 📦 BUYER MODULE — COMPLETE STRUCTURE

```
agrolink-ethiopia/
│
├── server/src/modules/buyer/                            # ═══ BACKEND ═══
│   │
│   ├── buyer-dashboard/
│   │   ├── dashboard.routes.js
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.service.js
│   │   ├── dashboard.repository.js
│   │   └── dashboard.validator.js                       # date range, filters
│   │
│   ├── buyer-profile/                                   # §4.1.2 profile management
│   │   ├── profile.routes.js
│   │   ├── profile.controller.js
│   │   ├── profile.service.js
│   │   ├── profile.repository.js
│   │   ├── profile.validator.js
│   │   ├── buyerProfile.model.js
│   │   ├── address.model.js                              # delivery address (record only, no delivery mgmt)
│   │   └── verificationStatus.model.js
│   │
│   ├── buyer-marketplace/                               # §5.4, §5.6 FR-MARKET-007..020, FR-SEARCH-001..009
│   │   ├── marketplace.routes.js                         # GET /api/v1/buyers/marketplace/*
│   │   ├── marketplace.controller.js
│   │   ├── marketplace.service.js
│   │   ├── marketplace.repository.js
│   │   ├── marketplace.validator.js                      # search/filter/sort schema
│   │   ├── productView.model.js                          # read-only projection
│   │   ├── categoryBrowse.service.js
│   │   ├── searchIndex.service.js                        # FR-SEARCH-007, NFR-PERF-003
│   │   ├── nearByQuery.service.js                        # location filter (FR-SEARCH-003)
│   │   └── farmerSummary.model.js
│   │
│   ├── buyer-cart/                                      # §5.7 FR-ORDER-001..002 (cart stage)
│   │   ├── cart.routes.js
│   │   ├── cart.controller.js
│   │   ├── cart.service.js
│   │   ├── cart.repository.js
│   │   ├── cart.validator.js
│   │   ├── cart.model.js
│   │   └── cartItem.model.js
│   │
│   ├── buyer-checkout/                                  # §5.7 FR-ORDER-002..004, 011
│   │   ├── checkout.routes.js
│   │   ├── checkout.controller.js
│   │   ├── checkout.service.js
│   │   ├── checkout.repository.js
│   │   ├── checkout.validator.js
│   │   ├── checkoutSession.model.js
│   │   └── priceCalculator.js                            # FR-ORDER-011 (backend computes totals)
│   │
│   ├── buyer-orders/                                    # §5.7 FR-ORDER-001..015 (buyer side)
│   │   ├── orders.routes.js
│   │   ├── orders.controller.js
│   │   ├── orders.service.js
│   │   ├── orders.repository.js
│   │   ├── orders.validator.js
│   │   ├── order.model.js                                # FR-ORDER-002, 003
│   │   ├── orderItem.model.js
│   │   ├── orderStatusTransition.js                      # FR-ORDER-006, 007 (read-only view)
│   │   ├── cancellation.service.js                       # FR-ORDER-009
│   │   └── orderHistory.model.js                         # FR-ORDER-013
│   │
│   ├── buyer-payments/                                  # §13.1 (record-only first release)
│   │   ├── payments.routes.js
│   │   ├── payments.controller.js
│   │   ├── payments.service.js
│   │   ├── payments.repository.js
│   │   ├── payments.validator.js
│   │   ├── payment.model.js                              # record status, transaction ref
│   │   ├── paymentMethod.model.js
│   │   ├── receipt.model.js
│   │   └── refundRequest.model.js
│   │
│   ├── buyer-favorites/
│   │   ├── favorites.routes.js
│   │   ├── favorites.controller.js
│   │   ├── favorites.service.js
│   │   ├── favorites.repository.js
│   │   └── favorite.model.js                             # product + farmer favourites
│   │
│   ├── buyer-consultations/                             # §5.8 FR-CONSULT-003..011 (buyer side)
│   │   ├── consultations.routes.js
│   │   ├── consultations.controller.js
│   │   ├── consultations.service.js
│   │   ├── consultations.repository.js
│   │   ├── consultations.validator.js
│   │   ├── consultationRequest.model.js                  # FR-CONSULT-004
│   │   ├── expertDirectory.service.js                    # FR-CONSULT-001, 002
│   │   └── consultation.model.js
│   │
│   ├── buyer-messages/                                  # §5.11 FR-MESSAGE-001..007
│   │   ├── messages.routes.js
│   │   ├── messages.controller.js
│   │   ├── messages.service.js
│   │   ├── messages.repository.js
│   │   ├── messages.validator.js
│   │   ├── conversation.model.js
│   │   ├── message.model.js
│   │   ├── messageRead.model.js                          # FR-MESSAGE-005
│   │   └── messageReport.model.js                        # FR-MESSAGE-006
│   │
│   ├── buyer-reviews/                                   # §5.14 FR-REVIEW-001..005
│   │   ├── reviews.routes.js
│   │   ├── reviews.controller.js
│   │   ├── reviews.service.js
│   │   ├── reviews.repository.js
│   │   ├── reviews.validator.js
│   │   ├── review.model.js
│   │   ├── reviewEligibility.js                          # FR-REVIEW-003 (must own completed order)
│   │   └── reviewReport.model.js
│   │
│   ├── buyer-disputes/                                  # §5.15 FR-DISPUTE-001..007
│   │   ├── disputes.routes.js
│   │   ├── disputes.controller.js
│   │   ├── disputes.service.js
│   │   ├── disputes.repository.js
│   │   ├── disputes.validator.js
│   │   ├── dispute.model.js                              # FR-DISPUTE-002
│   │   ├── disputeEvidence.model.js
│   │   └── disputeMessage.model.js
│   │
│   ├── buyer-market-prices/                             # §5.9 FR-PRICE-003..005 (read-only)
│   │   ├── marketPrices.routes.js
│   │   ├── marketPrices.controller.js
│   │   ├── marketPrices.service.js
│   │   └── marketPrices.repository.js
│   │
│   ├── buyer-articles/                                  # §5.10 FR-ARTICLE-004..007 (read-only)
│   │   ├── articles.routes.js
│   │   ├── articles.controller.js
│   │   ├── articles.service.js
│   │   ├── articles.repository.js
│   │   └── savedArticle.model.js
│   │
│   ├── buyer-notifications/                             # §5.12 FR-NOTIFY-001..010
│   │   ├── notifications.routes.js
│   │   ├── notifications.controller.js
│   │   ├── notifications.service.js
│   │   ├── notifications.repository.js
│   │   └── notificationPreference.model.js
│   │
│   ├── buyer-support/                                   # §5.13 FR-SUPPORT-001..009
│   │   ├── support.routes.js
│   │   ├── support.controller.js
│   │   ├── support.service.js
│   │   ├── support.repository.js
│   │   ├── support.validator.js
│   │   ├── supportTicket.model.js
│   │   └── supportMessage.model.js
│   │
│   ├── buyer-settings/
│   │   ├── settings.routes.js
│   │   ├── settings.controller.js
│   │   ├── settings.service.js
│   │   ├── settings.repository.js
│   │   └── settings.validator.js
│   │
│   └── index.js                                          # registers all /api/v1/buyers/* routes
│
│
├── client/src/layouts/buyer/                            # ═══ WEB LAYOUTS ═══ (§11.3)
│   ├── BuyerLayout.jsx
│   ├── BuyerSidebar.jsx
│   ├── BuyerTopbar.jsx
│   ├── BuyerNavigation.jsx
│   ├── BuyerMobileMenu.jsx
│   └── BuyerFooter.jsx
│
├── client/src/modules/buyer/                            # ═══ WEB MODULES ═══
│   │
│   ├── dashboard/                                       # §11.3 Overview
│   │   ├── pages/BuyerDashboard.jsx
│   │   ├── components/
│   │   │   ├── WelcomeBanner.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── RecentOrders.jsx
│   │   │   ├── RecommendedProducts.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── MarketInsights.jsx
│   │   │   └── FeaturedFarmers.jsx
│   │   ├── hooks/useBuyerDashboard.js
│   │   └── services/dashboardService.js
│   │
│   ├── marketplace/                                     # §11.3 Marketplace / Search Products
│   │   ├── pages/
│   │   │   ├── Marketplace.jsx                           # FR-MARKET-007
│   │   │   ├── ProductDetails.jsx                        # FR-MARKET-010
│   │   │   ├── CategoryProducts.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   └── NearbyProducts.jsx                        # FR-SEARCH-003
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductGallery.jsx
│   │   │   ├── ProductFilters.jsx                        # FR-SEARCH-002..005
│   │   │   ├── ProductSearch.jsx
│   │   │   ├── CategoryNavigation.jsx
│   │   │   ├── PriceRangeFilter.jsx
│   │   │   ├── LocationFilter.jsx
│   │   │   ├── SortDropdown.jsx                          # FR-SEARCH-009
│   │   │   ├── Pagination.jsx                            # FR-SEARCH-008
│   │   │   ├── FarmerSummary.jsx
│   │   │   ├── AddToCartBar.jsx
│   │   │   ├── ReportListingButton.jsx                   # FR-MARKET-015
│   │   │   └── LoginToBuyCTA.jsx                         # guest → login prompt
│   │   ├── hooks/useMarketplace.js
│   │   ├── services/marketplaceService.js
│   │   └── validators/marketplaceSchema.js
│   │
│   ├── cart/                                            # §11.3 Cart
│   │   ├── pages/
│   │   │   ├── ShoppingCart.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── components/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartItemList.jsx
│   │   │   ├── QuantitySelector.jsx
│   │   │   ├── CartPriceBreakdown.jsx
│   │   │   ├── StockAvailabilityBadge.jsx                # FR-ORDER-010
│   │   │   └── EmptyCart.jsx
│   │   ├── hooks/useCart.js
│   │   └── services/cartService.js
│   │
│   ├── checkout/                                        # §11.3 checkout flow
│   │   ├── pages/
│   │   │   ├── Checkout.jsx
│   │   │   ├── ShippingInformation.jsx                   # address record only
│   │   │   ├── PaymentSelection.jsx                      # record-only first release
│   │   │   ├── OrderReview.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── PaymentResult.jsx
│   │   ├── components/
│   │   │   ├── CheckoutSteps.jsx
│   │   │   ├── DeliveryAddressForm.jsx
│   │   │   ├── PaymentMethodCard.jsx
│   │   │   ├── OrderSummary.jsx
│   │   │   ├── CheckoutValidation.jsx
│   │   │   └── TotalPriceLockedNotice.jsx                # FR-ORDER-003
│   │   ├── hooks/useCheckout.js
│   │   ├── services/checkoutService.js
│   │   └── validators/checkoutSchema.js
│   │
│   ├── orders/                                          # §11.3 My Orders / Order Details
│   │   ├── pages/
│   │   │   ├── BuyerOrders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   ├── OrderStatus.jsx                          # in-platform status only (SRS §11.7)
│   │   │   ├── OrderHistory.jsx
│   │   │   └── CancelOrder.jsx                          # FR-ORDER-009
│   │   ├── components/
│   │   │   ├── OrderTable.jsx
│   │   │   ├── OrderCard.jsx
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   ├── OrderItems.jsx
│   │   │   ├── OrderFilters.jsx
│   │   │   └── OrderActions.jsx
│   │   ├── hooks/useBuyerOrders.js
│   │   └── services/orderService.js
│   │
│   ├── payments/                                        # §13.1 record-only
│   │   ├── pages/
│   │   │   ├── PaymentHistory.jsx
│   │   │   ├── PaymentDetails.jsx
│   │   │   ├── PaymentMethods.jsx
│   │   │   ├── PaymentReceipt.jsx
│   │   │   └── RefundRequests.jsx
│   │   ├── components/
│   │   │   ├── PaymentTable.jsx
│   │   │   ├── PaymentStatusBadge.jsx
│   │   │   ├── PaymentMethodForm.jsx
│   │   │   ├── TransactionSummary.jsx
│   │   │   └── RefundRequestForm.jsx
│   │   ├── hooks/usePayments.js
│   │   └── services/paymentService.js
│   │
│   ├── favorites/                                       # §11.3 + buyer convenience
│   │   ├── pages/
│   │   │   ├── FavoriteProducts.jsx
│   │   │   └── FavoriteFarmers.jsx
│   │   ├── components/
│   │   │   ├── FavoriteProductCard.jsx
│   │   │   ├── FavoriteFarmerCard.jsx
│   │   │   └── FavoriteButton.jsx
│   │   ├── hooks/useFavorites.js
│   │   └── services/favoriteService.js
│   │
│   ├── consultations/                                   # §11.3 + FR-CONSULT
│   │   ├── pages/
│   │   │   ├── BuyerConsultations.jsx
│   │   │   ├── FindExperts.jsx
│   │   │   ├── RequestConsultation.jsx                   # FR-CONSULT-003
│   │   │   ├── ConsultationDetails.jsx
│   │   │   └── ConsultationHistory.jsx
│   │   ├── components/
│   │   │   ├── ExpertCard.jsx
│   │   │   ├── ConsultationForm.jsx
│   │   │   ├── AppointmentCard.jsx
│   │   │   └── ConsultationStatusBadge.jsx
│   │   ├── hooks/useConsultations.js
│   │   └── services/consultationService.js
│   │
│   ├── messages/                                        # §11.3 Messages
│   │   ├── pages/BuyerMessages.jsx
│   │   ├── components/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageComposer.jsx
│   │   │   └── AttachmentPreview.jsx
│   │   ├── hooks/useBuyerChat.js
│   │   └── services/messageService.js
│   │
│   ├── reviews/                                         # §11.3 Reviews
│   │   ├── pages/
│   │   │   ├── MyReviews.jsx
│   │   │   └── WriteReview.jsx                           # FR-REVIEW-001, 003
│   │   ├── components/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── RatingInput.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewEligibilityNotice.jsx
│   │   ├── hooks/useReviews.js
│   │   └── services/reviewService.js
│   │
│   ├── disputes/                                        # §11.3 Disputes — FR-DISPUTE-001..007
│   │   ├── pages/
│   │   │   ├── MyDisputes.jsx
│   │   │   ├── CreateDispute.jsx                         # FR-DISPUTE-001
│   │   │   └── DisputeDetails.jsx                        # FR-DISPUTE-007
│   │   ├── components/
│   │   │   ├── DisputeCard.jsx
│   │   │   ├── DisputeForm.jsx
│   │   │   ├── DisputeTimeline.jsx
│   │   │   ├── DisputeEvidenceUploader.jsx
│   │   │   └── DisputeStatusBadge.jsx
│   │   ├── hooks/useDisputes.js
│   │   └── services/disputeService.js
│   │
│   ├── market-prices/                                   # §11.3 Market Prices
│   │   ├── pages/
│   │   │   ├── BuyerMarketPrices.jsx
│   │   │   ├── MarketPriceDetails.jsx
│   │   │   └── MarketInsights.jsx
│   │   ├── components/
│   │   │   ├── MarketPriceTable.jsx
│   │   │   ├── PriceTrendChart.jsx
│   │   │   └── MarketLocationFilter.jsx
│   │   ├── hooks/useMarketPrices.js
│   │   └── services/marketPriceService.js
│   │
│   ├── articles/                                        # §11.3 Articles and Resources
│   │   ├── pages/
│   │   │   ├── BuyerArticles.jsx
│   │   │   ├── ArticleDetails.jsx
│   │   │   └── SavedArticles.jsx
│   │   ├── components/
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleGrid.jsx
│   │   │   └── ArticleCategories.jsx
│   │   ├── hooks/useArticles.js
│   │   └── services/articleService.js
│   │
│   ├── profile/                                         # §11.3 Profile
│   │   ├── pages/
│   │   │   ├── BuyerProfile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Addresses.jsx
│   │   │   └── VerificationStatus.jsx
│   │   ├── components/
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── AvatarUploader.jsx
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── AddressCard.jsx
│   │   │   └── AddressForm.jsx
│   │   ├── hooks/useBuyerProfile.js
│   │   └── services/profileService.js
│   │
│   ├── notifications/                                   # §11.3 Notifications
│   │   ├── pages/BuyerNotifications.jsx
│   │   ├── components/
│   │   │   ├── NotificationList.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   └── NotificationFilters.jsx
│   │   ├── hooks/useNotifications.js
│   │   └── services/notificationService.js
│   │
│   ├── settings/                                        # §11.3 Settings
│   │   ├── pages/BuyerSettings.jsx
│   │   ├── components/
│   │   │   ├── AccountSettings.jsx
│   │   │   ├── SecuritySettings.jsx
│   │   │   ├── NotificationSettings.jsx
│   │   │   ├── PrivacySettings.jsx
│   │   │   ├── LanguageSettings.jsx                      # EN / AM (FR-ACCESS-006)
│   │   │   └── AppearanceSettings.jsx
│   │   ├── hooks/useBuyerSettings.js
│   │   └── services/settingsService.js
│   │
│   ├── support/                                         # §11.3 Support
│   │   ├── pages/
│   │   │   ├── HelpCenter.jsx
│   │   │   ├── ContactSupport.jsx
│   │   │   ├── CreateSupportTicket.jsx
│   │   │   └── SupportTicketDetails.jsx
│   │   ├── components/
│   │   │   ├── SupportTicketForm.jsx
│   │   │   ├── SupportTicketList.jsx
│   │   │   └── SupportTicketStatusBadge.jsx
│   │   ├── hooks/useBuyerSupport.js
│   │   └── services/supportService.js
│   │
│   └── index.js                                         # exports buyer route tree
│
│
├── mobile/src/navigation/buyer/                         # ═══ MOBILE NAVIGATION ═══
│   ├── BuyerTabNavigator.tsx                             # Home, Browse, Cart, Orders, More
│   ├── BuyerDrawerNavigator.tsx
│   ├── BuyerStackNavigator.tsx
│   ├── DashboardStack.tsx
│   ├── MarketplaceStack.tsx
│   ├── CartStack.tsx
│   ├── CheckoutStack.tsx
│   ├── OrdersStack.tsx
│   ├── PaymentsStack.tsx
│   ├── FavoritesStack.tsx
│   ├── ConsultationsStack.tsx
│   ├── MessagesStack.tsx
│   ├── ReviewsStack.tsx
│   ├── DisputesStack.tsx
│   ├── MarketPricesStack.tsx
│   ├── ArticlesStack.tsx
│   ├── NotificationsStack.tsx
│   ├── ProfileStack.tsx
│   └── SettingsStack.tsx
│
├── mobile/src/layouts/buyer/                            # ═══ MOBILE LAYOUTS ═══
│   ├── BuyerScreenWrapper.tsx
│   ├── BuyerDrawerContent.tsx
│   ├── BuyerTabBar.tsx                                   # + cart badge
│   ├── BuyerTopbar.tsx
│   ├── BuyerBreadcrumbs.tsx
│   ├── BuyerFooter.tsx
│   └── CartFloatingButton.tsx                            # mini-cart overlay
│
├── mobile/src/modules/buyer/                            # ═══ MOBILE MODULES ═══
│   │
│   ├── dashboard/
│   │   ├── screens/BuyerDashboard.screen.tsx
│   │   ├── components/
│   │   │   ├── WelcomeBanner.tsx
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RecentOrders.tsx
│   │   │   ├── RecommendedProducts.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── MarketInsights.tsx
│   │   │   └── FeaturedFarmers.tsx
│   │   ├── hooks/useBuyerDashboard.ts
│   │   └── services/dashboard.service.ts
│   │
│   ├── marketplace/
│   │   ├── screens/
│   │   │   ├── Marketplace.screen.tsx
│   │   │   ├── ProductDetails.screen.tsx
│   │   │   ├── CategoryProducts.screen.tsx
│   │   │   ├── SearchResults.screen.tsx
│   │   │   └── NearbyProducts.screen.tsx
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductGallery.tsx                        # swipeable
│   │   │   ├── ProductFilters.tsx
│   │   │   ├── ProductSearch.tsx
│   │   │   ├── CategoryNavigation.tsx
│   │   │   ├── PriceRangeFilter.tsx
│   │   │   ├── LocationFilter.tsx
│   │   │   ├── SortDropdown.tsx
│   │   │   ├── FarmerSummary.tsx
│   │   │   ├── ProductMapPreview.tsx                     # display-only farmer location
│   │   │   ├── AddToCartBar.tsx                          # sticky bottom CTA
│   │   │   └── ReportListingButton.tsx
│   │   ├── hooks/useMarketplace.ts
│   │   ├── services/marketplace.service.ts
│   │   └── validators/marketplaceSchema.ts
│   │
│   ├── cart/
│   │   ├── screens/
│   │   │   ├── ShoppingCart.screen.tsx
│   │   │   └── CartSummary.screen.tsx
│   │   ├── components/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartItemList.tsx
│   │   │   ├── QuantitySelector.tsx
│   │   │   ├── CartPriceBreakdown.tsx
│   │   │   ├── StockAvailabilityBadge.tsx
│   │   │   ├── EmptyCart.tsx
│   │   │   └── CartSwipeActions.tsx                      # swipe to delete
│   │   ├── hooks/useCart.ts
│   │   └── services/cart.service.ts
│   │
│   ├── checkout/
│   │   ├── screens/
│   │   │   ├── Checkout.screen.tsx
│   │   │   ├── ShippingInformation.screen.tsx
│   │   │   ├── PaymentSelection.screen.tsx
│   │   │   ├── OrderReview.screen.tsx
│   │   │   ├── OrderConfirmation.screen.tsx
│   │   │   └── PaymentResult.screen.tsx
│   │   ├── components/
│   │   │   ├── CheckoutSteps.tsx
│   │   │   ├── DeliveryAddressForm.tsx
│   │   │   ├── DeliveryLocationPicker.tsx                # map display-only
│   │   │   ├── PaymentMethodCard.tsx
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── CheckoutValidation.tsx
│   │   │   └── PaymentDeepLinkHandler.tsx                # Telebirr/Chapa return (if enabled)
│   │   ├── hooks/useCheckout.ts
│   │   ├── services/checkout.service.ts
│   │   └── validators/checkoutSchema.ts
│   │
│   ├── orders/
│   │   ├── screens/
│   │   │   ├── BuyerOrders.screen.tsx
│   │   │   ├── OrderDetails.screen.tsx
│   │   │   ├── OrderStatus.screen.tsx                    # in-platform status only
│   │   │   ├── OrderHistory.screen.tsx
│   │   │   └── CancelOrder.screen.tsx
│   │   ├── components/
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   ├── OrderTimeline.tsx
│   │   │   ├── OrderItems.tsx
│   │   │   ├── OrderFilters.tsx
│   │   │   └── OrderActions.tsx
│   │   ├── hooks/useBuyerOrders.ts
│   │   └── services/order.service.ts
│   │
│   ├── payments/
│   │   ├── screens/
│   │   │   ├── PaymentHistory.screen.tsx
│   │   │   ├── PaymentDetails.screen.tsx
│   │   │   ├── PaymentMethods.screen.tsx
│   │   │   ├── PaymentReceipt.screen.tsx
│   │   │   └── RefundRequests.screen.tsx
│   │   ├── components/
│   │   │   ├── PaymentList.tsx
│   │   │   ├── PaymentStatusBadge.tsx
│   │   │   ├── PaymentMethodForm.tsx
│   │   │   ├── TransactionSummary.tsx
│   │   │   └── RefundRequestForm.tsx
│   │   ├── hooks/usePayments.ts
│   │   └── services/payment.service.ts
│   │
│   ├── favorites/
│   │   ├── screens/
│   │   │   ├── FavoriteProducts.screen.tsx
│   │   │   └── FavoriteFarmers.screen.tsx
│   │   ├── components/
│   │   │   ├── FavoriteProductCard.tsx
│   │   │   ├── FavoriteFarmerCard.tsx
│   │   │   └── FavoriteButton.tsx
│   │   ├── hooks/useFavorites.ts
│   │   └── services/favorite.service.ts
│   │
│   ├── consultations/
│   │   ├── screens/
│   │   │   ├── BuyerConsultations.screen.tsx
│   │   │   ├── FindExperts.screen.tsx
│   │   │   ├── RequestConsultation.screen.tsx
│   │   │   ├── ConsultationDetails.screen.tsx
│   │   │   └── ConsultationHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── ExpertCard.tsx
│   │   │   ├── ConsultationForm.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   └── ConsultationStatusBadge.tsx
│   │   ├── hooks/useConsultations.ts
│   │   └── services/consultation.service.ts
│   │
│   ├── messages/
│   │   ├── screens/
│   │   │   ├── BuyerMessages.screen.tsx
│   │   │   └── BuyerConversation.screen.tsx
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageComposer.tsx
│   │   │   ├── MessageAttachmentPicker.tsx               # camera + doc
│   │   │   ├── VoiceMessageRecorder.tsx                  # expo-av
│   │   │   └── AttachmentPreview.tsx
│   │   ├── hooks/useBuyerChat.ts
│   │   └── services/message.service.ts
│   │
│   ├── reviews/
│   │   ├── screens/
│   │   │   ├── MyReviews.screen.tsx
│   │   │   └── WriteReview.screen.tsx
│   │   ├── components/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── RatingInput.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewPhotoPicker.tsx                     # camera + gallery
│   │   │   └── ReviewEligibilityNotice.tsx
│   │   ├── hooks/useReviews.ts
│   │   └── services/review.service.ts
│   │
│   ├── disputes/
│   │   ├── screens/
│   │   │   ├── MyDisputes.screen.tsx
│   │   │   ├── CreateDispute.screen.tsx
│   │   │   └── DisputeDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── DisputeCard.tsx
│   │   │   ├── DisputeForm.tsx
│   │   │   ├── DisputeTimeline.tsx
│   │   │   ├── DisputeEvidencePicker.tsx                 # camera + doc
│   │   │   └── DisputeStatusBadge.tsx
│   │   ├── hooks/useDisputes.ts
│   │   └── services/dispute.service.ts
│   │
│   ├── market-prices/
│   │   ├── screens/
│   │   │   ├── BuyerMarketPrices.screen.tsx
│   │   │   ├── MarketPriceDetails.screen.tsx
│   │   │   └── MarketInsights.screen.tsx
│   │   ├── components/
│   │   │   ├── MarketPriceList.tsx
│   │   │   ├── PriceTrendChart.tsx
│   │   │   └── MarketLocationFilter.tsx
│   │   ├── hooks/useMarketPrices.ts
│   │   └── services/marketPrice.service.ts
│   │
│   ├── articles/
│   │   ├── screens/
│   │   │   ├── BuyerArticles.screen.tsx
│   │   │   ├── ArticleDetails.screen.tsx
│   │   │   └── SavedArticles.screen.tsx
│   │   ├── components/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   └── ArticleCategories.tsx
│   │   ├── hooks/useArticles.ts
│   │   └── services/article.service.ts
│   │
│   ├── profile/
│   │   ├── screens/
│   │   │   ├── BuyerProfile.screen.tsx
│   │   │   ├── EditProfile.screen.tsx
│   │   │   ├── Addresses.screen.tsx
│   │   │   └── VerificationStatus.screen.tsx
│   │   ├── components/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── AvatarPicker.tsx                          # camera + gallery
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── AddressCard.tsx
│   │   │   └── AddressForm.tsx
│   │   ├── hooks/useBuyerProfile.ts
│   │   └── services/profile.service.ts
│   │
│   ├── notifications/
│   │   ├── screens/BuyerNotifications.screen.tsx
│   │   ├── components/
│   │   │   ├── NotificationList.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── NotificationFilters.tsx
│   │   │   └── NotificationPreferences.tsx
│   │   ├── hooks/useNotifications.ts
│   │   └── services/notification.service.ts
│   │
│   ├── settings/
│   │   ├── screens/
│   │   │   ├── BuyerSettings.screen.tsx
│   │   │   ├── AccountSecurity.screen.tsx
│   │   │   ├── NotificationSettings.screen.tsx
│   │   │   └── LanguagePreferences.screen.tsx
│   │   ├── components/
│   │   │   ├── AccountSettingsForm.tsx
│   │   │   ├── PasswordChangeForm.tsx
│   │   │   ├── TwoFactorSettings.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── PrivacyPreferences.tsx
│   │   ├── hooks/useBuyerSettings.ts
│   │   └── services/settings.service.ts
│   │
│   └── support/
│       ├── screens/
│       │   ├── HelpCenter.screen.tsx
│       │   ├── ContactSupport.screen.tsx
│       │   ├── CreateSupportTicket.screen.tsx
│       │   └── SupportTicketDetails.screen.tsx
│       ├── components/
│       │   ├── SupportTicketList.tsx
│       │   ├── SupportTicketForm.tsx
│       │   └── SupportAttachmentPicker.tsx               # camera + doc
│       ├── hooks/useBuyerSupport.ts
│       └── services/support.service.ts
│
│
├── client/src/i18n/locales/en/buyer.json                # ═══ I18N ═══
├── client/src/i18n/locales/am/buyer.json
├── mobile/src/i18n/locales/en/buyer.json
└── mobile/src/i18n/locales/am/buyer.json
```

---

## 🔑 Buyer Module → SRS Requirement Mapping

| SRS Requirement | Where implemented |
|---|---|
| **§4.1.2 Buyer actor responsibilities** | All 13 `client/src/modules/buyer/*` + `mobile/src/modules/buyer/*` |
| **FR-MARKET-007..010, 015, 017, 020** (browse, details, filter, report, availability) | `buyer-marketplace/*` + `Marketplace/*` + `ReportListingButton` |
| **FR-SEARCH-001..009** (search, filter category/location/price/availability, pagination, sort) | `marketplace.service.js`, `ProductFilters`, `SortDropdown`, `Pagination` |
| **FR-ORDER-001** (authenticated buyer creates order) | `checkout.service.js` requires auth |
| **FR-ORDER-002, 003** (record order + preserve agreed price) | `order.model.js` + `orderItem.model.js` + `TotalPriceLockedNotice` |
| **FR-ORDER-004** (confirmation workflow) | `OrderReview` → `OrderConfirmation` |
| **FR-ORDER-006, 007** (statuses + transitions) | `orderStatusTransition.js` (read-only buyer view) + `OrderStatusBadge` / `OrderTimeline` |
| **FR-ORDER-008** (only authorized participants) | `orders.repository.js` scoped by `buyer_id` |
| **FR-ORDER-009** (cancellation per policy) | `cancellation.service.js` + `CancelOrder` |
| **FR-ORDER-011** (backend computes totals) | `priceCalculator.js` — never trusted from client |
| **FR-ORDER-012** (notify relevant users) | `notificationEvents` fired on status change |
| **FR-ORDER-013** (preserve order history) | `orderHistory.model.js` |
| **FR-ORDER-014** (no transportation bookings) | ❌ no delivery module in buyer |
| **FR-ORDER-015** (no false "delivered" claim) | `OrderStatus` in-platform only (SRS §11.7) |
| **FR-CONSULT-003, 004** (submit request + record farmer/expert/subject/time) | `consultations.service.js` + `RequestConsultation` |
| **FR-CONSULT-009** (view consultation history) | `ConsultationHistory` |
| **FR-PRICE-003..005** (browse + filter + date shown) | `buyer-market-prices/*` + `MarketPriceTable` |
| **FR-ARTICLE-004..007** (browse/search/filter/EN+AM) | `buyer-articles/*` + `ArticleGrid` + `SavedArticles` |
| **FR-MESSAGE-001..007** | `buyer-messages/*` + `messages/*` |
| **FR-NOTIFY-001..010** | `buyer-notifications/*` + `notifications/*` |
| **FR-REVIEW-001..005** (submit eligible reviews) | `reviews.service.js` + `reviewEligibility.js` (must own completed order) + `WriteReview` |
| **FR-DISPUTE-001, 002, 007** (submit, record, view updates) | `buyer-disputes/*` + `MyDisputes` + `DisputeDetails` |
| **FR-SUPPORT-001, 008** (submit + view own tickets) | `buyer-support/*` + `SupportTicketList` |
| **§6.5 Use Case: Buyer Places an Order** | Full flow: `Marketplace` → `ProductDetails` → `ShoppingCart` → `Checkout` → `OrderConfirmation` → `BuyerOrders` |
| **§6.6 Use Case: Agricultural Consultation** | `FindExperts` → `RequestConsultation` → `ConsultationDetails` → `ConsultationHistory` |
| **§7.1 BR-004** (buyers shall not modify farmer listings) | No write endpoint to products — read-only `productView.model` |
| **§7.4 BR-030..035** (order rules) | `orders.service.js` + `orders.validator.js` |
| **§11.3 Buyer Dashboard sections** | Every folder in `client/src/modules/buyer/` matches a §11.3 item |
| **§11.7 Mobile buyer experience** | `mobile/src/modules/buyer/*` (product discovery, search/filter, details, cart, order creation, in-platform order tracking, messages, notifications) |
| **§13.1 payment record-only** | `payment.model.js` records status; no live gateway unless approved |
| **FR-ACCESS-006 (EN + AM)** | `i18n/locales/{en,am}/buyer.json` |
| **§2.4 excluded** | ❌ No delivery tracking module — "OrderTracking" page renamed to "OrderStatus" (in-platform status only). Payment is record-only. |

---

## ✅ Buyer module delivery summary

**3 layers, 16 sub-modules each side:**

1. **Backend** — 16 sub-modules under `server/src/modules/buyer/` with route → controller → service → repository → validator → models. Key backend-only files:
   - `searchIndex.service.js` (NFR-PERF-003 index use)
   - `priceCalculator.js` (FR-ORDER-011 — totals never trusted from client)
   - `orderStatusTransition.js` (FR-ORDER-007)
   - `reviewEligibility.js` (FR-REVIEW-003)
   - `cancellation.service.js` (FR-ORDER-009)

2. **Web (React + Vite)** — 16 sub-modules under `client/src/modules/buyer/` + 6 layout files + i18n EN/AM.

3. **Mobile (React Native + Expo)** — 16 sub-modules under `mobile/src/modules/buyer/` + 18 navigation stacks + 7 layouts + i18n EN/AM.

**Correctly excluded (SRS §2.4 + §11.7):**
- ❌ No **delivery tracking** — "OrderTracking" → **"OrderStatus"** (in-platform status only, no live map, no transporter view)
- ❌ No **transporter discovery or delivery request** in buyer module
- ❌ No **payment gateway integration** in release 1 (record-only per §13.1)
- ❌ No **AI recommendations** — "RecommendedProducts" is simple rule-based (recent categories) and not AI/ML per §2.4
- ✅ **Disputes** included — full buyer side of §5.15
- ✅ **Favorites** included — buyer convenience, not in exclusion list

👉 Next: **Service Provider** (Input Supplier + Agricultural Expert — 2 types under 1 actor)? Or **Support Agent** (assisted-farmer core)?