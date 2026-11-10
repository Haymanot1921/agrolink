// client/src/app/router.jsx
// Route tree for all 5 actors + public + auth.
// Every route is wrapped in RouteGuards that respect role + permissions.
// Bilingual routes (EN + AM) use the SAME path — translation is content,
// not URL. Language switching is instantaneous via i18n.
//
// SRS refs: §11.1 (public), §11.2–§11.7 (actor dashboards),
//           §4.1 (5 actors), FR-ACCESS-006.

import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────
// Layouts
// ─────────────────────────────────────────────────────────────
import { PublicLayout } from '@layouts/common/PublicLayout';
import { AuthLayout } from '@layouts/common/AuthLayout';
import { FarmerLayout } from '@layouts/farmer/FarmerLayout';
import { BuyerLayout } from '@layouts/buyer/BuyerLayout';
import { InputSupplierLayout } from '@layouts/input-supplier/InputSupplierLayout';
import { ExpertLayout } from '@layouts/agricultural-expert/ExpertLayout';
import { SupportAgentLayout } from '@layouts/support-agent/SupportAgentLayout';
import { AdministratorLayout } from '@layouts/administrator/AdministratorLayout';

// ─────────────────────────────────────────────────────────────
// Guards
// ─────────────────────────────────────────────────────────────
import {
  RequireAuth,
  RequireRole,
  GuestOnly,
} from './routeGuards';

// ─────────────────────────────────────────────────────────────
// Public pages (lazy — guest-accessible)
// ─────────────────────────────────────────────────────────────
const HomePage = lazy(() => import('@pages/public/HomePage'));
const AboutPage = lazy(() => import('@pages/public/AboutPage'));
const HowItWorksPage = lazy(() => import('@pages/public/HowItWorksPage'));
const PricingPage = lazy(() => import('@pages/public/PricingPage'));
const FaqPage = lazy(() => import('@pages/public/FaqPage'));
const ContactPage = lazy(() => import('@pages/public/ContactPage'));
const HelpCenterPage = lazy(() => import('@pages/public/HelpCenterPage'));
const TermsPage = lazy(() => import('@pages/public/TermsPage'));
const PrivacyPage = lazy(() => import('@pages/public/PrivacyPage'));
const CookiesPage = lazy(() => import('@pages/public/CookiesPage'));
const AccessibilityPage = lazy(() => import('@pages/public/AccessibilityPage'));
const CareersPage = lazy(() => import('@pages/public/CareersPage'));
const PressPage = lazy(() => import('@pages/public/PressPage'));
const BlogPage = lazy(() => import('@pages/public/BlogPage'));
const NotFoundPage = lazy(() => import('@pages/public/NotFoundPage'));

const PublicMarketplacePage = lazy(() =>
  import('@pages/marketplace/PublicMarketplacePage'),
);
const PublicProductDetailsPage = lazy(() =>
  import('@pages/marketplace/PublicProductDetailsPage'),
);
const PublicCategoryPage = lazy(() =>
  import('@pages/marketplace/PublicCategoryPage'),
);
const PublicSearchResultsPage = lazy(() =>
  import('@pages/marketplace/PublicSearchResultsPage'),
);
const PublicArticlesPage = lazy(() => import('@pages/articles/PublicArticlesPage'));
const PublicArticleDetailsPage = lazy(() =>
  import('@pages/articles/PublicArticleDetailsPage'),
);
const PublicArticleCategoryPage = lazy(() =>
  import('@pages/articles/PublicArticleCategoryPage'),
);
const PublicMarketPricesPage = lazy(() =>
  import('@pages/market-prices/PublicMarketPricesPage'),
);
const PublicMarketPriceDetailsPage = lazy(() =>
  import('@pages/market-prices/PublicMarketPriceDetailsPage'),
);
const PublicExpertsPage = lazy(() => import('@pages/experts/PublicExpertsPage'));
const PublicExpertDetailsPage = lazy(() =>
  import('@pages/experts/PublicExpertDetailsPage'),
);

// ─────────────────────────────────────────────────────────────
// Auth pages
// ─────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const RoleSelectionPage = lazy(() => import('@pages/auth/RoleSelectionPage'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@pages/auth/VerifyEmailPage'));

// ─────────────────────────────────────────────────────────────
// Errors
// ─────────────────────────────────────────────────────────────
const UnauthorizedPage = lazy(() => import('@pages/errors/UnauthorizedPage'));
const ForbiddenPage = lazy(() => import('@pages/errors/ForbiddenPage'));
const ServerErrorPage = lazy(() => import('@pages/errors/ServerErrorPage'));
const MaintenancePage = lazy(() => import('@pages/errors/MaintenancePage'));

