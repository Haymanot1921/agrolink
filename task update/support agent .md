# AgroLink Ethiopia — Support Agent Module (Complete: Backend + Web + Mobile)

**SRS coverage:** §4.1.4 (Support Agent actor), §5.3 (FEAT-ASSISTED — Assisted Farmer Onboarding), §5.11 (messages), §5.12 (notifications), §5.13 (FEAT-SUPPORT ticket management), §5.15 (complaints/disputes escalation), §6.2 (Assisted Farmer Registration), §6.4 (Support Agent Creates Product on Behalf of Farmer), §6.7 (Support Agent Assists with an Order), §6.8 (Administrator Reviews Assisted Activity), §7.2 (Assisted Farmer Business Rules BR-016..025), §9.5 (Assisted Access Architecture), §10.4 (Assisted Listing Data Requirements), §11.5 (Support Agent Dashboard), §11.7 (mobile), §14.3 (Assisted Farmer Privacy).

> **⚠️ Core SRS constraints for this actor (§4.1.4 + §7.2):** Support Agent **shall NOT** — access passwords/OTP, become listing owner, change price/quantity without approval, accept/reject orders without explicit authorization, withdraw money, access unrelated private data, change admin permissions, delete audit records. **All assisted actions traceable.**

---

## 📦 SUPPORT AGENT MODULE — COMPLETE STRUCTURE

