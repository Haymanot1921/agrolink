-- 002_create_users_auth.sql
-- Users, sessions, refresh tokens, OTP codes, MFA step-up logs, and the
-- role joins. Depends on 001.

-- ─── Users ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email                 VARCHAR(254)    NOT NULL,
  phone                 VARCHAR(20)     NOT NULL,
  full_name             VARCHAR(160)    NOT NULL,
  password_hash         VARCHAR(255)    NOT NULL,
  password_changed_at   DATETIME        NULL,
  primary_role_id       BIGINT UNSIGNED NOT NULL,
  status                ENUM('pending','active','suspended','deactivated','deleted')
                        NOT NULL DEFAULT 'pending',
  language              CHAR(2)         NOT NULL DEFAULT 'en',
  is_email_verified     TINYINT(1)      NOT NULL DEFAULT 0,
  is_phone_verified     TINYINT(1)      NOT NULL DEFAULT 0,
  email_verified_at     DATETIME        NULL,
  phone_verified_at     DATETIME        NULL,
  verification_status   ENUM('unverified','pending','under_review','approved','rejected','additional_info_requested','expired')
                        NOT NULL DEFAULT 'unverified',
  verification_application_id BIGINT UNSIGNED NULL,
  avatar_url            VARCHAR(500)    NULL,
  business_name         VARCHAR(160)    NULL,
  bio                   TEXT            NULL,
  provider_type_code    VARCHAR(64)     NULL,
  years_of_experience   SMALLINT UNSIGNED NULL,
  language_pref_notes   TEXT            NULL,
  notification_preferences JSON         NULL,
  token_version         INT UNSIGNED    NOT NULL DEFAULT 0,
  last_login_at         DATETIME        NULL,
  last_login_ip         VARCHAR(45)     NULL,
  last_login_user_agent VARCHAR(300)    NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at            DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone),
  KEY idx_users_status (status),
  KEY idx_users_role (primary_role_id),
  KEY idx_users_deleted (deleted_at),
  CONSTRAINT fk_users_role
    FOREIGN KEY (primary_role_id) REFERENCES roles (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── User ↔ Role (multi-role support) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id    BIGINT UNSIGNED NOT NULL,
  role_id    BIGINT UNSIGNED NOT NULL,
  granted_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  granted_by BIGINT UNSIGNED NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_userroles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_userroles_role
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Refresh tokens ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id            BIGINT UNSIGNED NOT NULL,
  token_hash         CHAR(64)        NOT NULL,
  device_fingerprint VARCHAR(200)    NULL,
  user_agent         VARCHAR(300)    NULL,
  ip                 VARCHAR(45)     NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at         DATETIME        NOT NULL,
  revoked_at         DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_hash (token_hash),
  KEY idx_refresh_tokens_user (user_id, revoked_at, expires_at),
  CONSTRAINT fk_refresh_tokens_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── OTP codes (email/phone verification, password reset, MFA step-up) ────
CREATE TABLE IF NOT EXISTS otp_codes (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  subject_id   BIGINT UNSIGNED NOT NULL,
  purpose      VARCHAR(60)     NOT NULL,
  channel      ENUM('email','sms') NOT NULL,
  code_hash    CHAR(64)        NOT NULL,
  attempts     TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts TINYINT UNSIGNED NOT NULL DEFAULT 5,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME        NOT NULL,
  consumed_at  DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_otp_subject_purpose (subject_id, purpose, consumed_at),
  KEY idx_otp_expires (expires_at),
  CONSTRAINT fk_otp_user
    FOREIGN KEY (subject_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── MFA step-up audit ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mfa_stepups (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  scope        VARCHAR(120)    NOT NULL,
  verified_at  DATETIME        NOT NULL,
  expires_at   DATETIME        NOT NULL,
  ip           VARCHAR(45)     NULL,
  user_agent   VARCHAR(300)    NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_mfa_user_scope (user_id, scope, expires_at),
  CONSTRAINT fk_mfa_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── User status history (audit trail for suspensions/deactivations) ──────
CREATE TABLE IF NOT EXISTS user_status_history (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  from_status VARCHAR(40)     NULL,
  to_status   VARCHAR(40)     NOT NULL,
  reason      VARCHAR(500)    NULL,
  actor_id    BIGINT UNSIGNED NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_status_history_user (user_id, created_at),
  CONSTRAINT fk_status_history_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── User ↔ Specialization (from 006 seeder) ──────────────────────────────
CREATE TABLE IF NOT EXISTS specializations (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(80)     NOT NULL,
  name_en    VARCHAR(160)    NOT NULL,
  name_am    VARCHAR(160)    NOT NULL,
  is_system  TINYINT(1)      NOT NULL DEFAULT 1,
  is_active  TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order INT             NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_specializations_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_specializations (
  user_id           BIGINT UNSIGNED NOT NULL,
  specialization_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, specialization_id),
  CONSTRAINT fk_userspec_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_userspec_spec
    FOREIGN KEY (specialization_id) REFERENCES specializations (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Provider types (from 010 seeder) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS provider_types (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code       VARCHAR(64)     NOT NULL,
  name_en    VARCHAR(160)    NOT NULL,
  name_am    VARCHAR(160)    NOT NULL,
  role_scope ENUM('expert','service_provider','both') NOT NULL DEFAULT 'both',
  is_system  TINYINT(1)      NOT NULL DEFAULT 1,
  is_active  TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order INT             NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_provider_types_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;