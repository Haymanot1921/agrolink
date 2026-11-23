-- 005_create_assisted_farmer.sql
-- SRS §6.8 — consent records, assisted actions, admin review notes,
-- suspicious-activity flags. Depends on 001, 002, 004.

-- ─── Consent records (farmer grants agent permission) ─────────────────────
CREATE TABLE IF NOT EXISTS consent_records (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  farmer_id        BIGINT UNSIGNED NOT NULL,
  agent_id         BIGINT UNSIGNED NOT NULL,
  consent_type     VARCHAR(60)     NOT NULL DEFAULT 'assisted_management',
  status           ENUM('pending','active','revoked','expired','declined') NOT NULL DEFAULT 'pending',
  grant_channel    ENUM('in_person','sms','in_app','phone_call','written_document') NULL,
  granted_at       DATETIME        NULL,
  expires_at       DATETIME        NULL,
  revoked_at       DATETIME        NULL,
  revoked_reason   VARCHAR(500)    NULL,
  document_id      VARCHAR(400)    NULL,
  notes            TEXT            NULL,
  last_reminder_at DATETIME        NULL,
  last_reminder_tier VARCHAR(8)    NULL,     -- '30d' | '7d'
  reminder_count   TINYINT UNSIGNED NOT NULL DEFAULT 0,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consent_farmer_status (farmer_id, status),
  KEY idx_consent_agent_status (agent_id, status),
  KEY idx_consent_expires (status, expires_at),
  CONSTRAINT fk_consent_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_consent_agent
    FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Assisted actions (each action an agent performs on behalf of a farmer)
CREATE TABLE IF NOT EXISTS assisted_actions (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  agent_id        BIGINT UNSIGNED NOT NULL,
  farmer_id       BIGINT UNSIGNED NOT NULL,
  consent_id      BIGINT UNSIGNED NOT NULL,
  action_type     VARCHAR(80)     NOT NULL,   -- 'assisted.listing.create', ...
  entity_type     VARCHAR(60)     NULL,       -- 'listing', 'order', 'message', ...
  entity_id       BIGINT UNSIGNED NULL,
  payload_json    JSON            NULL,
  risk_level      ENUM('low','medium','high') NOT NULL DEFAULT 'low',
  flagged         TINYINT(1)      NOT NULL DEFAULT 0,
  reviewed        TINYINT(1)      NOT NULL DEFAULT 0,
  reviewed_by     BIGINT UNSIGNED NULL,
  reviewed_at     DATETIME        NULL,
  review_decision ENUM('approve','reject','flag','request_info','resolve') NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_assisted_agent_time (agent_id, created_at),
  KEY idx_assisted_farmer_time (farmer_id, created_at),
  KEY idx_assisted_flagged (flagged, created_at),
  CONSTRAINT fk_assisted_agent
    FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_assisted_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_assisted_consent
    FOREIGN KEY (consent_id) REFERENCES consent_records (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Admin review notes on assisted actions ───────────────────────────────
CREATE TABLE IF NOT EXISTS admin_review_notes (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  action_id    BIGINT UNSIGNED NOT NULL,
  reviewer_id  BIGINT UNSIGNED NOT NULL,
  decision     ENUM('approve','reject','flag','request_info','resolve') NOT NULL,
  reason       VARCHAR(500)    NOT NULL,
  internal_notes TEXT          NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_review_notes_action (action_id, created_at),
  CONSTRAINT fk_review_notes_action
    FOREIGN KEY (action_id) REFERENCES assisted_actions (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_review_notes_reviewer
    FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Suspicious activity flags (heuristic-based, no AI/ML) ────────────────
CREATE TABLE IF NOT EXISTS suspicious_activity_flags (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  action_id    BIGINT UNSIGNED NULL,
  agent_id     BIGINT UNSIGNED NOT NULL,
  farmer_id    BIGINT UNSIGNED NOT NULL,
  rule_code    VARCHAR(80)     NOT NULL,   -- 'duplicate_action', 'rate_exceeded', ...
  details_json JSON            NULL,
  status       ENUM('open','under_review','resolved','dismissed') NOT NULL DEFAULT 'open',
  resolved_by  BIGINT UNSIGNED NULL,
  resolved_at  DATETIME        NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_suspicious_status (status, created_at),
  CONSTRAINT fk_suspicious_action
    FOREIGN KEY (action_id) REFERENCES assisted_actions (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_suspicious_agent
    FOREIGN KEY (agent_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_suspicious_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;