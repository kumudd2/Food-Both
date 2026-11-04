# 🐍 Smart Cafeteria - Python Flask REST API & Backend Documentation

A robust, production-grade **Python Flask backend** for the Smart Cafeteria Pre-Order platform. It features SQLite persistence, dynamic bill calculation with 5% GST, QR code generation, order tracking lifecycle, campus wallet ledger, meal subscriptions, nutrition logs, crowd monitoring, and kitchen queue management.

---

## 📁 Backend Architecture

```
d:\new\
├── app.py                      # Flask Application entry point, CORS configuration, static SPA routes
├── config.py                   # App settings (Host, Port, Database Path, 5% GST rate)
├── database.py                 # SQLite database setup, table schema, pre-seeded catalog
├── requirements.txt            # Python dependencies (Flask, Flask-CORS, Werkzeug)
├── run_backend.bat             # One-click Windows starter script
├── test_backend.py             # Automated test suite (10 test cases)
├── services/
│   ├── billing_service.py      # Subtotal, 5% GST, coupon validations (CAMPUS10, STUDENT50)
│   └── order_service.py        # Order creation, verification PIN, QR token, kitchen lifecycle
└── routes/
    ├── menu_routes.py          # /api/menu, /api/categories, /api/counters, /api/slots
    ├── order_routes.py         # /api/orders, /api/orders/<id>/status, /api/orders/calculate-bill
    ├── wallet_routes.py        # /api/wallet, /api/wallet/recharge, /api/wallet/transactions
    ├── mealplan_routes.py      # /api/meal-plans, /api/meal-plans/subscribe
    ├── nutrition_routes.py     # /api/nutrition, /api/nutrition/log
    ├── crowd_routes.py         # /api/crowd, /api/tables/reserve
    ├── catering_routes.py      # /api/catering/packages, /api/catering/quote
    ├── review_routes.py        # /api/reviews, /api/suggestions, /api/suggestions/<id>/vote
    ├── auth_routes.py          # /api/auth/login, /api/auth/profile
    └── admin_routes.py         # /api/admin/stats, /api/admin/kitchen-queue
```

---

## 🚀 How to Run the Backend

### Method 1: One-Click Windows Batch Script
Double-click [**`run_backend.bat`**](file:///d:/new/run_backend.bat).
* Automatically checks for Python.
* Creates a virtual environment (`venv`).
* Installs dependencies from `requirements.txt`.
* Starts Flask server on `http://127.0.0.1:5000`.

### Method 2: Manual Terminal Execution
```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the Flask application
python app.py
```

When started, open:
* **Web Application**: `http://127.0.0.1:5000/` (Flask serves the full React frontend!)
* **API Health Check**: `http://127.0.0.1:5000/api/health`

---

## 📡 REST API Reference

### 1. Food Menu & Catalog
* **`GET /api/categories`**: Lists all 7 categories (Breakfast, Meals, Snacks, Beverages, etc.).
* **`GET /api/counters`**: List cafeteria counters (Counter 1 Fast Food, Counter 2 South Indian, Counter 3 Beverages) and wait times.
* **`GET /api/slots`**: Available pickup time slots (Express ~10 mins, 11:30 AM – 1:15 PM).
* **`GET /api/menu`**: Full food menu catalog with prices in ₹.
  * *Query Parameters*:
    * `category`: Filter by category ID (`breakfast`, `snacks`, etc.).
    * `search`: Keyword search for dish names or descriptions.
    * `diet`: `veg` (Pure veg), `protein` (12g+ protein), `chef` (Chef specials).
    * `sort`: `price-low`, `price-high`, `rating`, `calories`.
* **`GET /api/menu/<item_id>`**: Detailed single dish specs, portion multipliers, allergens, and add-on toppings.

### 2. Orders & Bill Lifecycle
* **`POST /api/orders`**: Create and place a new cafeteria pre-order.
  * *Request Body*:
    ```json
    {
      "user_id": "user-1",
      "items": [
        {"item_id": "item-1", "quantity": 1},
        {"item_id": "item-2", "quantity": 1},
        {"item_id": "item-3", "quantity": 1}
      ],
      "pickup_slot": "12:15 PM",
      "counter": "Counter 1 (Fast Food)",
      "payment_method": "Campus Meal Card",
      "special_instructions": "No onions, extra ketchup",
      "coupon_code": "CAMPUS10"
    }
    ```
  * *Response*: Returns `order_id` (e.g. `ORD-10045`), 4-digit verification PIN, status `placed`, total amount, and QR code token payload.
* **`GET /api/orders`**: Retrieve user orders. Filterable with `?status=all|ongoing|completed`.
* **`GET /api/orders/<order_id>`**: Live tracking data, timestamps, counter location, and stage timeline.
* **`PATCH /api/orders/<order_id>/status`**: Advance order status (`placed` → `accepted` → `cooking` → `ready` → `collected`).
* **`POST /api/orders/calculate-bill`**: Live preview calculation for cart items (subtotal, 5% GST, discounts, and total).

### 3. Campus Digital Wallet & Meal Card
* **`GET /api/wallet`**: Returns student RFID smartcard details (`STU-2024-8842`), balance (₹480), and reward points.
* **`POST /api/wallet/recharge`**: Add funds via UPI/Card simulation (`{"amount": 500, "user_id": "user-1"}`).
* **`GET /api/wallet/transactions`**: Detailed ledger history of debits, recharges, and 5% dining cashback.

### 4. Meal Subscription Plans
* **`GET /api/meal-plans`**: Available recurring meal passes (Breakfast Club, Lunch Pack, High-Protein Diet).
* **`POST /api/meal-plans/subscribe`**: Link a meal plan to a student RFID card.

### 5. Nutrition & Daily Macro Tracker
* **`GET /api/nutrition`**: Calorie target (2,100 kcal) vs consumed calories, macro split (Protein, Carbs, Fats).
* **`POST /api/nutrition/log`**: Log a meal into today's campus nutrition diary.

### 6. Live Crowd & Table Reservations
* **`GET /api/crowd`**: Real-time occupancy percentages for Ground Floor, 1st Floor Kiosk, and Garden Terrace.
* **`POST /api/tables/reserve`**: Free study booth / dining table booking.

### 7. Bulk Catering & Club Orders
* **`GET /api/catering/packages`**: Pre-set packages for Hackathons, Seminars, and College Fests.
* **`POST /api/catering/quote`**: Instant headcount quote generator and coordinator booking.

### 8. Reviews & Chef Dish Suggestions
* **`GET /api/reviews`**: Verified student dining review feed.
* **`POST /api/reviews`**: Post a new review and rating.
* **`GET /api/suggestions`**: Chef specials student voting board.
* **`POST /api/suggestions/<id>/vote`**: Upvote a dish for next Friday's menu.
* **`POST /api/suggestions`**: Propose a new dish to the cafeteria chef.

### 9. Kitchen Display System (KDS) & Admin
* **`GET /api/admin/stats`**: Today's orders count (`128`), today's revenue (`₹12,450`), and kitchen prep metrics.
* **`GET /api/admin/kitchen-queue`**: Real-time queue for kitchen staff screens.

---

## 🧪 Running Automated Tests

Run the test suite with Python's built-in `unittest` runner:
```bash
python -m unittest test_backend.py
```
This runs 10 test cases covering the health check, menu items, prices, 5% GST billing math, coupon codes, order creation, QR generation, status updates, wallet recharges, crowd reservations, and dish voting.
