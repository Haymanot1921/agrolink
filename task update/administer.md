# Administrator Module — Complete (Backend + Web + Mobile)
## Single source of truth · No overlap with Project Manager delivery

> **Prerequisites (already delivered in the Project Manager Common Setup):**
> - Root + CI + `docker-compose.yml`
> - `server/src/{config,shared,sockets,jobs,database}` — shared backend infra
> - `server/src/modules/{auth,users,notifications,uploads,verification}` — shared backend modules
> - `client/src/app/*` — web router/guards/providers
> - `client/src/layouts/common/*` — public/auth/error layouts
> - `client/src/pages/{public,auth,marketplace,articles,market-prices,experts,errors,legal}` — public pages
> - `client/src/modules/auth/*` — shared login/register forms
> - `client/src/shared/*` — web design system
> - `client/src/i18n/*` — EN + AM namespaces (including `administrator.json`)
> - `mobile/src/app/*`, `mobile/src/layouts/common/*`, `mobile/src/navigation/auth/*`
> - `mobile/src/shared/*` — mobile design system
> - `mobile/src/i18n/*` — EN + AM namespaces
>
> **This delivery adds ONLY the Administrator-specific layer — 16 sub-modules in backend + web + mobile, plus admin layouts and mobile admin navigation. No duplication.**

**SRS coverage:** §4.1.5, §5.3 FR-ASSISTED-013, §5.9, §5.10, §5.14 FR-REVIEW-004, §5.15 FR-DISPUTE-004..006, §5.16, §6.8, §7.1 BR-008/009, §11.6, §11.7, §14.2, §15.3.

---

## 📦 ADMINISTRATOR MODULE STRUCTURE

