# AgroLink Ethiopia — Service Provider Module (Complete: Backend + Web + Mobile)

**SRS coverage:** §4.1.3 (Service Provider = Input Supplier + Agricultural Expert — 2 provider types), §4.3 (access matrix), §5.5 (FEAT-INPUT — Input Supplier), §5.8 (FEAT-CONSULT — Agricultural Expert), §5.9, §5.10, §5.11, §5.12, §5.13, §5.14, §7.1, §7.3 (service provider rules BR-026..029), §11.4 (Service Provider Dashboard), §11.7 (mobile), §13.1 (record-only payments).

> **Key SRS rule (§7.3 BR-026..029):** One Service Provider account has an **approved provider type** (`input_supplier` OR `agricultural_expert`). The two types **shall not automatically share permissions**.

---

## 📦 SERVICE PROVIDER MODULE — COMPLETE STRUCTURE

```
agrolink-ethiopia/
│
├── server/src/modules/service-provider/                 # ═══ BACKEND (shared root) ═══
│   │
│   ├── provider-profile/                                # shared provider base profile
│   │   ├── providerProfile.routes.js
│   │   ├── providerProfile.controller.js
│   │   ├── providerProfile.service.js
│   │   ├── providerProfile.repository.js
│   │   ├── providerProfile.validator.js
│   │   ├── providerProfile.model.js                     # BR-026 provider_type required
│   │   └── providerVerification.service.js              # shared KYC intake
│   │
│   ├── provider-messages/                               # §5.11 shared (both provider types)
│   │   ├── messages.routes.js
│   │   ├── messages.controller.js
│   │   ├── messages.service.js
│   │   ├── messages.repository.js
│   │   ├── messages.validator.js
│   │   ├── conversation.model.js
│   │   ├── message.model.js
│   │   └── messageReport.model.js
│   │
│   ├── provider-notifications/                          # §5.12 shared
│   │   ├── notifications.routes.js
│   │   ├── notifications.controller.js
│   │   ├── notifications.service.js
│   │   ├── notifications.repository.js
│   │   └── notificationPreference.model.js
│   │
│   ├── provider-support/                                # §5.13 shared
│   │   ├── support.routes.js
│   │   ├── support.controller.js
│   │   ├── support.service.js
│   │   ├── support.repository.js
│   │   ├── supportTicket.model.js
│   │   └── supportMessage.model.js
│   │
│   ├── provider-settings/                               # shared settings (language, security)
│   │   ├── settings.routes.js
│   │   ├── settings.controller.js
│   │   ├── settings.service.js
│   │   ├── settings.repository.js
│   │   └── settings.validator.js
│   │
│   ├── input-supplier/                                  # ─── PROVIDER TYPE A: INPUT SUPPLIER ───
│   │   │
│   │   ├── supplier-dashboard/
│   │   │   ├── dashboard.routes.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── dashboard.repository.js
│   │   │   └── dashboard.validator.js
│   │   │
│   │   ├── supplier-store-profile/
│   │   │   ├── storeProfile.routes.js
│   │   │   ├── storeProfile.controller.js
│   │   │   ├── storeProfile.service.js
│   │   │   ├── storeProfile.repository.js
│   │   │   ├── storeProfile.validator.js
│   │   │   ├── storeProfile.model.js                    # storefront name, logo, address
│   │   │   ├── operatingHours.model.js
│   │   │   └── verificationBadge.model.js
│   │   │
│   │   ├── supplier-verification/
│   │   │   ├── verification.routes.js
│   │   │   ├── verification.controller.js
│   │   │   ├── verification.service.js
│   │   │   ├── verification.repository.js
│   │   │   ├── verification.validator.js
│   │   │   ├── businessLicense.model.js                 # FR-INPUT-008 (project owner defines docs)
│   │   │   ├── taxCertificate.model.js
│   │   │   └── supplierIdentity.model.js
│   │   │
│   │   ├── input-catalog/                               # §5.5 FR-INPUT-001..008
│   │   │   ├── inputCatalog.routes.js
│   │   │   ├── inputCatalog.controller.js
│   │   │   ├── inputCatalog.service.js
│   │   │   ├── inputCatalog.repository.js
│   │   │   ├── inputCatalog.validator.js
│   │   │   ├── inputProduct.model.js                    # FR-INPUT-003 required fields
│   │   │   ├── inputProductImage.model.js
│   │   │   ├── inputSpecification.model.js              # seeds/fertilizers/tools/equipment
│   │   │   ├── inputPrice.model.js
│   │   │   ├── inputAvailability.model.js
│   │   │   ├── inputCategory.model.js                   # FR-INPUT-002 categories
│   │   │   └── inputOwnership.guard.js                  # BR-005 (only own listings)
│   │   │
│   │   ├── supplier-inventory/                          # stock management
│   │   │   ├── inventory.routes.js
│   │   │   ├── inventory.controller.js
│   │   │   ├── inventory.service.js
│   │   │   ├── inventory.repository.js
│   │   │   ├── inventory.validator.js
│   │   │   ├── inventory.model.js
│   │   │   ├── stockMovement.model.js
│   │   │   ├── inventoryBatch.model.js                  # expiry tracking
│   │   │   └── lowStockAlert.service.js
│   │   │
│   │   ├── supplier-orders/                             # orders received by supplier
│   │   │   ├── supplierOrders.routes.js
│   │   │   ├── supplierOrders.controller.js
│   │   │   ├── supplierOrders.service.js
│   │   │   ├── supplierOrders.repository.js
│   │   │   ├── supplierOrders.validator.js
│   │   │   ├── supplierOrder.model.js
│   │   │   ├── supplierOrderItem.model.js
│   │   │   └── supplierOrderStatusTransition.js
│   │   │
│   │   ├── supplier-procurement-requests/               # B2B procurement + quotations
│   │   │   ├── procurementRequests.routes.js
│   │   │   ├── procurementRequests.controller.js
│   │   │   ├── procurementRequests.service.js
│   │   │   ├── procurementRequests.repository.js
│   │   │   ├── procurementRequests.validator.js
│   │   │   ├── procurementRequest.model.js
│   │   │   └── quotation.model.js
│   │   │
│   │   ├── supplier-pricing-promotions/
│   │   │   ├── pricing.routes.js
│   │   │   ├── pricing.controller.js
│   │   │   ├── pricing.service.js
│   │   │   ├── pricing.repository.js
│   │   │   ├── pricing.validator.js
│   │   │   ├── productPrice.model.js
│   │   │   ├── priceHistory.model.js
│   │   │   ├── promotion.model.js
│   │   │   └── promotionValidator.js
│   │   │
│   │   ├── supplier-customers/                          # read-only customer view
│   │   │   ├── customers.routes.js
│   │   │   ├── customers.controller.js
│   │   │   ├── customers.service.js
│   │   │   └── customers.repository.js
│   │   │
│   │   ├── supplier-finance/                            # §13.1 record-only payments
│   │   │   ├── finance.routes.js
│   │   │   ├── finance.controller.js
│   │   │   ├── finance.service.js
│   │   │   ├── finance.repository.js
│   │   │   ├── supplierPayment.model.js
│   │   │   ├── supplierPayout.model.js
│   │   │   ├── supplierInvoice.model.js
│   │   │   └── supplierRefund.model.js
│   │   │
│   │   ├── supplier-reviews/                            # §5.14 reviews received
│   │   │   ├── reviews.routes.js
│   │   │   ├── reviews.controller.js
│   │   │   ├── reviews.service.js
│   │   │   ├── reviews.repository.js
│   │   │   └── reviewReply.model.js
│   │   │
│   │   └── supplier-reports/
│   │       ├── reports.routes.js
│   │       ├── reports.controller.js
│   │       ├── reports.service.js
│   │       ├── reports.repository.js
│   │       └── analytics.repository.js
│   │
│   ├── agricultural-expert/                             # ─── PROVIDER TYPE B: AGRICULTURAL EXPERT ───
│   │   │
│   │   ├── expert-dashboard/
│   │   │   ├── dashboard.routes.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── dashboard.repository.js
│   │   │   └── dashboard.validator.js
│   │   │
│   │   ├── expert-profile/                              # FR-CONSULT-002 (permitted info)
│   │   │   ├── expertProfile.routes.js
│   │   │   ├── expertProfile.controller.js
│   │   │   ├── expertProfile.service.js
│   │   │   ├── expertProfile.repository.js
│   │   │   ├── expertProfile.validator.js
│   │   │   ├── expertProfile.model.js
│   │   │   ├── educationHistory.model.js
│   │   │   ├── professionalExperience.model.js
│   │   │   ├── languageSpoken.model.js
│   │   │   └── certification.model.js
│   │   │
│   │   ├── expert-verification/
│   │   │   ├── verification.routes.js
│   │   │   ├── verification.controller.js
│   │   │   ├── verification.service.js
│   │   │   ├── verification.repository.js
│   │   │   ├── verification.validator.js
│   │   │   ├── identityDocument.model.js
│   │   │   ├── academicCertificate.model.js
│   │   │   ├── professionalLicense.model.js
│   │   │   └── experienceEvidence.model.js
│   │   │
│   │   ├── expert-specializations/
│   │   │   ├── specializations.routes.js
│   │   │   ├── specializations.controller.js
│   │   │   ├── specializations.service.js
│   │   │   ├── specializations.repository.js
│   │   │   ├── specialization.model.js
│   │   │   └── expertSpecialization.model.js
│   │   │
│   │   ├── expert-consultation-requests/                # FR-CONSULT-004..007
│   │   │   ├── consultationRequests.routes.js
│   │   │   ├── consultationRequests.controller.js
│   │   │   ├── consultationRequests.service.js
│   │   │   ├── consultationRequests.repository.js
│   │   │   ├── consultationRequests.validator.js
│   │   │   ├── consultationRequest.model.js             # FR-CONSULT-004
│   │   │   └── requestClarification.model.js
│   │   │
│   │   ├── expert-consultations/                        # FR-CONSULT-005..008
│   │   │   ├── consultations.routes.js
│   │   │   ├── consultations.controller.js
│   │   │   ├── consultations.service.js
│   │   │   ├── consultations.repository.js
│   │   │   ├── consultations.validator.js
│   │   │   ├── consultation.model.js                    # FR-CONSULT-007
│   │   │   ├── consultationNote.model.js                # FR-CONSULT-008 outcomes
│   │   │   └── consultationStatusTransition.js
│   │   │
│   │   ├── expert-scheduling/                           # FR-CONSULT availability
│   │   │   ├── scheduling.routes.js
│   │   │   ├── scheduling.controller.js
│   │   │   ├── scheduling.service.js
│   │   │   ├── scheduling.repository.js
│   │   │   ├── scheduling.validator.js
│   │   │   ├── availability.model.js
│   │   │   ├── appointmentSlot.model.js
│   │   │   └── blockedTime.model.js
│   │   │
│   │   ├── expert-communications/                       # §5.11 with assigned farmers
│   │   │   ├── communications.routes.js
│   │   │   ├── communications.controller.js
│   │   │   ├── communications.service.js
│   │   │   ├── communications.repository.js
│   │   │   ├── expertConversation.model.js
│   │   │   └── expertMessage.model.js
│   │   │
│   │   ├── expert-case-management/                      # human-guided case records (FR-CONSULT-012)
│   │   │   ├── agriculturalCases.routes.js
│   │   │   ├── agriculturalCases.controller.js
│   │   │   ├── agriculturalCases.service.js
│   │   │   ├── agriculturalCases.repository.js
│   │   │   ├── agriculturalCases.validator.js
│   │   │   ├── agriculturalCase.model.js
│   │   │   ├── caseAssessment.model.js
│   │   │   └── caseAttachment.model.js
│   │   │
│   │   ├── expert-advice/                               # human professional advice
│   │   │   ├── advice.routes.js
│   │   │   ├── advice.controller.js
│   │   │   ├── advice.service.js
│   │   │   ├── advice.repository.js
│   │   │   ├── advice.validator.js
│   │   │   ├── agriculturalAdvice.model.js              # FR-CONSULT-012 human-provided
│   │   │   ├── adviceRecommendation.model.js
│   │   │   └── adviceFollowUp.model.js
│   │   │
│   │   ├── expert-educational-content/                  # §5.10 FR-ARTICLE (expert may author)
│   │   │   ├── educationalContent.routes.js
│   │   │   ├── educationalContent.controller.js
│   │   │   ├── educationalContent.service.js
│   │   │   ├── educationalContent.repository.js
│   │   │   ├── educationalContent.validator.js
│   │   │   ├── educationalArticle.model.js
│   │   │   └── articleCategory.model.js
│   │   │
│   │   ├── expert-resource-library/
│   │   │   ├── resources.routes.js
│   │   │   ├── resources.controller.js
│   │   │   ├── resources.service.js
│   │   │   ├── resources.repository.js
│   │   │   ├── resource.model.js
│   │   │   └── resourceDownload.model.js
│   │   │
│   │   ├── expert-earnings/                             # §13.1 record-only
│   │   │   ├── earnings.routes.js
│   │   │   ├── earnings.controller.js
│   │   │   ├── earnings.service.js
│   │   │   ├── earnings.repository.js
│   │   │   ├── expertPayment.model.js
│   │   │   ├── expertPayout.model.js
│   │   │   └── earningsTransaction.model.js
│   │   │
│   │   ├── expert-reviews/                              # §5.14
│   │   │   ├── reviews.routes.js
│   │   │   ├── reviews.controller.js
│   │   │   ├── reviews.service.js
│   │   │   ├── reviews.repository.js
│   │   │   ├── review.model.js
│   │   │   └── reviewReply.model.js
│   │   │
│   │   ├── expert-analytics/
│   │   │   ├── analytics.routes.js
│   │   │   ├── analytics.controller.js
│   │   │   ├── analytics.service.js
│   │   │   └── analytics.repository.js
│   │   │
│   │   └── expert-reports/
│   │       ├── reports.routes.js
│   │       ├── reports.controller.js
│   │       ├── reports.service.js
│   │       └── reports.repository.js
│   │
│   └── index.js                                         # mounts: /api/v1/service-providers (shared)
│                                                        #         /api/v1/input-suppliers (type A)
│                                                        #         /api/v1/experts (type B)
│                                                        # + middleware enforcing BR-027/028/029
│
│
├── client/src/layouts/service-provider/                 # ═══ WEB LAYOUTS ═══ (§11.4)
│   ├── InputSupplierLayout.jsx
│   ├── InputSupplierSidebar.jsx
│   ├── InputSupplierTopbar.jsx
│   ├── InputSupplierNavigation.jsx
│   ├── InputSupplierMobileMenu.jsx
│   ├── InputSupplierBreadcrumbs.jsx
│   ├── InputSupplierFooter.jsx
│   ├── ExpertLayout.jsx
│   ├── ExpertSidebar.jsx
│   ├── ExpertTopbar.jsx
│   ├── ExpertNavigation.jsx
│   ├── ExpertMobileMenu.jsx
│   ├── ExpertBreadcrumbs.jsx
│   ├── ExpertFooter.jsx
│   ├── ProviderLayoutRouter.jsx                         # BR-029 — routes by provider_type
│   └── ProviderTypeMismatchGuard.jsx                    # blocks cross-type access
│
├── client/src/modules/service-provider/                 # ═══ WEB MODULES ═══
│   │
│   ├── shared/                                          # shared between both provider types
│   │   ├── messages/
│   │   │   ├── pages/ProviderMessagesPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   ├── ConversationView.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── MessageComposer.jsx
│   │   │   │   ├── AttachmentPreview.jsx
│   │   │   │   └── ConversationSearch.jsx
│   │   │   ├── hooks/useProviderMessages.js
│   │   │   └── services/messagesService.js
│   │   ├── notifications/
│   │   │   ├── pages/ProviderNotificationsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── NotificationCenter.jsx
│   │   │   │   ├── NotificationItem.jsx
│   │   │   │   ├── NotificationPreferences.jsx
│   │   │   │   └── NotificationFilters.jsx
│   │   │   ├── hooks/useProviderNotifications.js
│   │   │   └── services/notificationsService.js
│   │   ├── support/
│   │   │   ├── pages/
│   │   │   │   ├── ProviderSupportPage.jsx
│   │   │   │   ├── CreateSupportTicketPage.jsx
│   │   │   │   └── SupportTicketDetailsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── SupportTicketTable.jsx
│   │   │   │   ├── SupportTicketForm.jsx
│   │   │   │   ├── TicketPriorityBadge.jsx
│   │   │   │   └── SupportConversation.jsx
│   │   │   ├── hooks/useProviderSupport.js
│   │   │   └── services/supportService.js
│   │   └── settings/
│   │       ├── pages/
│   │       │   ├── ProviderSettingsPage.jsx
│   │       │   ├── AccountSecurityPage.jsx
│   │       │   ├── NotificationSettingsPage.jsx
│   │       │   └── LanguagePreferencesPage.jsx
│   │       ├── components/
│   │       │   ├── AccountSettingsForm.jsx
│   │       │   ├── PasswordChangeForm.jsx
│   │       │   ├── TwoFactorSettings.jsx
│   │       │   ├── LanguageSelector.jsx                # EN / AM
│   │       │   └── PrivacyPreferences.jsx
│   │       ├── hooks/useProviderSettings.js
│   │       └── services/settingsService.js
│   │
│   ├── input-supplier/                                  # ─── PROVIDER TYPE A ───
│   │   │
│   │   ├── dashboard/                                   # §11.4 Input Supplier Overview
│   │   │   ├── pages/InputSupplierDashboard.jsx
│   │   │   ├── components/
│   │   │   │   ├── DashboardWelcome.jsx
│   │   │   │   ├── SupplierStatsCards.jsx
│   │   │   │   ├── SalesOverviewChart.jsx
│   │   │   │   ├── RevenueAnalyticsChart.jsx
│   │   │   │   ├── TopSellingInputs.jsx
│   │   │   │   ├── LowStockAlerts.jsx
│   │   │   │   ├── RecentOrders.jsx
│   │   │   │   ├── RecentTransactions.jsx
│   │   │   │   ├── PendingOrderSummary.jsx
│   │   │   │   ├── QuickActions.jsx
│   │   │   │   ├── InventorySummary.jsx
│   │   │   │   └── MarketDemandOverview.jsx
│   │   │   ├── hooks/useSupplierDashboard.js
│   │   │   └── services/dashboardService.js
│   │   │
│   │   ├── store-profile/                               # §11.4 store-profile
│   │   │   ├── pages/
│   │   │   │   ├── SupplierProfilePage.jsx
│   │   │   │   ├── EditSupplierProfilePage.jsx
│   │   │   │   └── StorefrontPreviewPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── SupplierProfileHeader.jsx
│   │   │   │   ├── BusinessInformationForm.jsx
│   │   │   │   ├── StorefrontBrandingForm.jsx
│   │   │   │   ├── StorefrontLogoUploader.jsx
│   │   │   │   ├── StorefrontBannerUploader.jsx
│   │   │   │   ├── BusinessAddressForm.jsx
│   │   │   │   ├── BusinessContactDetails.jsx
│   │   │   │   ├── SupplierVerificationBadge.jsx
│   │   │   │   ├── BusinessOperatingHours.jsx
│   │   │   │   └── StorefrontPreview.jsx
│   │   │   ├── hooks/useSupplierProfile.js
│   │   │   ├── services/supplierProfileService.js
│   │   │   └── validators/supplierProfileSchema.js
│   │   │
│   │   ├── verification/                                # FR-INPUT-008
│   │   │   ├── pages/
│   │   │   │   ├── SupplierVerificationPage.jsx
│   │   │   │   └── VerificationStatusPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── VerificationProgress.jsx
│   │   │   │   ├── BusinessLicenseUpload.jsx
│   │   │   │   ├── TaxCertificateUpload.jsx
│   │   │   │   ├── SupplierIdentityForm.jsx
│   │   │   │   ├── VerificationDocumentList.jsx
│   │   │   │   ├── VerificationTimeline.jsx
│   │   │   │   └── VerificationStatusCard.jsx
│   │   │   ├── hooks/useSupplierVerification.js
│   │   │   ├── services/verificationService.js
│   │   │   └── validators/verificationSchema.js
│   │   │
│   │   ├── input-catalog/                               # §11.4 My Input Products / Add
│   │   │   ├── pages/
│   │   │   │   ├── InputCatalogPage.jsx
│   │   │   │   ├── CreateInputPage.jsx                  # FR-INPUT-001
│   │   │   │   ├── EditInputPage.jsx
│   │   │   │   ├── InputDetailsPage.jsx
│   │   │   │   └── ArchivedInputsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── InputCatalogTable.jsx
│   │   │   │   ├── InputCatalogGrid.jsx
│   │   │   │   ├── InputCard.jsx
│   │   │   │   ├── InputImageGallery.jsx
│   │   │   │   ├── InputImageUpload.jsx
│   │   │   │   ├── InputCategorySelector.jsx            # seeds, fertilizers, tools, equipment
│   │   │   │   ├── InputInformationForm.jsx
│   │   │   │   ├── InputSpecificationsForm.jsx
│   │   │   │   ├── InputPricingForm.jsx
│   │   │   │   ├── InputAvailabilityToggle.jsx          # FR-INPUT-003
│   │   │   │   ├── InputSearchBar.jsx
│   │   │   │   ├── InputFilters.jsx
│   │   │   │   ├── InputBulkUpload.jsx
│   │   │   │   ├── InputCatalogPagination.jsx
│   │   │   │   └── InputStatusBadge.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useInputCatalog.js
│   │   │   │   └── useInputDetails.js
│   │   │   ├── services/inputCatalogService.js
│   │   │   └── validators/inputSchema.js
│   │   │
│   │   ├── categories/                                  # FR-INPUT-002
│   │   │   ├── pages/
│   │   │   │   ├── InputCategoriesPage.jsx
│   │   │   │   └── InputCategoryDetailsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── CategoryGrid.jsx
│   │   │   │   ├── CategoryCard.jsx
│   │   │   │   ├── CategoryForm.jsx
│   │   │   │   └── CategoryProductCount.jsx
│   │   │   ├── hooks/useCategories.js
│   │   │   └── services/categoryService.js
│   │   │
│   │   ├── inventory/                                   # §11.4 Inventory
│   │   │   ├── pages/
│   │   │   │   ├── InventoryOverviewPage.jsx
│   │   │   │   ├── StockItemsPage.jsx
│   │   │   │   ├── StockMovementsPage.jsx
│   │   │   │   ├── LowStockPage.jsx
│   │   │   │   ├── ExpiringInputsPage.jsx
│   │   │   │   └── InventoryAdjustmentsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── InventoryStatsCards.jsx
│   │   │   │   ├── InventoryTable.jsx
│   │   │   │   ├── StockMovementTable.jsx
│   │   │   │   ├── StockAdjustmentForm.jsx
│   │   │   │   ├── StockInForm.jsx
│   │   │   │   ├── StockOutForm.jsx
│   │   │   │   ├── LowStockAlertCard.jsx
│   │   │   │   ├── ExpiryDateBadge.jsx
│   │   │   │   ├── BatchTrackingTable.jsx
│   │   │   │   ├── InventorySearchFilters.jsx
│   │   │   │   └── InventoryExportButton.jsx
│   │   │   ├── hooks/useInventory.js
│   │   │   ├── services/inventoryService.js
│   │   │   └── validators/inventorySchema.js
│   │   │
│   │   ├── supplier-orders/                             # §11.4 Orders
│   │   │   ├── pages/
│   │   │   │   ├── SupplierOrdersPage.jsx
│   │   │   │   ├── OrderDetailsPage.jsx
│   │   │   │   ├── NewOrdersPage.jsx
│   │   │   │   ├── ProcessingOrdersPage.jsx
│   │   │   │   ├── ReadyForDispatchPage.jsx
│   │   │   │   ├── CompletedOrdersPage.jsx
│   │   │   │   └── CancelledOrdersPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── SupplierOrderTable.jsx
│   │   │   │   ├── SupplierOrderCard.jsx
│   │   │   │   ├── OrderStatusBadge.jsx
│   │   │   │   ├── OrderDetailsPanel.jsx
│   │   │   │   ├── OrderItemsList.jsx
│   │   │   │   ├── OrderTimeline.jsx
│   │   │   │   ├── AcceptOrderDialog.jsx
│   │   │   │   ├── RejectOrderDialog.jsx
│   │   │   │   ├── ProcessingStatusForm.jsx
│   │   │   │   ├── ReadyForDispatchAction.jsx           # "ready" status only (no delivery mgmt)
│   │   │   │   ├── OrderSearchFilters.jsx
│   │   │   │   └── OrderExportButton.jsx
│   │   │   ├── hooks/useSupplierOrders.js
│   │   │   ├── services/supplierOrdersService.js
│   │   │   └── validators/supplierOrderSchema.js
│   │   │
│   │   ├── procurement-requests/                        # B2B quotation flow
│   │   │   ├── pages/
│   │   │   │   ├── ProcurementRequestsPage.jsx
│   │   │   │   ├── ProcurementRequestDetailsPage.jsx
│   │   │   │   └── CreateQuotationPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── ProcurementRequestTable.jsx
│   │   │   │   ├── ProcurementRequestCard.jsx
│   │   │   │   ├── RequestedInputsList.jsx
│   │   │   │   ├── RequestDeadlineBadge.jsx
│   │   │   │   ├── QuotationForm.jsx
│   │   │   │   ├── QuotationItemsEditor.jsx
│   │   │   │   ├── QuotationSummary.jsx
│   │   │   │   └── RequestSearchFilters.jsx
│   │   │   ├── hooks/useProcurementRequests.js
│   │   │   ├── services/procurementRequestService.js
│   │   │   └── validators/quotationSchema.js
│   │   │
│   │   ├── pricing-promotions/
│   │   │   ├── pages/
│   │   │   │   ├── PricingManagementPage.jsx
│   │   │   │   ├── PromotionsPage.jsx
│   │   │   │   ├── CreatePromotionPage.jsx
│   │   │   │   └── PriceHistoryPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── PricingTable.jsx
│   │   │   │   ├── PriceEditor.jsx
│   │   │   │   ├── BulkPriceUpdate.jsx
│   │   │   │   ├── PromotionCard.jsx
│   │   │   │   ├── PromotionForm.jsx
│   │   │   │   ├── DiscountBadge.jsx
│   │   │   │   ├── PriceHistoryChart.jsx
│   │   │   │   └── PromotionStatusBadge.jsx
│   │   │   ├── hooks/usePricingPromotions.js
│   │   │   ├── services/pricingPromotionsService.js
│   │   │   └── validators/promotionSchema.js
│   │   │
│   │   ├── customers/                                   # customers served
│   │   │   ├── pages/
│   │   │   │   ├── CustomersPage.jsx
│   │   │   │   └── CustomerDetailsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── CustomerTable.jsx
│   │   │   │   ├── CustomerProfileCard.jsx
│   │   │   │   ├── CustomerOrderHistory.jsx
│   │   │   │   └── CustomerContactPanel.jsx
│   │   │   ├── hooks/useSupplierCustomers.js
│   │   │   └── services/customersService.js
│   │   │
│   │   ├── payments-finance/                            # §13.1 record-only
│   │   │   ├── pages/
│   │   │   │   ├── FinanceOverviewPage.jsx
│   │   │   │   ├── PaymentsPage.jsx
│   │   │   │   ├── TransactionsPage.jsx
│   │   │   │   ├── PayoutsPage.jsx
│   │   │   │   ├── InvoicesPage.jsx
│   │   │   │   ├── InvoiceDetailsPage.jsx
│   │   │   │   └── RefundsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── FinanceStatsCards.jsx
│   │   │   │   ├── PaymentTable.jsx
│   │   │   │   ├── TransactionHistoryTable.jsx
│   │   │   │   ├── PayoutSummaryCard.jsx
│   │   │   │   ├── InvoiceDocument.jsx
│   │   │   │   ├── InvoiceStatusBadge.jsx
│   │   │   │   ├── RefundRequestForm.jsx
│   │   │   │   └── FinanceFilters.jsx
│   │   │   ├── hooks/useSupplierFinance.js
│   │   │   └── services/paymentsFinanceService.js
│   │   │
│   │   ├── reviews/                                     # §11.4 Reviews
│   │   │   ├── pages/
│   │   │   │   ├── SupplierReviewsPage.jsx
│   │   │   │   └── ReviewDetailsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── ReviewSummaryCards.jsx
│   │   │   │   ├── ReviewList.jsx
│   │   │   │   ├── RatingDistributionChart.jsx
│   │   │   │   ├── ReplyToReviewForm.jsx
│   │   │   │   └── ReviewFilterBar.jsx
│   │   │   ├── hooks/useSupplierReviews.js
│   │   │   └── services/reviewsService.js
│   │   │
│   │   └── reports-analytics/
│   │       ├── pages/
│   │       │   ├── SupplierReportsPage.jsx
│   │       │   ├── SalesReportsPage.jsx
│   │       │   ├── InventoryReportsPage.jsx
│   │       │   ├── ProductPerformancePage.jsx
│   │       │   └── CustomerInsightsPage.jsx
│   │       ├── components/
│   │       │   ├── ReportDateRangePicker.jsx
│   │       │   ├── SalesReportChart.jsx
│   │       │   ├── InventoryValuationChart.jsx
│   │       │   ├── ProductPerformanceTable.jsx
│   │       │   ├── ExportReportButton.jsx
│   │       │   └── ReportSummaryCards.jsx
│   │       ├── hooks/useSupplierReports.js
│   │       └── services/reportsAnalyticsService.js
│   │
│   └── agricultural-expert/                             # ─── PROVIDER TYPE B ───
│       │
│       ├── dashboard/                                   # §11.4 Expert Overview
│       │   ├── pages/ExpertDashboard.jsx
│       │   ├── components/
│       │   │   ├── ExpertWelcome.jsx
│       │   │   ├── ExpertStatsCards.jsx
│       │   │   ├── ConsultationOverviewChart.jsx
│       │   │   ├── EarningsOverviewChart.jsx
│       │   │   ├── UpcomingConsultations.jsx
│       │   │   ├── PendingRequests.jsx
│       │   │   ├── RecentConsultations.jsx
│       │   │   ├── RecentMessages.jsx
│       │   │   ├── ExpertAvailabilityCard.jsx
│       │   │   ├── ClientFeedbackSummary.jsx
│       │   │   ├── QuickActions.jsx
│       │   │   └── ConsultationReminders.jsx
│       │   ├── hooks/useExpertDashboard.js
│       │   └── services/dashboardService.js
│       │
│       ├── expert-profile/                              # §11.4 Professional Profile
│       │   ├── pages/
│       │   │   ├── ExpertProfilePage.jsx
│       │   │   ├── EditExpertProfilePage.jsx
│       │   │   └── PublicExpertProfilePage.jsx
│       │   ├── components/
│       │   │   ├── ExpertProfileHeader.jsx
│       │   │   ├── ExpertPersonalInformationForm.jsx
│       │   │   ├── ExpertBiographyForm.jsx
│       │   │   ├── ExpertProfileImageUpload.jsx
│       │   │   ├── EducationHistoryForm.jsx
│       │   │   ├── ProfessionalExperienceForm.jsx
│       │   │   ├── SpecializationSelector.jsx
│       │   │   ├── LanguagesSpokenForm.jsx
│       │   │   ├── CertificationsList.jsx
│       │   │   ├── ExpertRatingSummary.jsx
│       │   │   └── ProfileCompletionIndicator.jsx
│       │   ├── hooks/useExpertProfile.js
│       │   ├── services/expertProfileService.js
│       │   └── validators/expertProfileSchema.js
│       │
│       ├── verification/                                # expert KYC
│       │   ├── pages/
│       │   │   ├── ExpertVerificationPage.jsx
│       │   │   └── VerificationStatusPage.jsx
│       │   ├── components/
│       │   │   ├── VerificationProgress.jsx
│       │   │   ├── IdentityDocumentUpload.jsx
│       │   │   ├── AcademicCertificateUpload.jsx
│       │   │   ├── ProfessionalLicenseUpload.jsx
│       │   │   ├── ExperienceEvidenceUpload.jsx
│       │   │   ├── VerificationDocumentList.jsx
│       │   │   ├── VerificationTimeline.jsx
│       │   │   └── VerificationStatusCard.jsx
│       │   ├── hooks/useExpertVerification.js
│       │   ├── services/expertVerificationService.js
│       │   └── validators/expertVerificationSchema.js
│       │
│       ├── specializations/                             # FR-CONSULT-002
│       │   ├── pages/
│       │   │   ├── SpecializationsPage.jsx
│       │   │   └── SpecializationDetailsPage.jsx
│       │   ├── components/
│       │   │   ├── SpecializationGrid.jsx
│       │   │   ├── SpecializationCard.jsx
│       │   │   ├── CropExpertiseSelector.jsx
│       │   │   ├── LivestockExpertiseSelector.jsx
│       │   │   ├── SoilAndWaterExpertiseSelector.jsx
│       │   │   ├── PestAndDiseaseExpertiseSelector.jsx
│       │   │   └── ExpertiseTagsEditor.jsx
│       │   ├── hooks/useSpecializations.js
│       │   └── services/specializationsService.js
│       │
│       ├── consultation-requests/                       # FR-CONSULT-005, 006
│       │   ├── pages/
│       │   │   ├── ConsultationRequestsPage.jsx
│       │   │   ├── ConsultationRequestDetailsPage.jsx
│       │   │   ├── AcceptedRequestsPage.jsx
│       │   │   └── DeclinedRequestsPage.jsx
│       │   ├── components/
│       │   │   ├── ConsultationRequestTable.jsx
│       │   │   ├── ConsultationRequestCard.jsx
│       │   │   ├── FarmerInformationPanel.jsx
│       │   │   ├── AgriculturalProblemSummary.jsx
│       │   │   ├── ProblemImageGallery.jsx
│       │   │   ├── RequestPriorityBadge.jsx
│       │   │   ├── AcceptConsultationDialog.jsx
│       │   │   ├── DeclineConsultationDialog.jsx
│       │   │   ├── RequestClarificationForm.jsx
│       │   │   └── RequestSearchFilters.jsx
│       │   ├── hooks/useConsultationRequests.js
│       │   ├── services/consultationRequestsService.js
│       │   └── validators/consultationRequestSchema.js
│       │
│       ├── consultations/                               # FR-CONSULT-007, 008
│       │   ├── pages/
│       │   │   ├── ConsultationsPage.jsx
│       │   │   ├── ConsultationDetailsPage.jsx
│       │   │   ├── UpcomingConsultationsPage.jsx
│       │   │   ├── ActiveConsultationsPage.jsx
│       │   │   ├── CompletedConsultationsPage.jsx
│       │   │   └── CancelledConsultationsPage.jsx
│       │   ├── components/
│       │   │   ├── ConsultationTable.jsx
│       │   │   ├── ConsultationCard.jsx
│       │   │   ├── ConsultationStatusBadge.jsx
│       │   │   ├── ConsultationDetailsPanel.jsx
│       │   │   ├── ConsultationTimeline.jsx
│       │   │   ├── ConsultationNotesPanel.jsx           # outcomes recorded (FR-CONSULT-008)
│       │   │   ├── ConsultationSearchFilters.jsx
│       │   │   └── ConsultationExportButton.jsx
│       │   ├── hooks/useConsultations.js
│       │   └── services/consultationsService.js
│       │
│       ├── scheduling/                                  # availability + appointments
│       │   ├── pages/
│       │   │   ├── ConsultationCalendarPage.jsx
│       │   │   ├── AvailabilityManagementPage.jsx
│       │   │   ├── AppointmentDetailsPage.jsx
│       │   │   └── BlockedTimePage.jsx
│       │   ├── components/
│       │   │   ├── ConsultationCalendar.jsx
│       │   │   ├── CalendarToolbar.jsx
│       │   │   ├── AppointmentCard.jsx
│       │   │   ├── AvailabilityScheduleForm.jsx
│       │   │   ├── WeeklyAvailabilityEditor.jsx
│       │   │   ├── DateAvailabilityPicker.jsx
│       │   │   ├── TimeSlotSelector.jsx
│       │   │   ├── BlockTimeDialog.jsx
│       │   │   ├── RescheduleAppointmentDialog.jsx
│       │   │   └── TimezoneSettings.jsx
│       │   ├── hooks/useConsultationCalendar.js
│       │   ├── services/schedulingService.js
│       │   └── validators/availabilitySchema.js
│       │
│       ├── farmer-communications/                       # §5.11 assigned farmers
│       │   ├── pages/
│       │   │   ├── FarmerCommunicationsPage.jsx
│       │   │   └── FarmerConversationPage.jsx
│       │   ├── components/
│       │   │   ├── FarmerConversationList.jsx
│       │   │   ├── ConversationHeader.jsx
│       │   │   ├── ConversationThread.jsx
│       │   │   ├── MessageComposer.jsx
│       │   │   ├── MessageAttachmentUpload.jsx
│       │   │   ├── VoiceMessageRecorder.jsx
│       │   │   ├── MessageSearch.jsx
│       │   │   └── ConversationStatusBadge.jsx
│       │   ├── hooks/useFarmerCommunications.js
│       │   └── services/farmerCommunicationsService.js
│       │
│       ├── case-management/                             # human-guided case records
│       │   ├── pages/
│       │   │   ├── AgriculturalCasesPage.jsx
│       │   │   ├── AgriculturalCaseDetailsPage.jsx
│       │   │   ├── CreateCasePage.jsx
│       │   │   └── CaseHistoryPage.jsx
│       │   ├── components/
│       │   │   ├── AgriculturalCaseTable.jsx
│       │   │   ├── CaseSummaryCard.jsx
│       │   │   ├── CaseDetailsPanel.jsx
│       │   │   ├── CropProblemForm.jsx
│       │   │   ├── LivestockProblemForm.jsx
│       │   │   ├── SoilProblemForm.jsx
│       │   │   ├── PestDiseaseAssessmentForm.jsx
│       │   │   ├── CaseAttachmentGallery.jsx
│       │   │   ├── CaseStatusTimeline.jsx
│       │   │   ├── DiagnosisNotesEditor.jsx
│       │   │   └── CaseSearchFilters.jsx
│       │   ├── hooks/useAgriculturalCases.js
│       │   ├── services/caseManagementService.js
│       │   └── validators/agriculturalCaseSchema.js
│       │
│       ├── expert-advice/                               # FR-CONSULT-012 human advice
│       │   ├── pages/
│       │   │   ├── AdviceWorkspacePage.jsx
│       │   │   ├── CreateAdvicePage.jsx
│       │   │   ├── AdviceDetailsPage.jsx
│       │   │   └── AdviceHistoryPage.jsx
│       │   ├── components/
│       │   │   ├── AdviceEditor.jsx
│       │   │   ├── AdviceTemplateSelector.jsx
│       │   │   ├── RecommendedActionsEditor.jsx
│       │   │   ├── TreatmentPlanForm.jsx
│       │   │   ├── FollowUpRecommendations.jsx
│       │   │   ├── AdviceAttachmentUploader.jsx
│       │   │   ├── AdvicePreview.jsx
│       │   │   └── AdviceStatusBadge.jsx
│       │   ├── hooks/useExpertAdvice.js
│       │   ├── services/expertAdviceService.js
│       │   └── validators/expertAdviceSchema.js
│       │
│       ├── educational-content/                         # §11.4 expert-authored articles
│       │   ├── pages/
│       │   │   ├── ExpertArticlesPage.jsx
│       │   │   ├── CreateArticlePage.jsx
│       │   │   ├── EditArticlePage.jsx
│       │   │   ├── ArticleDetailsPage.jsx
│       │   │   └── PublishedArticlesPage.jsx
│       │   ├── components/
│       │   │   ├── ArticleEditor.jsx
│       │   │   ├── ArticleMetadataForm.jsx
│       │   │   ├── ArticleCategorySelector.jsx
│       │   │   ├── ArticleCoverUploader.jsx
│       │   │   ├── RichTextEditor.jsx
│       │   │   ├── ArticlePreview.jsx
│       │   │   ├── ArticleStatusBadge.jsx
│       │   │   └── ArticlePerformanceSummary.jsx
│       │   ├── hooks/useEducationalContent.js
│       │   ├── services/educationalContentService.js
│       │   └── validators/articleSchema.js
│       │
│       ├── resource-library/
│       │   ├── pages/
│       │   │   ├── ExpertResourceLibraryPage.jsx
│       │   │   └── ResourceDetailsPage.jsx
│       │   ├── components/
│       │   │   ├── ResourceLibraryGrid.jsx
│       │   │   ├── ResourceCard.jsx
│       │   │   ├── ResourceUploadForm.jsx
│       │   │   ├── ResourceCategoryFilter.jsx
│       │   │   ├── ResourcePreview.jsx
│       │   │   └── ResourceDownloadHistory.jsx
│       │   ├── hooks/useExpertResources.js
│       │   └── services/resourceLibraryService.js
│       │
│       ├── earnings-payments/                           # §13.1 record-only
│       │   ├── pages/
│       │   │   ├── ExpertEarningsPage.jsx
│       │   │   ├── ConsultationPaymentsPage.jsx
│       │   │   ├── PayoutHistoryPage.jsx
│       │   │   └── EarningsTransactionsPage.jsx
│       │   ├── components/
│       │   │   ├── EarningsStatsCards.jsx
│       │   │   ├── EarningsOverviewChart.jsx
│       │   │   ├── ConsultationPaymentTable.jsx
│       │   │   ├── PayoutHistoryTable.jsx
│       │   │   ├── PayoutRequestForm.jsx
│       │   │   ├── PaymentStatusBadge.jsx
│       │   │   └── EarningsDateFilters.jsx
│       │   ├── hooks/useExpertEarnings.js
│       │   └── services/earningsPaymentsService.js
│       │
│       ├── reviews-ratings/                             # §5.14
│       │   ├── pages/
│       │   │   ├── ExpertReviewsPage.jsx
│       │   │   └── ReviewDetailsPage.jsx
│       │   ├── components/
│       │   │   ├── ReviewSummaryCards.jsx
│       │   │   ├── ReviewList.jsx
│       │   │   ├── RatingDistributionChart.jsx
│       │   │   ├── ReviewReplyForm.jsx
│       │   │   └── ReviewFilters.jsx
│       │   ├── hooks/useExpertReviews.js
│       │   └── services/reviewsRatingsService.js
│       │
│       ├── reports-analytics/
│       │   ├── pages/
│       │   │   ├── ExpertReportsPage.jsx
│       │   │   ├── ConsultationAnalyticsPage.jsx
│       │   │   ├── FarmerOutcomesPage.jsx
│       │   │   └── PerformanceReportsPage.jsx
│       │   ├── components/
│       │   │   ├── ConsultationVolumeChart.jsx
│       │   │   ├── ResolutionRateChart.jsx
│       │   │   ├── FarmerSatisfactionChart.jsx
│       │   │   ├── ConsultationTypeBreakdown.jsx
│       │   │   ├── ReportsDateRangePicker.jsx
│       │   │   └── ExportReportButton.jsx
│       │   ├── hooks/useExpertReports.js
│       │   └── services/reportsAnalyticsService.js
│       │
│       └── index.js
│
│
├── mobile/src/navigation/service-provider/              # ═══ MOBILE NAVIGATION ═══
│   ├── ProviderTypeRouter.tsx                            # BR-029
│   ├── input-supplier/
│   │   ├── InputSupplierTabNavigator.tsx
│   │   ├── InputSupplierDrawerNavigator.tsx
│   │   ├── InputSupplierStackNavigator.tsx
│   │   ├── DashboardStack.tsx
│   │   ├── StoreProfileStack.tsx
│   │   ├── VerificationStack.tsx
│   │   ├── CatalogStack.tsx
│   │   ├── CategoriesStack.tsx
│   │   ├── InventoryStack.tsx
│   │   ├── OrdersStack.tsx
│   │   ├── ProcurementStack.tsx
│   │   ├── PricingStack.tsx
│   │   ├── CustomersStack.tsx
│   │   ├── FinanceStack.tsx
│   │   ├── ReviewsStack.tsx
│   │   ├── ReportsStack.tsx
│   │   ├── MessagesStack.tsx
│   │   ├── NotificationsStack.tsx
│   │   ├── ProfileStack.tsx
│   │   └── SettingsStack.tsx
│   └── agricultural-expert/
│       ├── ExpertTabNavigator.tsx
│       ├── ExpertDrawerNavigator.tsx
│       ├── ExpertStackNavigator.tsx
│       ├── DashboardStack.tsx
│       ├── ProfileStack.tsx
│       ├── VerificationStack.tsx
│       ├── SpecializationsStack.tsx
│       ├── RequestsStack.tsx
│       ├── ConsultationsStack.tsx
│       ├── ScheduleStack.tsx
│       ├── CommunicationsStack.tsx
│       ├── CasesStack.tsx
│       ├── AdviceStack.tsx
│       ├── ContentStack.tsx
│       ├── ResourcesStack.tsx
│       ├── EarningsStack.tsx
│       ├── ReviewsStack.tsx
│       ├── ReportsStack.tsx
│       ├── MessagesStack.tsx
│       ├── NotificationsStack.tsx
│       └── SettingsStack.tsx
│
├── mobile/src/layouts/service-provider/                 # ═══ MOBILE LAYOUTS ═══
│   ├── ProviderScreenWrapper.tsx
│   ├── input-supplier/
│   │   ├── InputSupplierDrawerContent.tsx
│   │   ├── InputSupplierTabBar.tsx
│   │   ├── InputSupplierTopbar.tsx
│   │   ├── InputSupplierBreadcrumbs.tsx
│   │   ├── InputSupplierFooter.tsx
│   │   └── StoreStatusIndicator.tsx                     # store open/closed toggle
│   └── agricultural-expert/
│       ├── ExpertDrawerContent.tsx
│       ├── ExpertTabBar.tsx
│       ├── ExpertTopbar.tsx
│       ├── ExpertBreadcrumbs.tsx
│       ├── ExpertFooter.tsx
│       └── AvailabilityIndicator.tsx                    # online/offline toggle
│
├── mobile/src/modules/service-provider/                 # ═══ MOBILE MODULES ═══
│   │
│   ├── shared/                                          # shared mobile UI
│   │   ├── messages/
│   │   │   ├── screens/ProviderMessages.screen.tsx
│   │   │   ├── screens/ProviderConversation.screen.tsx
│   │   │   ├── components/{ConversationList,ConversationView,MessageBubble,MessageComposer,MessageAttachmentPicker,VoiceMessageRecorder,AttachmentPreview,ConversationSearch}.tsx
│   │   │   ├── hooks/useProviderMessages.ts
│   │   │   └── services/messages.service.ts
│   │   ├── notifications/
│   │   │   ├── screens/ProviderNotifications.screen.tsx
│   │   │   ├── components/{NotificationCenter,NotificationItem,NotificationPreferences,NotificationFilters}.tsx
│   │   │   ├── hooks/useProviderNotifications.ts
│   │   │   └── services/notifications.service.ts
│   │   ├── support/
│   │   │   ├── screens/{ProviderSupport,CreateSupportTicket,SupportTicketDetails}.screen.tsx
│   │   │   ├── components/{SupportTicketList,SupportTicketForm,TicketPriorityBadge,SupportConversation,SupportAttachmentPicker}.tsx
│   │   │   ├── hooks/useProviderSupport.ts
│   │   │   └── services/support.service.ts
│   │   └── settings/
│   │       ├── screens/{ProviderSettings,AccountSecurity,NotificationSettings,LanguagePreferences}.screen.tsx
│   │       ├── components/{AccountSettingsForm,PasswordChangeForm,TwoFactorSettings,LanguageSelector,PrivacyPreferences}.tsx
│   │       ├── hooks/useProviderSettings.ts
│   │       └── services/settings.service.ts
│   │
│   ├── input-supplier/                                  # ─── PROVIDER TYPE A (mobile) ───
│   │   ├── dashboard/
│   │   │   ├── screens/InputSupplierDashboard.screen.tsx
│   │   │   ├── components/{DashboardWelcome,SupplierStatsCards,SalesOverviewChart,RevenueAnalyticsChart,TopSellingInputs,LowStockAlerts,RecentOrders,RecentTransactions,PendingOrderSummary,QuickActions,InventorySummary,MarketDemandOverview}.tsx
│   │   │   ├── hooks/useSupplierDashboard.ts
│   │   │   └── services/dashboard.service.ts
│   │   ├── store-profile/
│   │   │   ├── screens/{SupplierProfile,EditSupplierProfile,StorefrontPreview}.screen.tsx
│   │   │   ├── components/{SupplierProfileHeader,BusinessInformationForm,StorefrontBrandingForm,StorefrontLogoPicker,StorefrontBannerPicker,BusinessAddressForm,BusinessContactDetails,SupplierVerificationBadge,BusinessOperatingHours,StorefrontPreview}.tsx
│   │   │   ├── hooks/useSupplierProfile.ts
│   │   │   ├── services/supplierProfile.service.ts
│   │   │   └── validators/supplierProfileSchema.ts
│   │   ├── verification/
│   │   │   ├── screens/{SupplierVerification,VerificationStatus}.screen.tsx
│   │   │   ├── components/{VerificationProgress,BusinessLicensePicker,TaxCertificatePicker,SupplierIdentityForm,VerificationDocumentList,VerificationTimeline,VerificationStatusCard}.tsx
│   │   │   ├── hooks/useSupplierVerification.ts
│   │   │   ├── services/verification.service.ts
│   │   │   └── validators/verificationSchema.ts
│   │   ├── input-catalog/
│   │   │   ├── screens/{InputCatalog,CreateInput,EditInput,InputDetails,ArchivedInputs}.screen.tsx
│   │   │   ├── components/{InputCatalogList,InputCatalogGrid,InputCard,InputImageGallery,InputImagePicker,InputCategorySelector,InputInformationForm,InputSpecificationsForm,InputPricingForm,InputAvailabilityToggle,InputSearchBar,InputFilters,InputBulkUpload,InputCatalogPagination,InputStatusBadge}.tsx
│   │   │   ├── hooks/{useInputCatalog,useInputDetails}.ts
│   │   │   ├── services/inputCatalog.service.ts
│   │   │   └── validators/inputSchema.ts
│   │   ├── categories/
│   │   │   ├── screens/{InputCategories,InputCategoryDetails}.screen.tsx
│   │   │   ├── components/{CategoryGrid,CategoryCard,CategoryForm,CategoryProductCount}.tsx
│   │   │   ├── hooks/useCategories.ts
│   │   │   └── services/category.service.ts
│   │   ├── inventory/
│   │   │   ├── screens/{InventoryOverview,StockItems,StockMovements,LowStock,ExpiringInputs,InventoryAdjustments}.screen.tsx
│   │   │   ├── components/{InventoryStatsCards,InventoryList,StockMovementList,StockAdjustmentForm,StockInForm,StockOutForm,LowStockAlertCard,ExpiryDateBadge,BatchTrackingList,BarcodeScanner,InventorySearchFilters,InventoryExportButton}.tsx
│   │   │   ├── hooks/useInventory.ts
│   │   │   ├── services/inventory.service.ts
│   │   │   └── validators/inventorySchema.ts
│   │   ├── supplier-orders/
│   │   │   ├── screens/{SupplierOrders,OrderDetails,NewOrders,ProcessingOrders,ReadyForDispatch,CompletedOrders,CancelledOrders}.screen.tsx
│   │   │   ├── components/{SupplierOrderList,SupplierOrderCard,OrderStatusBadge,OrderDetailsPanel,OrderItemsList,OrderTimeline,AcceptOrderModal,RejectOrderModal,ProcessingStatusForm,ReadyForDispatchAction,OrderSearchFilters,OrderExportButton}.tsx
│   │   │   ├── hooks/useSupplierOrders.ts
│   │   │   ├── services/supplierOrders.service.ts
│   │   │   └── validators/supplierOrderSchema.ts
│   │   ├── procurement-requests/
│   │   │   ├── screens/{ProcurementRequests,ProcurementRequestDetails,CreateQuotation}.screen.tsx
│   │   │   ├── components/{ProcurementRequestList,ProcurementRequestCard,RequestedInputsList,RequestDeadlineBadge,QuotationForm,QuotationItemsEditor,QuotationSummary,RequestSearchFilters}.tsx
│   │   │   ├── hooks/useProcurementRequests.ts
│   │   │   ├── services/procurementRequest.service.ts
│   │   │   └── validators/quotationSchema.ts
│   │   ├── pricing-promotions/
│   │   │   ├── screens/{PricingManagement,Promotions,CreatePromotion,PriceHistory}.screen.tsx
│   │   │   ├── components/{PricingList,PriceEditor,BulkPriceUpdate,PromotionCard,PromotionForm,DiscountBadge,PriceHistoryChart,PromotionStatusBadge}.tsx
│   │   │   ├── hooks/usePricingPromotions.ts
│   │   │   ├── services/pricingPromotions.service.ts
│   │   │   └── validators/promotionSchema.ts
│   │   ├── customers/
│   │   │   ├── screens/{Customers,CustomerDetails}.screen.tsx
│   │   │   ├── components/{CustomerList,CustomerProfileCard,CustomerOrderHistory,CustomerContactPanel}.tsx
│   │   │   ├── hooks/useSupplierCustomers.ts
│   │   │   └── services/customers.service.ts
│   │   ├── payments-finance/
│   │   │   ├── screens/{FinanceOverview,Payments,Transactions,Payouts,Invoices,InvoiceDetails,Refunds}.screen.tsx
│   │   │   ├── components/{FinanceStatsCards,PaymentList,TransactionHistoryList,PayoutSummaryCard,InvoiceDocument,InvoiceStatusBadge,RefundRequestForm,FinanceFilters}.tsx
│   │   │   ├── hooks/useSupplierFinance.ts
│   │   │   └── services/paymentsFinance.service.ts
│   │   ├── reviews/
│   │   │   ├── screens/{SupplierReviews,ReviewDetails}.screen.tsx
│   │   │   ├── components/{ReviewSummaryCards,ReviewList,RatingDistributionChart,ReplyToReviewForm,ReviewFilterBar}.tsx
│   │   │   ├── hooks/useSupplierReviews.ts
│   │   │   └── services/reviews.service.ts
│   │   └── reports-analytics/
│   │       ├── screens/{SupplierReports,SalesReports,InventoryReports,ProductPerformance,CustomerInsights}.screen.tsx
│   │       ├── components/{ReportDateRangePicker,SalesReportChart,InventoryValuationChart,ProductPerformanceList,ExportReportButton,ReportSummaryCards}.tsx
│   │       ├── hooks/useSupplierReports.ts
│   │       └── services/reportsAnalytics.service.ts
│   │
│   └── agricultural-expert/                             # ─── PROVIDER TYPE B (mobile) ───
│       ├── dashboard/
│       │   ├── screens/ExpertDashboard.screen.tsx
│       │   ├── components/{ExpertWelcome,ExpertStatsCards,ConsultationOverviewChart,EarningsOverviewChart,UpcomingConsultations,PendingRequests,RecentConsultations,RecentMessages,ExpertAvailabilityCard,ClientFeedbackSummary,QuickActions,ConsultationReminders}.tsx
│       │   ├── hooks/useExpertDashboard.ts
│       │   └── services/dashboard.service.ts
│       ├── expert-profile/
│       │   ├── screens/{ExpertProfile,EditExpertProfile,PublicExpertProfile}.screen.tsx
│       │   ├── components/{ExpertProfileHeader,ExpertPersonalInformationForm,ExpertBiographyForm,ExpertProfileImagePicker,EducationHistoryForm,ProfessionalExperienceForm,SpecializationSelector,LanguagesSpokenForm,CertificationsList,ExpertRatingSummary,ProfileCompletionIndicator}.tsx
│       │   ├── hooks/useExpertProfile.ts
│       │   ├── services/expertProfile.service.ts
│       │   └── validators/expertProfileSchema.ts
│       ├── verification/
│       │   ├── screens/{ExpertVerification,VerificationStatus}.screen.tsx
│       │   ├── components/{VerificationProgress,IdentityDocumentPicker,AcademicCertificatePicker,ProfessionalLicensePicker,ExperienceEvidencePicker,VerificationDocumentList,VerificationTimeline,VerificationStatusCard}.tsx
│       │   ├── hooks/useExpertVerification.ts
│       │   ├── services/expertVerification.service.ts
│       │   └── validators/expertVerificationSchema.ts
│       ├── specializations/
│       │   ├── screens/{Specializations,SpecializationDetails}.screen.tsx
│       │   ├── components/{SpecializationGrid,SpecializationCard,CropExpertiseSelector,LivestockExpertiseSelector,SoilAndWaterExpertiseSelector,PestAndDiseaseExpertiseSelector,ExpertiseTagsEditor}.tsx
│       │   ├── hooks/useSpecializations.ts
│       │   └── services/specializations.service.ts
│       ├── consultation-requests/
│       │   ├── screens/{ConsultationRequests,ConsultationRequestDetails,AcceptedRequests,DeclinedRequests}.screen.tsx
│       │   ├── components/{ConsultationRequestList,ConsultationRequestCard,FarmerInformationPanel,AgriculturalProblemSummary,ProblemImageGallery,RequestPriorityBadge,AcceptConsultationModal,DeclineConsultationModal,RequestClarificationForm,RequestSearchFilters}.tsx
│       │   ├── hooks/useConsultationRequests.ts
│       │   ├── services/consultationRequests.service.ts
│       │   └── validators/consultationRequestSchema.ts
│       ├── consultations/
│       │   ├── screens/{Consultations,ConsultationDetails,UpcomingConsultations,ActiveConsultations,CompletedConsultations,CancelledConsultations}.screen.tsx
│       │   ├── components/{ConsultationList,ConsultationCard,ConsultationStatusBadge,ConsultationDetailsPanel,ConsultationTimeline,ConsultationNotesPanel,ConsultationSearchFilters,ConsultationExportButton}.tsx
│       │   ├── hooks/useConsultations.ts
│       │   └── services/consultations.service.ts
│       ├── scheduling/
│       │   ├── screens/{ConsultationCalendar,AvailabilityManagement,AppointmentDetails,BlockedTime}.screen.tsx
│       │   ├── components/{ConsultationCalendar,CalendarToolbar,AppointmentCard,AvailabilityScheduleForm,WeeklyAvailabilityEditor,DateAvailabilityPicker,TimeSlotSelector,BlockTimeModal,RescheduleAppointmentModal,TimezoneSettings}.tsx
│       │   ├── hooks/{useConsultationCalendar,useAvailability}.ts
│       │   ├── services/scheduling.service.ts
│       │   └── validators/availabilitySchema.ts
│       ├── farmer-communications/
│       │   ├── screens/{FarmerCommunications,FarmerConversation}.screen.tsx
│       │   ├── components/{FarmerConversationList,ConversationHeader,ConversationThread,MessageComposer,MessageAttachmentPicker,VoiceMessageRecorder,MessageSearch,ConversationStatusBadge}.tsx
│       │   ├── hooks/useFarmerCommunications.ts
│       │   └── services/farmerCommunications.service.ts
│       ├── case-management/
│       │   ├── screens/{AgriculturalCases,AgriculturalCaseDetails,CreateCase,CaseHistory}.screen.tsx
│       │   ├── components/{AgriculturalCaseList,CaseSummaryCard,CaseDetailsPanel,CropProblemForm,LivestockProblemForm,SoilProblemForm,PestDiseaseAssessmentForm,CaseAttachmentGallery,CaseAttachmentPicker,CaseStatusTimeline,DiagnosisNotesEditor,CaseSearchFilters}.tsx
│       │   ├── hooks/useAgriculturalCases.ts
│       │   ├── services/caseManagement.service.ts
│       │   └── validators/agriculturalCaseSchema.ts
│       ├── expert-advice/
│       │   ├── screens/{AdviceWorkspace,CreateAdvice,AdviceDetails,AdviceHistory}.screen.tsx
│       │   ├── components/{AdviceEditor,AdviceTemplateSelector,RecommendedActionsEditor,TreatmentPlanForm,FollowUpRecommendations,AdviceAttachmentPicker,AdvicePreview,AdviceStatusBadge}.tsx
│       │   ├── hooks/useExpertAdvice.ts
│       │   ├── services/expertAdvice.service.ts
│       │   └── validators/expertAdviceSchema.ts
│       ├── educational-content/
│       │   ├── screens/{ExpertArticles,CreateArticle,EditArticle,ArticleDetails,PublishedArticles}.screen.tsx
│       │   ├── components/{ArticleEditor,RichTextEditor,ArticleMetadataForm,ArticleCategorySelector,ArticleCoverPicker,ArticlePreview,ArticleStatusBadge,ArticlePerformanceSummary}.tsx
│       │   ├── hooks/useEducationalContent.ts
│       │   ├── services/educationalContent.service.ts
│       │   └── validators/articleSchema.ts
│       ├── resource-library/
│       │   ├── screens/{ExpertResourceLibrary,ResourceDetails}.screen.tsx
│       │   ├── components/{ResourceLibraryGrid,ResourceCard,ResourceUploadForm,ResourceCategoryFilter,ResourcePreview,ResourceDownloadHistory}.tsx
│       │   ├── hooks/useExpertResources.ts
│       │   └── services/resourceLibrary.service.ts
│       ├── earnings-payments/
│       │   ├── screens/{ExpertEarnings,ConsultationPayments,PayoutHistory,EarningsTransactions}.screen.tsx
│       │   ├── components/{EarningsStatsCards,EarningsOverviewChart,ConsultationPaymentList,PayoutHistoryList,PayoutRequestForm,PaymentStatusBadge,EarningsDateFilters}.tsx
│       │   ├── hooks/useExpertEarnings.ts
│       │   └── services/earningsPayments.service.ts
│       ├── reviews-ratings/
│       │   ├── screens/{ExpertReviews,ReviewDetails}.screen.tsx
│       │   ├── components/{ReviewSummaryCards,ReviewList,RatingDistributionChart,ReviewReplyForm,ReviewFilters}.tsx
│       │   ├── hooks/useExpertReviews.ts
│       │   └── services/reviewsRatings.service.ts
│       └── reports-analytics/
│           ├── screens/{ExpertReports,ConsultationAnalytics,FarmerOutcomes,PerformanceReports}.screen.tsx
│           ├── components/{ConsultationVolumeChart,ResolutionRateChart,FarmerSatisfactionChart,ConsultationTypeBreakdown,ReportsDateRangePicker,ExportReportButton}.tsx
│           ├── hooks/useExpertReports.ts
│           └── services/reportsAnalytics.service.ts
│
│
├── client/src/i18n/locales/en/input-supplier.json       # ═══ I18N ═══
├── client/src/i18n/locales/en/agricultural-expert.json
├── client/src/i18n/locales/am/input-supplier.json
├── client/src/i18n/locales/am/agricultural-expert.json
├── mobile/src/i18n/locales/en/input-supplier.json
├── mobile/src/i18n/locales/en/agricultural-expert.json
├── mobile/src/i18n/locales/am/input-supplier.json
└── mobile/src/i18n/locales/am/agricultural-expert.json
```

