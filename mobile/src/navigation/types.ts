// mobile/src/navigation/types.ts
// Central type definitions for all navigator param lists.
// Every stack (Auth + 5 actors) is fully typed.

import type { NavigatorScreenParams } from '@react-navigation/native';

// ─────────────────────────────────────────────────────────────
// AUTH STACK
// ─────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelection: undefined;
  ServiceProviderType: { role: 'service_provider' };
  Login: { roleHint?: 'farmer' | 'buyer' | 'service_provider' | 'support_agent' | 'administrator' } | undefined;
  Register: {
    role: 'farmer' | 'buyer' | 'service_provider' | 'support_agent' | 'administrator';
    providerType?: 'input_supplier' | 'agricultural_expert';
  };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  OtpVerification: { identifier: string; purpose: 'registration' | 'reset' };
};

// ─────────────────────────────────────────────────────────────
// FARMER STACK
// ─────────────────────────────────────────────────────────────
export type FarmerStackParamList = {
  Dashboard: undefined;
  MyProducts: undefined;
  AddProduct: undefined;
  EditProduct: { productId: string };
  ProductDetails: { productId: string };
  FarmerOrders: undefined;
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
  MyConsultations: undefined;
  NewConsultation: undefined;
  ConsultationDetails: { consultationId: string };
  FindExperts: undefined;
  FarmerMessages: { conversationId?: string };
  MarketPrices: undefined;
  MarketPriceDetails: { priceId: string };
  Articles: undefined;
  ArticleDetails: { articleId: string };
  FarmerNotifications: undefined;
  FarmerProfile: undefined;
  EditProfile: undefined;
  FarmDetails: undefined;
  MyDocuments: undefined;
  VerificationStatus: undefined;
  FarmerSupport: undefined;
  CreateSupportTicket: undefined;
  SupportTicketDetails: { ticketId: string };
  FarmerSettings: undefined;
};

// ─────────────────────────────────────────────────────────────
// BUYER STACK
// ─────────────────────────────────────────────────────────────
export type BuyerStackParamList = {
  Dashboard: undefined;
  Marketplace: undefined;
  ProductDetails: { productId: string };
  CategoryProducts: { categoryId: number; categoryName: string };
  SearchResults: { query: string };
  ShoppingCart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  BuyerOrders: undefined;
  BuyerOrderDetails: { orderId: string };
  PaymentHistory: undefined;
  PaymentDetails: { paymentId: string };
  FavoriteProducts: undefined;
  FavoriteFarmers: undefined;
  BuyerConsultations: undefined;
  RequestConsultation: undefined;
  BuyerConsultationDetails: { consultationId: string };
  BuyerMessages: { conversationId?: string };
  MyReviews: undefined;
  WriteReview: { orderId: string; targetType: string; targetId: string };
  MyDisputes: undefined;
  CreateDispute: { orderId: string };
  DisputeDetails: { disputeId: string };
  BuyerMarketPrices: undefined;
  BuyerArticles: undefined;
  BuyerArticleDetails: { articleId: string };
  BuyerNotifications: undefined;
  BuyerProfile: undefined;
  BuyerEditProfile: undefined;
  BuyerAddresses: undefined;
  BuyerSupport: undefined;
  BuyerSettings: undefined;
};

// ─────────────────────────────────────────────────────────────
// INPUT SUPPLIER STACK (Service Provider — Type A)
// ─────────────────────────────────────────────────────────────
export type InputSupplierStackParamList = {
  Dashboard: undefined;
  StoreProfile: undefined;
  EditStoreProfile: undefined;
  SupplierVerification: undefined;
  InputCatalog: undefined;
  CreateInput: undefined;
  EditInput: { inputId: string };
  InputDetails: { inputId: string };
  Inventory: undefined;
  SupplierOrders: undefined;
  SupplierOrderDetails: { orderId: string };
  ProcurementRequests: undefined;
  ProcurementRequestDetails: { requestId: string };
  CreateQuotation: { requestId: string };
  Pricing: undefined;
  Promotions: undefined;
  Customers: undefined;
  SupplierFinance: undefined;
  SupplierReviews: undefined;
  SupplierMessages: { conversationId?: string };
  SupplierNotifications: undefined;
  SupplierReports: undefined;
  SupplierSettings: undefined;
};