```
agrolink-ethiopia/
│
├── server/src/modules/administrator/                    # ═══ BACKEND (16 sub-modules) ═══
│   │
│   ├── administrator-dashboard/                         # §11.6 Overview
│   │   ├── dashboard.routes.js
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.service.js
│   │   ├── dashboard.repository.js
│   │   └── dashboard.validator.js
│   │
│   ├── administrator-profile/
│   │   ├── administratorProfile.routes.js
│   │   ├── administratorProfile.controller.js
│   │   ├── administratorProfile.service.js
│   │   ├── administratorProfile.repository.js
│   │   ├── administratorProfile.validator.js
│   │   └── administratorSessionHistory.model.js
│   │
│   ├── access-control/                                  # FR-ADMIN-002, §4.3, §14.2
│   │   ├── accessControl.routes.js
│   │   ├── accessControl.controller.js
│   │   ├── accessControl.service.js
│   │   ├── accessControl.repository.js
│   │   ├── accessControl.validator.js
│   │   ├── role.model.js
│   │   ├── permission.model.js
│   │   ├── rolePermission.model.js
│   │   └── userRole.model.js
│   │
│   ├── user-management/                                 # FR-ADMIN-001, FR-AUTH-009, FR-AUTH-014
│   │   ├── users.routes.js
│   │   ├── users.controller.js
│   │   ├── users.service.js
│   │   ├── users.repository.js
│   │   ├── users.validator.js
│   │   ├── userStatusHistory.model.js
│   │   └── userRoleChangeLog.model.js
│   │
│   ├── farmer-management/                               # FR-ADMIN-001
│   │   ├── farmers.routes.js
│   │   ├── farmers.controller.js
│   │   ├── farmers.service.js
│   │   ├── farmers.repository.js
│   │   └── farmers.validator.js
│   │
│   ├── support-agent-management/                        # FR-ADMIN-004, BR-023
│   │   ├── supportAgents.routes.js
│   │   ├── supportAgents.controller.js
│   │   ├── supportAgents.service.js
│   │   ├── supportAgents.repository.js
│   │   ├── supportAgents.validator.js
│   │   └── supportAgentPermissionScope.model.js
│   │
│   ├── assisted-farmer-monitoring/                      # ⚠️ SRS §6.8, FR-ASSISTED-013
│   │   ├── assistedFarmer.routes.js
│   │   ├── assistedFarmer.controller.js
│   │   ├── assistedFarmer.service.js
│   │   ├── assistedFarmer.repository.js
│   │   ├── assistedFarmer.validator.js
│   │   ├── assistedActivityReview.service.js            # §6.8 step 5
│   │   ├── suspiciousActivityDetection.service.js       # §6.8 step 6
│   │   ├── assistedActionReview.model.js
│   │   ├── consentRecordReview.model.js
│   │   ├── adminReviewNote.model.js                     # §6.8 step 7
│   │   └── assistedReportsProjection.model.js           # FR-ASSISTED-013
│   │
│   ├── identity-verification/                           # FR-ADMIN-003
│   │   ├── verification.routes.js
│   │   ├── verification.controller.js
│   │   ├── verification.service.js
│   │   ├── verification.repository.js
│   │   ├── verification.validator.js
│   │   ├── verificationApplication.model.js
│   │   ├── verificationDocument.model.js
│   │   └── verificationDecision.model.js
│   │
│   ├── listing-moderation/                              # FR-ADMIN-006, FR-MARKET-016
│   │   ├── listingModeration.routes.js
│   │   ├── listingModeration.controller.js
│   │   ├── listingModeration.service.js
│   │   ├── listingModeration.repository.js
│   │   ├── listingModeration.validator.js
│   │   ├── listingReview.model.js
│   │   ├── listingReport.model.js
│   │   └── listingModerationHistory.model.js
│   │
│   ├── content-moderation/                              # §5.10 oversight
│   │   ├── contentModeration.routes.js
│   │   ├── contentModeration.controller.js
│   │   ├── contentModeration.service.js
│   │   ├── contentModeration.repository.js
│   │   ├── contentModeration.validator.js
│   │   ├── contentReport.model.js
│   │   └── contentModerationHistory.model.js
│   │
│   ├── review-moderation/                               # FR-REVIEW-004 (§5.14)
│   │   ├── reviewModeration.routes.js
│   │   ├── reviewModeration.controller.js
│   │   ├── reviewModeration.service.js
│   │   ├── reviewModeration.repository.js
│   │   ├── reviewModeration.validator.js
│   │   ├── reportedReview.model.js
│   │   └── reviewModerationHistory.model.js
│   │
│   ├── disputes-management/                             # FR-DISPUTE-004..006
│   │   ├── disputes.routes.js
│   │   ├── disputes.controller.js
│   │   ├── disputes.service.js
│   │   ├── disputes.repository.js
│   │   ├── disputes.validator.js
│   │   ├── dispute.model.js
│   │   ├── disputeEvidence.model.js
│   │   ├── disputeMessage.model.js
│   │   ├── disputeResolution.model.js
│   │   └── disputeAssignment.model.js
│   │
│   ├── support-ticket-oversight/                        # §4.1.5 "Manage support tickets"
│   │   ├── supportTickets.routes.js
│   │   ├── supportTickets.controller.js
│   │   ├── supportTickets.service.js
│   │   ├── supportTickets.repository.js
│   │   ├── supportTickets.validator.js
│   │   ├── ticketAssignment.model.js
│   │   └── ticketOversightHistory.model.js
│   │
│   ├── order-oversight/                                 # FR-ADMIN-010 (read-only)
│   │   ├── ordersOversight.routes.js
│   │   ├── ordersOversight.controller.js
│   │   ├── ordersOversight.service.js
│   │   ├── ordersOversight.repository.js
│   │   └── orderAudit.model.js
│   │
│   ├── consultation-oversight/                          # FR-ADMIN-011 (read-only)
│   │   ├── consultationsOversight.routes.js
│   │   ├── consultationsOversight.controller.js
│   │   ├── consultationsOversight.service.js
│   │   └── consultationsOversight.repository.js
│   │
│   ├── market-info-management/                          # §5.9 FR-PRICE-001..008
│   │   ├── marketInfo.routes.js
│   │   ├── marketInfo.controller.js
│   │   ├── marketInfo.service.js
│   │   ├── marketInfo.repository.js
│   │   ├── marketInfo.validator.js
│   │   ├── marketPrice.model.js                         # source + observation_date (FR-PRICE-002)
│   │   ├── marketPriceSource.model.js
│   │   └── marketPriceStatus.model.js                   # FR-PRICE-008
│   │
│   ├── educational-articles/                            # §5.10 FR-ARTICLE-001..008
│   │   ├── articles.routes.js
│   │   ├── articles.controller.js
│   │   ├── articles.service.js
│   │   ├── articles.repository.js
│   │   ├── articles.validator.js
│   │   ├── article.model.js                             # EN + AM fields (FR-ARTICLE-007)
│   │   ├── articleCategory.model.js
│   │   └── articleStatusHistory.model.js
│   │
│   ├── category-management/                             # FR-ADMIN-007
│   │   ├── categories.routes.js
│   │   ├── categories.controller.js
│   │   ├── categories.service.js
│   │   ├── categories.repository.js
│   │   ├── categories.validator.js
│   │   ├── productCategory.model.js
│   │   └── inputCategory.model.js
│   │
│   ├── reports-analytics/                               # FR-ADMIN-013
│   │   ├── reports.routes.js
│   │   ├── reports.controller.js
│   │   ├── reports.service.js
│   │   ├── reports.repository.js
│   │   ├── reportBuilder.service.js
│   │   ├── reportExport.service.js
│   │   └── reports.validator.js
│   │
│   ├── audit-logs/                                      # FR-ADMIN-014, 015, §15.3
│   │   ├── auditLogs.routes.js
│   │   ├── auditLogs.controller.js
│   │   ├── auditLogs.service.js
│   │   ├── auditLogs.repository.js
│   │   ├── auditLogs.validator.js
│   │   ├── auditLog.model.js                            # append-only
│   │   └── securityEvent.model.js
│   │
│   ├── platform-configuration/                          # FR-ADMIN-018
│   │   ├── configuration.routes.js
│   │   ├── configuration.controller.js
│   │   ├── configuration.service.js
│   │   ├── configuration.repository.js
│   │   ├── configuration.validator.js
│   │   ├── platformSetting.model.js
│   │   ├── marketplaceCategory.model.js
│   │   └── notificationSettingConfig.model.js
│   │
│   ├── notifications/                                   # Admin inbox (own)
│   │   ├── notifications.routes.js
│   │   ├── notifications.controller.js
│   │   ├── notifications.service.js
│   │   ├── notifications.repository.js
│   │   └── notificationPreference.model.js
│   │
│   ├── system-health/
│   │   ├── systemHealth.routes.js
│   │   ├── systemHealth.controller.js
│   │   ├── systemHealth.service.js
│   │   ├── systemHealth.repository.js
│   │   └── backgroundJobLog.model.js
│   │
│   ├── admin-activity/
│   │   ├── adminActivity.routes.js
│   │   ├── adminActivity.controller.js
│   │   ├── adminActivity.service.js
│   │   ├── adminActivity.repository.js
│   │   └── adminActivity.model.js
│   │
│   └── index.js                                         # mounts /api/v1/admin/* + /api/v1/assisted-farmers/reports
│                                                        # + privileged middleware requirePermission('admin')
│                                                        # + every mutating endpoint writes audit_log
│
│
├── client/src/layouts/administrator/                    # ═══ WEB LAYOUTS ═══ (§11.6)
│   ├── AdministratorLayout.jsx
│   ├── AdministratorSidebar.jsx
│   ├── AdministratorTopbar.jsx
│   ├── AdministratorNavigation.jsx
│   ├── AdministratorMobileMenu.jsx
│   ├── AdministratorBreadcrumbs.jsx
│   ├── AdministratorFooter.jsx
│   ├── SystemStatusIndicator.jsx
│   └── PrivilegedActionConfirmModal.jsx                 # BR-008
│
├── client/src/modules/administrator/                    # ═══ WEB MODULES (16 sub-modules) ═══
│   │
│   ├── dashboard/
│   │   ├── pages/AdministratorDashboard.jsx
│   │   ├── components/
│   │   │   ├── DashboardWelcome.jsx
│   │   │   ├── PlatformOverviewCards.jsx
│   │   │   ├── TotalUsersChart.jsx
│   │   │   ├── MarketplaceActivityChart.jsx
│   │   │   ├── PendingApprovalsPanel.jsx
│   │   │   ├── ModerationQueueSummary.jsx
│   │   │   ├── OpenDisputesPanel.jsx
│   │   │   ├── AssistedActivitySummary.jsx              # §6.8
│   │   │   ├── UserGrowthChart.jsx
│   │   │   ├── TransactionOverview.jsx
│   │   │   ├── PlatformHealthCards.jsx
│   │   │   ├── RecentAdminActivity.jsx
│   │   │   ├── SecurityAlertsPanel.jsx
│   │   │   └── QuickAdminActions.jsx
│   │   ├── hooks/useAdministratorDashboard.js
│   │   └── services/dashboardService.js
│   │
│   ├── access-control/
│   │   ├── pages/{AccessControlPage,RolesAndPermissionsPage,RoleDetailsPage,PermissionMatrixPage}.jsx
│   │   ├── components/{RoleTable,RoleDetailsPanel,CreateRoleDialog,EditRoleDialog,PermissionSelector,PermissionMatrix,RoleAssignmentDialog,AccessPolicyEditor,RoleStatusBadge}.jsx
│   │   ├── hooks/useAccessControl.js
│   │   ├── services/accessControlService.js
│   │   └── validators/rolePermissionSchema.js
│   │
│   ├── user-management/
│   │   ├── pages/{UsersPage,UserDetailsPage,CreateUserPage,EditUserPage,SuspendedUsersPage,UserActivityPage}.jsx
│   │   ├── components/{UsersTable,UserDetailsPanel,UserProfileSummary,UserSearchFilters,UserRoleBadge,UserStatusBadge,SuspendUserDialog,ReactivateUserDialog,UserRoleChangeDialog,UserActivityTimeline,BulkUserActions}.jsx
│   │   ├── hooks/useUserManagement.js
│   │   ├── services/userManagementService.js
│   │   └── validators/userManagementSchema.js
│   │
│   ├── farmer-management/
│   │   ├── pages/{FarmersPage,FarmerDetailsPage,FarmerListingsPage,FarmerVerificationPage}.jsx
│   │   ├── components/{FarmersTable,FarmerProfileSummary,FarmerListingsTable,FarmerSearchFilters,FarmerAccessMethodBadge}.jsx
│   │   ├── hooks/useFarmerManagement.js
│   │   └── services/farmerManagementService.js
│   │
│   ├── support-agent-management/
│   │   ├── pages/{SupportAgentsPage,SupportAgentDetailsPage,CreateSupportAgentPage}.jsx
│   │   ├── components/{SupportAgentsTable,SupportAgentProfileCard,SupportAgentPermissionScope,SupportAgentStatusBadge,SuspendAgentDialog}.jsx
│   │   ├── hooks/useSupportAgentManagement.js
│   │   └── services/supportAgentManagementService.js
│   │
│   ├── assisted-farmer-monitoring/                      # ⚠️ §6.8
│   │   ├── pages/
│   │   │   ├── AssistedFarmerManagementPage.jsx
│   │   │   ├── AssistedActionDetailsPage.jsx
│   │   │   ├── ConsentRecordsPage.jsx
│   │   │   ├── SupportAgentActivityPage.jsx
│   │   │   ├── AssistedListingsPage.jsx
│   │   │   └── AssistedServiceReportsPage.jsx
│   │   ├── components/
│   │   │   ├── AssistedActionTable.jsx
│   │   │   ├── AssistedActionDetails.jsx
│   │   │   ├── FarmerAgentActionCard.jsx
│   │   │   ├── ConsentRecordTable.jsx
│   │   │   ├── ConsentRecordDetails.jsx
│   │   │   ├── SupportAgentActivityTable.jsx
│   │   │   ├── SuspiciousActivityFlag.jsx               # §6.8 step 6
│   │   │   ├── AssistedListingTable.jsx
│   │   │   ├── ListingOwnerVerification.jsx
│   │   │   ├── AssistedServiceReportChart.jsx
│   │   │   └── AdministrativeReviewForm.jsx              # §6.8 step 7
│   │   ├── hooks/{useAssistedFarmerMonitoring,useConsentRecords,useAssistedReports}.js
│   │   ├── services/{assistedFarmerMonitoringService,consentAuditService,assistedReportsService}.js
│   │   └── validators/adminReviewSchema.js
│   │
│   ├── identity-verification/
│   │   ├── pages/{VerificationQueuePage,VerificationDetailsPage,ApprovedAccountsPage,RejectedApplicationsPage}.jsx
│   │   ├── components/{VerificationQueueTable,VerificationApplicantCard,VerificationDocumentViewer,VerificationChecklist,VerificationDecisionPanel,ApproveVerificationDialog,RejectVerificationDialog,RequestMoreInformationDialog,VerificationStatusBadge}.jsx
│   │   ├── hooks/useIdentityVerification.js
│   │   ├── services/identityVerificationService.js
│   │   └── validators/verificationDecisionSchema.js
│   │
│   ├── listing-moderation/
│   │   ├── pages/{ListingModerationPage,ListingDetailsPage,PendingListingsPage,PublishedListingsPage,RejectedListingsPage,ReportedListingsPage}.jsx
│   │   ├── components/{ListingModerationTable,ListingPreviewPanel,ListingDetailsCard,ListingCategoryBadge,ListingReportSummary,ListingModerationFilters,ApproveListingDialog,RejectListingDialog,RequestListingChangesDialog,RemoveListingDialog,ListingModerationTimeline,ListingCreationMethodBadge}.jsx
│   │   ├── hooks/useListingModeration.js
│   │   ├── services/listingModerationService.js
│   │   └── validators/listingModerationSchema.js
│   │
│   ├── content-moderation/
│   │   ├── pages/{ContentModerationPage,ArticlesModerationPage,CommentsModerationPage,ReportedContentPage,ContentDetailsPage}.jsx
│   │   ├── components/{ContentModerationTable,ContentPreviewPanel,ContentReportSummary,ContentStatusBadge,ContentModerationFilters,RemoveContentDialog,ContentModerationTimeline}.jsx
│   │   ├── hooks/useContentModeration.js
│   │   └── services/contentModerationService.js
│   │
│   ├── review-moderation/                               # FR-REVIEW-004
│   │   ├── pages/{ReviewModerationPage,ReportedReviewsPage,ReviewDetailsPage}.jsx
│   │   ├── components/{ReviewModerationTable,ReviewPreviewPanel,ReviewReportSummary,RemoveReviewDialog,ReviewModerationTimeline}.jsx
│   │   ├── hooks/useReviewModeration.js
│   │   ├── services/reviewModerationService.js
│   │   └── validators/reviewModerationSchema.js
│   │
│   ├── disputes-management/
│   │   ├── pages/{DisputesPage,DisputeDetailsPage,OpenDisputesPage,UnderReviewDisputesPage,ResolvedDisputesPage,EscalatedDisputesPage}.jsx
│   │   ├── components/{DisputesTable,DisputeDetailsPanel,DisputeStatusTimeline,DisputeEvidenceViewer,DisputePartiesCard,DisputeConversationThread,AssignDisputeDialog,RequestEvidenceDialog,DisputeResolutionForm,IssueRefundDialog,EscalateDisputeDialog,DisputeSearchFilters}.jsx
│   │   ├── hooks/useDisputesManagement.js
│   │   ├── services/disputesManagementService.js
│   │   └── validators/disputeResolutionSchema.js
│   │
│   ├── support-ticket-oversight/
│   │   ├── pages/{SupportTicketOversightPage,SupportTicketOversightDetailsPage}.jsx
│   │   ├── components/{SupportTicketOversightTable,SupportTicketOversightFilters,AssignTicketDialog,ReassignTicketDialog,TicketOversightTimeline}.jsx
│   │   ├── hooks/useSupportTicketOversight.js
│   │   └── services/supportTicketOversightService.js
│   │
│   ├── order-oversight/
│   │   ├── pages/{OrderOversightPage,OrderOversightDetailsPage}.jsx
│   │   ├── components/{OrderOversightTable,OrderOversightDetailsPanel,OrderOversightFilters}.jsx
│   │   ├── hooks/useOrderOversight.js
│   │   └── services/orderOversightService.js
│   │
│   ├── consultation-oversight/
│   │   ├── pages/{ConsultationOversightPage,ConsultationOversightDetailsPage}.jsx
│   │   ├── components/{ConsultationOversightTable,ConsultationOversightDetailsPanel,ConsultationOversightFilters}.jsx
│   │   ├── hooks/useConsultationOversight.js
│   │   └── services/consultationOversightService.js
│   │
│   ├── market-info-management/
│   │   ├── pages/{MarketPricesManagementPage,CreateMarketPricePage,EditMarketPricePage,MarketPriceSourcesPage}.jsx
│   │   ├── components/{MarketPriceTable,MarketPriceForm,MarketLocationSelector,PriceSourceForm,MarketInfoStatusBadge,MarketPriceDateNotice}.jsx
│   │   ├── hooks/useMarketInfoManagement.js
│   │   └── services/marketInfoService.js
│   │
│   ├── educational-articles/
│   │   ├── pages/{ArticlesManagementPage,CreateArticlePage,EditArticlePage,ArticleCategoriesPage}.jsx
│   │   ├── components/{ArticlesTable,ArticleForm,ArticleCategorySelector,ArticleImageUpload,ArticleStatusToggle,ArticleLanguageTabs}.jsx
│   │   ├── hooks/useEducationalArticles.js
│   │   └── services/educationalArticlesService.js
│   │
│   ├── category-management/
│   │   ├── pages/{ProductCategoriesPage,InputCategoriesPage}.jsx
│   │   ├── components/{CategoryManagementTable,CategoryEditorDialog,CategoryStatusBadge}.jsx
│   │   ├── hooks/useCategoryManagement.js
│   │   └── services/categoryManagementService.js
│   │
│   ├── reports-analytics/
│   │   ├── pages/{ReportsAnalyticsPage,UserReportsPage,MarketplaceReportsPage,FinancialReportsPage,ModerationReportsPage,DisputesReportsPage,ActivityReportsPage,AssistedServiceReportsPage,CustomReportBuilderPage}.jsx
│   │   ├── components/{ReportSummaryCards,UserGrowthChart,TransactionVolumeChart,ListingModerationChart,DisputeResolutionChart,AssistedServiceReportChart,ReportDateRangePicker,ReportFilterPanel,ReportBuilderForm,ReportPreviewTable,ExportReportButton}.jsx
│   │   ├── hooks/useReportsAnalytics.js
│   │   ├── services/reportsAnalyticsService.js
│   │   └── validators/reportBuilderSchema.js
│   │
│   ├── audit-logs/
│   │   ├── pages/{AuditLogsPage,AuditLogDetailsPage,SecurityEventsPage,AdministrativeActionsPage}.jsx
│   │   ├── components/{AuditLogsTable,AuditLogDetailsPanel,AuditEventTimeline,AuditSearchFilters,ActorInformationCard,AuditMetadataViewer,SecurityEventBadge,ExportAuditLogsButton}.jsx
│   │   ├── hooks/useAuditLogs.js
│   │   └── services/auditLogsService.js
│   │
│   ├── platform-configuration/
│   │   ├── pages/{PlatformSettingsPage,MarketplacePoliciesPage,RegionalSettingsPage,MaintenanceModePage}.jsx
│   │   ├── components/{GeneralSettingsForm,MarketplacePolicyEditor,RegionalSettingsForm,MaintenanceModeToggle,NotificationSettingsForm,ConfigurationHistory}.jsx
│   │   ├── hooks/usePlatformConfiguration.js
│   │   └── services/platformConfigurationService.js
│   │
│   ├── notifications/
│   │   ├── pages/AdministratorNotificationsPage.jsx
│   │   ├── components/{NotificationCenter,NotificationItem,NotificationFilters,NotificationPreferences}.jsx
│   │   ├── hooks/useAdministratorNotifications.js
│   │   └── services/notificationsService.js
│   │
│   ├── administrator-profile/
│   │   ├── pages/{AdministratorProfilePage,EditAdministratorProfilePage}.jsx
│   │   ├── components/{AdministratorInformationForm,AdministratorSecuritySettings,AdministratorSessionHistory}.jsx
│   │   ├── hooks/useAdministratorProfile.js
│   │   └── services/administratorProfileService.js
│   │
│   ├── system-health/
│   │   ├── pages/{SystemHealthPage,ServiceStatusPage,BackgroundJobsPage}.jsx
│   │   ├── components/{ServiceHealthCards,DatabaseHealthPanel,ApiPerformanceChart,JobExecutionTable,ErrorRateChart,SystemAlertList}.jsx
│   │   ├── hooks/useSystemHealth.js
│   │   └── services/systemHealthService.js
│   │
│   └── index.js                                         # exports admin route tree
│
│
├── mobile/src/navigation/administrator/                 # ═══ MOBILE NAVIGATION (19 stacks) ═══
│   ├── AdministratorTabNavigator.tsx
│   ├── AdministratorDrawerNavigator.tsx
│   ├── AdministratorStackNavigator.tsx
│   ├── DashboardStack.tsx
│   ├── AccessControlStack.tsx
│   ├── UserManagementStack.tsx
│   ├── FarmerManagementStack.tsx
│   ├── SupportAgentManagementStack.tsx
│   ├── AssistedFarmerStack.tsx                          # ⚠️ §6.8
│   ├── VerificationStack.tsx
│   ├── ListingModerationStack.tsx
│   ├── ContentModerationStack.tsx
│   ├── ReviewModerationStack.tsx
│   ├── DisputesStack.tsx
│   ├── SupportTicketOversightStack.tsx
│   ├── OrderOversightStack.tsx
│   ├── ConsultationOversightStack.tsx
│   ├── MarketInfoStack.tsx
│   ├── ArticlesStack.tsx
│   ├── CategoryManagementStack.tsx
│   ├── ReportsStack.tsx
│   ├── AuditLogsStack.tsx
│   ├── PlatformConfigStack.tsx
│   ├── NotificationsStack.tsx
│   ├── ProfileStack.tsx
│   └── SystemHealthStack.tsx
│
├── mobile/src/layouts/administrator/                    # ═══ MOBILE LAYOUTS ═══
│   ├── AdministratorScreenWrapper.tsx
│   ├── AdministratorDrawerContent.tsx
│   ├── AdministratorTabBar.tsx
│   ├── AdministratorTopbar.tsx
│   ├── AdministratorBreadcrumbs.tsx
│   ├── AdministratorFooter.tsx
│   ├── SystemStatusIndicator.tsx
│   └── PrivilegedActionConfirmSheet.tsx
│
├── mobile/src/modules/administrator/                    # ═══ MOBILE MODULES (16 sub-modules) ═══
│   │
│   ├── dashboard/
│   │   ├── screens/AdministratorDashboard.screen.tsx
│   │   ├── components/{DashboardWelcome,PlatformOverviewCards,TotalUsersChart,MarketplaceActivityChart,PendingApprovalsPanel,ModerationQueueSummary,OpenDisputesPanel,AssistedActivitySummary,UserGrowthChart,TransactionOverview,PlatformHealthCards,RecentAdminActivity,SecurityAlertsPanel,QuickAdminActions}.tsx
│   │   ├── hooks/useAdministratorDashboard.ts
│   │   └── services/dashboard.service.ts
│   │
│   ├── access-control/
│   │   ├── screens/{AccessControl,RolesAndPermissions,RoleDetails,PermissionMatrix}.screen.tsx
│   │   ├── components/{RoleList,RoleDetailsPanel,CreateRoleModal,EditRoleModal,PermissionSelector,PermissionMatrix,RoleAssignmentModal,AccessPolicyEditor,RoleStatusBadge}.tsx
│   │   ├── hooks/useAccessControl.ts
│   │   ├── services/accessControl.service.ts
│   │   └── validators/rolePermissionSchema.ts
│   │
│   ├── user-management/
│   │   ├── screens/{Users,UserDetails,CreateUser,EditUser,SuspendedUsers,UserActivity}.screen.tsx
│   │   ├── components/{UserList,UserDetailsPanel,UserProfileSummary,UserSearchFilters,UserRoleBadge,UserStatusBadge,SuspendUserModal,ReactivateUserModal,UserRoleChangeModal,UserActivityTimeline,BulkUserActions}.tsx
│   │   ├── hooks/useUserManagement.ts
│   │   ├── services/userManagement.service.ts
│   │   └── validators/userManagementSchema.ts
│   │
│   ├── farmer-management/
│   │   ├── screens/{Farmers,FarmerDetails,FarmerListings,FarmerVerification}.screen.tsx
│   │   ├── components/{FarmerList,FarmerProfileSummary,FarmerListingsList,FarmerSearchFilters,FarmerAccessMethodBadge}.tsx
│   │   ├── hooks/useFarmerManagement.ts
│   │   └── services/farmerManagement.service.ts
│   │
│   ├── support-agent-management/
│   │   ├── screens/{SupportAgents,SupportAgentDetails,CreateSupportAgent}.screen.tsx
│   │   ├── components/{SupportAgentList,SupportAgentProfileCard,SupportAgentPermissionScope,SupportAgentStatusBadge,SuspendAgentModal}.tsx
│   │   ├── hooks/useSupportAgentManagement.ts
│   │   └── services/supportAgentManagement.service.ts
│   │
│   ├── assisted-farmer-monitoring/                      # ⚠️ §6.8
│   │   ├── screens/{AssistedFarmerManagement,AssistedActionDetails,ConsentRecords,SupportAgentActivity,AssistedListings,AssistedServiceReports}.screen.tsx
│   │   ├── components/{AssistedActionList,AssistedActionDetailsPanel,FarmerAgentActionCard,ConsentRecordList,ConsentRecordDetails,SupportAgentActivityList,SuspiciousActivityBadge,AssistedListingList,ListingOwnerVerification,AssistedServiceReportChart,AdministrativeReviewModal}.tsx
│   │   ├── hooks/{useAssistedFarmerMonitoring,useConsentRecords,useAssistedReports}.ts
│   │   ├── services/{assistedFarmerMonitoring.service,consentAudit.service,assistedReports.service}.ts
│   │   └── validators/adminReviewSchema.ts
│   │
│   ├── identity-verification/
│   │   ├── screens/{VerificationQueue,VerificationDetails,ApprovedAccounts,RejectedApplications}.screen.tsx
│   │   ├── components/{VerificationQueueList,VerificationApplicantCard,VerificationDocumentViewer,VerificationChecklist,VerificationDecisionPanel,ApproveVerificationModal,RejectVerificationModal,RequestMoreInfoModal,VerificationStatusBadge}.tsx
│   │   ├── hooks/useIdentityVerification.ts
│   │   ├── services/identityVerification.service.ts
│   │   └── validators/verificationDecisionSchema.ts
│   │
│   ├── listing-moderation/
│   │   ├── screens/{ListingModeration,ListingDetails,PendingListings,PublishedListings,RejectedListings,ReportedListings}.screen.tsx
│   │   ├── components/{ListingModerationList,ListingPreviewPanel,ListingDetailsCard,ListingCategoryBadge,ListingReportSummary,ListingModerationFilters,ApproveListingModal,RejectListingModal,RequestListingChangesModal,RemoveListingModal,ListingModerationTimeline,ListingCreationMethodBadge}.tsx
│   │   ├── hooks/useListingModeration.ts
│   │   ├── services/listingModeration.service.ts
│   │   └── validators/listingModerationSchema.ts
│   │
│   ├── content-moderation/
│   │   ├── screens/{ContentModeration,ArticlesModeration,CommentsModeration,ReportedContent,ContentDetails}.screen.tsx
│   │   ├── components/{ContentModerationList,ContentPreviewPanel,ContentReportSummary,ContentStatusBadge,ContentModerationFilters,RemoveContentModal,ContentModerationTimeline}.tsx
│   │   ├── hooks/useContentModeration.ts
│   │   └── services/contentModeration.service.ts
│   │
│   ├── review-moderation/
│   │   ├── screens/{ReviewModeration,ReportedReviews,ReviewDetails}.screen.tsx
│   │   ├── components/{ReviewModerationList,ReviewPreviewPanel,ReviewReportSummary,RemoveReviewModal,ReviewModerationTimeline}.tsx
│   │   ├── hooks/useReviewModeration.ts
│   │   └── services/reviewModeration.service.ts
│   │
│   ├── disputes-management/
│   │   ├── screens/{Disputes,DisputeDetails,OpenDisputes,UnderReviewDisputes,ResolvedDisputes,EscalatedDisputes}.screen.tsx
│   │   ├── components/{DisputesList,DisputeDetailsPanel,DisputeStatusTimeline,DisputeEvidenceViewer,DisputePartiesCard,DisputeConversationThread,AssignDisputeModal,RequestEvidenceModal,DisputeResolutionForm,IssueRefundModal,EscalateDisputeModal,DisputeSearchFilters}.tsx
│   │   ├── hooks/useDisputesManagement.ts
│   │   ├── services/disputesManagement.service.ts
│   │   └── validators/disputeResolutionSchema.ts
│   │
│   ├── support-ticket-oversight/
│   │   ├── screens/{SupportTicketOversight,SupportTicketOversightDetails}.screen.tsx
│   │   ├── components/{SupportTicketOversightList,SupportTicketOversightFilters,AssignTicketModal,ReassignTicketModal,TicketOversightTimeline}.tsx
│   │   ├── hooks/useSupportTicketOversight.ts
│   │   └── services/supportTicketOversight.service.ts
│   │
│   ├── order-oversight/
│   │   ├── screens/{OrderOversight,OrderOversightDetails}.screen.tsx
│   │   ├── components/{OrderOversightList,OrderOversightDetailsPanel,OrderOversightFilters}.tsx
│   │   ├── hooks/useOrderOversight.ts
│   │   └── services/orderOversight.service.ts
│   │
│   ├── consultation-oversight/
│   │   ├── screens/{ConsultationOversight,ConsultationOversightDetails}.screen.tsx
│   │   ├── components/{ConsultationOversightList,ConsultationOversightDetailsPanel,ConsultationOversightFilters}.tsx
│   │   ├── hooks/useConsultationOversight.ts
│   │   └── services/consultationOversight.service.ts
│   │
│   ├── market-info-management/
│   │   ├── screens/{MarketPricesManagement,CreateMarketPrice,EditMarketPrice,MarketPriceSources}.screen.tsx
│   │   ├── components/{MarketPriceList,MarketPriceForm,MarketLocationSelector,PriceSourceForm,MarketInfoStatusBadge,MarketPriceDateNotice}.tsx
│   │   ├── hooks/useMarketInfoManagement.ts
│   │   └── services/marketInfo.service.ts
│   │
│   ├── educational-articles/
│   │   ├── screens/{ArticlesManagement,CreateArticle,EditArticle,ArticleCategories}.screen.tsx
│   │   ├── components/{ArticlesList,ArticleForm,ArticleCategorySelector,ArticleImagePicker,ArticleStatusToggle,ArticleLanguageTabs}.tsx
│   │   ├── hooks/useEducationalArticles.ts
│   │   └── services/educationalArticles.service.ts
│   │
│   ├── category-management/
│   │   ├── screens/{ProductCategories,InputCategories}.screen.tsx
│   │   ├── components/{CategoryManagementList,CategoryEditorModal,CategoryStatusBadge}.tsx
│   │   ├── hooks/useCategoryManagement.ts
│   │   └── services/categoryManagement.service.ts
│   │
│   ├── reports-analytics/
│   │   ├── screens/{ReportsAnalytics,UserReports,MarketplaceReports,FinancialReports,ModerationReports,DisputesReports,ActivityReports,AssistedServiceReports,CustomReportBuilder}.screen.tsx
│   │   ├── components/{ReportSummaryCards,UserGrowthChart,TransactionVolumeChart,ListingModerationChart,DisputeResolutionChart,AssistedServiceReportChart,ReportDateRangePicker,ReportFilterPanel,ReportBuilderForm,ReportPreviewTable,ExportReportButton}.tsx
│   │   ├── hooks/useReportsAnalytics.ts
│   │   ├── services/reportsAnalytics.service.ts
│   │   └── validators/reportBuilderSchema.ts
│   │
│   ├── audit-logs/
│   │   ├── screens/{AuditLogs,AuditLogDetails,SecurityEvents,AdministrativeActions}.screen.tsx
│   │   ├── components/{AuditLogsList,AuditLogDetailsPanel,AuditEventTimeline,AuditSearchFilters,ActorInformationCard,AuditMetadataViewer,SecurityEventBadge,ExportAuditLogsButton}.tsx
│   │   ├── hooks/useAuditLogs.ts
│   │   └── services/auditLogs.service.ts
│   │
│   ├── platform-configuration/
│   │   ├── screens/{PlatformSettings,MarketplacePolicies,RegionalSettings,MaintenanceMode}.screen.tsx
│   │   ├── components/{GeneralSettingsForm,MarketplacePolicyEditor,RegionalSettingsForm,MaintenanceModeToggle,NotificationSettingsForm,ConfigurationHistory}.tsx
│   │   ├── hooks/usePlatformConfiguration.ts
│   │   └── services/platformConfiguration.service.ts
│   │
│   ├── notifications/
│   │   ├── screens/AdministratorNotifications.screen.tsx
│   │   ├── components/{NotificationCenter,NotificationItem,NotificationFilters,NotificationPreferences}.tsx
│   │   ├── hooks/useAdministratorNotifications.ts
│   │   └── services/notifications.service.ts
│   │
│   ├── administrator-profile/
│   │   ├── screens/{AdministratorProfile,EditAdministratorProfile}.screen.tsx
│   │   ├── components/{AdministratorInformationForm,AdministratorSecuritySettings,AdministratorSessionHistory}.tsx
│   │   ├── hooks/useAdministratorProfile.ts
│   │   └── services/administratorProfile.service.ts
│   │
│   └── system-health/
│       ├── screens/{SystemHealth,ServiceStatus,BackgroundJobs}.screen.tsx
│       ├── components/{ServiceHealthCards,DatabaseHealthPanel,ApiPerformanceChart,JobExecutionTable,ErrorRateChart,SystemAlertList}.tsx
│       ├── hooks/useSystemHealth.ts
│       └── services/systemHealth.service.ts
│
│
├── server/tests/                                        # ═══ ADMIN TESTS ═══
│   ├── unit/
│   │   ├── accessControl.test.js
│   │   ├── userManagement.test.js
│   │   ├── assistedFarmerMonitoring.test.js             # §6.8
│   │   ├── identityVerification.test.js
│   │   ├── listingModeration.test.js
│   │   ├── contentModeration.test.js
│   │   ├── reviewModeration.test.js
│   │   ├── disputesManagement.test.js
│   │   ├── supportTicketOversight.test.js
│   │   ├── marketInfo.test.js
│   │   ├── educationalArticles.test.js
│   │   ├── reportsAnalytics.test.js
│   │   └── auditLogs.test.js
│   ├── integration/
│   │   ├── accessControl.api.test.js
│   │   ├── users.api.test.js
│   │   ├── assistedFarmer.api.test.js
│   │   ├── verification.api.test.js
│   │   ├── listingModeration.api.test.js
│   │   ├── reviewModeration.api.test.js
│   │   ├── supportTickets.api.test.js
│   │   ├── disputes.api.test.js
│   │   ├── reports.api.test.js
│   │   └── auditLogs.api.test.js
│   └── fixtures/
│       ├── administrator.fixture.js
│       ├── user.fixture.js
│       ├── assistedAction.fixture.js
│       ├── listing.fixture.js
│       ├── review.fixture.js
│       ├── dispute.fixture.js
│       └── auditLog.fixture.js
│
└── mobile/tests/e2e/administrator/                       # ═══ MOBILE E2E ═══
    ├── auth.e2e.ts
    ├── administrator-dashboard.e2e.ts
    ├── assisted-farmer.e2e.ts
    ├── listing-moderation.e2e.ts
    └── disputes.e2e.ts
```