```
agrolink-ethiopia/
│
├── server/src/modules/support-agent/                    # ═══ BACKEND ═══
│   │
│   ├── agent-dashboard/
│   │   ├── dashboard.routes.js
│   │   ├── dashboard.controller.js
│   │   ├── dashboard.service.js
│   │   ├── dashboard.repository.js
│   │   └── dashboard.validator.js
│   │
│   ├── agent-profile/
│   │   ├── agentProfile.routes.js
│   │   ├── agentProfile.controller.js
│   │   ├── agentProfile.service.js
│   │   ├── agentProfile.repository.js
│   │   ├── agentProfile.validator.js
│   │   ├── agentProfile.model.js
│   │   ├── agentAvailability.model.js
│   │   └── agentWorkPreferences.model.js
│   │
│   ├── assisted-farmer-onboarding/                      # ⚠️ CORE — SRS §5.3, §6.2
│   │   ├── assistedFarmer.routes.js                     # POST /register, GET /search, POST /consents, POST /products
│   │   ├── assistedFarmer.controller.js
│   │   ├── assistedFarmer.service.js
│   │   ├── assistedFarmer.repository.js
│   │   ├── assistedFarmer.validator.js
│   │   ├── farmerSearch.service.js                      # FR-ASSISTED-002 (search before create)
│   │   ├── duplicateCheck.service.js                    # FR-ASSISTED-002 (prevent duplicates)
│   │   ├── assistedRegistration.service.js              # FR-ASSISTED-001, 003
│   │   ├── assistedAction.model.js                      # §9.5 (farmer + agent + action + timestamp)
│   │   ├── assistedRegistration.model.js
│   │   ├── assistedAccessRecord.model.js                # FR-ASSISTED-015
│   │   └── listingOwnershipEnforcer.js                  # FR-ASSISTED-007, BR-017
│   │
│   ├── assisted-consent-management/                     # ⚠️ CORE — FR-ASSISTED-004, 005, 012
│   │   ├── consent.routes.js
│   │   ├── consent.controller.js
│   │   ├── consent.service.js
│   │   ├── consent.repository.js
│   │   ├── consent.validator.js
│   │   ├── consentRecord.model.js                       # FR-ASSISTED-004, 005 (type + timestamp)
│   │   ├── consentPurpose.model.js                      # action scope
│   │   ├── consentEvidence.model.js                     # supporting evidence
│   │   ├── consentAuditLog.model.js                     # §9.5 (immutable record)
│   │   └── consentWithdrawal.service.js                 # FR-ASSISTED-012
│   │
│   ├── assisted-listing/                                # ⚠️ CORE — §6.4, FR-ASSISTED-006..010
│   │   ├── assistedListing.routes.js
│   │   ├── assistedListing.controller.js
│   │   ├── assistedListing.service.js
│   │   ├── assistedListing.repository.js
│   │   ├── assistedListing.validator.js
│   │   ├── assistedListing.model.js                     # farmer_id owner, agent_id actor
│   │   ├── listingCreationMethod.model.js               # FR-MARKET-019 (DIRECT | ASSISTED_SUPPORT)
│   │   ├── assistedListingHistory.model.js              # FR-ASSISTED-010 (change history)
│   │   ├── listingReviewWithFarmer.service.js           # FR-ASSISTED-009 (farmer confirms)
│   │   ├── priceChangeApproval.service.js               # BR-021 (no price change without approval)
│   │   └── correctionRequest.service.js                 # FR-ASSISTED-011
│   │
│   ├── order-assistance/                                # §6.7 FR-ASSISTED — explains orders only
│   │   ├── orderAssistance.routes.js
│   │   ├── orderAssistance.controller.js
│   │   ├── orderAssistance.service.js
│   │   ├── orderAssistance.repository.js
│   │   ├── orderAssistance.model.js
│   │   ├── orderExplanationLog.model.js                 # FR-ASSISTED-010
│   │   └── orderActionGuard.js                          # §6.7 — no accept/reject on behalf
│   │
│   ├── consultation-assistance/                         # FR-ASSISTED — help submit requests
│   │   ├── consultationAssistance.routes.js
│   │   ├── consultationAssistance.controller.js
│   │   ├── consultationAssistance.service.js
│   │   ├── consultationAssistance.repository.js
│   │   ├── consultationAssistance.model.js
│   │   └── consultationRequestOnBehalf.model.js         # farmer as requester, agent as actor
│   │
│   ├── farmer-support-requests/                         # §5.13 FR-SUPPORT-001..009
│   │   ├── supportRequests.routes.js
│   │   ├── supportRequests.controller.js
│   │   ├── supportRequests.service.js
│   │   ├── supportRequests.repository.js
│   │   ├── supportRequests.validator.js
│   │   ├── supportRequest.model.js
│   │   ├── supportRequestAssignment.model.js
│   │   └── supportRequestHistory.model.js
│   │
│   ├── ticket-management/                               # §5.13 FR-SUPPORT-003..007
│   │   ├── tickets.routes.js
│   │   ├── tickets.controller.js
│   │   ├── tickets.service.js
│   │   ├── tickets.repository.js
│   │   ├── tickets.validator.js
│   │   ├── ticket.model.js
│   │   ├── ticketAssignment.model.js
│   │   ├── ticketComment.model.js
│   │   ├── ticketAttachment.model.js
│   │   └── ticketStatusTransition.js
│   │
│   ├── farmer-communication/                            # §5.11 FR-MESSAGE-001..007
│   │   ├── communication.routes.js
│   │   ├── communication.controller.js
│   │   ├── communication.service.js
│   │   ├── communication.repository.js
│   │   ├── conversation.model.js
│   │   ├── message.model.js
│   │   ├── messageAttachment.model.js
│   │   ├── messageReport.model.js                       # FR-MESSAGE-006
│   │   └── communicationAccessGuard.js                  # FR-MESSAGE-007 (only assigned)
│   │
│   ├── account-assistance/                              # password guidance, account recovery
│   │   ├── accountAssistance.routes.js
│   │   ├── accountAssistance.controller.js
│   │   ├── accountAssistance.service.js
│   │   ├── accountAssistance.repository.js
│   │   ├── accountAssistance.validator.js
│   │   ├── accountAssistanceCase.model.js
│   │   └── passwordPolicyGuard.js                        # BR-020, FR-AUTH-013 — never reveal/ask password
│   │
│   ├── marketplace-support/                             # order/payment/marketplace issues
│   │   ├── marketplaceSupport.routes.js
│   │   ├── marketplaceSupport.controller.js
│   │   ├── marketplaceSupport.service.js
│   │   ├── marketplaceSupport.repository.js
│   │   ├── marketplaceSupport.validator.js
│   │   ├── marketplaceIssue.model.js
│   │   └── disputeEvidence.model.js
│   │
│   ├── consultation-support/                            # expert consultation issues
│   │   ├── consultationSupport.routes.js
│   │   ├── consultationSupport.controller.js
│   │   ├── consultationSupport.service.js
│   │   ├── consultationSupport.repository.js
│   │   ├── consultationIssue.model.js
│   │   └── expertReferral.model.js
│   │
│   ├── knowledge-base/                                  # SOP + solutions
│   │   ├── knowledgeBase.routes.js
│   │   ├── knowledgeBase.controller.js
│   │   ├── knowledgeBase.service.js
│   │   ├── knowledgeBase.repository.js
│   │   ├── knowledgeBase.validator.js
│   │   ├── knowledgeArticle.model.js
│   │   ├── knowledgeCategory.model.js
│   │   └── helpfulFeedback.model.js
│   │
│   ├── escalation-management/                           # §5.15 FR-DISPUTE-003, FR-SUPPORT-005
│   │   ├── escalations.routes.js
│   │   ├── escalations.controller.js
│   │   ├── escalations.service.js
│   │   ├── escalations.repository.js
│   │   ├── escalation.validator.js
│   │   ├── escalation.model.js
│   │   ├── escalationAssignment.model.js
│   │   └── escalationTimeline.model.js
│   │
│   ├── farmer-feedback/                                 # feedback on agent assistance
│   │   ├── feedback.routes.js
│   │   ├── feedback.controller.js
│   │   ├── feedback.service.js
│   │   ├── feedback.repository.js
│   │   ├── feedback.model.js
│   │   └── satisfactionScore.model.js
│   │
│   ├── support-notifications/                           # §5.12
│   │   ├── notifications.routes.js
│   │   ├── notifications.controller.js
│   │   ├── notifications.service.js
│   │   ├── notifications.repository.js
│   │   └── notificationPreference.model.js
│   │
│   ├── support-analytics/                               # performance metrics
│   │   ├── analytics.routes.js
│   │   ├── analytics.controller.js
│   │   ├── analytics.service.js
│   │   ├── analytics.repository.js
│   │   ├── assistedActivityAnalytics.service.js         # FR-ASSISTED-013
│   │   └── responseTimeAnalytics.service.js
│   │
│   ├── support-guidelines/                              # SOP content + response templates
│   │   ├── guidelines.routes.js
│   │   ├── guidelines.controller.js
│   │   ├── guidelines.service.js
│   │   ├── guidelines.repository.js
│   │   ├── responseTemplate.model.js
│   │   ├── supportPolicyDocument.model.js
│   │   └── privacyGuideline.model.js
│   │
│   ├── support-settings/
│   │   ├── settings.routes.js
│   │   ├── settings.controller.js
│   │   ├── settings.service.js
│   │   ├── settings.repository.js
│   │   ├── settings.validator.js
│   │   └── workQueuePreference.model.js
│   │
│   ├── support-audit/                                   # FR-ASSISTED-010, BR-009 (all actions traceable)
│   │   ├── audit.routes.js
│   │   ├── audit.controller.js
│   │   ├── audit.service.js
│   │   ├── audit.repository.js
│   │   └── supportAuditLog.model.js
│   │
│   └── index.js                                         # mounts /api/v1/support-agents/*
│                                                        # + assisted endpoints from SRS §12.3:
│                                                        #   POST /api/v1/assisted-farmers/register
│                                                        #   GET  /api/v1/assisted-farmers/search
│                                                        #   POST /api/v1/assisted-farmers/consents
│                                                        #   POST /api/v1/assisted-farmers/products
│                                                        #   GET  /api/v1/assisted-farmers/history
│                                                        #   PATCH /api/v1/assisted-farmers/products
│                                                        #   GET  /api/v1/assisted-farmers/reports
│
│
├── client/src/layouts/support-agent/                    # ═══ WEB LAYOUTS ═══ (§11.5)
│   ├── SupportAgentLayout.jsx
│   ├── SupportAgentSidebar.jsx
│   ├── SupportAgentTopbar.jsx
│   ├── SupportAgentNavigation.jsx
│   ├── SupportAgentMobileMenu.jsx
│   ├── SupportAgentBreadcrumbs.jsx
│   ├── SupportAgentFooter.jsx
│   └── ActingOnBehalfBanner.jsx                         # §11.5 — "clearly show when agent is acting on behalf of farmer"
│
├── client/src/modules/support-agent/                    # ═══ WEB MODULES ═══
│   │
│   ├── dashboard/                                       # §11.5 Overview
│   │   ├── pages/SupportAgentDashboard.jsx
│   │   ├── components/
│   │   │   ├── DashboardWelcome.jsx
│   │   │   ├── SupportStatsCards.jsx
│   │   │   ├── TicketVolumeChart.jsx
│   │   │   ├── ResolutionPerformanceChart.jsx
│   │   │   ├── MyAssignedTickets.jsx
│   │   │   ├── UrgentCasesPanel.jsx
│   │   │   ├── UnassignedTicketsSummary.jsx
│   │   │   ├── RecentFarmerInteractions.jsx
│   │   │   ├── AverageResponseTimeCard.jsx
│   │   │   ├── FarmerSatisfactionCard.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── SupportActivityFeed.jsx
│   │   │   └── AssistedActivitySummary.jsx               # SRS §6.8
│   │   ├── hooks/useSupportAgentDashboard.js
│   │   └── services/dashboardService.js
│   │
│   ├── assisted-farmer-onboarding/                       # ⚠️ CORE — SRS §11.5, §6.2, §6.4
│   │   ├── pages/
│   │   │   ├── FarmerSearchPage.jsx                      # FR-ASSISTED-002
│   │   │   ├── AssistedRegistrationPage.jsx              # FR-ASSISTED-001, 003
│   │   │   ├── ConsentRecordPage.jsx                     # FR-ASSISTED-004, 005
│   │   │   ├── AssistedListingCreatePage.jsx             # FR-ASSISTED-006, 007
│   │   │   ├── AssistedListingEditPage.jsx               # FR-ASSISTED-010
│   │   │   ├── AssistedListingReviewPage.jsx             # FR-ASSISTED-009 (farmer confirms)
│   │   │   └── AssistanceHistoryPage.jsx                 # FR-ASSISTED-010
│   │   ├── components/
│   │   │   ├── FarmerSearchBar.jsx
│   │   │   ├── FarmerSearchResults.jsx
│   │   │   ├── DuplicateFarmerWarning.jsx                # FR-ASSISTED-002
│   │   │   ├── AssistedRegistrationForm.jsx
│   │   │   ├── ConsentCaptureDialog.jsx                  # FR-ASSISTED-004
│   │   │   ├── ConsentTypeSelector.jsx                   # FR-ASSISTED-005
│   │   │   ├── ConsentEvidenceUpload.jsx
│   │   │   ├── AssistedListingForm.jsx
│   │   │   ├── ListingOwnerNotice.jsx                    # FR-ASSISTED-007 (farmer remains owner)
│   │   │   ├── FarmerConfirmationPrompt.jsx              # FR-ASSISTED-009
│   │   │   ├── AssistedActionBadge.jsx                   # "Assisted by [Agent]"
│   │   │   ├── AssistanceHistoryTable.jsx
│   │   │   ├── CorrectionRequestForm.jsx                 # FR-ASSISTED-011
│   │   │   ├── ConsentWithdrawalForm.jsx                 # FR-ASSISTED-012
│   │   │   └── ActingOnBehalfBannerTrigger.jsx           # activates top banner
│   │   ├── hooks/
│   │   │   ├── useFarmerSearch.js
│   │   │   ├── useAssistedRegistration.js
│   │   │   ├── useAssistedListings.js
│   │   │   └── useAssistanceHistory.js
│   │   ├── services/
│   │   │   ├── assistedFarmerService.js
│   │   │   ├── farmerSearchService.js
│   │   │   └── assistedListingService.js
│   │   └── validators/
│   │       ├── assistedRegistrationSchema.js
│   │       └── assistedListingSchema.js
│   │
│   ├── consent-management/                              # FR-ASSISTED-004, 005, 012
│   │   ├── pages/
│   │   │   ├── FarmerConsentPage.jsx
│   │   │   ├── ConsentDetailsPage.jsx
│   │   │   └── ConsentHistoryPage.jsx
│   │   ├── components/
│   │   │   ├── ConsentStatusCard.jsx
│   │   │   ├── ConsentRequestForm.jsx
│   │   │   ├── ConsentPurposeSelector.jsx
│   │   │   ├── ConsentScopeChecklist.jsx
│   │   │   ├── ConsentConfirmationDialog.jsx
│   │   │   ├── ConsentAuditTimeline.jsx
│   │   │   ├── ConsentExpiryBadge.jsx
│   │   │   └── ConsentRevocationNotice.jsx
│   │   ├── hooks/useFarmerConsent.js
│   │   ├── services/consentManagementService.js
│   │   └── validators/consentSchema.js
│   │
│   ├── farmer-support-requests/                         # §11.5 Support Tickets
│   │   ├── pages/
│   │   │   ├── SupportRequestsPage.jsx
│   │   │   ├── SupportRequestDetailsPage.jsx
│   │   │   ├── AssignedRequestsPage.jsx
│   │   │   ├── UnassignedRequestsPage.jsx
│   │   │   └── EscalatedRequestsPage.jsx
│   │   ├── components/
│   │   │   ├── SupportRequestTable.jsx
│   │   │   ├── SupportRequestCard.jsx
│   │   │   ├── RequestStatusBadge.jsx
│   │   │   ├── RequestPriorityBadge.jsx
│   │   │   ├── FarmerRequestSummary.jsx
│   │   │   ├── RequestCategoryBadge.jsx
│   │   │   ├── AssignRequestDialog.jsx
│   │   │   ├── TransferRequestDialog.jsx
│   │   │   ├── EscalateRequestDialog.jsx
│   │   │   ├── RequestTimeline.jsx
│   │   │   └── RequestSearchFilters.jsx
│   │   ├── hooks/useSupportRequests.js
│   │   ├── services/supportRequestsService.js
│   │   └── validators/supportRequestSchema.js
│   │
│   ├── ticket-management/                               # §11.5 tickets
│   │   ├── pages/
│   │   │   ├── TicketsPage.jsx
│   │   │   ├── TicketDetailsPage.jsx
│   │   │   ├── OpenTicketsPage.jsx
│   │   │   ├── PendingTicketsPage.jsx
│   │   │   ├── ResolvedTicketsPage.jsx
│   │   │   └── ClosedTicketsPage.jsx
│   │   ├── components/
│   │   │   ├── TicketTable.jsx
│   │   │   ├── TicketDetailsPanel.jsx
│   │   │   ├── TicketStatusTimeline.jsx
│   │   │   ├── TicketCategorySelector.jsx
│   │   │   ├── TicketPrioritySelector.jsx
│   │   │   ├── TicketAssignmentPanel.jsx
│   │   │   ├── TicketInternalNotes.jsx
│   │   │   ├── TicketResolutionForm.jsx
│   │   │   ├── TicketSearchFilters.jsx
│   │   │   └── TicketExportButton.jsx
│   │   ├── hooks/useTickets.js
│   │   ├── services/ticketManagementService.js
│   │   └── validators/ticketSchema.js
│   │
│   ├── farmer-communication/                            # §11.5 messages
│   │   ├── pages/
│   │   │   ├── FarmerConversationsPage.jsx
│   │   │   ├── ConversationDetailsPage.jsx
│   │   │   └── CommunicationHistoryPage.jsx
│   │   ├── components/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ConversationHeader.jsx
│   │   │   ├── ConversationThread.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageComposer.jsx
│   │   │   ├── MessageAttachmentPreview.jsx
│   │   │   ├── FarmerContactCard.jsx
│   │   │   ├── ConversationSearch.jsx
│   │   │   └── ConversationStatusBadge.jsx
│   │   ├── hooks/useFarmerCommunication.js
│   │   └── services/farmerCommunicationService.js
│   │
│   ├── account-assistance/
│   │   ├── pages/
│   │   │   ├── AccountAssistancePage.jsx
│   │   │   ├── AccountIssueDetailsPage.jsx
│   │   │   └── AccountRecoverySupportPage.jsx
│   │   ├── components/
│   │   │   ├── AccountIssueForm.jsx
│   │   │   ├── AccountVerificationChecklist.jsx
│   │   │   ├── AccountStatusCard.jsx
│   │   │   ├── PasswordResetGuidance.jsx                # guidance ONLY — never reveals passwords
│   │   │   ├── ContactInformationUpdateForm.jsx
│   │   │   └── AccountAssistanceTimeline.jsx
│   │   ├── hooks/useAccountAssistance.js
│   │   └── services/accountAssistanceService.js
│   │
│   ├── marketplace-support/
│   │   ├── pages/
│   │   │   ├── MarketplaceIssuesPage.jsx
│   │   │   ├── OrderIssueDetailsPage.jsx
│   │   │   ├── PaymentIssueDetailsPage.jsx
│   │   │   └── DeliveryIssueDetailsPage.jsx             # status explanation only
│   │   ├── components/
│   │   │   ├── MarketplaceIssueTable.jsx
│   │   │   ├── OrderIssueSummary.jsx
│   │   │   ├── PaymentIssueSummary.jsx
│   │   │   ├── DeliveryIssueSummary.jsx
│   │   │   ├── DisputeEvidenceViewer.jsx
│   │   │   ├── IssueResolutionForm.jsx
│   │   │   └── MarketplaceIssueFilters.jsx
│   │   ├── hooks/useMarketplaceSupport.js
│   │   └── services/marketplaceSupportService.js
│   │
│   ├── consultation-support/
│   │   ├── pages/
│   │   │   ├── ConsultationIssuesPage.jsx
│   │   │   └── ConsultationIssueDetailsPage.jsx
│   │   ├── components/
│   │   │   ├── ConsultationIssueTable.jsx
│   │   │   ├── ConsultationIssueSummary.jsx
│   │   │   ├── ExpertReferralPanel.jsx
│   │   │   ├── AppointmentIssueForm.jsx
│   │   │   └── ConsultationResolutionForm.jsx
│   │   ├── hooks/useConsultationSupport.js
│   │   └── services/consultationSupportService.js
│   │
│   ├── knowledge-base/
│   │   ├── pages/
│   │   │   ├── KnowledgeBasePage.jsx
│   │   │   ├── KnowledgeArticlePage.jsx
│   │   │   └── SuggestedSolutionsPage.jsx
│   │   ├── components/
│   │   │   ├── KnowledgeSearchBar.jsx
│   │   │   ├── KnowledgeCategoryGrid.jsx
│   │   │   ├── KnowledgeArticleCard.jsx
│   │   │   ├── KnowledgeArticleViewer.jsx
│   │   │   ├── RelatedArticles.jsx
│   │   │   ├── SolutionChecklist.jsx
│   │   │   └── HelpfulFeedbackForm.jsx
│   │   ├── hooks/useKnowledgeBase.js
│   │   └── services/knowledgeBaseService.js
│   │
│   ├── escalation-management/
│   │   ├── pages/
│   │   │   ├── EscalationsPage.jsx
│   │   │   └── EscalationDetailsPage.jsx
│   │   ├── components/
│   │   │   ├── EscalationQueue.jsx
│   │   │   ├── EscalationReasonForm.jsx
│   │   │   ├── EscalationTimeline.jsx
│   │   │   ├── EscalationAssignmentPanel.jsx
│   │   │   └── EscalationStatusBadge.jsx
│   │   ├── hooks/useEscalations.js
│   │   └── services/escalationManagementService.js
│   │
│   ├── feedback-satisfaction/
│   │   ├── pages/
│   │   │   ├── FarmerFeedbackPage.jsx
│   │   │   ├── FeedbackDetailsPage.jsx
│   │   │   └── SatisfactionReportsPage.jsx
│   │   ├── components/
│   │   │   ├── FeedbackSummaryCards.jsx
│   │   │   ├── FarmerRatingList.jsx
│   │   │   ├── SatisfactionTrendChart.jsx
│   │   │   ├── FeedbackResponseForm.jsx
│   │   │   └── FeedbackFilters.jsx
│   │   ├── hooks/useFarmerFeedback.js
│   │   └── services/feedbackSatisfactionService.js
│   │
│   ├── reports-analytics/
│   │   ├── pages/
│   │   │   ├── SupportReportsPage.jsx
│   │   │   ├── AgentPerformancePage.jsx
│   │   │   ├── TicketAnalyticsPage.jsx
│   │   │   ├── FarmerSatisfactionReportsPage.jsx
│   │   │   ├── ResponseTimeReportsPage.jsx
│   │   │   └── AssistedServiceReportsPage.jsx           # FR-ASSISTED-013
│   │   ├── components/
│   │   │   ├── SupportVolumeChart.jsx
│   │   │   ├── ResolutionRateChart.jsx
│   │   │   ├── AgentWorkloadChart.jsx
│   │   │   ├── ResponseTimeChart.jsx
│   │   │   ├── AssistedActivityReportChart.jsx
│   │   │   ├── ReportDateRangePicker.jsx
│   │   │   └── ExportReportButton.jsx
│   │   ├── hooks/useSupportReports.js
│   │   └── services/reportsAnalyticsService.js
│   │
│   ├── notifications/
│   │   ├── pages/SupportAgentNotificationsPage.jsx
│   │   ├── components/
│   │   │   ├── NotificationCenter.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   ├── NotificationFilters.jsx
│   │   │   └── NotificationPreferences.jsx
│   │   ├── hooks/useSupportNotifications.js
│   │   └── services/notificationsService.js
│   │
│   ├── agent-profile/
│   │   ├── pages/
│   │   │   ├── AgentProfilePage.jsx
│   │   │   └── EditAgentProfilePage.jsx
│   │   ├── components/
│   │   │   ├── AgentPersonalInformationForm.jsx
│   │   │   ├── AgentWorkPreferencesForm.jsx
│   │   │   ├── AgentAvailabilityStatus.jsx
│   │   │   └── AgentPerformanceSummary.jsx
│   │   ├── hooks/useAgentProfile.js
│   │   └── services/agentProfileService.js
│   │
│   ├── support-settings/
│   │   ├── pages/
│   │   │   ├── SupportSettingsPage.jsx
│   │   │   ├── AccountSecurityPage.jsx
│   │   │   ├── NotificationSettingsPage.jsx
│   │   │   └── LanguagePreferencesPage.jsx
│   │   ├── components/
│   │   │   ├── AccountSettingsForm.jsx
│   │   │   ├── PasswordChangeForm.jsx
│   │   │   ├── TwoFactorSettings.jsx
│   │   │   ├── LanguageSelector.jsx                    # EN / AM
│   │   │   └── WorkQueuePreferences.jsx
│   │   ├── hooks/useSupportSettings.js
│   │   └── services/supportSettingsService.js
│   │
│   ├── support-guidelines/
│   │   ├── pages/SupportGuidelinesPage.jsx
│   │   ├── components/
│   │   │   ├── ResponseTemplatesList.jsx
│   │   │   ├── SupportPolicyViewer.jsx
│   │   │   ├── PrivacyGuidelines.jsx                   # §14.3
│   │   │   └── EscalationPolicyViewer.jsx
│   │   ├── hooks/useSupportGuidelines.js
│   │   └── services/supportGuidelinesService.js
│   │
│   └── index.js                                         # exports support-agent route tree
│
│
├── mobile/src/navigation/support-agent/                 # ═══ MOBILE NAVIGATION ═══
│   ├── SupportAgentTabNavigator.tsx                     # tabs: Dashboard, Assisted, Tickets, Messages, More
│   ├── SupportAgentDrawerNavigator.tsx
│   ├── SupportAgentStackNavigator.tsx
│   ├── DashboardStack.tsx
│   ├── AssistedFarmerStack.tsx                          # ⚠️ core
│   ├── RequestsStack.tsx
│   ├── TicketsStack.tsx
│   ├── MessagesStack.tsx
│   ├── KnowledgeStack.tsx
│   ├── EscalationsStack.tsx
│   ├── FeedbackStack.tsx
│   ├── ReportsStack.tsx
│   ├── NotificationsStack.tsx
│   ├── ProfileStack.tsx
│   └── SettingsStack.tsx
│
├── mobile/src/layouts/support-agent/                    # ═══ MOBILE LAYOUTS ═══
│   ├── SupportAgentScreenWrapper.tsx
│   ├── SupportAgentDrawerContent.tsx
│   ├── SupportAgentTabBar.tsx
│   ├── SupportAgentTopbar.tsx
│   ├── SupportAgentBreadcrumbs.tsx
│   ├── SupportAgentFooter.tsx
│   └── ActingOnBehalfBanner.tsx                        # mobile equivalent of web banner
│
├── mobile/src/modules/support-agent/                    # ═══ MOBILE MODULES ═══
│   │
│   ├── dashboard/
│   │   ├── screens/SupportAgentDashboard.screen.tsx
│   │   ├── components/
│   │   │   ├── DashboardWelcome.tsx
│   │   │   ├── SupportStatsCards.tsx
│   │   │   ├── TicketVolumeChart.tsx
│   │   │   ├── ResolutionPerformanceChart.tsx
│   │   │   ├── MyAssignedTickets.tsx
│   │   │   ├── UrgentCasesPanel.tsx
│   │   │   ├── UnassignedTicketsSummary.tsx
│   │   │   ├── RecentFarmerInteractions.tsx
│   │   │   ├── AverageResponseTimeCard.tsx
│   │   │   ├── FarmerSatisfactionCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── SupportActivityFeed.tsx
│   │   │   └── AssistedActivitySummary.tsx
│   │   ├── hooks/useSupportAgentDashboard.ts
│   │   └── services/dashboard.service.ts
│   │
│   ├── assisted-farmer-onboarding/                      # ⚠️ CORE — SRS §5.3, §6.2, §6.4
│   │   ├── screens/
│   │   │   ├── FarmerSearch.screen.tsx
│   │   │   ├── AssistedRegistration.screen.tsx
│   │   │   ├── ConsentRecord.screen.tsx
│   │   │   ├── AssistedListingCreate.screen.tsx
│   │   │   ├── AssistedListingEdit.screen.tsx
│   │   │   ├── AssistedListingReview.screen.tsx
│   │   │   └── AssistanceHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── FarmerSearchBar.tsx
│   │   │   ├── FarmerSearchResults.tsx
│   │   │   ├── DuplicateFarmerWarning.tsx
│   │   │   ├── AssistedRegistrationForm.tsx
│   │   │   ├── ConsentCaptureModal.tsx
│   │   │   ├── ConsentTypeSelector.tsx
│   │   │   ├── ConsentEvidencePicker.tsx
│   │   │   ├── AssistedListingForm.tsx
│   │   │   ├── ListingOwnerNotice.tsx
│   │   │   ├── FarmerConfirmationPrompt.tsx
│   │   │   ├── AssistedActionBadge.tsx
│   │   │   ├── AssistanceHistoryList.tsx
│   │   │   ├── CorrectionRequestForm.tsx
│   │   │   └── ConsentWithdrawalForm.tsx
│   │   ├── hooks/
│   │   │   ├── useFarmerSearch.ts
│   │   │   ├── useAssistedRegistration.ts
│   │   │   ├── useAssistedListings.ts
│   │   │   └── useAssistanceHistory.ts
│   │   ├── services/
│   │   │   ├── assistedFarmer.service.ts
│   │   │   ├── farmerSearch.service.ts
│   │   │   └── assistedListing.service.ts
│   │   └── validators/
│   │       ├── assistedRegistrationSchema.ts
│   │       └── assistedListingSchema.ts
│   │
│   ├── consent-management/
│   │   ├── screens/
│   │   │   ├── FarmerConsent.screen.tsx
│   │   │   ├── ConsentDetails.screen.tsx
│   │   │   └── ConsentHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── ConsentStatusCard.tsx
│   │   │   ├── ConsentRequestForm.tsx
│   │   │   ├── ConsentPurposeSelector.tsx
│   │   │   ├── ConsentScopeChecklist.tsx
│   │   │   ├── ConsentConfirmationModal.tsx
│   │   │   ├── ConsentAuditTimeline.tsx
│   │   │   ├── ConsentExpiryBadge.tsx
│   │   │   └── ConsentRevocationNotice.tsx
│   │   ├── hooks/useFarmerConsent.ts
│   │   ├── services/consentManagement.service.ts
│   │   └── validators/consentSchema.ts
│   │
│   ├── farmer-support-requests/
│   │   ├── screens/
│   │   │   ├── SupportRequests.screen.tsx
│   │   │   ├── SupportRequestDetails.screen.tsx
│   │   │   ├── AssignedRequests.screen.tsx
│   │   │   ├── UnassignedRequests.screen.tsx
│   │   │   └── EscalatedRequests.screen.tsx
│   │   ├── components/
│   │   │   ├── SupportRequestList.tsx
│   │   │   ├── SupportRequestCard.tsx
│   │   │   ├── RequestStatusBadge.tsx
│   │   │   ├── RequestPriorityBadge.tsx
│   │   │   ├── FarmerRequestSummary.tsx
│   │   │   ├── RequestCategoryBadge.tsx
│   │   │   ├── AssignRequestModal.tsx
│   │   │   ├── TransferRequestModal.tsx
│   │   │   ├── EscalateRequestModal.tsx
│   │   │   ├── RequestTimeline.tsx
│   │   │   └── RequestSearchFilters.tsx
│   │   ├── hooks/useSupportRequests.ts
│   │   ├── services/supportRequests.service.ts
│   │   └── validators/supportRequestSchema.ts
│   │
│   ├── ticket-management/
│   │   ├── screens/
│   │   │   ├── Tickets.screen.tsx
│   │   │   ├── TicketDetails.screen.tsx
│   │   │   ├── OpenTickets.screen.tsx
│   │   │   ├── PendingTickets.screen.tsx
│   │   │   ├── ResolvedTickets.screen.tsx
│   │   │   └── ClosedTickets.screen.tsx
│   │   ├── components/
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketDetailsPanel.tsx
│   │   │   ├── TicketStatusTimeline.tsx
│   │   │   ├── TicketCategorySelector.tsx
│   │   │   ├── TicketPrioritySelector.tsx
│   │   │   ├── TicketAssignmentPanel.tsx
│   │   │   ├── TicketInternalNotes.tsx
│   │   │   ├── TicketResolutionForm.tsx
│   │   │   ├── TicketSearchFilters.tsx
│   │   │   └── TicketExportButton.tsx
│   │   ├── hooks/useTickets.ts
│   │   ├── services/ticketManagement.service.ts
│   │   └── validators/ticketSchema.ts
│   │
│   ├── farmer-communication/
│   │   ├── screens/
│   │   │   ├── FarmerConversations.screen.tsx
│   │   │   ├── ConversationDetails.screen.tsx
│   │   │   └── CommunicationHistory.screen.tsx
│   │   ├── components/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ConversationHeader.tsx
│   │   │   ├── ConversationThread.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageComposer.tsx
│   │   │   ├── MessageAttachmentPicker.tsx
│   │   │   ├── VoiceMessageRecorder.tsx
│   │   │   ├── FarmerContactCard.tsx
│   │   │   ├── ConversationSearch.tsx
│   │   │   └── ConversationStatusBadge.tsx
│   │   ├── hooks/useFarmerCommunication.ts
│   │   └── services/farmerCommunication.service.ts
│   │
│   ├── account-assistance/
│   │   ├── screens/
│   │   │   ├── AccountAssistance.screen.tsx
│   │   │   ├── AccountIssueDetails.screen.tsx
│   │   │   └── AccountRecoverySupport.screen.tsx
│   │   ├── components/
│   │   │   ├── AccountIssueForm.tsx
│   │   │   ├── AccountVerificationChecklist.tsx
│   │   │   ├── AccountStatusCard.tsx
│   │   │   ├── PasswordResetGuidance.tsx
│   │   │   ├── ContactInformationUpdateForm.tsx
│   │   │   └── AccountAssistanceTimeline.tsx
│   │   ├── hooks/useAccountAssistance.ts
│   │   └── services/accountAssistance.service.ts
│   │
│   ├── marketplace-support/
│   │   ├── screens/
│   │   │   ├── MarketplaceIssues.screen.tsx
│   │   │   ├── OrderIssueDetails.screen.tsx
│   │   │   ├── PaymentIssueDetails.screen.tsx
│   │   │   └── DeliveryIssueDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── MarketplaceIssueList.tsx
│   │   │   ├── OrderIssueSummary.tsx
│   │   │   ├── PaymentIssueSummary.tsx
│   │   │   ├── DeliveryIssueSummary.tsx
│   │   │   ├── DisputeEvidenceViewer.tsx
│   │   │   ├── IssueResolutionForm.tsx
│   │   │   └── MarketplaceIssueFilters.tsx
│   │   ├── hooks/useMarketplaceSupport.ts
│   │   └── services/marketplaceSupport.service.ts
│   │
│   ├── consultation-support/
│   │   ├── screens/
│   │   │   ├── ConsultationIssues.screen.tsx
│   │   │   └── ConsultationIssueDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── ConsultationIssueList.tsx
│   │   │   ├── ConsultationIssueSummary.tsx
│   │   │   ├── ExpertReferralPanel.tsx
│   │   │   ├── AppointmentIssueForm.tsx
│   │   │   └── ConsultationResolutionForm.tsx
│   │   ├── hooks/useConsultationSupport.ts
│   │   └── services/consultationSupport.service.ts
│   │
│   ├── knowledge-base/
│   │   ├── screens/
│   │   │   ├── KnowledgeBase.screen.tsx
│   │   │   ├── KnowledgeArticle.screen.tsx
│   │   │   └── SuggestedSolutions.screen.tsx
│   │   ├── components/
│   │   │   ├── KnowledgeSearchBar.tsx
│   │   │   ├── KnowledgeCategoryGrid.tsx
│   │   │   ├── KnowledgeArticleCard.tsx
│   │   │   ├── KnowledgeArticleViewer.tsx
│   │   │   ├── RelatedArticles.tsx
│   │   │   ├── SolutionChecklist.tsx
│   │   │   └── HelpfulFeedbackForm.tsx
│   │   ├── hooks/useKnowledgeBase.ts
│   │   └── services/knowledgeBase.service.ts
│   │
│   ├── escalation-management/
│   │   ├── screens/
│   │   │   ├── Escalations.screen.tsx
│   │   │   └── EscalationDetails.screen.tsx
│   │   ├── components/
│   │   │   ├── EscalationQueue.tsx
│   │   │   ├── EscalationReasonForm.tsx
│   │   │   ├── EscalationTimeline.tsx
│   │   │   ├── EscalationAssignmentPanel.tsx
│   │   │   └── EscalationStatusBadge.tsx
│   │   ├── hooks/useEscalations.ts
│   │   └── services/escalationManagement.service.ts
│   │
│   ├── feedback-satisfaction/
│   │   ├── screens/
│   │   │   ├── FarmerFeedback.screen.tsx
│   │   │   ├── FeedbackDetails.screen.tsx
│   │   │   └── SatisfactionReports.screen.tsx
│   │   ├── components/
│   │   │   ├── FeedbackSummaryCards.tsx
│   │   │   ├── FarmerRatingList.tsx
│   │   │   ├── SatisfactionTrendChart.tsx
│   │   │   ├── FeedbackResponseForm.tsx
│   │   │   └── FeedbackFilters.tsx
│   │   ├── hooks/useFarmerFeedback.ts
│   │   └── services/feedbackSatisfaction.service.ts
│   │
│   ├── reports-analytics/
│   │   ├── screens/
│   │   │   ├── SupportReports.screen.tsx
│   │   │   ├── AgentPerformance.screen.tsx
│   │   │   ├── TicketAnalytics.screen.tsx
│   │   │   ├── FarmerSatisfactionReports.screen.tsx
│   │   │   ├── ResponseTimeReports.screen.tsx
│   │   │   └── AssistedServiceReports.screen.tsx
│   │   ├── components/
│   │   │   ├── SupportVolumeChart.tsx
│   │   │   ├── ResolutionRateChart.tsx
│   │   │   ├── AgentWorkloadChart.tsx
│   │   │   ├── ResponseTimeChart.tsx
│   │   │   ├── AssistedActivityReportChart.tsx
│   │   │   ├── ReportDateRangePicker.tsx
│   │   │   └── ExportReportButton.tsx
│   │   ├── hooks/useSupportReports.ts
│   │   └── services/reportsAnalytics.service.ts
│   │
│   ├── notifications/
│   │   ├── screens/SupportAgentNotifications.screen.tsx
│   │   ├── components/
│   │   │   ├── NotificationCenter.tsx
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── NotificationFilters.tsx
│   │   │   └── NotificationPreferences.tsx
│   │   ├── hooks/useSupportNotifications.ts
│   │   └── services/notifications.service.ts
│   │
│   ├── agent-profile/
│   │   ├── screens/
│   │   │   ├── AgentProfile.screen.tsx
│   │   │   └── EditAgentProfile.screen.tsx
│   │   ├── components/
│   │   │   ├── AgentPersonalInformationForm.tsx
│   │   │   ├── AgentWorkPreferencesForm.tsx
│   │   │   ├── AgentAvailabilityStatus.tsx
│   │   │   └── AgentPerformanceSummary.tsx
│   │   ├── hooks/useAgentProfile.ts
│   │   └── services/agentProfile.service.ts
│   │
│   ├── support-settings/
│   │   ├── screens/
│   │   │   ├── SupportSettings.screen.tsx
│   │   │   ├── AccountSecurity.screen.tsx
│   │   │   ├── NotificationSettings.screen.tsx
│   │   │   └── LanguagePreferences.screen.tsx
│   │   ├── components/
│   │   │   ├── AccountSettingsForm.tsx
│   │   │   ├── PasswordChangeForm.tsx
│   │   │   ├── TwoFactorSettings.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   └── WorkQueuePreferences.tsx
│   │   ├── hooks/useSupportSettings.ts
│   │   └── services/supportSettings.service.ts
│   │
│   └── support-guidelines/
│       ├── screens/SupportGuidelines.screen.tsx
│       ├── components/
│       │   ├── ResponseTemplatesList.tsx
│       │   ├── SupportPolicyViewer.tsx
│       │   ├── PrivacyGuidelines.tsx
│       │   └── EscalationPolicyViewer.tsx
│       ├── hooks/useSupportGuidelines.ts
│       └── services/supportGuidelines.service.ts
│
│
├── client/src/i18n/locales/en/support-agent.json        # ═══ I18N ═══
├── client/src/i18n/locales/am/support-agent.json
├── mobile/src/i18n/locales/en/support-agent.json
└── mobile/src/i18n/locales/am/support-agent.json
```

