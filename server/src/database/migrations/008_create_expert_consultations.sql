-- 008_create_expert_consultations.sql
-- Expert profile extension, consultation requests, video sessions, reviews.
-- Depends on 001, 002.

-- ─── Expert profile extension ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expert_profiles (
  user_id             BIGINT UNSIGNED NOT NULL,
  provider_type_code  VARCHAR(64)     NOT NULL,
  hourly_rate_minor   BIGINT UNSIGNED NULL,
  consultation_topics_json JSON       NULL,
  languages_json      JSON            NULL,
  availability_json   JSON            NULL,        -- weekly schedule
  is_accepting        TINYINT(1)      NOT NULL DEFAULT 1,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_expert_profiles_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Consultations ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consultations (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id           BIGINT UNSIGNED NOT NULL,
  expert_id          BIGINT UNSIGNED NOT NULL,
  status             ENUM('requested','accepted','scheduled','in_progress','completed','cancelled','declined','no_show')
                     NOT NULL DEFAULT 'requested',
  topic              VARCHAR(200)    NOT NULL,
  description        TEXT            NULL,
  scheduled_at       DATETIME        NULL,
  duration_minutes   SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  video_provider     VARCHAR(40)     NULL,        -- 'jitsi' | 'daily' | 'zoom'
  video_room_url     VARCHAR(500)    NULL,
  accepted_at        DATETIME        NULL,
  started_at         DATETIME        NULL,
  ended_at           DATETIME        NULL,
  cancelled_by       BIGINT UNSIGNED NULL,
  cancellation_reason VARCHAR(500)   NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consultations_buyer (buyer_id, status, scheduled_at),
  KEY idx_consultations_expert (expert_id, status, scheduled_at),
  CONSTRAINT fk_consultations_buyer
    FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_consultations_expert
    FOREIGN KEY (expert_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS consultation_messages (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  consultation_id  BIGINT UNSIGNED NOT NULL,
  sender_id        BIGINT UNSIGNED NOT NULL,
  body             TEXT            NOT NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consult_msgs (consultation_id, created_at),
  CONSTRAINT fk_consult_msgs_consult
    FOREIGN KEY (consultation_id) REFERENCES consultations (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_consult_msgs_sender
    FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;