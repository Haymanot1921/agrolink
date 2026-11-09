// mobile/src/app/linking.ts
// Deep-link configuration: agrolink://<actor>/<path>
// Used by Expo Linking + React Navigation.
//
// Examples:
//   agrolink://home                         → Public / Home tab
//   agrolink://marketplace                  → Public / Market tab
//   agrolink://marketplace/list             → Standalone marketplace screen
//   agrolink://marketplace/product/123      → Product details
//   agrolink://articles                     → Articles list
//   agrolink://articles/abc                 → Article detail
//   agrolink://market-prices                → Market prices list
//   agrolink://experts/expert-xyz           → Expert profile
//   agrolink://about                        → About (via More stack)
//   agrolink://legal/privacy                → Privacy (via More stack)
//   agrolink://auth/login                   → Login
//   agrolink://auth/reset-password?token=x  → Reset password
//   agrolink://farmer/products/123          → Farmer product details
//   agrolink://buyer/orders/abc             → Buyer order details
//   agrolink://support-agent/assisted-farmers/search
//   agrolink://admin/assisted-farmers/reports
//
// SRS refs: §11.1 (public pages), §11.7 (mobile deep links),
//           §5.3 (assisted farmer), §5.7 (orders), §5.15 (disputes),
//           §6.8 (admin assisted review).

import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@navigation/types';

// ─────────────────────────────────────────────────────────────
// Prefixes — how users can arrive at the app
// ─────────────────────────────────────────────────────────────

export const PREFIXES = [
  Linking.createURL('/'),
  'agrolink://',
  'agrolink-dev://',
  'agrolink-preview://',
  'https://agrolink.et/app', // Universal Link (iOS) / App Link (Android)
  'https://staging.agrolink.et/app',
];