// ─────────────────────────────────────────────────────────────
// Farmer routes
// ─────────────────────────────────────────────────────────────
const FarmerDashboard = lazy(() =>
  import('@modules/farmer/dashboard/pages/FarmerDashboard'),
);
const MyProducts = lazy(() =>
  import('@modules/farmer/products/pages/MyProducts'),
);
const AddProduct = lazy(() => import('@modules/farmer/products/pages/AddProduct'));
const FarmerOrders = lazy(() =>
  import('@modules/farmer/orders/pages/FarmerOrders'),
);
const FarmerConsultations = lazy(() =>
  import('@modules/farmer/consultations/pages/MyConsultations'),
);
const FarmerMessages = lazy(() =>
  import('@modules/farmer/messages/pages/FarmerMessages'),
);
const FarmerMarketPrices = lazy(() =>
  import('@modules/farmer/market-prices/pages/MarketPrices'),
);
const FarmerArticles = lazy(() =>
  import('@modules/farmer/articles/pages/ArticlesResources'),
);
const FarmerNotifications = lazy(() =>
  import('@modules/farmer/notifications/pages/FarmerNotifications'),
);
const FarmerProfile = lazy(() =>
  import('@modules/farmer/profile-verification/pages/FarmerProfile'),
);
const FarmerSettings = lazy(() =>
  import('@modules/farmer/settings/pages/FarmerSettings'),
);

// ─────────────────────────────────────────────────────────────
// Buyer routes
// ─────────────────────────────────────────────────────────────
const BuyerDashboard = lazy(() =>
  import('@modules/buyer/dashboard/pages/BuyerDashboard'),
);
const BuyerMarketplace = lazy(() =>
  import('@modules/buyer/marketplace/pages/Marketplace'),
);
const ShoppingCart = lazy(() => import('@modules/buyer/cart/pages/ShoppingCart'));
const Checkout = lazy(() => import('@modules/buyer/checkout/pages/Checkout'));
const BuyerOrders = lazy(() =>
  import('@modules/buyer/orders/pages/BuyerOrders'),
);
const BuyerMessages = lazy(() =>
  import('@modules/buyer/messages/pages/BuyerMessages'),
);
const BuyerConsultations = lazy(() =>
  import('@modules/buyer/consultations/pages/BuyerConsultations'),
);
const BuyerNotifications = lazy(() =>
  import('@modules/buyer/notifications/pages/BuyerNotifications'),
);
const BuyerProfile = lazy(() =>
  import('@modules/buyer/profile/pages/BuyerProfile'),
);
const BuyerSettings = lazy(() =>
  import('@modules/buyer/settings/pages/BuyerSettings'),
);

// ─────────────────────────────────────────────────────────────
// Input Supplier routes
// ─────────────────────────────────────────────────────────────
const SupplierDashboard = lazy(() =>
  import('@modules/input-supplier/dashboard/pages/InputSupplierDashboard'),
);
const SupplierCatalog = lazy(() =>
  import('@modules/input-supplier/input-catalog/pages/InputCatalogPage'),
);
const SupplierInventory = lazy(() =>
  import('@modules/input-supplier/inventory/pages/InventoryOverviewPage'),
);
const SupplierOrders = lazy(() =>
  import('@modules/input-supplier/supplier-orders/pages/SupplierOrdersPage'),
);
const SupplierMessages = lazy(() =>
  import('@modules/input-supplier/messages/pages/SupplierMessagesPage'),
);
const SupplierNotifications = lazy(() =>
  import('@modules/input-supplier/notifications/pages/SupplierNotificationsPage'),
);
const SupplierProfile = lazy(() =>
  import('@modules/input-supplier/store-profile/pages/SupplierProfilePage'),
);
const SupplierSettings = lazy(() =>
  import('@modules/input-supplier/settings/pages/SupplierSettingsPage'),
);

