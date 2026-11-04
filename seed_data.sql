-- Seed data for Smart Cafeteria SQLite database
-- Populates default users, catalog, slots, coupons, and orders matching mockups

BEGIN TRANSACTION;

-- 1. Users
INSERT OR REPLACE INTO users (id, role, full_name, email, phone, password_hash, avatar_url, is_active)
VALUES 
  ('u1111111-1111-1111-1111-111111111111', 'student', 'Kumud Negi', 'kumud.negi@college.edu', '+91 98765 43210', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg', 1),
  ('u2222222-2222-2222-2222-222222222222', 'staff', 'Chef Ramesh Kumar', 'ramesh.counter1@college.edu', '+91 98765 43211', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg', 1),
  ('u3333333-3333-3333-3333-333333333333', 'admin', 'Cafeteria Manager Sharma', 'cafeteria.admin@college.edu', '+91 98765 43212', 'scrypt:32768:8:1$hashedpassword123', 'assets/avatar.jpg', 1);

-- 2. Student Profile
INSERT OR REPLACE INTO student_profiles (user_id, roll_number, department, year_of_study, dietary_preference, allergies, notify_order_updates, notify_offers)
VALUES ('u1111111-1111-1111-1111-111111111111', 'STU-2024-8842', 'CSE - 2nd Year', 2, 'veg', '["Lactose (Low)"]', 1, 1);

-- 3. Categories
INSERT OR REPLACE INTO categories (id, name, sort_order, is_active) VALUES
  (1, 'Breakfast', 1, 1),
  (2, 'Lunch', 2, 1),
  (3, 'Snacks', 3, 1),
  (4, 'Beverages', 4, 1),
  (5, 'Desserts', 5, 1);

-- 4. Cafeteria Settings
INSERT OR REPLACE INTO cafeteria_settings (id, name, address, contact_phone, tax_percent, is_open, slot_length_mins, default_slot_cap, payment_gateway)
VALUES (1, 'Campus Cafeteria', 'Ground Floor, Student Activity Center, Block C', '+91 11 2345 6789', 5.00, 1, 15, 20, 'CampusPay / UPI');

-- 5. Operating Hours
INSERT OR REPLACE INTO operating_hours (day_of_week, opens_at, closes_at, is_closed) VALUES
  (0, '07:30', '22:00', 0),
  (1, '07:30', '22:00', 0),
  (2, '07:30', '22:00', 0),
  (3, '07:30', '22:00', 0),
  (4, '07:30', '22:00', 0),
  (5, '08:00', '22:30', 0),
  (6, '08:00', '21:00', 0);

-- 6. Menu Items
INSERT OR REPLACE INTO menu_items (
    id, category_id, name, description, ingredients, image_url,
    base_price, diet, calories, prep_time_mins, is_available, is_special,
    stock_qty, low_stock_alert, avg_rating, rating_count
) VALUES
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
   130.00, 'veg', 580, 9, 1, 1, 90, 15, 4.90, 410);

-- 7. Addons
INSERT OR REPLACE INTO addons (id, name, price, is_active) VALUES
  ('add-1', 'Extra Cheddar Cheese Slice', 20.00, 1),
  ('add-2', 'Double Veg Patty', 35.00, 1),
  ('add-3', 'Spicy Peri-Peri Seasoning', 10.00, 1),
  ('add-4', 'Garlic Truffle Mayo Dip', 20.00, 1),
  ('add-5', 'Pure Desi Ghee Roast', 20.00, 1),
  ('add-6', 'Extra Scoop Vanilla Ice Cream', 20.00, 1);

-- 8. Pickup Slots
INSERT OR REPLACE INTO pickup_slots (id, slot_date, start_time, end_time, capacity, booked_count, is_active) VALUES
  ('slot-1', date('now'), '11:30', '11:45', 20, 4, 1),
  ('slot-2', date('now'), '11:45', '12:00', 20, 12, 1),
  ('slot-3', date('now'), '12:00', '12:15', 20, 18, 1),
  ('slot-4', date('now'), '12:15', '12:30', 20, 14, 1),
  ('slot-5', date('now'), '12:30', '12:45', 20, 19, 1),
  ('slot-6', date('now'), '12:45', '13:00', 20, 8, 1),
  ('slot-7', date('now'), '13:00', '13:15', 20, 5, 1);

-- 9. Coupons
INSERT OR REPLACE INTO coupons (id, code, description, discount_type, discount_value, max_discount, min_order_value, usage_limit, per_user_limit, valid_from, valid_until, is_active) VALUES
  ('cp-1', 'CAMPUS10', 'Flat ₹10 discount on orders above ₹50', 'flat', 10.00, 10.00, 50.00, 500, 2, '2026-01-01', '2026-12-31', 1),
  ('cp-2', 'STUDENT50', 'Flat ₹50 discount on orders above ₹200', 'flat', 50.00, 50.00, 200.00, 200, 1, '2026-01-01', '2026-12-31', 1),
  ('cp-3', 'WELCOME20', '20% off on first meal pre-order up to ₹40', 'percent', 0.20, 40.00, 100.00, 1000, 1, '2026-01-01', '2026-12-31', 1);

-- 10. Wallet
INSERT OR REPLACE INTO wallets (user_id, balance, reward_points)
VALUES ('u1111111-1111-1111-1111-111111111111', 480.00, 1240);

-- 11. Wallet Transactions
INSERT OR REPLACE INTO wallet_transactions (id, user_id, txn_type, amount, points_delta, balance_after, reference) VALUES
  ('wtx-1', 'u1111111-1111-1111-1111-111111111111', 'topup', 500.00, 50, 684.75, 'UPI Topup via GPay'),
  ('wtx-2', 'u1111111-1111-1111-1111-111111111111', 'payment', -204.75, 20, 480.00, 'Pre-order ORD-10045');

-- 12. Active Order (ORD-10045)
INSERT OR REPLACE INTO orders (
    id, order_number, user_id, pickup_slot_id, status, subtotal, discount_amount,
    tax_amount, total_amount, coupon_id, pickup_qr_token, invoice_number, notes
) VALUES (
    'ord-10045-uuid-0000-000000000001', 'ORD-10045', 'u1111111-1111-1111-1111-111111111111',
    'slot-4', 'preparing', 195.00, 0.00, 9.75, 204.75, NULL, 'a8f93c04d1e2b588', 'INV-2026-10045', 'No onions in burger, extra ketchup'
);

-- Items for ORD-10045
INSERT OR REPLACE INTO order_items (id, order_id, item_id, item_name, variant_label, addons, unit_price, quantity, line_total, instructions) VALUES
  ('oi-1', 'ord-10045-uuid-0000-000000000001', 'm1000001-0000-0000-0000-000000000001', 'Veg Burger', 'Regular', '[]', 65.00, 1, 65.00, 'No onions'),
  ('oi-2', 'ord-10045-uuid-0000-000000000001', 'm1000001-0000-0000-0000-000000000002', 'Cold Coffee with Ice Cream', 'Regular', '[]', 60.00, 1, 60.00, NULL),
  ('oi-3', 'ord-10045-uuid-0000-000000000001', 'm1000001-0000-0000-0000-000000000003', 'French Fries', 'Regular', '[]', 70.00, 1, 70.00, 'Extra crisp');

-- Status History
INSERT OR REPLACE INTO order_status_history (id, order_id, status, changed_by, note) VALUES
  ('osh-1', 'ord-10045-uuid-0000-000000000001', 'placed', 'u1111111-1111-1111-1111-111111111111', 'Customer confirmed pre-order via app'),
  ('osh-2', 'ord-10045-uuid-0000-000000000001', 'accepted', 'u2222222-2222-2222-2222-222222222222', 'Chef accepted order into queue'),
  ('osh-3', 'ord-10045-uuid-0000-000000000001', 'preparing', 'u2222222-2222-2222-2222-222222222222', 'Cooking at Counter 1');

-- Payment record
INSERT OR REPLACE INTO payments (id, order_id, method, status, amount, gateway_txn_id)
VALUES ('pay-1', 'ord-10045-uuid-0000-000000000001', 'wallet', 'success', 204.75, 'CAMPUS-RFID-4829');

-- Past order ORD-10032
INSERT OR REPLACE INTO orders (
    id, order_number, user_id, pickup_slot_id, status, subtotal, discount_amount,
    tax_amount, total_amount, coupon_id, pickup_qr_token, invoice_number, notes
) VALUES (
    'ord-10032-uuid-0000-000000000002', 'ORD-10032', 'u1111111-1111-1111-1111-111111111111',
    'slot-5', 'collected', 130.00, 0.00, 6.50, 136.50, NULL, 'b9e71f11c3a4d299', 'INV-2026-10032', 'Extra sambar'
);

INSERT OR REPLACE INTO order_items (id, order_id, item_id, item_name, variant_label, addons, unit_price, quantity, line_total, instructions) VALUES
  ('oi-4', 'ord-10032-uuid-0000-000000000002', 'm1000001-0000-0000-0000-000000000004', 'Masala Dosa with Chutney', 'Regular', '[]', 70.00, 1, 70.00, 'Crispy'),
  ('oi-5', 'ord-10032-uuid-0000-000000000002', 'm1000001-0000-0000-0000-000000000002', 'Cold Coffee with Ice Cream', 'Regular', '[]', 60.00, 1, 60.00, NULL);

-- 13. Reviews
INSERT OR REPLACE INTO reviews (id, order_id, user_id, item_id, food_rating, service_rating, comment)
VALUES ('rev-1', 'ord-10032-uuid-0000-000000000002', 'u1111111-1111-1111-1111-111111111111', 'm1000001-0000-0000-0000-000000000001', 5, 5, 'Super crispy burger! Walked in and scanned the QR code at Counter 1 without queueing.');

-- 14. Notifications
INSERT OR REPLACE INTO notifications (id, user_id, type, title, body, order_id, is_read) VALUES
  ('notif-1', 'u1111111-1111-1111-1111-111111111111', 'order', 'Order ORD-10045 is now Preparing.', 'Chef is cooking your burger at Counter 1.', 'ord-10045-uuid-0000-000000000001', 0),
  ('notif-2', 'u1111111-1111-1111-1111-111111111111', 'order', 'Order ORD-10045 was Accepted.', 'Your pickup slot is 12:15 PM.', 'ord-10045-uuid-0000-000000000001', 0),
  ('notif-3', 'u1111111-1111-1111-1111-111111111111', 'wallet', 'Cashback Credited', '₹10.25 cashback added to your Campus Wallet.', NULL, 1);

COMMIT;
