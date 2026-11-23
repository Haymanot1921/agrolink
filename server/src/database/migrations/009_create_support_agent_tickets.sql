-- 009_create_support_agent_tickets.sql
-- Support tickets, messages, agent scopes, ticket assignment history.
-- Depends on 001, 002.

-- ─── Support agent scopes (SRS §6.8) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_agent_scopes (
  user_id      BIGINT UNSIGNED NOT NULL,
  scope_code   VARCHAR(80)     NOT NULL,
  granted_by   BIGINT UNSIGNED NULL,
  granted_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  revoked_at   DATETIME        NULL,
  PRIMARY KEY (user_id, scope_code),
  CONSTRAINT fk_agent_scopes_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Support tickets ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_number   VARCHAR(32)     NOT NULL,
  requester_id    BIGINT UNSIGNED NOT NULL,
  assignee_id     BIGINT UNSIGNED NULL,
  subject         VARCHAR(200)    NOT NULL,
  body            TEXT            NOT NULL,
  category        VARCHAR(60)     NULL,
  priority        ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  status          ENUM('open','in_progress','waiting_for_user','escalated','resolved','closed') NOT NULL DEFAULT 'open',
  first_response_at DATETIME      NULL,
  resolved_at     DATETIME        NULL,
  closed_at       DATETIME        NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tickets_number (ticket_number),
  KEY idx_tickets_requester (requester_id, status, created_at),
  KEY idx_tickets_assignee (assignee_id, status, created_at),
  KEY idx_tickets_status (status, priority, created_at),
  CONSTRAINT fk_tickets_requester
    FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_tickets_assignee
    FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS support_messages (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id   BIGINT UNSIGNED NOT NULL,
  sender_id   BIGINT UNSIGNED NOT NULL,
  sender_role VARCHAR(64)     NOT NULL,
  body        TEXT            NOT NULL,
  attachments_json JSON       NULL,
  is_internal TINYINT(1)      NOT NULL DEFAULT 0,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_support_msgs (ticket_id, created_at),
  CONSTRAINT fk_support_msgs_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_support_msgs_sender
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ticket_assignments (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_id    BIGINT UNSIGNED NOT NULL,
  assignee_id  BIGINT UNSIGNED NOT NULL,
  assigned_by  BIGINT UNSIGNED NULL,
  assigned_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unassigned_at DATETIME       NULL,
  PRIMARY KEY (id),
  KEY idx_ticket_assignments (ticket_id, assigned_at),
  CONSTRAINT fk_ticket_assignments_ticket
    FOREIGN KEY (ticket_id) REFERENCES support_tickets (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_ticket_assignments_user
    FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;