---

## 🔑 Support Agent Module → SRS Requirement Mapping

| SRS Requirement | Where implemented |
|---|---|
| **§4.1.4 Support Agent responsibilities** | All 22 sub-modules |
| **FR-ASSISTED-001** (initiate registration) | `assistedRegistration.service.js` + `AssistedRegistrationPage` / `.screen` |
| **FR-ASSISTED-002** (search first + prevent duplicate) | `farmerSearch.service.js` + `duplicateCheck.service.js` + `DuplicateFarmerWarning` |
| **FR-ASSISTED-003** (record responsible agent) | `assistedRegistration.model.agent_id` |
| **FR-ASSISTED-004** (consent recorded) | `consentRecord.model` + `ConsentCaptureDialog`/`Modal` |
| **FR-ASSISTED-005** (consent type + time) | `consentRecord.model` (`consent_type`, `created_at`) |
| **FR-ASSISTED-006** (agent creates listing) | `assistedListing.service.js` + `AssistedListingCreatePage`/`.screen` |
| **FR-ASSISTED-007** (farmer remains owner) | `listingOwnershipEnforcer.js` — cannot overwrite `farmer_id` |
| **FR-ASSISTED-008** (record agent as actor) | `assistedAction.model` (`agent_id` + `action_type`) |
| **FR-ASSISTED-009** (farmer reviews before publish) | `listingReviewWithFarmer.service.js` + `FarmerConfirmationPrompt` |
| **FR-ASSISTED-010** (preserve assisted change record) | `assistedListingHistory.model` + `AssistanceHistoryPage`/`.screen` |
| **FR-ASSISTED-011** (farmer requests correction) | `correctionRequest.service.js` + `CorrectionRequestForm` |
| **FR-ASSISTED-012** (farmer withdraws consent) | `consentWithdrawal.service.js` + `ConsentWithdrawalForm` |
| **FR-ASSISTED-013** (admin assisted reports) | `assistedActivityAnalytics.service.js` + `AssistedServiceReportsPage` (also surfaced in Admin module) |
| **FR-ASSISTED-014** (no password / OTP access) | `passwordPolicyGuard.js` — enforces FR-AUTH-013 + BR-020 |
| **FR-ASSISTED-015** (assisted-access record reviewable) | `assistedAccessRecord.model` + `ConsentHistoryPage` |
| **§6.2 Assisted Farmer Registration flow** | `FarmerSearch → AssistedRegistration → ConsentRecord` sequence |
| **§6.4 Agent Creates Product on Behalf** | `AssistedListingCreate → AssistedListingReview` (farmer confirms) sequence |
| **§6.7 Agent Assists with an Order** | `orderAssistance.service.js` + `orderActionGuard.js` (explains only, no accept/reject) |
| **§9.5 Assisted Access Architecture** | `assistedAction.model` contains: farmer_id, agent_id, action_type, consent_status, consent_method, consent_timestamp, listing_id, prev/updated values, action_result |
| **§10.4 Assisted Listing Data Requirements** | `assistedListing.model` + `listingCreationMethod.model` (`DIRECT_FARMER` \| `ASSISTED_SUPPORT`) |
| **BR-016** (no listing without consent) | `consentVerifier` middleware + `assistedListing.service` check |
| **BR-017** (farmer remains owner) | `listingOwnershipEnforcer.js` |
| **BR-018** (record agent) | `assistedAction.model` |
| **BR-019** (record consent type + timestamp) | `consentRecord.model` |
| **BR-020** (no password / OTP access) | `passwordPolicyGuard.js` |
| **BR-021** (no independent price decision) | `priceChangeApproval.service.js` |
| **BR-022** (farmer confirms important listing info) | `FarmerConfirmationPrompt` |
| **BR-023** (agent permissions limited) | `rbac.middleware` scope + `communicationAccessGuard.js` |
| **BR-024** (farmer can request corrections) | `correctionRequest.service.js` |
| **BR-025** (traceable history of assisted changes) | `assistedListingHistory.model` + `support-audit/*` |
| **FR-SUPPORT-003..007** (tickets) | `ticket-management/*` + `tickets/*` UI |
| **FR-MESSAGE-007** (support agent access only when authorized) | `communicationAccessGuard.js` |
| **FR-DISPUTE-003** (escalate complaints) | `escalation-management/*` |
| **§11.5 Support Agent Dashboard list** | Every folder in `support-agent/*` maps to §11.5 |
| **§11.5 "clearly show when acting on behalf"** | `ActingOnBehalfBanner.jsx` / `.tsx` |
| **§14.3 Assisted Farmer Privacy** | `consentRecord` + `assistedAction` + `support-audit` + `PrivacyGuidelines` |
| **§12.3 Assisted Farmer endpoints** | `index.js` mounts exact SRS endpoints |
| **FR-ACCESS-006 (EN + AM)** | `i18n/locales/{en,am}/support-agent.json` |
| **§2.4 excluded** | ❌ No AI, no automated diagnosis, no transporter, no delivery — agent workflow is human |

