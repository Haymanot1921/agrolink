// server/src/config/environment.js
// Centralized, validated environment configuration loader.
// Fails fast at boot if a required variable is missing.

'use strict';

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env from project root (works for dev + docker)
const envFile = process.env.NODE_ENV === 'test'
  ? '.env.test'
  : '.env';

const envPath = path.resolve(process.cwd(), envFile);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const REQUIRED = [
  'NODE_ENV',
  'PORT',
  'API_PREFIX',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'CORS_ORIGINS',
];

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(`[config] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

const splitList = (value, fallback = []) =>
  (value ? value.split(',').map((s) => s.trim()).filter(Boolean) : fallback);

const toInt = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
};

const toBool = (value, fallback = false) =>
  value === undefined ? fallback : String(value).toLowerCase() === 'true';

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',

  app: {
    name: process.env.APP_NAME || 'AgroLink Ethiopia',
    port: toInt(process.env.PORT, 5000),
    apiPrefix: process.env.API_PREFIX || '/api/v1',
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    supportedLanguages: splitList(process.env.SUPPORTED_LANGUAGES, ['en', 'am']),
    timezone: process.env.TZ || 'Africa/Addis_Ababa',
    currency: process.env.CURRENCY || 'ETB',
  },

  database: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: toInt(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    name: process.env.MYSQL_DATABASE || 'agrolink',
    options: {
      connectionLimit: toInt(process.env.MYSQL_CONNECTION_LIMIT, 20),
      connectTimeout: toInt(process.env.MYSQL_CONNECT_TIMEOUT, 10000),
      timezone: process.env.MYSQL_TIMEZONE || 'Z',
    },
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'agrolink-ethiopia',
    audience: process.env.JWT_AUDIENCE || 'agrolink-clients',
  },

  cors: {
    origins: splitList(process.env.CORS_ORIGINS, ['http://localhost:3000']),
    credentials: toBool(process.env.CORS_CREDENTIALS, true),
    methods: splitList(process.env.CORS_METHODS, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
    allowedHeaders: splitList(process.env.CORS_ALLOWED_HEADERS, ['Content-Type', 'Authorization', 'Accept-Language', 'X-Request-Id']),
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'agrolink',
    enabled: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
    maxUploadSizeMb: toInt(process.env.CLOUDINARY_MAX_UPLOAD_MB, 10),
    allowedImageTypes: splitList(process.env.CLOUDINARY_IMAGE_TYPES, ['jpg', 'jpeg', 'png', 'webp']),
    allowedDocTypes: splitList(process.env.CLOUDINARY_DOC_TYPES, ['pdf', 'jpg', 'jpeg', 'png']),
  },

  socket: {
    enabled: toBool(process.env.SOCKET_ENABLED, true),
    path: process.env.SOCKET_PATH || '/socket.io',
    corsOrigin: process.env.SOCKET_CORS_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000',
    pingTimeout: toInt(process.env.SOCKET_PING_TIMEOUT, 25000),
    pingInterval: toInt(process.env.SOCKET_PING_INTERVAL, 20000),
    maxHttpBufferSize: toInt(process.env.SOCKET_MAX_BUFFER, 1e6),
    transports: splitList(process.env.SOCKET_TRANSPORTS, ['websocket', 'polling']),
  },

  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp', // smtp | ses | sendgrid
    fromName: process.env.EMAIL_FROM_NAME || 'AgroLink Ethiopia',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@agrolink.et',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@agrolink.et',
    smtp: {
      host: process.env.SMTP_HOST,
      port: toInt(process.env.SMTP_PORT, 587),
      secure: toBool(process.env.SMTP_SECURE, false),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
    awsSes: {
      region: process.env.AWS_SES_REGION || process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },

  sms: {
    provider: process.env.SMS_PROVIDER || 'africastalking', // africastalking | twilio
    senderId: process.env.SMS_SENDER_ID || 'AgroLink',
    africastalking: {
      username: process.env.AT_USERNAME,
      apiKey: process.env.AT_API_KEY,
      baseUrl: process.env.AT_BASE_URL || 'https://api.africastalking.com/version1/messaging',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
    },
  },

  // SRS §13.1: payments are record-only in first release.
  payment: {
    recordOnly: toBool(process.env.PAYMENT_RECORD_ONLY, true),
    providers: splitList(process.env.PAYMENT_PROVIDERS, ['telebirr', 'cbe_birr', 'cash_on_record']),
    telebirr: {
      appId: process.env.TELEBIRR_APP_ID,
      appKey: process.env.TELEBIRR_APP_KEY,
      publicKey: process.env.TELEBIRR_PUBLIC_KEY,
      baseUrl: process.env.TELEBIRR_BASE_URL || 'https://telebirr.et/api',
    },
    cbeBirr: {
      merchantId: process.env.CBE_BIRR_MERCHANT_ID,
      apiKey: process.env.CBE_BIRR_API_KEY,
      baseUrl: process.env.CBE_BIRR_BASE_URL,
    },
  },

  // SRS §5.8: consultation video provider (no delivery, no AI).
  video: {
    provider: process.env.VIDEO_PROVIDER || 'jitsi', // jitsi | daily | zoom
    jitsi: {
      domain: process.env.JITSI_DOMAIN || 'meet.jit.si',
      appId: process.env.JITSI_APP_ID,
      appSecret: process.env.JITSI_APP_SECRET,
    },
    daily: {
      apiKey: process.env.DAILY_API_KEY,
      baseUrl: process.env.DAILY_BASE_URL || 'https://api.daily.co/v1',
    },
    maxSessionMinutes: toInt(process.env.VIDEO_MAX_SESSION_MINUTES, 60),
  },

  maps: {
    provider: process.env.MAPS_PROVIDER || 'google', // google | mapbox | osm
    google: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    mapbox: {
      accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    },
    defaultCountry: process.env.MAPS_DEFAULT_COUNTRY || 'ET',
    defaultCenter: {
      lat: Number.parseFloat(process.env.MAPS_DEFAULT_LAT || '9.0300'),
      lng: Number.parseFloat(process.env.MAPS_DEFAULT_LNG || '38.7400'),
    },
  },

  security: {
    bcryptRounds: toInt(process.env.BCRYPT_ROUNDS, 12),
    passwordMinLength: toInt(process.env.PASSWORD_MIN_LENGTH, 8),
    passwordResetTokenTtlMinutes: toInt(process.env.PASSWORD_RESET_TTL_MIN, 30),
    emailVerificationTtlMinutes: toInt(process.env.EMAIL_VERIFY_TTL_MIN, 60),
    otpTtlSeconds: toInt(process.env.OTP_TTL_SECONDS, 300),
    maxLoginAttempts: toInt(process.env.MAX_LOGIN_ATTEMPTS, 5),
    lockoutMinutes: toInt(process.env.LOCKOUT_MINUTES, 15),
    rateLimitWindowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 100),
    privilegedActionConfirmHeader: 'x-privileged-confirm',
  },

  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    dir: process.env.LOG_DIR || path.resolve(process.cwd(), 'logs'),
    enableFile: toBool(process.env.LOG_ENABLE_FILE, false),
    redactKeys: splitList(process.env.LOG_REDACT_KEYS, [
      'password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'authorization', 'otp',
    ]),
  },

  uploads: {
    maxFileSizeMb: toInt(process.env.UPLOAD_MAX_FILE_SIZE_MB, 10),
    maxFilesPerRequest: toInt(process.env.UPLOAD_MAX_FILES, 5),
    allowedMimeTypes: splitList(process.env.UPLOAD_ALLOWED_MIME, [
      'image/jpeg', 'image/png', 'image/webp', 'application/pdf',
    ]),
  },

  // FR-ADMIN-013 / FR-ASSISTED-013
  reports: {
    exportDir: process.env.REPORT_EXPORT_DIR || path.resolve(process.cwd(), 'tmp/reports'),
    formats: splitList(process.env.REPORT_FORMATS, ['csv', 'xlsx', 'pdf']),
    maxDateRangeDays: toInt(process.env.REPORT_MAX_RANGE_DAYS, 366),
  },

  // SRS §6.8 step 6 — deterministic heuristic thresholds (NO AI/ML).
  assistedMonitoring: {
    duplicateActionWindowMinutes: toInt(process.env.ASSISTED_DUPLICATE_WINDOW_MIN, 30),
    maxActionsPerHour: toInt(process.env.ASSISTED_MAX_ACTIONS_PER_HOUR, 20),
    maxConsentAgeDays: toInt(process.env.ASSISTED_MAX_CONSENT_AGE_DAYS, 365),
  },

  i18n: {
    fallbackLng: 'en',
    languages: ['en', 'am'],
  },
});

module.exports = env;