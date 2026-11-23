-- 003_create_verification.sql
-- Identity verification applications + documents + decision history.
-- Depends on 001, 002.

CREATE TABLE IF NOT EXISTS verification_applications (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  applicant_id           BIGINT UNSIGNED NOT NULL,
  applicant_role_code    VARCHAR(64)     NOT NULL,
  status                 ENUM('unverified','pending','under_review','approved','rejected','additional_info_requested','expired')
                         NOT NULL DEFAULT 'pending',
  notes                  TEXT            NULL,
  submitted_at           DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at            DATETIME        NULL,
  info_requested_at      DATETIME        NULL,
  additional_info_submitted_at DATETIME  NULL,
  rejection_reason       VARCHAR(80)     NULL,
  rejection_note         VARCHAR(1000)   NULL,
  approved_by            BIGINT UNSIGNED NULL,
  rejected_by            BIGINT UNSIGNED NULL,
  withdrawn_at           DATETIME        NULL,
  withdrawn_by_applicant TINYINT(1)      NOT NULL DEFAULT 0,
  reminder_count         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_reminder_at       DATETIME        NULL,
  created_at             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_verif_applicant (applicant_id, status),
  KEY idx_verif_status (status, created_at),
  CONSTRAINT fk_verif_applicant
    FOREIGN KEY (applicant_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification_documents (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id   BIGINT UNSIGNED NOT NULL,
  document_type    VARCHAR(60)     NOT NULL,
  public_id        VARCHAR(400)    NOT NULL,
  url              VARCHAR(500)    NULL,
  file_name        VARCHAR(200)    NULL,
  mime_type        VARCHAR(120)    NULL,
  size_bytes       INT UNSIGNED    NULL,
  is_additional    TINYINT(1)      NOT NULL DEFAULT 0,
  uploaded_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_verif_docs_app (application_id, document_type),
  CONSTRAINT fk_verif_docs_app
    FOREIGN KEY (application_id) REFERENCES verification_applications (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification_review_history (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  application_id BIGINT UNSIGNED NOT NULL,
  event          VARCHAR(60)     NOT NULL,
  actor_id       BIGINT UNSIGNED NULL,
  actor_role     VARCHAR(64)     NULL,
  notes          VARCHAR(2000)   NULL,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_verif_history_app (application_id, created_at),
  CONSTRAINT fk_verif_history_app
    FOREIGN KEY (application_id) REFERENCES verification_applications (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;