---

## 🔑 Administrator Module → SRS Requirement Mapping

| SRS | Where |
|---|---|
| **FR-ADMIN-001** (manage users) | `user-management/*` + `farmer-management/*` + `support-agent-management/*` |
| **FR-ADMIN-002** (roles) | `access-control/*` + `RoleAssignmentDialog` |
| **FR-ADMIN-003** (verification) | `identity-verification/*` |
| **FR-ADMIN-004** (support agent accounts) | `support-agent-management/*` |
| **FR-ADMIN-005** (assisted activity) | `assisted-farmer-monitoring/*` |
| **FR-ADMIN-006** (listing moderation) | `listing-moderation/*` |
| **FR-ADMIN-007** (categories) | `category-management/*` |
| **FR-ADMIN-008** (articles) | `educational-articles/*` |
| **FR-ADMIN-009** (market prices) | `market-info-management/*` |
| **FR-ADMIN-010** (monitor orders) | `order-oversight/*` (read-only) |
| **FR-ADMIN-011** (monitor consultations) | `consultation-oversight/*` (read-only) |
| **FR-ADMIN-012** (disputes) | `disputes-management/*` |
| **FR-ADMIN-013** (reports) | `reports-analytics/*` |
| **FR-ADMIN-014** (audit logs) | `audit-logs/*` |
| **FR-ADMIN-015** (privileged actions logged) | `audit-logs` + `PrivilegedActionConfirmModal` |
| **FR-ADMIN-018** (notification settings) | `platform-configuration/NotificationSettingsForm` |
| **FR-ASSISTED-013** (assisted reports) | `assisted-farmer-monitoring/AssistedServiceReportsPage` + `/api/v1/assisted-farmers/reports` |
| **§6.8 step 2** (open Assisted Farmer Management) | `AssistedFarmerManagementPage.jsx` |
| **§6.8 step 3** (select action) | `AssistedActionDetailsPage.jsx` |
| **§6.8 step 4** (show farmer, agent, consent, action, timestamp) | `FarmerAgentActionCard.jsx` |
| **§6.8 step 5** (review) | `AdministrativeReviewForm.jsx` |
| **§6.8 step 6** (suspicious activity) | `SuspiciousActivityFlag.jsx` + `suspiciousActivityDetection.service.js` |
| **§6.8 step 7** (record review) | `adminReviewNote.model` + `AdministrativeReviewForm` |
| **FR-PRICE-001..008** | `market-info-management/*` (source + date + deactivate) |
| **FR-ARTICLE-001..008** | `educational-articles/*` (title/category/content/author/status + EN/AM + deactivate) |
| **FR-REVIEW-004** (moderate reported reviews) | `review-moderation/*` |
| **FR-DISPUTE-004..006** | `disputes-management/*` + `DisputeResolutionForm` |
| **BR-008** (privileged access) | `access-control/*` + `PrivilegedActionConfirmModal` |
| **BR-009** (audit logs) | `audit-logs/*` — all mutating admin endpoints write to `audit_log` |
| **§11.6** (Admin dashboard items) | Every folder maps to a §11.6 bullet |
| **§11.7** (mobile) | `mobile/src/modules/administrator/*` + `mobile/src/navigation/administrator/*` |
| **§14.2** (authorization) | `requirePermission('admin')` on every route |
| **§15.3** (audit & logging) | `auditLog.model` (append-only) + `securityEvent.model` |
| **FR-ACCESS-006** (EN + AM) | `i18n/locales/{en,am}/administrator.json` (already delivered in PM setup) |
| **§2.4 excluded** | ❌ No AI, no automated diagnosis, no transporter, no delivery tracking |

