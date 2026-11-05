-- ============================================================
-- Cafeteria Pre-Order System - PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------- ENUMS ----------
CREATE TYPE user_role        AS ENUM ('student', 'staff', 'admin');
CREATE TYPE diet_type        AS ENUM ('veg', 'non_veg', 'vegan', 'egg');
CREATE TYPE order_status     AS ENUM ('placed', 'accepted', 'preparing', 'ready', 'collected', 'rejected', 'cancelled');
CREATE TYPE payment_method   AS ENUM ('upi', 'card', 'net_banking', 'wallet', 'pay_at_counter');
CREATE TYPE payment_status   AS ENUM ('pending', 'success', 'failed', 'refunded');
CREATE TYPE discount_type    AS ENUM ('percent', 'flat');
CREATE TYPE wallet_txn_type  AS ENUM ('topup', 'payment', 'refund', 'cashback', 'adjustment');
CREATE TYPE stock_move_type  AS ENUM ('restock', 'sale', 'wastage', 'adjustment');
CREATE TYPE notif_type       AS ENUM ('order', 'offer', 'wallet', 'system');
CREATE TYPE otp_purpose      AS ENUM ('password_reset', 'email_verify', 'phone_verify');

-- ---------- AUTH & USERS ----------
CREATE TABLE users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role           user_role    NOT NULL DEFAULT 'student',
    full_name      VARCHAR(120) NOT NULL,
    email          VARCHAR(160) NOT NULL UNIQUE,
    phone          VARCHAR(50)  UNIQUE,
    password_hash  TEXT         NOT NULL,
    avatar_url     TEXT,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,   -- block / unblock
    last_login_at  TIMESTAMPTZ,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE student_profiles (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number          VARCHAR(30) NOT NULL UNIQUE,
    department           VARCHAR(80),
    year_of_study        SMALLINT,
    dietary_preference   diet_type,
    allergies            TEXT[],
    notify_order_updates BOOLEAN NOT NULL DEFAULT TRUE,
    notify_offers        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    purpose     otp_purpose NOT NULL,
    code_hash   TEXT        NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_otp_user ON otp_codes(user_id, purpose);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- MENU ----------
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(60) NOT NULL UNIQUE,   -- Breakfast, Lunch, Snacks, Beverages, Desserts
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE menu_items (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id      INT NOT NULL REFERENCES categories(id),
    name             VARCHAR(120) NOT NULL,
    description      TEXT,
    ingredients      TEXT,
    image_url        TEXT,
    base_price       NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    diet             diet_type NOT NULL DEFAULT 'veg',
    calories         INT,
    prep_time_mins   INT NOT NULL DEFAULT 10,
    is_available     BOOLEAN NOT NULL DEFAULT TRUE,
    is_special       BOOLEAN NOT NULL DEFAULT FALSE,  -- today's special
    stock_qty        INT,                              -- NULL = unlimited
    low_stock_alert  INT NOT NULL DEFAULT 5,
    avg_rating       NUMERIC(3,2) NOT NULL DEFAULT 0,
    rating_count     INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at       TIMESTAMPTZ
);
CREATE INDEX idx_items_category ON menu_items(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_items_name     ON menu_items(lower(name));

-- Size options: Small / Medium / Large
CREATE TABLE item_variants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id     UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    label       VARCHAR(40) NOT NULL,
    price_delta NUMERIC(10,2) NOT NULL DEFAULT 0,
    UNIQUE (item_id, label)
);

-- Add-ons: Extra cheese, extra butter, etc.
CREATE TABLE addons (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(80) NOT NULL,
    price       NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE menu_item_addons (
    item_id   UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    addon_id  UUID REFERENCES addons(id)     ON DELETE CASCADE,
    PRIMARY KEY (item_id, addon_id)
);

CREATE TABLE favorites (
    user_id     UUID REFERENCES users(id)      ON DELETE CASCADE,
    item_id     UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, item_id)
);

-- ---------- INVENTORY ----------
CREATE TABLE stock_movements (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id      UUID NOT NULL REFERENCES menu_items(id),
    move_type    stock_move_type NOT NULL,
    quantity     INT NOT NULL,                 -- +ve in, -ve out
    note         TEXT,
    created_by   UUID REFERENCES users(id),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_stock_item ON stock_movements(item_id, created_at DESC);

-- ---------- CAFETERIA SETTINGS & PICKUP SLOTS ----------
CREATE TABLE cafeteria_settings (
    id                 SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- single row
    name               VARCHAR(120) NOT NULL,
    address            TEXT,
    contact_phone      VARCHAR(50),
    tax_percent        NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    is_open            BOOLEAN NOT NULL DEFAULT TRUE,   -- drives "Cafeteria Closed" page
    slot_length_mins   INT NOT NULL DEFAULT 15,
    default_slot_cap   INT NOT NULL DEFAULT 20,
    payment_gateway    VARCHAR(40),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE operating_hours (
    day_of_week SMALLINT PRIMARY KEY CHECK (day_of_week BETWEEN 0 AND 6),
    opens_at    TIME,
    closes_at   TIME,
    is_closed   BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE pickup_slots (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_date     DATE NOT NULL,
    start_time    TIME NOT NULL,
    end_time      TIME NOT NULL,
    capacity      INT  NOT NULL CHECK (capacity >= 0),
    booked_count  INT  NOT NULL DEFAULT 0 CHECK (booked_count <= capacity),
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (slot_date, start_time)
);

-- ---------- CART ----------
CREATE TABLE carts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    coupon_id   UUID,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id       UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    item_id       UUID NOT NULL REFERENCES menu_items(id),
    variant_id    UUID REFERENCES item_variants(id),
    quantity      INT  NOT NULL CHECK (quantity > 0),
    addon_ids     UUID[] NOT NULL DEFAULT '{}',
    instructions  TEXT
);

-- ---------- COUPONS ----------
CREATE TABLE coupons (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(30) NOT NULL UNIQUE,
    description     TEXT,
    discount_type   discount_type NOT NULL,
    discount_value  NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    max_discount    NUMERIC(10,2),
    min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0,
    usage_limit     INT,                         -- total uses
    per_user_limit  INT NOT NULL DEFAULT 1,
    valid_from      TIMESTAMPTZ NOT NULL,
    valid_until     TIMESTAMPTZ NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE carts ADD CONSTRAINT fk_cart_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- ---------- ORDERS ----------
CREATE SEQUENCE order_number_seq START 1001;

CREATE TABLE orders (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number     VARCHAR(20) NOT NULL UNIQUE
                     DEFAULT ('ORD' || nextval('order_number_seq')),
    user_id          UUID REFERENCES users(id),
    pickup_slot_id   UUID REFERENCES pickup_slots(id),
    status           order_status NOT NULL DEFAULT 'placed',
    subtotal         NUMERIC(10,2) NOT NULL,
    discount_amount  NUMERIC(10,2) NOT NULL DEFAULT 0,
    tax_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount     NUMERIC(10,2) NOT NULL,
    coupon_id        UUID REFERENCES coupons(id),
    pickup_qr_token  TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    estimated_ready_at TIMESTAMPTZ,
    accepted_at      TIMESTAMPTZ,
    ready_at         TIMESTAMPTZ,
    collected_at     TIMESTAMPTZ,
    collected_by     UUID REFERENCES users(id),     -- staff who verified QR
    rejection_reason TEXT,
    notes            TEXT,
    invoice_number   VARCHAR(30) UNIQUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user   ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status, created_at);
CREATE INDEX idx_orders_slot   ON orders(pickup_slot_id);

CREATE TABLE order_items (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id        UUID REFERENCES menu_items(id),
    item_name      VARCHAR(120) NOT NULL,           -- snapshot
    variant_label  VARCHAR(40),
    addons         JSONB NOT NULL DEFAULT '[]',     -- [{name, price}]
    unit_price     NUMERIC(10,2) NOT NULL,          -- snapshot incl. variant + addons
    quantity       INT NOT NULL CHECK (quantity > 0),
    line_total     NUMERIC(10,2) NOT NULL,
    instructions   TEXT
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_item  ON order_items(item_id);

CREATE TABLE order_status_history (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      order_status NOT NULL,
    changed_by  UUID REFERENCES users(id),
    note        TEXT,
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_status_hist_order ON order_status_history(order_id, changed_at);

CREATE TABLE coupon_usages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id   UUID NOT NULL REFERENCES coupons(id),
    user_id     UUID NOT NULL REFERENCES users(id),
    order_id    UUID NOT NULL REFERENCES orders(id),
    used_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (order_id)
);

-- ---------- PAYMENTS & WALLET ----------
CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    method           payment_method NOT NULL,
    status           payment_status NOT NULL DEFAULT 'pending',
    amount           NUMERIC(10,2) NOT NULL,
    gateway_txn_id   VARCHAR(100),
    gateway_response JSONB,
    paid_at          TIMESTAMPTZ,
    refunded_at      TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_order ON payments(order_id);

CREATE TABLE saved_payment_methods (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method      payment_method NOT NULL,
    label       VARCHAR(60),
    token       TEXT NOT NULL,
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallets (
    user_id        UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    reward_points  INT NOT NULL DEFAULT 0 CHECK (reward_points >= 0),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet_transactions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id),
    txn_type       wallet_txn_type NOT NULL,
    amount         NUMERIC(10,2) NOT NULL,
    points_delta   INT NOT NULL DEFAULT 0,
    balance_after  NUMERIC(10,2) NOT NULL,
    order_id       UUID REFERENCES orders(id),
    reference      VARCHAR(100),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wallet_txn_user ON wallet_transactions(user_id, created_at DESC);

-- ---------- REVIEWS ----------
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    item_id         UUID REFERENCES menu_items(id),
    food_rating     SMALLINT CHECK (food_rating BETWEEN 1 AND 5),
    service_rating  SMALLINT CHECK (service_rating BETWEEN 1 AND 5),
    comment         TEXT,
    admin_reply     TEXT,
    is_visible      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (order_id, user_id, item_id)
);
CREATE INDEX idx_reviews_item ON reviews(item_id);

-- ---------- NOTIFICATIONS ----------
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notif_type NOT NULL,
    title       VARCHAR(120) NOT NULL,
    body        TEXT,
    order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user ON notifications(user_id, is_read, created_at DESC);

-- ---------- AUDIT ----------
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    actor_id    UUID REFERENCES users(id),
    action      VARCHAR(80) NOT NULL,
    entity      VARCHAR(60),
    entity_id   TEXT,
    details     JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- USEFUL VIEWS ----------
CREATE VIEW v_daily_sales AS
SELECT date_trunc('day', created_at)::date AS day,
       COUNT(*)                            AS orders,
       SUM(total_amount)                   AS revenue
FROM orders
WHERE status IN ('collected', 'ready', 'preparing', 'accepted')
GROUP BY 1;

CREATE VIEW v_top_items AS
SELECT oi.item_id, oi.item_name,
       SUM(oi.quantity)   AS units_sold,
       SUM(oi.line_total) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'collected'
GROUP BY oi.item_id, oi.item_name
ORDER BY units_sold DESC;

CREATE VIEW v_low_stock AS
SELECT id, name, stock_qty, low_stock_alert
FROM menu_items
WHERE stock_qty IS NOT NULL AND stock_qty <= low_stock_alert AND deleted_at IS NULL;

-- ---------- SEED DATA ----------
INSERT INTO categories (name, sort_order) VALUES
 ('Breakfast',1), ('Lunch',2), ('Snacks',3), ('Beverages',4), ('Desserts',5);

INSERT INTO cafeteria_settings (id, name, tax_percent) VALUES (1, 'Campus Cafeteria', 5.00);
