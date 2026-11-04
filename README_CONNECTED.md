# 🔗 Full 3-Tier Integration: Frontend + Backend + Database

All three layers of the **Smart Cafeteria Pre-Order System** are connected to each other:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TIER 1: FRONTEND                              │
│              React 18 + Tailwind CSS (18-Page Single Page App)         │
│               [index.html] • [js/app.jsx] • [js/api.js]                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  ▲
             JSON REST API Requests │  │  Live State / WebSocket Fallback
           (CORS enabled, Port 5000)│  │
                                    ▼  │
┌────────────────────────────────────────────────────────────────────────┐
│                           TIER 2: BACKEND                              │
│                       Python Flask REST API Server                     │
│               [app.py] • [routes/] • [services/] • [models.py]         │
│          • BillingService (5% GST, Subtotal, Promo Coupons)            │
│          • OrderService (QR tokens, 4-digit PINs, Status tracker)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  ▲
                          SQL Reads │  │  Transactional Commits
                      & Real-time   │  │  (Foreign Keys ON, Row Factory)
                            Queries │  │
                                    ▼  │
┌────────────────────────────────────────────────────────────────────────┐
│                          TIER 3: DATABASE                              │
│             SQLite [cafeteria.db] (from cafeteria_schema.sql)          │
│                    28 Relational Tables + 3 Analytical Views           │
│   • users, student_profiles, categories, menu_items, item_variants     │
│   • pickup_slots, coupons, orders, order_items, order_status_history   │
│   • wallets, wallet_transactions, payments, reviews, notifications     │
│   • Views: v_daily_sales, v_top_items, v_low_stock                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 End-to-End Interconnection Details

### 1. Database ⇄ Backend (`cafeteria.db` ⇄ Flask API)
- **Database Engine**: Direct SQLite connection in [`database.py`](file:///d:/new/database.py) using `sqlite3.Row` factory and `PRAGMA foreign_keys = ON`.
- **Data Access Objects**: [`models.py`](file:///d:/new/models.py) exposes `UserModel`, `MenuModel`, `OrderModel`, `WalletModel`.
- **Order Placement**: [`OrderService.create_order()`](file:///d:/new/services/order_service.py) writes across **6 relational tables** in a single ACID transaction:
  1. `orders`: Generates `order_number` (e.g. `ORD-10046`), `pickup_qr_token`, `invoice_number`, subtotal, and 5% GST.
  2. `order_items`: Records snapshot of item name, quantity, unit price, and line total.
  3. `order_status_history`: Logs initial status `'placed'` with timestamp for live timeline audit.
  4. `menu_items`: Decrements inventory stock (`stock_qty = MAX(0, stock_qty - qty)`).
  5. `wallets`: If paying with Campus Meal Card, deducts balance and credits 10% loyalty reward points.
  6. `wallet_transactions`: Appends ledger row with delta, new balance, and reference.
  7. `notifications`: Inserts instant order confirmation notification.

### 2. Backend ⇄ Frontend (Flask API ⇄ React App)
- **Unified Host**: [`app.py`](file:///d:/new/app.py) serves both the REST API on `/api/*` and the static single-page app (`index.html`, `js/`, `css/`, `assets/`) on `http://127.0.0.1:5000/`.
- **Cross-Origin Support**: Automatic CORS support ensures the frontend works whether opened directly from `file:///d:/new/index.html` or over `http://127.0.0.1:5000/`.
- **Connection Handshake**:
  - [`js/api.js`](file:///d:/new/js/api.js) calls `GET /api/health` on startup.
  - When Flask responds, the frontend switches to **🟢 Backend & DB Connected** mode.
  - Live menu catalog, active orders, and student wallet balance are automatically fetched from the database.

### 3. Frontend Customer Workflows
- **Dynamic Menu & Cart**: When browsing dishes, the user clicks `[+]` or `[-]`. The cart updates instantaneously, recalculating subtotal and 5% GST in real-time.
- **Checkout & Pre-Order**: When clicking *"Confirm & Place Pre-Order"*, the frontend posts to `POST /api/orders`. The order is written to `cafeteria.db` and assigned a live database `order_number` (e.g. `ORD-10046`) and verification PIN.
- **Kitchen KDS & Tracking**: When the kitchen or simulation advances an order to `'ready'`, a status PATCH is sent to `PATCH /api/orders/{id}/status`, updating `order_status_history` and `orders` in `cafeteria.db`.
- **Wallet Top-Up**: When recharging via UPI, `POST /api/wallet/recharge` updates `wallets.balance` and `wallets.reward_points` in `cafeteria.db`.

---

## 🚀 Running All 3 Layers Together

### Step 1: Initialize Database (Already Completed)
The SQLite database [`cafeteria.db`](file:///d:/new/cafeteria.db) (352 KB) is already created and verified with all 28 tables and sample seed data. If you ever want to rebuild it:
```cmd
build_database.exe
```
Or double-click [`init_db.bat`](file:///d:/new/init_db.bat).

### Step 2: Start Flask Backend Server
Double-click [`run_backend.bat`](file:///d:/new/run_backend.bat) (or run `python app.py`).
The server starts at:
```
http://127.0.0.1:5000
```

### Step 3: Launch Frontend
Open [`http://127.0.0.1:5000`](http://127.0.0.1:5000) or open [`index.html`](file:///d:/new/index.html) in your browser.
Look at the top navbar:
- **🟢 Backend & DB Connected**: Shows green pulse indicator confirming full 3-tier connectivity with `cafeteria.db`.