---

## 🔑 Service Provider Module → SRS Requirement Mapping

| SRS Requirement | Where implemented |
|---|---|
| **§4.1.3 Service Provider = 2 provider types** | `providerProfile.model.js` (`provider_type` column) + `ProviderLayoutRouter.jsx` + `ProviderTypeRouter.tsx` |
| **BR-026 (approved provider type)** | `providerProfile.model` NOT NULL `provider_type` — enum `input_supplier` \| `agricultural_expert` |
| **BR-027 (Input Suppliers → supplier functions)** | `input-supplier/*` backend + web + mobile |
| **BR-028 (Experts → expert functions)** | `agricultural-expert/*` backend + web + mobile |
| **BR-029 (no auto-cross permissions)** | `rbac.middleware` + `ProviderTypeMismatchGuard.jsx` + `ProviderTypeRouter.tsx` |
| **FR-INPUT-001..008** | `input-supplier/input-catalog/*` + `InputCatalogPage` + `CreateInputPage` |
| **FR-INPUT-002 (categories)** | `inputCategory.model` + `InputCategorySelector` (seeds, fertilizers, tools, equipment) |
| **FR-INPUT-003 (required fields)** | `inputProduct.model` + `inputSchema.js` |
| **FR-INPUT-004 (buyers search inputs)** | Public marketplace (Buyer module) reads supplier listings |
| **FR-INPUT-005 (suppliers manage own)** | `inputOwnership.guard.js` |
| **FR-INPUT-006 (admin moderates reported)** | Admin module (not here) |
| **FR-INPUT-007 (no auto-certification)** | `verificationBadge.model` — status only; no "genuine/safe" claim |
| **FR-INPUT-008 (supplier docs defined by owner)** | `businessLicense.model` + `taxCertificate.model` + `verificationSchema.js` |
| **FR-CONSULT-001 (experts browsable)** | Public expert directory (Buyer module) reads from `expert-profile` |
| **FR-CONSULT-002 (permitted professional info)** | `expertProfile.model` + `PublicExpertProfilePage` |
| **FR-CONSULT-005 (accept/reject)** | `consultationRequests.service.js` + `AcceptConsultationDialog` / `DeclineConsultationDialog` |
| **FR-CONSULT-006 (reschedule)** | `scheduling.service.js` + `RescheduleAppointmentDialog` |
| **FR-CONSULT-007 (status)** | `consultationStatusTransition.js` + `ConsultationStatusBadge` |
| **FR-CONSULT-008 (record outcomes)** | `consultationNote.model` + `ConsultationNotesPanel` |
| **FR-CONSULT-011 (feedback)** | Buyer side leaves feedback → Expert `reviews-ratings` |
| **FR-CONSULT-012 (human experts only)** | `agriculturalAdvice.model` — no AI field; `expert-advice` module is human-only |
| **FR-ARTICLE (expert may author)** | `expert-educational-content/*` — SRS §5.10 allows Experts to author |
| **FR-MESSAGE-001..007** | `provider-messages/*` (shared) + `farmer-communications/*` (expert-specific) |
| **FR-NOTIFY-001..010** | `provider-notifications/*` (shared) |
| **FR-SUPPORT-001..009** | `provider-support/*` (shared) |
| **FR-REVIEW-001..005** | `supplier-reviews/*` + `expert-reviews/*` — receive + reply |
| **§11.4 Input Supplier pages** | Every folder in `input-supplier/*` matches §11.4 list |
| **§11.4 Agricultural Expert pages** | Every folder in `agricultural-expert/*` matches §11.4 list |
| **§13.1 record-only payments** | `supplier-finance/*` + `expert-earnings/*` — record-only mode |
| **FR-ACCESS-006 (EN + AM)** | `i18n/locales/{en,am}/input-supplier.json` + `agricultural-expert.json` |
| **§2.4 excluded** | ❌ No AI/ML, no delivery tracking, no transporter, no automated crop diagnosis — Expert advice is human-authored |
| **§3.3 operating env** | React + Vite web, React Native mobile, Node + Express + PostgreSQL backend |