---

## ✅ Delivery Summary

**Administrator-specific layer only — no duplication with Project Manager delivery.**

| Layer | Sub-modules | Files |
|---|---|---|
| **Backend** | 16 | ~200 files under `server/src/modules/administrator/` |
| **Web** | 16 + 9 layouts | ~180 files under `client/src/modules/administrator/` + `client/src/layouts/administrator/` |
| **Mobile** | 16 + 19 nav stacks + 8 layouts | ~180 files under `mobile/src/modules/administrator/` + `mobile/src/navigation/administrator/` + `mobile/src/layouts/administrator/` |
| **Tests** | — | ~30 files under `server/tests/` + `mobile/tests/e2e/administrator/` |

**Key highlights:**
- ⚠️ **Assisted-farmer monitoring (§6.8)** — full 7-step workflow with `adminReviewNote` (step 7), suspicious-activity detection (step 6), and `/api/v1/assisted-farmers/reports` (FR-ASSISTED-013)
- ✅ **Review moderation (FR-REVIEW-004)** — dedicated sub-module
- ✅ **Support-ticket oversight** — §4.1.5 "Manage support tickets"
- ✅ **Market info + Articles** — full §5.9 + §5.10 with EN/AM fields
- ✅ **Read-only oversight** for orders + consultations
- ✅ **Append-only audit logs** on every mutating endpoint (BR-009, FR-ADMIN-015)
- ✅ **Privileged action confirmation** on web (modal) and mobile (bottom sheet)
- ✅ **No AI/ML, no transporter, no delivery** — respects SRS §2.4

**Combined with the Project Manager delivery → the full AgroLink Ethiopia platform is covered.** Students 2–4 (Farmer, Buyer+Service Provider, Support Agent) plug their modules into `client/src/shared/*`, `mobile/src/shared/*`, and `server/src/shared/*` with no conflict.