// ─────────────────────────────────────────────────────────────
// AGRICULTURAL EXPERT STACK (Service Provider — Type B)
// ─────────────────────────────────────────────────────────────
export type ExpertStackParamList = {
  Dashboard: undefined;
  ExpertProfile: undefined;
  EditExpertProfile: undefined;
  ExpertVerification: undefined;
  Specializations: undefined;
  ConsultationRequests: undefined;
  ConsultationRequestDetails: { requestId: string };
  ExpertConsultations: undefined;
  ExpertConsultationDetails: { consultationId: string };
  ConsultationCalendar: undefined;
  AvailabilityManagement: undefined;
  FarmerCommunications: { conversationId?: string };
  Cases: undefined;
  CreateCase: undefined;
  CaseDetails: { caseId: string };
  Advice: undefined;
  CreateAdvice: { caseId?: string };
  AdviceDetails: { adviceId: string };
  ExpertArticles: undefined;
  CreateArticle: undefined;
  ResourceLibrary: undefined;
  ExpertEarnings: undefined;
  ExpertReviews: undefined;
  ExpertMessages: { conversationId?: string };
  ExpertNotifications: undefined;
  ExpertReports: undefined;
  ExpertSettings: undefined;
};

// ─────────────────────────────────────────────────────────────
// SUPPORT AGENT STACK
// ─────────────────────────────────────────────────────────────
export type SupportAgentStackParamList = {
  Dashboard: undefined;
  FarmerSearch: undefined;
  AssistedRegistration: undefined;
  ConsentRecord: { farmerId: string };
  AssistedListingCreate: { farmerId: string };
  AssistedListingEdit: { listingId: string };
  AssistedListingReview: { listingId: string };
  AssistanceHistory: undefined;
  SupportRequests: undefined;
  SupportRequestDetails: { requestId: string };
  Tickets: undefined;
  TicketDetails: { ticketId: string };
  FarmerCommunication: { conversationId?: string };
  ConsentManagement: undefined;
  ConsentDetails: { consentId: string };
  AccountAssistance: undefined;
  MarketplaceIssues: undefined;
  OrderIssueDetails: { issueId: string };
  ConsultationSupport: undefined;
  KnowledgeBase: undefined;
  KnowledgeArticle: { articleId: string };
  Escalations: undefined;
  EscalationDetails: { escalationId: string };
  SupportFeedback: undefined;
  SupportReports: undefined;
  SupportNotifications: undefined;
  AgentProfile: undefined;
  SupportSettings: undefined;
  SupportGuidelines: undefined;
};

// ─────────────────────────────────────────────────────────────
// ADMINISTRATOR STACK
// ─────────────────────────────────────────────────────────────
export type AdministratorStackParamList = {
  Dashboard: undefined;
  AccessControl: undefined;
  RolesAndPermissions: undefined;
  RoleDetails: { roleId: number };
  UserManagement: undefined;
  UserDetails: { userId: string };
  FarmerManagement: undefined;
  FarmerDetails: { farmerId: string };
  SupportAgentManagement: undefined;
  SupportAgentDetails: { agentId: string };
  AssistedFarmerManagement: undefined;
  AssistedActionDetails: { actionId: string };
  ConsentRecords: undefined;
  SupportAgentActivity: undefined;
  AssistedListings: undefined;
  AssistedServiceReports: undefined;
  VerificationQueue: undefined;
  VerificationDetails: { applicationId: string };
  ListingModeration: undefined;
  ListingDetails: { listingId: string; listingType: 'product' | 'input' };
  ContentModeration: undefined;
  ReviewModeration: undefined;
  Disputes: undefined;
  DisputeDetails: { disputeId: string };
  SupportTicketOversight: undefined;
  SupportTicketOversightDetails: { ticketId: string };
  OrderOversight: undefined;
  OrderOversightDetails: { orderId: string };
  ConsultationOversight: undefined;
  ConsultationOversightDetails: { consultationId: string };
  MarketPricesManagement: undefined;
  CreateMarketPrice: undefined;
  EditMarketPrice: { priceId: string };
  MarketPriceSources: undefined;
  ArticlesManagement: undefined;
  CreateArticle: undefined;
  EditArticle: { articleId: string };
  ArticleCategories: undefined;
  CategoryManagement: undefined;
  ReportsAnalytics: undefined;
  AuditLogs: undefined;
  AuditLogDetails: { logId: string };
  PlatformSettings: undefined;
  MarketplacePolicies: undefined;
  RegionalSettings: undefined;
  MaintenanceMode: undefined;
  AdministratorNotifications: undefined;
  AdministratorProfile: undefined;
  EditAdministratorProfile: undefined;
  SystemHealth: undefined;
  ServiceStatus: undefined;
  BackgroundJobs: undefined;
};