---

## ✅ Service Provider module delivery summary

**3 layers × 2 provider types + shared root:**

1. **Backend** (`server/src/modules/service-provider/`):
   - **Shared** (5 sub-modules): `provider-profile`, `provider-messages`, `provider-notifications`, `provider-support`, `provider-settings`
   - **Input Supplier** (14 sub-modules): `supplier-dashboard`, `supplier-store-profile`, `supplier-verification`, `input-catalog`, `supplier-inventory`, `supplier-orders`, `supplier-procurement-requests`, `supplier-pricing-promotions`, `supplier-customers`, `supplier-finance`, `supplier-reviews`, `supplier-reports`, `supplier-inventory-alerts`
   - **Agricultural Expert** (14 sub-modules): `expert-dashboard`, `expert-profile`, `expert-verification`, `expert-specializations`, `expert-consultation-requests`, `expert-consultations`, `expert-scheduling`, `expert-communications`, `expert-case-management`, `expert-advice`, `expert-educational-content`, `expert-resource-library`, `expert-earnings`, `expert-reviews`, `expert-analytics`, `expert-reports`
   - **`index.js`** mounts `/api/v1/service-providers` (shared) + `/api/v1/input-suppliers` (type A) + `/api/v1/experts` (type B) with **BR-027/028/029 guard middleware**.

