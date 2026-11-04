-- ============================================================
-- Cafeteria Pre-Order System - SQLite Compatible Schema
-- Transpiled from cafeteria_schema.sql with full table & constraint parity
-- ============================================================

PRAGMA foreign_keys = ON;

-- ---------- AUTH & USERS ----------
CREATE TABLE IF NOT EXISTS users (
    id             TEXT PRIMARY KEY,
    role           TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
    full_name      TEXT NOT NULL,
    email          TEXT NOT NULL UNIQUE,
    phone          TEXT UNIQUE,
    password_hash  TEXT NOT NULL,
    avatar_url     TEXT,
    is_active      INTEGER NOT NULL DEFAULT 1,
    last_login_at  TIMESTAMP,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    user_id              TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    roll_number          TEXT NOT NULL UNIQUE,
    department           TEXT,
    year_of_study        INTEGER,
    dietary_preference   TEXT CHECK (dietary_preference IN ('veg', 'non_veg', 'vegan', 'egg')),
    allergies            TEXT DEFAULT '[]', -- JSON array
    notify_order_updates INTEGER NOT NULL DEFAULT 1,
    notify_offers        INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id          TEXT PRIMARY KEY,
    user_id     TEXT REFERENCES users(id) ON DELETE CASCADE,
    purpose     TEXT NOT NULL CHECK (purpose IN ('password_reset', 'email_verify', 'phone_verify')),
    code_hash   TEXT NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_otp_user ON otp_codes(user_id, purpose);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    revoked_at  TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- MENU ----------
CREATE TABLE IF NOT EXISTS categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_items (
    id               TEXT PRIMARY KEY,
    category_id      INTEGER NOT NULL REFERENCES categories(id),
    name             TEXT NOT NULL,
    description      TEXT,
    ingredients      TEXT,
    image_url        TEXT,
    base_price       REAL NOT NULL CHECK (base_price >= 0),
    diet             TEXT NOT NULL DEFAULT 'veg' CHECK (diet IN ('veg', 'non_veg', 'vegan', 'egg')),
    calories         INTEGER,
    prep_time_mins   INTEGER NOT NULL DEFAULT 10,
    is_available     INTEGER NOT NULL DEFAULT 1,
    is_special       INTEGER NOT NULL DEFAULT 0,
    stock_qty        INTEGER,
    low_stock_alert  INTEGER NOT NULL DEFAULT 5,
    avg_rating       REAL NOT NULL DEFAULT 0,
    rating_count     INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at       TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_name     ON menu_items(name);

CREATE TABLE IF NOT EXISTS item_variants (
    id          TEXT PRIMARY KEY,
    item_id     TEXT NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    label       TEXT NOT NULL,
    price_delta REAL NOT NULL DEFAULT 0,
    UNIQUE (item_id, label)
);

CREATE TABLE IF NOT EXISTS addons (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    price       REAL NOT NULL DEFAULT 0,
    is_active   INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS menu_item_addons (
    item_id   TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
    addon_id  TEXT REFERENCES addons(id)     ON DELETE CASCADE,
    PRIMARY KEY (item_id, addon_id)
);

CREATE TABLE IF NOT EXISTS favorites (
    user_id     TEXT REFERENCES users(id)      ON DELETE CASCADE,
    item_id     TEXT REFERENCES menu_items(id) ON DELETE CASCADE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id)
);

-- ---------- INVENTORY ----------
CREATE TABLE IF NOT EXISTS stock_movements (
    id           TEXT PRIMARY KEY,
    item_id      TEXT NOT NULL REFERENCES menu_items(id),
    move_type    TEXT NOT NULL CHECK (move_type IN ('restock', 'sale', 'wastage', 'adjustment')),
    quantity     INTEGER NOT NULL,
    note         TEXT,
    created_by   TEXT REFERENCES users(id),
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_stock_item ON stock_movements(item_id, created_at DESC);

-- ---------- CAFETERIA SETTINGS & PICKUP SLOTS ----------
CREATE TABLE IF NOT EXISTS cafeteria_settings (
    id                 INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    name               TEXT NOT NULL,
    address            TEXT,
    contact_phone      TEXT,
    tax_percent        REAL NOT NULL DEFAULT 5.00,
    is_open            INTEGER NOT NULL DEFAULT 1,
    slot_length_mins   INTEGER NOT NULL DEFAULT 15,
    default_slot_cap   INTEGER NOT NULL DEFAULT 20,
    payment_gateway    TEXT,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS operating_hours (
    day_of_week INTEGER PRIMARY KEY CHECK (day_of_week BETWEEN 0 AND 6),
    opens_at    TEXT,
    closes_at   TEXT,
    is_closed   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pickup_slots (
    id            TEXT PRIMARY KEY,
    slot_date     TEXT NOT NULL,
    start_time    TEXT NOT NULL,
    end_time      TEXT NOT NULL,
    capacity      INTEGER NOT NULL CHECK (capacity >= 0),
    booked_count  INTEGER NOT NULL DEFAULT 0 CHECK (booked_count <= capacity),
    is_active     INTEGER NOT NULL DEFAULT 1,
    UNIQUE (slot_date, start_time)
);

-- ---------- CART ----------
CREATE TABLE IF NOT EXISTS carts (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    coupon_id   TEXT REFERENCES coupons(id) ON DELETE SET NULL,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id            TEXT PRIMARY KEY,
    cart_id       TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    item_id       TEXT NOT NULL REFERENCES menu_items(id),
    variant_id    TEXT REFERENCES item_variants(id),
    quantity      INTEGER NOT NULL CHECK (quantity > 0),
    addon_ids     TEXT NOT NULL DEFAULT '[]', -- JSON array of UUIDs
    instructions  TEXT
);

-- ---------- COUPONS ----------
CREATE TABLE IF NOT EXISTS coupons (
    id              TEXT PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,
    description     TEXT,
    discount_type   TEXT NOT NULL CHECK (discount_type IN ('percent', 'flat')),
    discount_value  REAL NOT NULL CHECK (discount_value > 0),
    max_discount    REAL,
    min_order_value REAL NOT NULL DEFAULT 0,
    usage_limit     INTEGER,
    per_user_limit  INTEGER NOT NULL DEFAULT 1,
    valid_from      TIMESTAMP NOT NULL,
    valid_until     TIMESTAMP NOT NULL,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
    id                 TEXT PRIMARY KEY,
    order_number       TEXT NOT NULL UNIQUE,
    user_id            TEXT NOT NULL REFERENCES users(id),
    pickup_slot_id     TEXT NOT NULL REFERENCES pickup_slots(id),
    status             TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'accepted', 'preparing', 'ready', 'collected', 'rejected', 'cancelled')),
    subtotal           REAL NOT NULL,
    discount_amount    REAL NOT NULL DEFAULT 0,
    tax_amount         REAL NOT NULL DEFAULT 0,
    total_amount       REAL NOT NULL,
    coupon_id          TEXT REFERENCES coupons(id),
    pickup_qr_token    TEXT NOT NULL UNIQUE,
    estimated_ready_at TIMESTAMP,
    accepted_at        TIMESTAMP,
    ready_at           TIMESTAMP,
    collected_at       TIMESTAMP,
    collected_by       TEXT REFERENCES users(id),
    rejection_reason   TEXT,
    notes              TEXT,
    invoice_number     TEXT UNIQUE,
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_orders_user   ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_slot   ON orders(pickup_slot_id);

CREATE TABLE IF NOT EXISTS order_items (
    id             TEXT PRIMARY KEY,
    order_id       TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    item_id        TEXT NOT NULL REFERENCES menu_items(id),
    item_name      TEXT NOT NULL,
    variant_label  TEXT,
    addons         TEXT NOT NULL DEFAULT '[]', -- JSON array
    unit_price     REAL NOT NULL,
    quantity       INTEGER NOT NULL CHECK (quantity > 0),
    line_total     REAL NOT NULL,
    instructions   TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_item  ON order_items(item_id);

CREATE TABLE IF NOT EXISTS order_status_history (
    id          TEXT PRIMARY KEY,
    order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status      TEXT NOT NULL CHECK (status IN ('placed', 'accepted', 'preparing', 'ready', 'collected', 'rejected', 'cancelled')),
    changed_by  TEXT REFERENCES users(id),
    note        TEXT,
    changed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_status_hist_order ON order_status_history(order_id, changed_at);

CREATE TABLE IF NOT EXISTS coupon_usages (
    id          TEXT PRIMARY KEY,
    coupon_id   TEXT NOT NULL REFERENCES coupons(id),
    user_id     TEXT NOT NULL REFERENCES users(id),
    order_id    TEXT NOT NULL REFERENCES orders(id),
    used_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id)
);

-- ---------- PAYMENTS & WALLET ----------
CREATE TABLE IF NOT EXISTS payments (
    id               TEXT PRIMARY KEY,
    order_id         TEXT NOT NULL REFERENCES orders(id),
    method           TEXT NOT NULL CHECK (method IN ('upi', 'card', 'net_banking', 'wallet', 'pay_at_counter')),
    status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    amount           REAL NOT NULL,
    gateway_txn_id   TEXT,
    gateway_response TEXT, -- JSON
    paid_at          TIMESTAMP,
    refunded_at      TIMESTAMP,
    created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);

CREATE TABLE IF NOT EXISTS saved_payment_methods (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method      TEXT NOT NULL CHECK (method IN ('upi', 'card', 'net_banking', 'wallet', 'pay_at_counter')),
    label       TEXT,
    token       TEXT NOT NULL,
    is_default  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallets (
    user_id        TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    balance        REAL NOT NULL DEFAULT 0 CHECK (balance >= 0),
    reward_points  INTEGER NOT NULL DEFAULT 0 CHECK (reward_points >= 0),
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id             TEXT PRIMARY KEY,
    user_id        TEXT NOT NULL REFERENCES users(id),
    txn_type       TEXT NOT NULL CHECK (txn_type IN ('topup', 'payment', 'refund', 'cashback', 'adjustment')),
    amount         REAL NOT NULL,
    points_delta   INTEGER NOT NULL DEFAULT 0,
    balance_after  REAL NOT NULL,
    order_id       TEXT REFERENCES orders(id),
    reference      TEXT,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_wallet_txn_user ON wallet_transactions(user_id, created_at DESC);

-- ---------- REVIEWS ----------
CREATE TABLE IF NOT EXISTS reviews (
    id              TEXT PRIMARY KEY,
    order_id        TEXT NOT NULL REFERENCES orders(id),
    user_id         TEXT NOT NULL REFERENCES users(id),
    item_id         TEXT REFERENCES menu_items(id),
    food_rating     INTEGER CHECK (food_rating BETWEEN 1 AND 5),
    service_rating  INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    comment         TEXT,
    admin_reply     TEXT,
    is_visible      INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id);

-- ---------- NOTIFICATIONS ----------
CREATE TABLE IF NOT EXISTS notifications (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('order', 'offer', 'wallet', 'system')),
    title       TEXT NOT NULL,
    body        TEXT,
    order_id    TEXT REFERENCES orders(id) ON DELETE SET NULL,
    is_read     INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read, created_at DESC);

-- ---------- AUDIT ----------
CREATE TABLE IF NOT EXISTS audit_logs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id    TEXT REFERENCES users(id),
    action      TEXT NOT NULL,
    entity      TEXT,
    entity_id   TEXT,
    details     TEXT, -- JSON
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- USEFUL VIEWS ----------
CREATE VIEW IF NOT EXISTS v_daily_sales AS
SELECT date(created_at) AS day,
       COUNT(*)         AS orders,
       SUM(total_amount) AS revenue
FROM orders
WHERE status IN ('collected', 'ready', 'preparing', 'accepted')
GROUP BY date(created_at);

CREATE VIEW IF NOT EXISTS v_top_items AS
SELECT oi.item_id, oi.item_name,
       SUM(oi.quantity)   AS units_sold,
       SUM(oi.line_total) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.status = 'collected'
GROUP BY oi.item_id, oi.item_name
ORDER BY units_sold DESC;

CREATE VIEW IF NOT EXISTS v_low_stock AS
SELECT id, name, stock_qty, low_stock_alert
FROM menu_items
WHERE stock_qty IS NOT NULL AND stock_qty <= low_stock_alert AND deleted_at IS NULL;