// ─────────────────────────────────────────────────────────────
// Agricultural Expert routes
// ─────────────────────────────────────────────────────────────
const ExpertDashboard = lazy(() =>
  import('@modules/agricultural-expert/dashboard/pages/ExpertDashboard'),
);
const ExpertProfile = lazy(() =>
  import('@modules/agricultural-expert/expert-profile/pages/ExpertProfilePage'),
);
const ExpertRequests = lazy(() =>
  import(
    '@modules/agricultural-expert/consultation-requests/pages/ConsultationRequestsPage'
  ),
);
const ExpertConsultations = lazy(() =>
  import('@modules/agricultural-expert/consultations/pages/ConsultationsPage'),
);
const ExpertSchedule = lazy(() =>
  import(
    '@modules/agricultural-expert/scheduling/pages/ConsultationCalendarPage'
  ),
);
const ExpertMessages = lazy(() =>
  import(
    '@modules/agricultural-expert/messages-notifications/pages/ExpertMessagesPage'
  ),
);
const ExpertNotifications = lazy(() =>
  import(
    '@modules/agricultural-expert/messages-notifications/pages/ExpertNotificationsPage'
  ),
);
const ExpertSettings = lazy(() =>
  import('@modules/agricultural-expert/settings/pages/ExpertSettingsPage'),
);

// ─────────────────────────────────────────────────────────────
// Support Agent routes
// ─────────────────────────────────────────────────────────────
const SupportAgentDashboard = lazy(() =>
  import('@modules/support-agent/dashboard/pages/SupportAgentDashboard'),
);
const AssistedFarmerPage = lazy(() =>
  import(
    '@modules/support-agent/assisted-farmer-onboarding/pages/AssistedFarmerManagementPage'
  ),
);
const ConsentManagement = lazy(() =>
  import('@modules/support-agent/consent-management/pages/FarmerConsentPage'),
);
const SupportTickets = lazy(() =>
  import('@modules/support-agent/ticket-management/pages/TicketsPage'),
);
const SupportMessages = lazy(() =>
  import(
    '@modules/support-agent/farmer-communication/pages/FarmerConversationsPage'
  ),
);
const SupportNotifications = lazy(() =>
  import(
    '@modules/support-agent/notifications/pages/SupportAgentNotificationsPage'
  ),
);
const SupportSettings = lazy(() =>
  import('@modules/support-agent/support-settings/pages/SupportSettingsPage'),
);

// ─────────────────────────────────────────────────────────────
// Administrator routes
// ─────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() =>
  import('@modules/administrator/dashboard/pages/AdministratorDashboard'),
);
const AdminAssistedFarmer = lazy(() =>
  import(
    '@modules/administrator/assisted-farmer-monitoring/pages/AssistedFarmerManagementPage'
  ),
);
const AdminUsers = lazy(() =>
  import('@modules/administrator/user-management/pages/UsersPage'),
);
const AdminVerification = lazy(() =>
  import(
    '@modules/administrator/identity-verification/pages/VerificationQueuePage'
  ),
);
const AdminListingModeration = lazy(() =>
  import('@modules/administrator/listing-moderation/pages/ListingModerationPage'),
);
const AdminReviewModeration = lazy(() =>
  import('@modules/administrator/review-moderation/pages/ReviewModerationPage'),
);
const AdminDisputes = lazy(() =>
  import('@modules/administrator/disputes-management/pages/DisputesPage'),
);
const AdminReports = lazy(() =>
  import('@modules/administrator/reports-analytics/pages/ReportsAnalyticsPage'),
);
const AdminAuditLogs = lazy(() =>
  import('@modules/administrator/audit-logs/pages/AuditLogsPage'),
);
const AdminNotifications = lazy(() =>
  import(
    '@modules/administrator/notifications/pages/AdministratorNotificationsPage'
  ),
);
const AdminProfile = lazy(() =>
  import('@modules/administrator/administrator-profile/pages/AdministratorProfilePage'),
);
const AdminSettings = lazy(() =>
  import('@modules/administrator/platform-configuration/pages/PlatformSettingsPage'),
);