2. **Web** (`client/src/modules/service-provider/`):
   - **Shared** (4 sub-modules): `messages`, `notifications`, `support`, `settings`
   - **Input Supplier** (12 sub-modules)
   - **Agricultural Expert** (16 sub-modules)
   - **Layouts** (16 files): `InputSupplier*` + `Expert*` + `ProviderLayoutRouter` + `ProviderTypeMismatchGuard`

3. **Mobile** (`mobile/src/modules/service-provider/`):
   - **Shared** (4 sub-modules)
   - **Input Supplier** (12 sub-modules)
   - **Agricultural Expert** (16 sub-modules)
   - **Navigation** (2 type-specific nav roots + `ProviderTypeRouter`)
   - **Layouts** (2 type-specific layout folders)

**Correctly excluded per SRS v2.0:**
- ❌ No **AI/ML** for expert advice — human-only
- ❌ No **automated crop-disease diagnosis** — `case-management` is human-guided records only
- ❌ No **delivery tracking** — supplier `ReadyForDispatch` is a status flag only
- ❌ No **transporter module** — suppliers arrange transport outside platform
- ❌ No **auto-certification** of input products (§FR-INPUT-007)
- ✅ **One login** (shared auth) but **type-specific UI** (BR-029 enforced)
- ✅ **Both types share** messages/notifications/support/settings — but NOT domain functions
- ✅ **Payments record-only** in release 1

👉 Next: **Support Agent** (assisted-farmer onboarding + tickets + consent + escalation — the SRS core feature)?