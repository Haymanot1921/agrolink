-- 013_create_cache_queues.sql
-- Application-level cache and queue tables (for deployments without Redis).
-- If Redis is available these tables sit empty — the cache utility checks
-- Redis first, falls back to these tables.

-- ─── Cache entries (fallback when Redis unavailable) ─────────────────────
CREATE TABLE IF NOT EXISTS cache_entries (
  cache_key   VARCHAR(255)    NOT NULL,
  value_json  LONGTEXT        NOT NULL,
  expires_at  DATETIME        NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cache_key),
  KEY idx_cache_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Generic job queue (used for async tasks not covered by cron) ────────
CREATE TABLE IF NOT EXISTS job_queue (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  queue           VARCHAR(60)     NOT NULL DEFAULT 'default',
  job_type        VARCHAR(120)    NOT NULL,
  payload_json    JSON            NOT NULL,
  status          ENUM('pending','reserved','processing','succeeded','failed','dead')
                  NOT NULL DEFAULT 'pending',
  attempts        SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts    SMALLINT UNSIGNED NOT NULL DEFAULT 3,
  available_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reserved_at     DATETIME        NULL,
  reserved_by     VARCHAR(60)     NULL,
  completed_at    DATETIME        NULL,
  last_error      TEXT            NULL,
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_job_queue_pickup (queue, status, available_at),
  KEY idx_job_queue_type (job_type, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Job locks (used by migration runner + cron jobs) ────────────────────
CREATE TABLE IF NOT EXISTS job_locks (
  name         VARCHAR(120)    NOT NULL,
  holder       VARCHAR(120)    NOT NULL,
  acquired_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME        NOT NULL,
  PRIMARY KEY (name),
  KEY idx_job_locks_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;