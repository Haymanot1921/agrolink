-- 011_create_messaging_reviews_disputes.sql
-- Conversations, messages, reviews, disputes, evidence. Depends on 001,
-- 002, 006.

-- ─── Conversations ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_a_id       BIGINT UNSIGNED NOT NULL,
  user_b_id       BIGINT UNSIGNED NOT NULL,
  last_message_id BIGINT UNSIGNED NULL,
  last_message_at DATETIME        NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conversations_pair (user_a_id, user_b_id),
  KEY idx_conversations_user_a (user_a_id, last_message_at),
  KEY idx_conversations_user_b (user_b_id, last_message_at),
  CONSTRAINT fk_conversations_a
    FOREIGN KEY (user_a_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_conversations_b
    FOREIGN KEY (user_b_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS messages (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id BIGINT UNSIGNED NOT NULL,
  sender_id       BIGINT UNSIGNED NOT NULL,
  body            TEXT            NOT NULL,
  attachments_json JSON           NULL,
  reported        TINYINT(1)      NOT NULL DEFAULT 0,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_messages_conv (conversation_id, created_at),
  CONSTRAINT fk_messages_conv
    FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS message_reads (
  message_id  BIGINT UNSIGNED NOT NULL,
  user_id     BIGINT UNSIGNED NOT NULL,
  read_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  CONSTRAINT fk_message_reads_msg
    FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_message_reads_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Reviews ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  author_id       BIGINT UNSIGNED NOT NULL,
  subject_id      BIGINT UNSIGNED NOT NULL,
  order_id        BIGINT UNSIGNED NULL,
  consultation_id BIGINT UNSIGNED NULL,
  rating          TINYINT UNSIGNED NOT NULL,
  title           VARCHAR(200)    NULL,
  body            TEXT            NULL,
  status          ENUM('draft','pending','under_review','approved','published','rejected','changes_requested','hidden','removed','archived')
                  NOT NULL DEFAULT 'published',
  report_count    INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_subject (subject_id, status, created_at),
  KEY idx_reviews_author (author_id, created_at),
  CONSTRAINT fk_reviews_author
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_subject
    FOREIGN KEY (subject_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS review_reports (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  review_id    BIGINT UNSIGNED NOT NULL,
  reporter_id  BIGINT UNSIGNED NOT NULL,
  reason_code  VARCHAR(60)     NOT NULL,
  reason_text  VARCHAR(1000)   NULL,
  status       ENUM('open','under_review','resolved','dismissed','closed') NOT NULL DEFAULT 'open',
  resolved_by  BIGINT UNSIGNED NULL,
  resolved_at  DATETIME        NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_review_reports_status (status, created_at),
  CONSTRAINT fk_review_reports_review
    FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_review_reports_reporter
    FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Disputes ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS disputes (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_number   VARCHAR(32)     NOT NULL,
  order_id         BIGINT UNSIGNED NOT NULL,
  buyer_id         BIGINT UNSIGNED NOT NULL,
  farmer_id        BIGINT UNSIGNED NOT NULL,
  assigned_admin_id BIGINT UNSIGNED NULL,
  category         VARCHAR(60)     NOT NULL,
  description      TEXT            NOT NULL,
  status           ENUM('open','under_review','awaiting_evidence','awaiting_response','escalated','resolved_buyer','resolved_seller','resolved_mutual','withdrawn','closed')
                   NOT NULL DEFAULT 'open',
  resolution_type  VARCHAR(40)     NULL,
  resolution_notes TEXT            NULL,
  refund_amount_minor BIGINT UNSIGNED NULL,
  evidence_requested_at DATETIME   NULL,
  resolved_at      DATETIME        NULL,
  resolved_by      BIGINT UNSIGNED NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_disputes_number (dispute_number),
  KEY idx_disputes_order (order_id),
  KEY idx_disputes_status (status, created_at),
  KEY idx_disputes_buyer (buyer_id, status),
  KEY idx_disputes_farmer (farmer_id, status),
  CONSTRAINT fk_disputes_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_disputes_buyer
    FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_disputes_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_disputes_admin
    FOREIGN KEY (assigned_admin_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dispute_evidence (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_id   BIGINT UNSIGNED NOT NULL,
  uploaded_by  BIGINT UNSIGNED NOT NULL,
  public_id    VARCHAR(400)    NOT NULL,
  url          VARCHAR(500)    NOT NULL,
  file_name    VARCHAR(200)    NULL,
  mime_type    VARCHAR(120)    NULL,
  description  VARCHAR(500)    NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_dispute_evidence_dispute (dispute_id, created_at),
  CONSTRAINT fk_dispute_evidence_dispute
    FOREIGN KEY (dispute_id) REFERENCES disputes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dispute_evidence_uploader
    FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dispute_messages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_id  BIGINT UNSIGNED NOT NULL,
  sender_id   BIGINT UNSIGNED NOT NULL,
  sender_role VARCHAR(64)     NOT NULL,
  body        TEXT            NOT NULL,
  is_internal TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_dispute_messages (dispute_id, created_at),
  CONSTRAINT fk_dispute_messages_dispute
    FOREIGN KEY (dispute_id) REFERENCES disputes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dispute_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS dispute_assignments (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  dispute_id   BIGINT UNSIGNED NOT NULL,
  assignee_id  BIGINT UNSIGNED NOT NULL,
  assigned_by  BIGINT UNSIGNED NULL,
  assigned_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unassigned_at DATETIME       NULL,
  PRIMARY KEY (id),
  KEY idx_dispute_assignments (dispute_id, assigned_at),
  CONSTRAINT fk_dispute_assignments_dispute
    FOREIGN KEY (dispute_id) REFERENCES disputes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_dispute_assignments_user
    FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;