// ─────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ═══════════════════════════════════════════════════ */}
        {/* PUBLIC — guest-accessible (SRS §11.1)             */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="help" element={<HelpCenterPage />} />

          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="accessibility" element={<AccessibilityPage />} />

          <Route path="careers" element={<CareersPage />} />
          <Route path="press" element={<PressPage />} />
          <Route path="blog" element={<BlogPage />} />

          <Route path="marketplace" element={<PublicMarketplacePage />} />
          <Route
            path="marketplace/product/:productId"
            element={<PublicProductDetailsPage />}
          />
          <Route path="marketplace/category/:slug" element={<PublicCategoryPage />} />
          <Route path="marketplace/search" element={<PublicSearchResultsPage />} />

          <Route path="articles" element={<PublicArticlesPage />} />
          <Route path="articles/:articleId" element={<PublicArticleDetailsPage />} />
          <Route
            path="articles/category/:slug"
            element={<PublicArticleCategoryPage />}
          />

          <Route path="market-prices" element={<PublicMarketPricesPage />} />
          <Route
            path="market-prices/:priceId"
            element={<PublicMarketPriceDetailsPage />}
          />

          <Route path="experts" element={<PublicExpertsPage />} />
          <Route path="experts/:expertId" element={<PublicExpertDetailsPage />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* AUTH — accessible only to guests                   */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          element={
            <GuestOnly>
              <AuthLayout />
            </GuestOnly>
          }
        >
          <Route path="auth/login" element={<LoginPage />} />
          <Route path="auth/register" element={<RegisterPage />} />
          <Route path="auth/role" element={<RoleSelectionPage />} />
          <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="auth/verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* FARMER — requires role=farmer (SRS §11.2)         */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="farmer"
          element={
            <RequireRole roles={['farmer']}>
              <RequireAuth>
                <FarmerLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="products" element={<MyProducts />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="consultations" element={<FarmerConsultations />} />
          <Route path="messages" element={<FarmerMessages />} />
          <Route path="market-prices" element={<FarmerMarketPrices />} />
          <Route path="articles" element={<FarmerArticles />} />
          <Route path="notifications" element={<FarmerNotifications />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="settings" element={<FarmerSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* BUYER — requires role=buyer (SRS §11.3)           */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="buyer"
          element={
            <RequireRole roles={['buyer']}>
              <RequireAuth>
                <BuyerLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="marketplace" element={<BuyerMarketplace />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="consultations" element={<BuyerConsultations />} />
          <Route path="messages" element={<BuyerMessages />} />
          <Route path="notifications" element={<BuyerNotifications />} />
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="settings" element={<BuyerSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* INPUT SUPPLIER — service_provider + input_supplier */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="supplier"
          element={
            <RequireRole roles={['service_provider']} providerType="input_supplier">
              <RequireAuth>
                <InputSupplierLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SupplierDashboard />} />
          <Route path="catalog" element={<SupplierCatalog />} />
          <Route path="inventory" element={<SupplierInventory />} />
          <Route path="orders" element={<SupplierOrders />} />
          <Route path="messages" element={<SupplierMessages />} />
          <Route path="notifications" element={<SupplierNotifications />} />
          <Route path="profile" element={<SupplierProfile />} />
          <Route path="settings" element={<SupplierSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* AGRICULTURAL EXPERT — service_provider + expert    */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="expert"
          element={
            <RequireRole
              roles={['service_provider']}
              providerType="agricultural_expert"
            >
              <RequireAuth>
                <ExpertLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ExpertDashboard />} />
          <Route path="profile" element={<ExpertProfile />} />
          <Route path="requests" element={<ExpertRequests />} />
          <Route path="consultations" element={<ExpertConsultations />} />
          <Route path="schedule" element={<ExpertSchedule />} />
          <Route path="messages" element={<ExpertMessages />} />
          <Route path="notifications" element={<ExpertNotifications />} />
          <Route path="settings" element={<ExpertSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* SUPPORT AGENT — assisted farmer core (SRS §11.5)   */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="support-agent"
          element={
            <RequireRole roles={['support_agent']}>
              <RequireAuth>
                <SupportAgentLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SupportAgentDashboard />} />
          <Route path="assisted-farmers" element={<AssistedFarmerPage />} />
          <Route path="consents" element={<ConsentManagement />} />
          <Route path="tickets" element={<SupportTickets />} />
          <Route path="messages" element={<SupportMessages />} />
          <Route path="notifications" element={<SupportNotifications />} />
          <Route path="settings" element={<SupportSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* ADMINISTRATOR — full platform governance (§11.6)   */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route
          path="admin"
          element={
            <RequireRole roles={['administrator']}>
              <RequireAuth>
                <AdministratorLayout />
              </RequireAuth>
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="assisted-farmers" element={<AdminAssistedFarmer />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="listing-moderation" element={<AdminListingModeration />} />
          <Route path="review-moderation" element={<AdminReviewModeration />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ═══════════════════════════════════════════════════ */}
        {/* ERRORS                                              */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route path="error/401" element={<UnauthorizedPage />} />
        <Route path="error/403" element={<ForbiddenPage />} />
        <Route path="error/500" element={<ServerErrorPage />} />
        <Route path="error/maintenance" element={<MaintenancePage />} />

        {/* ═══════════════════════════════════════════════════ */}
        {/* 404 — catch-all                                     */}
        {/* ═══════════════════════════════════════════════════ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}