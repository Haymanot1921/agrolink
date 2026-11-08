// mobile/src/app/linking.ts
// Deep-link configuration: agrolink://<actor>/<path>
// Used by Expo Linking + React Navigation.
//
// Examples:
//   agrolink://farmer/products/123
//   agrolink://buyer/orders/abc
//   agrolink://support-agent/assisted-farmers/search
//   agrolink://admin/assisted-farmers/reports
//   agrolink://auth/reset-password?token=xyz
//
// SRS refs: §5.3 (assisted farmer), §5.7 (orders), §5.15 (disputes),
//           §6.8 (admin assisted review), §11.7 (mobile deep links).

import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from '@navigation/types';

export const PREFIXES = [
  Linking.createURL('/'),
  'agrolink://',
  'agrolink-dev://',
  'agrolink-preview://',
  'https://agrolink.et/app',   // universal link (iOS) / app link (Android)
  'https://staging.agrolink.et/app',
];

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: PREFIXES,
  config: {
    screens: {
      // ─── Auth ───
      Auth: {
        screens: {
          Onboarding: 'welcome',
          RoleSelection: 'auth/role',
          Login: 'auth/login',
          Register: 'auth/register',
          ForgotPassword: 'auth/forgot-password',
          ResetPassword: {
            path: 'auth/reset-password',
            parse: { token: (token: string) => token },
          },
          OtpVerification: {
            path: 'auth/otp',
            parse: { identifier: (identifier: string) => identifier },
          },
        },
      },

      // ─── Farmer ───
      Farmer: {
        screens: {
          Dashboard: 'farmer/dashboard',
          Products: 'farmer/products',
          ProductDetails: {
            path: 'farmer/products/:productId',
            parse: { productId: (id: string) => id },
          },
          Orders: 'farmer/orders',
          OrderDetails: {
            path: 'farmer/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          Consultations: 'farmer/consultations',
          Messages: 'farmer/messages',
          MarketPrices: 'farmer/market-prices',
          Articles: 'farmer/articles',
          Notifications: 'farmer/notifications',
          Profile: 'farmer/profile',
          Settings: 'farmer/settings',
        },
      },

      // ─── Buyer ───
      Buyer: {
        screens: {
          Dashboard: 'buyer/dashboard',
          Marketplace: 'buyer/marketplace',
          ProductDetails: {
            path: 'buyer/products/:productId',
            parse: { productId: (id: string) => id },
          },
          Cart: 'buyer/cart',
          Checkout: 'buyer/checkout',
          Orders: 'buyer/orders',
          OrderDetails: {
            path: 'buyer/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          Payments: 'buyer/payments',
          Favorites: 'buyer/favorites',
          Consultations: 'buyer/consultations',
          Messages: 'buyer/messages',
          Reviews: 'buyer/reviews',
          Disputes: 'buyer/disputes',
          DisputeDetails: {
            path: 'buyer/disputes/:disputeId',
            parse: { disputeId: (id: string) => id },
          },
          Notifications: 'buyer/notifications',
          Profile: 'buyer/profile',
          Settings: 'buyer/settings',
        },
      },

      // ─── Input Supplier (Service Provider) ───
      InputSupplier: {
        screens: {
          Dashboard: 'supplier/dashboard',
          StoreProfile: 'supplier/store-profile',
          Catalog: 'supplier/catalog',
          InputDetails: {
            path: 'supplier/catalog/:inputId',
            parse: { inputId: (id: string) => id },
          },
          Inventory: 'supplier/inventory',
          Orders: 'supplier/orders',
          OrderDetails: {
            path: 'supplier/orders/:orderId',
            parse: { orderId: (id: string) => id },
          },
          Procurement: 'supplier/procurement',
          Pricing: 'supplier/pricing',
          Finance: 'supplier/finance',
          Reviews: 'supplier/reviews',
          Messages: 'supplier/messages',
          Notifications: 'supplier/notifications',
          Reports: 'supplier/reports',
          Settings: 'supplier/settings',
        },
      },

      // ─── Agricultural Expert (Service Provider) ───
      AgriculturalExpert: {
        screens: {
          Dashboard: 'expert/dashboard',
          ExpertProfile: 'expert/profile',
          Specializations: 'expert/specializations',
          Requests: 'expert/requests',
          RequestDetails: {
            path: 'expert/requests/:requestId',
            parse: { requestId: (id: string) => id },
          },
          Consultations: 'expert/consultations',
          ConsultationDetails: {
            path: 'expert/consultations/:consultationId',
            parse: { consultationId: (id: string) => id },
          },
          Schedule: 'expert/schedule',
          Cases: 'expert/cases',
          Advice: 'expert/advice',
          Earnings: 'expert/earnings',
          Messages: 'expert/messages',
          Notifications: 'expert/notifications',
          Reports: 'expert/reports',
          Settings: 'expert/settings',
        },
      },

      // ─── Support Agent ───
      SupportAgent: {
        screens: {
          Dashboard: 'support-agent/dashboard',
          AssistedFarmerSearch: 'support-agent/assisted-farmers/search',
          AssistedFarmerRegister: 'support-agent/assisted-farmers/register',
          AssistedConsent: 'support-agent/assisted-farmers/:farmerId/consent',
          AssistedListingCreate: 'support-agent/assisted-farmers/:farmerId/listings/create',
          AssistedListingEdit: {
            path: 'support-agent/assisted-listings/:listingId/edit',
            parse: { listingId: (id: string) => id },
          },
          AssistanceHistory: 'support-agent/assisted-farmers/history',
          SupportRequests: 'support-agent/requests',
          SupportRequestDetails: {
            path: 'support-agent/requests/:ticketId',
            parse: { ticketId: (id: string) => id },
          },
          Tickets: 'support-agent/tickets',
          FarmerCommunication: 'support-agent/communications',
          Escalations: 'support-agent/escalations',
          Notifications: 'support-agent/notifications',
          Profile: 'support-agent/profile',
          Settings: 'support-agent/settings',
        },
      },

      // ─── Administrator ───
      Administrator: {
        screens: {
          Dashboard: 'admin/dashboard',
          AssistedFarmerMonitoring: 'admin/assisted-farmers',
          AssistedActionDetails: {
            path: 'admin/assisted-farmers/actions/:actionId',
            parse: { actionId: (id: string) => id },
          },
          ConsentRecords: 'admin/assisted-farmers/consents',
          SupportAgentActivity: 'admin/assisted-farmers/agents',
          AssistedServiceReports: 'admin/assisted-farmers/reports',
          UserManagement: 'admin/users',
          UserDetails: {
            path: 'admin/users/:userId',
            parse: { userId: (id: string) => id },
          },
          VerificationQueue: 'admin/verification',
          ListingModeration: 'admin/listing-moderation',
          ContentModeration: 'admin/content-moderation',
          ReviewModeration: 'admin/review-moderation',
          Disputes: 'admin/disputes',
          DisputeDetails: {
            path: 'admin/disputes/:disputeId',
            parse: { disputeId: (id: string) => id },
          },
          SupportTicketOversight: 'admin/tickets',
          OrderOversight: 'admin/orders',
          ConsultationOversight: 'admin/consultations',
          MarketInfo: 'admin/market-info',
          Articles: 'admin/articles',
          CategoryManagement: 'admin/categories',
          Reports: 'admin/reports',
          AuditLogs: 'admin/audit-logs',
          PlatformConfig: 'admin/settings',
          Notifications: 'admin/notifications',
          SystemHealth: 'admin/system-health',
        },
      },
    },
  },
};