// ─────────────────────────────────────────────────────────────
// Full linking config
// ─────────────────────────────────────────────────────────────

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: PREFIXES,

  config: {
    // Fallback if a URL doesn't match any screen
    screens: {
      // ═══════════════════════════════════════════════════════
      // PUBLIC STACK
      // Contains: HomeTab (tabs) + all standalone public screens
      //          + Auth screens (reachable from public CTAs)
      // ═══════════════════════════════════════════════════════
      Public: {
        screens: {
          // ─────────── Home tabs (PublicTabNavigator) ───────────
          HomeTab: {
            screens: {
              // "Home" tab is the default for `/`
              Home: '',
              Market: 'marketplace',
              Articles: 'articles',
              Experts: 'experts',
              More: 'more',
            },
          },

          // ─────────── Info / marketing screens ───────────
          About: 'about',
          HowItWorks: 'how-it-works',
          Pricing: 'pricing',
          Faq: 'faq',
          Contact: 'contact',
          HelpCenter: 'help',

          // ─────────── Legal screens ───────────
          Terms: 'legal/terms',
          Privacy: 'legal/privacy',
          Cookies: 'legal/cookies',
          Accessibility: 'legal/accessibility',

          // ─────────── Company screens ───────────
          Careers: 'careers',
          Press: 'press',
          Blog: 'blog',

          // ─────────── Marketplace ───────────
          PublicMarketplace: 'marketplace/list',
          PublicProductDetails: {
            path: 'marketplace/product/:productId',
            parse: { productId: (id: string) => id },
          },
          PublicCategory: {
            path: 'marketplace/category/:categoryId',
            parse: { categoryId: (id: string) => Number(id) },
          },
          PublicSearchResults: {
            path: 'marketplace/search',
            parse: { query: (q: string) => q },
          },

          // ─────────── Articles ───────────
          PublicArticles: 'articles/list',
          PublicArticleDetails: {
            path: 'articles/:articleId',
            parse: { articleId: (id: string) => id },
          },
          PublicArticleCategory: {
            path: 'articles/category/:slug',
            parse: { slug: (s: string) => s },
          },

          // ─────────── Market prices ───────────
          PublicMarketPrices: 'market-prices',
          PublicMarketPriceDetails: {
            path: 'market-prices/:priceId',
            parse: { priceId: (id: string) => id },
          },

          // ─────────── Experts ───────────
          PublicExperts: 'experts/list',
          PublicExpertDetails: {
            path: 'experts/:expertId',
            parse: { expertId: (id: string) => id },
          },

          // ─────────── Errors ───────────
          Unauthorized: 'error/unauthorized',
          Forbidden: 'error/forbidden',
          ServerError: 'error/server',
          Maintenance: 'error/maintenance',
          NotFound: 'error/not-found',

          // ─────────── Auth (reachable from public CTAs) ───────────
          // NOTE: these are the *screen instances* used for guests;
          //       the dedicated Auth stack below is used for the login flow.
          Login: 'auth/login',
          Register: 'auth/register',
          RoleSelection: 'auth/role',
          ForgotPassword: 'auth/forgot',
          ResetPassword: {
            path: 'auth/reset',
            parse: { token: (t: string) => t },
          },
          OtpVerification: {
            path: 'auth/otp',
            parse: { identifier: (i: string) => i },
          },
          Onboarding: 'welcome',
        },
      },

      // ═══════════════════════════════════════════════════════
      // AUTH STACK
      // The dedicated auth flow (login → OTP → actor stack).
      // Reachable via agrolink://auth or via a public CTA that
      // redirects to the Auth stack root.
      // ═══════════════════════════════════════════════════════
      Auth: {
        screens: {
          Onboarding: 'auth/welcome',
          RoleSelection: 'auth/role-select',
          ServiceProviderType: 'auth/provider-type',
          Login: 'auth/sign-in',
          Register: 'auth/sign-up',
          ForgotPassword: 'auth/forgot-password',
          ResetPassword: {
            path: 'auth/reset-password',
            parse: { token: (token: string) => token },
          },
          OtpVerification: {
            path: 'auth/verify',
            parse: { identifier: (identifier: string) => identifier },
          },
        },
      },

      // ═══════════════════════════════════════════════════════
      // FARMER STACK
      // ═══════════════════════════════════════════════════════
      Farmer: {
        screens: {
          Dashboard: 'farmer/dashboard',
          MyProducts: 'farmer/products',
          ProductDetails: {
            path: 'farmer/products/:productId',
            parse: { productId: (id: string) => id },
          },
          AddProduct: 'farmer/products/new',
          EditProduct: {
            path: 'farmer/products/:productId/edit',
            parse: { productId: (id: string) => id },
          },
          FarmerOrders: 'farmer/orders',
          OrderDetails: {
            path: 'farmer/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          OrderHistory: 'farmer/orders/history',
          MyConsultations: 'farmer/consultations',
          ConsultationDetails: {
            path: 'farmer/consultations/:consultationId',
            parse: { consultationId: (id: string) => id },
          },
          NewConsultation: 'farmer/consultations/new',
          FindExperts: 'farmer/experts',
          FarmerMessages: 'farmer/messages',
          MarketPrices: 'farmer/market-prices',
          Articles: 'farmer/articles',
          ArticleDetails: {
            path: 'farmer/articles/:articleId',
            parse: { articleId: (id: string) => id },
          },
          FarmerNotifications: 'farmer/notifications',
          FarmerProfile: 'farmer/profile',
          EditProfile: 'farmer/profile/edit',
          FarmDetails: 'farmer/farm',
          MyDocuments: 'farmer/documents',
          VerificationStatus: 'farmer/verification',
          FarmerSupport: 'farmer/support',
          CreateSupportTicket: 'farmer/support/new',
          SupportTicketDetails: {
            path: 'farmer/support/:ticketId',
            parse: { ticketId: (id: string) => id },
          },
          FarmerSettings: 'farmer/settings',
        },
      },

      // ═══════════════════════════════════════════════════════
      // BUYER STACK
      // ═══════════════════════════════════════════════════════
      Buyer: {
        screens: {
          Dashboard: 'buyer/dashboard',
          Marketplace: 'buyer/marketplace',
          ProductDetails: {
            path: 'buyer/products/:productId',
            parse: { productId: (id: string) => id },
          },
          CategoryProducts: {
            path: 'buyer/categories/:categoryId',
            parse: { categoryId: (id: string) => Number(id) },
          },
          SearchResults: {
            path: 'buyer/search',
            parse: { query: (q: string) => q },
          },
          ShoppingCart: 'buyer/cart',
          Checkout: 'buyer/checkout',
          OrderConfirmation: {
            path: 'buyer/orders/:orderId/confirmation',
            parse: { orderId: (id: string) => id },
          },
          BuyerOrders: 'buyer/orders',
          BuyerOrderDetails: {
            path: 'buyer/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          PaymentHistory: 'buyer/payments',
          PaymentDetails: {
            path: 'buyer/payments/:paymentId',
            parse: { paymentId: (id: string) => id },
          },
          FavoriteProducts: 'buyer/favorites/products',
          FavoriteFarmers: 'buyer/favorites/farmers',
          BuyerConsultations: 'buyer/consultations',
          BuyerConsultationDetails: {
            path: 'buyer/consultations/:consultationId',
            parse: { consultationId: (id: string) => id },
          },
          RequestConsultation: 'buyer/consultations/new',
          BuyerMessages: 'buyer/messages',
          MyReviews: 'buyer/reviews',
          WriteReview: {
            path: 'buyer/reviews/write',
            parse: {
              orderId: (id: string) => id,
              targetType: (t: string) => t,
              targetId: (id: string) => id,
            },
          },
          MyDisputes: 'buyer/disputes',
          CreateDispute: 'buyer/disputes/new',
          DisputeDetails: {
            path: 'buyer/disputes/:disputeId',
            parse: { disputeId: (id: string) => id },
          },
          BuyerMarketPrices: 'buyer/market-prices',
          BuyerArticles: 'buyer/articles',
          BuyerArticleDetails: {
            path: 'buyer/articles/:articleId',
            parse: { articleId: (id: string) => id },
          },
          BuyerNotifications: 'buyer/notifications',
          BuyerProfile: 'buyer/profile',
          BuyerEditProfile: 'buyer/profile/edit',
          BuyerAddresses: 'buyer/addresses',
          BuyerSupport: 'buyer/support',
          BuyerSettings: 'buyer/settings',
        },
      },

      // ═══════════════════════════════════════════════════════
      // INPUT SUPPLIER STACK (Service Provider — Type A)
      // ═══════════════════════════════════════════════════════
      InputSupplier: {
        screens: {
          Dashboard: 'supplier/dashboard',
          StoreProfile: 'supplier/store-profile',
          EditStoreProfile: 'supplier/store-profile/edit',
          SupplierVerification: 'supplier/verification',
          InputCatalog: 'supplier/catalog',
          CreateInput: 'supplier/catalog/new',
          EditInput: {
            path: 'supplier/catalog/:inputId/edit',
            parse: { inputId: (id: string) => id },
          },
          InputDetails: {
            path: 'supplier/catalog/:inputId',
            parse: { inputId: (id: string) => id },
          },
          Inventory: 'supplier/inventory',
          SupplierOrders: 'supplier/orders',
          SupplierOrderDetails: {
            path: 'supplier/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          ProcurementRequests: 'supplier/procurement',
          ProcurementRequestDetails: {
            path: 'supplier/procurement/:requestId',
            parse: { requestId: (id: string) => id },
          },
          CreateQuotation: {
            path: 'supplier/procurement/:requestId/quote',
            parse: { requestId: (id: string) => id },
          },
          Pricing: 'supplier/pricing',
          Promotions: 'supplier/promotions',
          Customers: 'supplier/customers',
          SupplierFinance: 'supplier/finance',
          SupplierReviews: 'supplier/reviews',
          SupplierMessages: 'supplier/messages',
          SupplierNotifications: 'supplier/notifications',
          SupplierReports: 'supplier/reports',
          SupplierSettings: 'supplier/settings',
        },
      },

      // ═══════════════════════════════════════════════════════
      // AGRICULTURAL EXPERT STACK (Service Provider — Type B)
      // ═══════════════════════════════════════════════════════
      AgriculturalExpert: {
        screens: {
          Dashboard: 'expert/dashboard',
          ExpertProfile: 'expert/profile',
          EditExpertProfile: 'expert/profile/edit',
          ExpertVerification: 'expert/verification',
          Specializations: 'expert/specializations',
          ConsultationRequests: 'expert/requests',
          ConsultationRequestDetails: {
            path: 'expert/requests/:requestId',
            parse: { requestId: (id: string) => id },
          },
          ExpertConsultations: 'expert/consultations',
          ExpertConsultationDetails: {
            path: 'expert/consultations/:consultationId',
            parse: { consultationId: (id: string) => id },
          },
          ConsultationCalendar: 'expert/schedule',
          AvailabilityManagement: 'expert/availability',
          FarmerCommunications: 'expert/communications',
          Cases: 'expert/cases',
          CreateCase: 'expert/cases/new',
          CaseDetails: {
            path: 'expert/cases/:caseId',
            parse: { caseId: (id: string) => id },
          },
          Advice: 'expert/advice',
          CreateAdvice: 'expert/advice/new',
          AdviceDetails: {
            path: 'expert/advice/:adviceId',
            parse: { adviceId: (id: string) => id },
          },
          ExpertArticles: 'expert/articles',
          CreateArticle: 'expert/articles/new',
          ResourceLibrary: 'expert/resources',
          ExpertEarnings: 'expert/earnings',
          ExpertReviews: 'expert/reviews',
          ExpertMessages: 'expert/messages',
          ExpertNotifications: 'expert/notifications',
          ExpertReports: 'expert/reports',
          ExpertSettings: 'expert/settings',
        },
      },

      // ═══════════════════════════════════════════════════════
      // SUPPORT AGENT STACK
      // ═══════════════════════════════════════════════════════
      SupportAgent: {
        screens: {
          Dashboard: 'support-agent/dashboard',

          // ─────────── Assisted Farmer core (§5.3, §6.2, §6.4, §6.8) ───────────
          FarmerSearch: 'support-agent/assisted-farmers/search',
          AssistedRegistration: 'support-agent/assisted-farmers/register',
          ConsentRecord: {
            path: 'support-agent/assisted-farmers/:farmerId/consent',
            parse: { farmerId: (id: string) => id },
          },
          AssistedListingCreate: {
            path: 'support-agent/assisted-farmers/:farmerId/listings/create',
            parse: { farmerId: (id: string) => id },
          },
          AssistedListingEdit: {
            path: 'support-agent/assisted-listings/:listingId/edit',
            parse: { listingId: (id: string) => id },
          },
          AssistedListingReview: {
            path: 'support-agent/assisted-listings/:listingId/review',
            parse: { listingId: (id: string) => id },
          },
          AssistanceHistory: 'support-agent/assisted-farmers/history',
          ConsentManagement: 'support-agent/consents',
          ConsentDetails: {
            path: 'support-agent/consents/:consentId',
            parse: { consentId: (id: string) => id },
          },

          // ─────────── Support ───────────
          SupportRequests: 'support-agent/requests',
          SupportRequestDetails: {
            path: 'support-agent/requests/:requestId',
            parse: { requestId: (id: string) => id },
          },
          Tickets: 'support-agent/tickets',
          TicketDetails: {
            path: 'support-agent/tickets/:ticketId',
            parse: { ticketId: (id: string) => id },
          },
          FarmerCommunication: 'support-agent/communications',
          AccountAssistance: 'support-agent/account',
          MarketplaceIssues: 'support-agent/marketplace-issues',
          OrderIssueDetails: {
            path: 'support-agent/marketplace-issues/:issueId',
            parse: { issueId: (id: string) => id },
          },
          ConsultationSupport: 'support-agent/consultation-issues',
          KnowledgeBase: 'support-agent/knowledge',
          KnowledgeArticle: {
            path: 'support-agent/knowledge/:articleId',
            parse: { articleId: (id: string) => id },
          },
          Escalations: 'support-agent/escalations',
          EscalationDetails: {
            path: 'support-agent/escalations/:escalationId',
            parse: { escalationId: (id: string) => id },
          },
          SupportFeedback: 'support-agent/feedback',
          SupportReports: 'support-agent/reports',
          SupportNotifications: 'support-agent/notifications',
          AgentProfile: 'support-agent/profile',
          SupportSettings: 'support-agent/settings',
          SupportGuidelines: 'support-agent/guidelines',
        },
      },

      // ═══════════════════════════════════════════════════════
      // ADMINISTRATOR STACK
      // ═══════════════════════════════════════════════════════
      Administrator: {
        screens: {
          Dashboard: 'admin/dashboard',

          // ─────────── Access control ───────────
          AccessControl: 'admin/access-control',
          RolesAndPermissions: 'admin/roles',
          RoleDetails: {
            path: 'admin/roles/:roleId',
            parse: { roleId: (id: string) => Number(id) },
          },

          // ─────────── Users ───────────
          UserManagement: 'admin/users',
          UserDetails: {
            path: 'admin/users/:userId',
            parse: { userId: (id: string) => id },
          },
          FarmerManagement: 'admin/farmers',
          FarmerDetails: {
            path: 'admin/farmers/:farmerId',
            parse: { farmerId: (id: string) => id },
          },
          SupportAgentManagement: 'admin/support-agents',
          SupportAgentDetails: {
            path: 'admin/support-agents/:agentId',
            parse: { agentId: (id: string) => id },
          },

          // ─────────── Assisted farmer (§6.8) ───────────
          AssistedFarmerManagement: 'admin/assisted-farmers',
          AssistedActionDetails: {
            path: 'admin/assisted-farmers/actions/:actionId',
            parse: { actionId: (id: string) => id },
          },
          ConsentRecords: 'admin/assisted-farmers/consents',
          SupportAgentActivity: 'admin/assisted-farmers/agents',
          AssistedListings: 'admin/assisted-farmers/listings',
          AssistedServiceReports: 'admin/assisted-farmers/reports',

          // ─────────── Verification ───────────
          VerificationQueue: 'admin/verification',
          VerificationDetails: {
            path: 'admin/verification/:applicationId',
            parse: { applicationId: (id: string) => id },
          },

          // ─────────── Moderation ───────────
          ListingModeration: 'admin/listing-moderation',
          ListingDetails: {
            path: 'admin/listing-moderation/:listingId',
            parse: { listingId: (id: string) => id },
          },
          ContentModeration: 'admin/content-moderation',
          ReviewModeration: 'admin/review-moderation',

          // ─────────── Disputes ───────────
          Disputes: 'admin/disputes',
          DisputeDetails: {
            path: 'admin/disputes/:disputeId',
            parse: { disputeId: (id: string) => id },
          },

          // ─────────── Oversight (read-only) ───────────
          SupportTicketOversight: 'admin/tickets',
          SupportTicketOversightDetails: {
            path: 'admin/tickets/:ticketId',
            parse: { ticketId: (id: string) => id },
          },
          OrderOversight: 'admin/orders',
          OrderOversightDetails: {
            path: 'admin/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          ConsultationOversight: 'admin/consultations',
          ConsultationOversightDetails: {
            path: 'admin/consultations/:consultationId',
            parse: { consultationId: (id: string) => id },
          },

          // ─────────── Content management ───────────
          MarketPricesManagement: 'admin/market-info',
          CreateMarketPrice: 'admin/market-info/new',
          EditMarketPrice: {
            path: 'admin/market-info/:priceId/edit',
            parse: { priceId: (id: string) => id },
          },
          MarketPriceSources: 'admin/market-info/sources',
          ArticlesManagement: 'admin/articles',
          CreateArticle: 'admin/articles/new',
          EditArticle: {
            path: 'admin/articles/:articleId/edit',
            parse: { articleId: (id: string) => id },
          },
          ArticleCategories: 'admin/articles/categories',
          CategoryManagement: 'admin/categories',

          // ─────────── Reports / audit / settings ───────────
          ReportsAnalytics: 'admin/reports',
          AuditLogs: 'admin/audit-logs',
          AuditLogDetails: {
            path: 'admin/audit-logs/:logId',
            parse: { logId: (id: string) => id },
          },
          PlatformSettings: 'admin/settings',
          MarketplacePolicies: 'admin/settings/policies',
          RegionalSettings: 'admin/settings/regional',
          MaintenanceMode: 'admin/settings/maintenance',

          // ─────────── Notifications / profile / health ───────────
          AdministratorNotifications: 'admin/notifications',
          AdministratorProfile: 'admin/profile',
          EditAdministratorProfile: 'admin/profile/edit',
          SystemHealth: 'admin/system-health',
          ServiceStatus: 'admin/system-health/services',
          BackgroundJobs: 'admin/system-health/jobs',
        },
      },
    },
  },
};