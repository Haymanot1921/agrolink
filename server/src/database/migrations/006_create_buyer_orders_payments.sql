-- 006_create_buyer_orders_payments.sql
-- Carts, orders, order items, payments (record-only), refunds, favourites,
-- consultation requests (linkage lives in 008). Depends on 001, 002, 004.

-- ─── Cart ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id    BIGINT UNSIGNED NOT NULL,
  listing_id  BIGINT UNSIGNED NOT NULL,
  quantity    DECIMAL(12,3)   NOT NULL,
  added_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_buyer_listing (buyer_id, listing_id),
  CONSTRAINT fk_cart_buyer
    FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_cart_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Orders ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number       VARCHAR(32)     NOT NULL,
  buyer_id           BIGINT UNSIGNED NOT NULL,
  farmer_id          BIGINT UNSIGNED NOT NULL,
  status             ENUM('pending','confirmed','rejected','preparing','ready_for_pickup','completed','cancelled','disputed','refunded')
                     NOT NULL DEFAULT 'pending',
  subtotal_minor     BIGINT UNSIGNED NOT NULL DEFAULT 0,
  tax_minor          BIGINT UNSIGNED NOT NULL DEFAULT 0,
  total_minor        BIGINT UNSIGNED NOT NULL DEFAULT 0,
  currency           CHAR(3)         NOT NULL DEFAULT 'ETB',
  delivery_address_json JSON         NULL,
  buyer_note         VARCHAR(1000)   NULL,
  farmer_note        VARCHAR(1000)   NULL,
  cancellation_reason VARCHAR(500)   NULL,
  confirmed_at       DATETIME        NULL,
  completed_at       DATETIME        NULL,
  cancelled_at       DATETIME        NULL,
  created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_number (order_number),
  KEY idx_orders_buyer (buyer_id, status, created_at),
  KEY idx_orders_farmer (farmer_id, status, created_at),
  KEY idx_orders_status (status, created_at),
  CONSTRAINT fk_orders_buyer
    FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_orders_farmer
    FOREIGN KEY (farmer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id         BIGINT UNSIGNED NOT NULL,
  listing_id       BIGINT UNSIGNED NULL,
  product_name     VARCHAR(200)    NOT NULL,
  quantity         DECIMAL(12,3)   NOT NULL,
  unit             VARCHAR(20)     NOT NULL,
  unit_price_minor BIGINT UNSIGNED NOT NULL,
  line_total_minor BIGINT UNSIGNED NOT NULL,
  notes            VARCHAR(500)    NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_listing
    FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_status_history (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id     BIGINT UNSIGNED NOT NULL,
  from_status  VARCHAR(40)     NULL,
  to_status    VARCHAR(40)     NOT NULL,
  actor_id     BIGINT UNSIGNED NULL,
  actor_role   VARCHAR(64)     NULL,
  reason       VARCHAR(500)    NULL,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_order_status_history (order_id, created_at),
  CONSTRAINT fk_order_status_history_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Payments (record-only in first release — SRS §13.1) ──────────────────
CREATE TABLE IF NOT EXISTS payment_methods (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  code           VARCHAR(40)     NOT NULL,
  name_en        VARCHAR(120)    NOT NULL,
  name_am        VARCHAR(120)    NOT NULL,
  provider       VARCHAR(40)     NOT NULL,
  is_record_only TINYINT(1)      NOT NULL DEFAULT 1,
  is_active      TINYINT(1)      NOT NULL DEFAULT 1,
  sort_order     INT             NOT NULL DEFAULT 0,
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_methods_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id         BIGINT UNSIGNED NOT NULL,
  buyer_id         BIGINT UNSIGNED NOT NULL,
  method_code      VARCHAR(40)     NOT NULL,
  transaction_ref  VARCHAR(120)    NOT NULL,
  amount_minor     BIGINT UNSIGNED NOT NULL,
  refund_minor     BIGINT UNSIGNED NOT NULL DEFAULT 0,
  currency         CHAR(3)         NOT NULL DEFAULT 'ETB',
  status           ENUM('recorded','refund_requested','refunded','cancelled') NOT NULL DEFAULT 'recorded',
  mode             ENUM('record_only','live') NOT NULL DEFAULT 'record_only',
  metadata_json    JSON            NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_ref (transaction_ref),
  KEY idx_payments_order (order_id, status),
  KEY idx_payments_buyer (buyer_id, created_at),
  CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_payments_buyer
    FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refunds (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  payment_id     BIGINT UNSIGNED NOT NULL,
  amount_minor   BIGINT UNSIGNED NOT NULL,
  reason         VARCHAR(500)    NULL,
  requested_by   BIGINT UNSIGNED NULL,
  processed_by   BIGINT UNSIGNED NULL,
  status         ENUM('requested','approved','processed','rejected') NOT NULL DEFAULT 'requested',
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at   DATETIME        NULL,
  PRIMARY KEY (id),
  KEY idx_refunds_payment (payment_id, status),
  CONSTRAINT fk_refunds_payment
    FOREIGN KEY (payment_id) REFERENCES payments (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Favourites ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favourites (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  kind        ENUM('listing','farmer') NOT NULL,
  target_id   BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_favourites (user_id, kind, target_id),
  CONSTRAINT fk_favourites_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;