-- 010_create_administrator.sql
-- Platform settings, audit logs (append-only), security events,
-- background job log. Depends on 001, 002.

-- ─── Platform settings ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_settings (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key`       VARCHAR(120)    NOT NULL,
  `value`     LONGTEXT        NOT NULL,
  value_type  ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
  category    VARCHAR(64)     NOT NULL,
  description VARCHAR(500)    NULL,
  is_public   TINYINT(1)      NOT NULL DEFAULT 0,
  updated_by  BIGINT UNSIGNED NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_platform_settings_key (`key`),
  KEY idx_platform_settings_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Audit log (append-only) ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_id      BIGINT UNSIGNED NULL,
  actor_role    VARCHAR(64)     NULL,
  action        VARCHAR(120)    NOT NULL,
  category      VARCHAR(64)     NOT NULL,
  severity      ENUM('low','medium','high') NOT NULL DEFAULT 'low',
  outcome       ENUM('success','failure') NOT NULL DEFAULT 'success',
  target_type   VARCHAR(60)     NULL,
  target_id     VARCHAR(60)     NULL,
  changes_json  JSON            NULL,
  metadata_json JSON            NULL,
  reason        VARCHAR(500)    NULL,
  ip            VARCHAR(45)     NULL,
  user_agent    VARCHAR(300)    NULL,
  request_id    VARCHAR(60)     NULL,
  mfa_verified  TINYINT(1)      NOT NULL DEFAULT 0,
  consent_id    BIGINT UNSIGNED NULL,
  timestamp     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_actor (actor_id, timestamp),
  KEY idx_audit_category (category, severity, timestamp),
  KEY idx_audit_action (action, timestamp),
  KEY idx_audit_target (target_type, target_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cold archive (>12 months) — identical schema
CREATE TABLE IF NOT EXISTS audit_logs_archived LIKE audit_logs;

-- ─── Security events (subset of audit logs for the security dashboard) ────
CREATE TABLE IF NOT EXISTS security_events (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NULL,
  event_type  VARCHAR(80)     NOT NULL,
  severity    ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  details_json JSON           NULL,
  ip          VARCHAR(45)     NULL,
  user_agent  VARCHAR(300)    NULL,
  timestamp   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_security_events_type (event_type, timestamp),
  KEY idx_security_events_user (user_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Background job log ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS background_job_logs (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_name      VARCHAR(120)    NOT NULL,
  status        ENUM('succeeded','failed','skipped') NOT NULL,
  started_at    DATETIME        NOT NULL,
  finished_at   DATETIME        NULL,
  duration_ms   INT UNSIGNED    NULL,
  processed     INT UNSIGNED    NOT NULL DEFAULT 0,
  skipped       INT UNSIGNED    NOT NULL DEFAULT 0,
  failed        INT UNSIGNED    NOT NULL DEFAULT 0,
  error_message TEXT            NULL,
  triggered_by  VARCHAR(60)     NULL,
  notes_json    JSON            NULL,
  PRIMARY KEY (id),
  KEY idx_bg_job_name (job_name, started_at),
  KEY idx_bg_job_status (status, started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Admin notifications inbox ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_notification_preferences (
  user_id             BIGINT UNSIGNED NOT NULL,
  email_enabled       TINYINT(1)      NOT NULL DEFAULT 1,
  sms_enabled         TINYINT(1)      NOT NULL DEFAULT 1,
  push_enabled        TINYINT(1)      NOT NULL DEFAULT 0,
  inapp_enabled       TINYINT(1)      NOT NULL DEFAULT 1,
  daily_summary_enabled TINYINT(1)    NOT NULL DEFAULT 1,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_admin_notif_prefs_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;