// ─────────────────────────────────────────────────────────────
// ROOT STACK (aggregates all actor stacks)
// ─────────────────────────────────────────────────────────────
export type ActorRootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Farmer: NavigatorScreenParams<FarmerStackParamList>;
  Buyer: NavigatorScreenParams<BuyerStackParamList>;
  InputSupplier: NavigatorScreenParams<InputSupplierStackParamList>;
  AgriculturalExpert: NavigatorScreenParams<ExpertStackParamList>;
  SupportAgent: NavigatorScreenParams<SupportAgentStackParamList>;
  Administrator: NavigatorScreenParams<AdministratorStackParamList>;
};

  // mobile/src/navigation/types.ts
// Central route param list. Includes: Auth, Public, and 5 actor stacks.
// Every screen in `src/pages/` is registered here.

// ─────────────────────────────────────────────────────────────
// PUBLIC STACK (matches src/pages/)
// ─────────────────────────────────────────────────────────────

export type PublicStackParamList = {
  // Main tabs
  HomeTab: NavigatorScreenParams<PublicHomeTabParamList>;

  // ─────────── PUBLIC — HOME ───────────
  Home: undefined;
  About: undefined;
  HowItWorks: undefined;
  Pricing: undefined;
  Faq: undefined;
  Contact: undefined;
  HelpCenter: undefined;

  // ─────────── PUBLIC — LEGAL ───────────
  Terms: undefined;
  Privacy: undefined;
  Cookies: undefined;
  Accessibility: undefined;

  // ─────────── PUBLIC — COMPANY ───────────
  Careers: undefined;
  Press: undefined;
  Blog: undefined;

  // ─────────── PUBLIC — MARKETPLACE ───────────
  PublicMarketplace: undefined;
  PublicProductDetails: { productId: string };
  PublicCategory: { categoryId: number; categoryName?: string };
  PublicSearchResults: { query: string };

  // ─────────── PUBLIC — ARTICLES ───────────
  PublicArticles: undefined;
  PublicArticleDetails: { articleId: string };
  PublicArticleCategory: { slug: string; title?: string };

  // ─────────── PUBLIC — MARKET PRICES ───────────
  PublicMarketPrices: undefined;
  PublicMarketPriceDetails: { priceId: string };

  // ─────────── PUBLIC — EXPERTS ───────────
  PublicExperts: undefined;
  PublicExpertDetails: { expertId: string };

  // ─────────── PUBLIC — ERRORS ───────────
  Unauthorized: undefined;
  Forbidden: undefined;
  ServerError: undefined;
  Maintenance: undefined;
  NotFound: undefined;

  // ─────────── AUTH (cross-navigated from public pages) ───────────
  Login: undefined;
  Register: {
    role: 'farmer' | 'buyer' | 'service_provider' | 'support_agent' | 'administrator';
    providerType?: 'input_supplier' | 'agricultural_expert';
  };
  RoleSelection: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  OtpVerification: { identifier: string; purpose: 'registration' | 'reset' };
  Onboarding: undefined;
};

// ─────────────────────────────────────────────────────────────
// PUBLIC HOME TABS (bottom nav for guests)
// ─────────────────────────────────────────────────────────────

export type PublicHomeTabParamList = {
  Home: undefined;
  Market: undefined;
  Articles: undefined;
  Experts: undefined;
  More: undefined;
};

// ─────────────────────────────────────────────────────────────
// PUBLIC "MORE" STACK (drawer sub-stack)
// ─────────────────────────────────────────────────────────────

export type PublicMoreStackParamList = {
  MoreMenu: undefined;
  About: undefined;
  HowItWorks: undefined;
  Pricing: undefined;
  Faq: undefined;
  Contact: undefined;
  HelpCenter: undefined;
  Terms: undefined;
  Privacy: undefined;
  Cookies: undefined;
  Accessibility: undefined;
  Careers: undefined;
  Press: undefined;
  Blog: undefined;
};

// ─────────────────────────────────────────────────────────────
// AUTH STACK
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// ACTOR STACKS (defined elsewhere; shown for completeness)
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// ROOT STACK
// ─────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Public: NavigatorScreenParams<PublicStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Farmer: NavigatorScreenParams<FarmerStackParamList>;
  Buyer: NavigatorScreenParams<BuyerStackParamList>;
  InputSupplier: NavigatorScreenParams<InputSupplierStackParamList>;
  AgriculturalExpert: NavigatorScreenParams<ExpertStackParamList>;
  SupportAgent: NavigatorScreenParams<SupportAgentStackParamList>;
  Administrator: NavigatorScreenParams<AdministratorStackParamList>;
};

// ─────────────────────────────────────────────────────────────
// GLOBAL type augmentation for useNavigation
// ─────────────────────────────────────────────────────────────

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}