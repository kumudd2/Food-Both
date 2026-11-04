"""
Database Builder & Seeder for Smart Cafeteria System
Constructs the database according to cafeteria_schema.sql.
Supports both SQLite (default cafeteria.db) and PostgreSQL.
"""
import os
import sqlite3
import json
import uuid
from datetime import datetime, date, timedelta
from config import Config

def get_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def build_database():
    """Executes schema_sqlite.sql and seeds complete sample data."""
    print(f"[*] Initializing database at: {Config.DATABASE_PATH}")
    
    schema_path = os.path.join(Config.BASE_DIR, 'schema_sqlite.sql')
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript(schema_sql)
    conn.commit()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()['count'] == 0:
        print("[*] Seeding database with initial cafeteria catalog and sample records...")
        seed_data(conn)
        print("[+] Seeding completed successfully!")
    else:
        print("[!] Database already populated with records.")

    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # 1. Users
    user_id = "u1111111-1111-1111-1111-111111111111"
    staff_id = "u2222222-2222-2222-2222-222222222222"
    admin_id = "u3333333-3333-3333-3333-333333333333"

    cursor.execute("""
    INSERT INTO users (id, role, full_name, email, phone, password_hash, avatar_url, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1),
           (?, ?, ?, ?, ?, ?, ?, 1),
           (?, ?, ?, ?, ?, ?, ?, 1)
    """, (
        user_id, 'student', 'Kumud Negi', 'kumud.negi@college.edu', '+91 98765 43210', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg',
        staff_id, 'staff', 'Chef Ramesh Kumar', 'ramesh.counter1@college.edu', '+91 98765 43211', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg',
        admin_id, 'admin', 'Cafeteria Manager Sharma', 'cafeteria.admin@college.edu', '+91 98765 43212', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg'
    ))

    # 2. Student Profile
    cursor.execute("""
    INSERT INTO student_profiles (user_id, roll_number, department, year_of_study, dietary_preference, allergies, notify_order_updates, notify_offers)
    VALUES (?, ?, ?, ?, ?, ?, 1, 1)
    """, (
        user_id, 'STU-2024-8842', 'CSE - 2nd Year', 2, 'veg', json.dumps(['Lactose (Low)'])
    ))

    # 3. Categories (Matching uploaded schema seed data + extra category)
    categories = [
        (1, 'Breakfast', 1, 1),
        (2, 'Lunch', 2, 1),
        (3, 'Snacks', 3, 1),
        (4, 'Beverages', 4, 1),
        (5, 'Desserts', 5, 1)
    ]
    cursor.executemany("INSERT OR REPLACE INTO categories (id, name, sort_order, is_active) VALUES (?, ?, ?, ?)", categories)

    # 4. Cafeteria Settings
    cursor.execute("""
    INSERT OR REPLACE INTO cafeteria_settings (id, name, address, contact_phone, tax_percent, is_open, slot_length_mins, default_slot_cap, payment_gateway)
    VALUES (1, 'Campus Cafeteria', 'Ground Floor, Student Activity Center, Block C', '+91 11 2345 6789', 5.00, 1, 15, 20, 'CampusPay / UPI')
    """)

    # 5. Operating Hours (Monday=0 to Sunday=6)
    hours = [
        (0, '07:30', '22:00', 0),
        (1, '07:30', '22:00', 0),
        (2, '07:30', '22:00', 0),
        (3, '07:30', '22:00', 0),
        (4, '07:30', '22:00', 0),
        (5, '08:00', '22:30', 0),
        (6, '08:00', '21:00', 0)
    ]
    cursor.executemany("INSERT OR REPLACE INTO operating_hours (day_of_week, opens_at, closes_at, is_closed) VALUES (?, ?, ?, ?)", hours)

    # 6. Menu Items
    menu_items = [
        ('m1000001-0000-0000-0000-000000000001', 3, 'Veg Burger',
         'Crispy potato herb patty with cheddar cheese, lettuce, tomatoes and signature house sauce.',
         'Potato, Green Peas, Wheat Buns, Cheddar, Lettuce, Mayo', 'assets/burger.jpg',
         65.00, 'veg', 320, 8, 1, 0, 80, 10, 4.60, 142),

        ('m1000001-0000-0000-0000-000000000002', 4, 'Cold Coffee with Ice Cream',
         'Chilled espresso blended with whole milk, vanilla ice cream scoop and dark chocolate swirl.',
         'Espresso, Whole Milk, Vanilla Ice Cream, Cocoa', 'assets/coffee.jpg',
         60.00, 'veg', 180, 5, 1, 0, 150, 15, 4.50, 210),

        ('m1000001-0000-0000-0000-000000000003', 3, 'French Fries',
         'Crispy golden salted hand-cut potato fries served with garlic mayo and tomato dip.',
         'Russet Potatoes, Vegetable Oil, Sea Salt', 'assets/fries.jpg',
         70.00, 'veg', 280, 6, 1, 0, 100, 12, 4.50, 188),

        ('m1000001-0000-0000-0000-000000000004', 1, 'Masala Dosa with Chutney',
         'Crispy golden fermented rice crepe stuffed with spiced potato masala, hot sambar & coconut chutney.',
         'Rice, Urad Dal, Potatoes, Onions, Mustard, Coconut, Sambar Spices', 'assets/dosa.jpg',
         70.00, 'veg', 260, 10, 1, 1, 60, 8, 4.60, 320),

        ('m1000001-0000-0000-0000-000000000005', 1, 'Grilled Paneer Sandwich',
         'Toasted whole wheat bread layered with fresh paneer cubes, capsicum, corn and mint chutney.',
         'Whole Wheat Bread, Paneer, Bell Peppers, Mint, Butter', 'assets/sandwich.jpg',
         55.00, 'veg', 240, 7, 1, 0, 45, 5, 4.40, 95),

        ('m1000001-0000-0000-0000-000000000006', 2, 'Farmhouse Veggie Pizza',
         '8-inch hand-stretched thin crust pizza with marinara, mozzarella, corn, black olives & capsicum.',
         'Flour, Yeast, Tomato Sauce, Mozzarella, Sweet Corn, Olives', 'assets/pizza.jpg',
         120.00, 'veg', 450, 12, 1, 1, 35, 5, 4.70, 164),

        ('m1000001-0000-0000-0000-000000000007', 5, 'Belgian Chocolate Fudge Cake',
         'Moist dark Belgian chocolate sponge coated in silky ganache glaze with dark chocolate curls.',
         'Cocoa, Flour, Butter, Dark Chocolate, Sugar, Eggs-free', 'assets/cake.jpg',
         60.00, 'veg', 310, 3, 1, 0, 50, 5, 4.80, 245),

        ('m1000001-0000-0000-0000-000000000008', 2, 'Veg Hakka Noodles',
         'Wok-tossed noodles with shredded cabbage, crunchy carrots, bell peppers and Indo-Chinese spices.',
         'Noodles, Cabbage, Carrots, Soy Sauce, Garlic, Scallions', 'assets/noodles.jpg',
         80.00, 'veg', 340, 8, 1, 0, 60, 10, 4.60, 112),

        ('m1000001-0000-0000-0000-000000000009', 4, 'Alphonso Mango Smoothie',
         'Pure Alphonso mango blended with chilled Greek yogurt, raw honey and chia seeds.',
         'Mango Puree, Greek Yogurt, Honey, Chia Seeds', 'assets/smoothie.jpg',
         65.00, 'veg', 190, 4, 1, 0, 40, 8, 4.70, 84),

        ('m1000001-0000-0000-0000-000000000010', 2, 'Mediterranean Salad Bowl',
         'Crisp romaine, cherry tomatoes, cucumbers, kalamata olives, marinated paneer & vinaigrette.',
         'Romaine Lettuce, Tomatoes, Olives, Paneer, Herb Dressing', 'assets/salad.jpg',
         85.00, 'veg', 210, 5, 1, 1, 30, 5, 4.80, 98),

        ('m1000001-0000-0000-0000-000000000011', 3, 'Crispy Samosa Chaat',
         'Flaky potato samosas crushed with warm chole ragda, sweet tamarind, curd, green chutney & sev.',
         'Potatoes, Flour, Chickpeas, Yogurt, Tamarind, Mint, Sev', 'assets/samosa.jpg',
         50.00, 'veg', 290, 5, 1, 0, 75, 10, 4.60, 230),

        ('m1000001-0000-0000-0000-000000000012', 2, 'Royal Campus Special Thali',
         'Wholesome platter with Paneer Butter Masala, Dal Makhani, Phulkas, Jeera Rice, Papad, Raita & Gulab Jamun.',
         'Paneer, Lentils, Wheat, Basmati Rice, Curd, Ghee, Spices', 'assets/thali.jpg',
         130.00, 'veg', 580, 9, 1, 1, 90, 15, 4.90, 410)
    ]
    cursor.executemany("""
    INSERT INTO menu_items (
        id, category_id, name, description, ingredients, image_url,
        base_price, diet, calories, prep_time_mins, is_available, is_special,
        stock_qty, low_stock_alert, avg_rating, rating_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, menu_items)

    # 7. Addons
    addons = [
        ('add-1', 'Extra Cheddar Cheese Slice', 20.00, 1),
        ('add-2', 'Double Veg Patty', 35.00, 1),
        ('add-3', 'Spicy Peri-Peri Seasoning', 10.00, 1),
        ('add-4', 'Garlic Truffle Mayo Dip', 20.00, 1),
        ('add-5', 'Pure Desi Ghee Roast', 20.00, 1),
        ('add-6', 'Extra Scoop Vanilla Ice Cream', 20.00, 1)
    ]
    cursor.executemany("INSERT INTO addons (id, name, price, is_active) VALUES (?, ?, ?, ?)", addons)

    # 8. Pickup Slots for Today
    today_str = date.today().isoformat()
    slots = [
        ('slot-exp', today_str, '11:15', '11:30', 25, 6, 1),
        ('slot-1',   today_str, '11:30', '11:45', 20, 4, 1),
        ('slot-2',   today_str, '11:45', '12:00', 20, 12, 1),
        ('slot-3',   today_str, '12:00', '12:15', 20, 18, 1),
        ('slot-4',   today_str, '12:15', '12:30', 20, 14, 1),
        ('slot-5',   today_str, '12:30', '12:45', 20, 19, 1),
        ('slot-6',   today_str, '12:45', '01:00', 20, 8, 1),
        ('slot-7',   today_str, '01:00', '01:15', 20, 5, 1)
    ]
    cursor.executemany("INSERT INTO pickup_slots (id, slot_date, start_time, end_time, capacity, booked_count, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)", slots)

    # 9. Coupons
    coupons = [
        ('cp-1', 'CAMPUS10', 'Flat ₹10 discount on orders above ₹50', 'flat', 10.00, 10.00, 50.00, 500, 2, '2026-01-01', '2026-12-31', 1),
        ('cp-2', 'STUDENT50', 'Flat ₹50 discount on orders above ₹200', 'flat', 50.00, 50.00, 200.00, 200, 1, '2026-01-01', '2026-12-31', 1),
        ('cp-3', 'WELCOME20', '20% off on first meal pre-order up to ₹40', 'percent', 0.20, 40.00, 100.00, 1000, 1, '2026-01-01', '2026-12-31', 1)
    ]
    cursor.executemany("""
    INSERT INTO coupons (id, code, description, discount_type, discount_value, max_discount, min_order_value, usage_limit, per_user_limit, valid_from, valid_until, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, coupons)

    # 10. Wallet
    cursor.execute("""
    INSERT INTO wallets (user_id, balance, reward_points)
    VALUES (?, 480.00, 1240)
    """, (user_id,))

    # 11. Wallet Transactions
    now_ts = datetime.now().isoformat()
    cursor.execute("""
    INSERT INTO wallet_transactions (id, user_id, txn_type, amount, points_delta, balance_after, reference, created_at)
    VALUES ('wtx-1', ?, 'topup', 500.00, 50, 684.75, 'UPI Topup via GPay', ?),
           ('wtx-2', ?, 'payment', -204.75, 20, 480.00, 'Pre-order ORD-10045', ?)
    """, (user_id, now_ts, user_id, now_ts))

    # 12. Active Order (ORD-10045) matching reference mockup
    order_id = "ord-10045-uuid-0000-000000000001"
    cursor.execute("""
    INSERT INTO orders (
        id, order_number, user_id, pickup_slot_id, status, subtotal, discount_amount,
        tax_amount, total_amount, coupon_id, pickup_qr_token, invoice_number, notes
    ) VALUES (?, 'ORD-10045', ?, 'slot-4', 'preparing', 195.00, 0.00, 9.75, 204.75, NULL, 'a8f93c04d1e2b588', 'INV-2026-10045', 'No onions in burger, extra ketchup')
    """, (order_id, user_id))

    # Order Items for ORD-10045
    order_items = [
        ('oi-1', order_id, 'm1000001-0000-0000-0000-000000000001', 'Veg Burger', 'Regular', '[]', 65.00, 1, 65.00, 'No onions'),
        ('oi-2', order_id, 'm1000001-0000-0000-0000-000000000002', 'Cold Coffee with Ice Cream', 'Regular', '[]', 60.00, 1, 60.00, None),
        ('oi-3', order_id, 'm1000001-0000-0000-0000-000000000003', 'French Fries', 'Regular', '[]', 70.00, 1, 70.00, 'Extra crisp')
    ]
    cursor.executemany("""
    INSERT INTO order_items (id, order_id, item_id, item_name, variant_label, addons, unit_price, quantity, line_total, instructions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, order_items)

    # Order Status History (powers live tracker)
    cursor.execute("""
    INSERT INTO order_status_history (id, order_id, status, changed_by, note)
    VALUES ('osh-1', ?, 'placed', ?, 'Customer confirmed pre-order via app'),
           ('osh-2', ?, 'accepted', ?, 'Chef accepted order into queue'),
           ('osh-3', ?, 'preparing', ?, 'Cooking at Counter 1')
    """, (order_id, user_id, order_id, staff_id, order_id, staff_id))

    # Payment record
    cursor.execute("""
    INSERT INTO payments (id, order_id, method, status, amount, gateway_txn_id)
    VALUES ('pay-1', ?, 'wallet', 'success', 204.75, 'CAMPUS-RFID-4829')
    """, (order_id,))

    # Past completed order ORD-10032
    past_order_id = "ord-10032-uuid-0000-000000000002"
    cursor.execute("""
    INSERT INTO orders (
        id, order_number, user_id, pickup_slot_id, status, subtotal, discount_amount,
        tax_amount, total_amount, coupon_id, pickup_qr_token, invoice_number, notes
    ) VALUES (?, 'ORD-10032', ?, 'slot-5', 'collected', 130.00, 0.00, 6.50, 136.50, NULL, 'b9e71f11c3a4d299', 'INV-2026-10032', 'Extra sambar')
    """, (past_order_id, user_id))

    cursor.execute("""
    INSERT INTO order_items (id, order_id, item_id, item_name, variant_label, addons, unit_price, quantity, line_total, instructions)
    VALUES ('oi-4', ?, 'm1000001-0000-0000-0000-000000000004', 'Masala Dosa with Chutney', 'Regular', '[]', 70.00, 1, 70.00, 'Crispy'),
           ('oi-5', ?, 'm1000001-0000-0000-0000-000000000002', 'Cold Coffee with Ice Cream', 'Regular', '[]', 60.00, 1, 60.00, NULL)
    """, (past_order_id, past_order_id))

    # 13. Reviews
    cursor.execute("""
    INSERT INTO reviews (id, order_id, user_id, item_id, food_rating, service_rating, comment)
    VALUES ('rev-1', ?, ?, 'm1000001-0000-0000-0000-000000000001', 5, 5, 'Super crispy burger! Walked in and scanned the QR code at Counter 1 without queueing.')
    """, (past_order_id, user_id))

    # 14. Notifications
    cursor.execute("""
    INSERT INTO notifications (id, user_id, type, title, body, order_id, is_read)
    VALUES ('notif-1', ?, 'order', 'Order ORD-10045 is now Preparing.', 'Chef is cooking your burger at Counter 1.', ?, 0),
           ('notif-2', ?, 'order', 'Order ORD-10045 was Accepted.', 'Your pickup slot is 12:15 PM.', ?, 0),
           ('notif-3', ?, 'wallet', 'Cashback Credited', '₹10.25 cashback added to your Campus Wallet.', NULL, 1)
    """, (user_id, order_id, user_id, order_id, user_id))

    conn.commit()

if __name__ == '__main__':
    build_database()