---

## ✅ Support Agent module delivery summary

**3 layers × 22 sub-modules:**

1. **Backend** (`server/src/modules/support-agent/`) — 22 sub-modules covering:
   - **Assisted Farmer core** (§5.3, §6.2, §6.4, §9.5): `assisted-farmer-onboarding`, `assisted-consent-management`, `assisted-listing`, `order-assistance`, `consultation-assistance`
   - **Support domain**: `farmer-support-requests`, `ticket-management`, `farmer-communication`, `account-assistance`, `marketplace-support`, `consultation-support`, `knowledge-base`, `escalation-management`
   - **Ops**: `agent-dashboard`, `agent-profile`, `feedback`, `notifications`, `analytics`, `guidelines`, `settings`
   - **Traceability**: `support-audit` (immutable log of every assisted action)
   - **Guard middleware**: `listingOwnershipEnforcer`, `priceChangeApproval`, `consentVerifier` (via `shared/middleware/requireConsent`), `passwordPolicyGuard`, `communicationAccessGuard`, `orderActionGuard`
   - **SRS §12.3 endpoints** mounted exactly as specified

2. **Web** (`client/src/modules/support-agent/`) — 22 sub-modules + 8 layout files including **`ActingOnBehalfBanner.jsx`** (SRS §11.5 explicit requirement)

3. **Mobile** (`mobile/src/modules/support-agent/`) — 22 sub-modules + navigation (14 stacks) + layouts + **`ActingOnBehalfBanner.tsx`**

**SRS §4.1.4 "shall NOT do" list enforced:**
- ✅ **No password / OTP access** → `passwordPolicyGuard.js` + FR-AUTH-013/BR-020
- ✅ **Cannot become listing owner** → `listingOwnershipEnforcer.js`
- ✅ **Cannot change price/quantity without approval** → `priceChangeApproval.service.js`
- ✅ **Cannot accept/reject orders** → `orderActionGuard.js`
- ✅ **Cannot withdraw money / approve payments** → no payout module in agent
- ✅ **Cannot access unrelated private data** → `communicationAccessGuard.js` + scope checks
- ✅ **Cannot change admin permissions** → no access to RBAC module
- ✅ **Cannot delete audit records** → `supportAuditLog.model` append-only
- ✅ **All assisted actions traceable** → `assistedAction.model` + `support-audit`

👉 Next (last one): **Administrator module** — including assisted-farmer monitoring (§6.8), identity verification, listing moderation, content moderation, disputes, reports, audit logs, platform configuration, market info, articles, system health?